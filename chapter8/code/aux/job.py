import sys
from awsglue.transforms import SelectFields, Join, ApplyMapping
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
import gs_to_timestamp
import boto3

args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

# Create a client for AWS Systems Manager
ssm = boto3.client('ssm')

# Retrieve the value of the parameter containing the bucket_name
parameter_name = 'clickstream_bucket'
response = ssm.get_parameter(Name=parameter_name)
bucket_name = response['Parameter']['Value']

# Create an S3 client instance
s3 = boto3.client('s3')

# Get source events stored in /raw
get_json = glueContext.create_dynamic_frame.from_options(format_options={"multiline": False}, connection_type="s3", format="json", connection_options={"paths":  ["s3://{}/raw/".format(bucket_name)], "recurse": True}, transformation_ctx="get_json")

# get reference file with geographic data
get_continents = glueContext.create_dynamic_frame.from_options(format_options={"quoteChar": "\"", "withHeader": True, "separator": ";", "optimizePerformance": False}, connection_type="s3", format="csv", connection_options={"paths": ["s3://{}/reference/countries_continents.csv".format(bucket_name)], "recurse": True}, transformation_ctx="get_continents")

# convert click date to timestamp
convert_date = get_json.gs_to_timestamp(colName="timestamp", colType="autodetect", newColName="click-date")

# convert id into int
change_schema = ApplyMapping.apply(frame=get_continents, mappings=[("id", "string", "id", "int"), ("country-name", "string", "country-name", "string"), ("continent", "string", "continent", "string")], transformation_ctx="change_schema")

# convert location into int
change_schema_2 = ApplyMapping.apply(frame=convert_date, mappings=[("event_type", "string", "event_type", "string"), ("user_id", "string", "user_id", "string"), ("user_action", "string", "user_action", "string"), ("product_category", "string", "product_category", "string"), ("location", "string", "location", "int"), ("user_age", "int", "user_age", "int"), ("timestamp", "int", "timestamp", "int"), ("click-date", "timestamp", "click-date", "timestamp")], transformation_ctx="change_schema_2")

# join the 2 datasets
join_datasets = Join.apply(frame1=change_schema_2, frame2=change_schema, keys1=["location"], keys2=["id"], transformation_ctx="join_datasets")

# select a small set of fields from the result dataset
select_fields = SelectFields.apply(frame=join_datasets, paths=["user_age", "continent", "country-name", "user_action", "product_category", "event_type", "click-date", "user_id", "job_id"], transformation_ctx="select_fields")

# Coalesce into a single partition
select_fields = select_fields.coalesce(1)

# store output dataset in s3
output_file = glueContext.getSink(path="s3://{}/results/".format(bucket_name), connection_type="s3", updateBehavior="UPDATE_IN_DATABASE", partitionKeys=[], enableUpdateCatalog=True, transformation_ctx="output_file")
output_file.setCatalogInfo(catalogDatabase="clickstream_db", catalogTableName="clickstream_table")
output_file.setFormat("csv")
output_file.writeFrame(select_fields)

job.commit()


# Clean S3 bucket - Move files from raw/ to processed/
source_prefix = "raw/"
dest_prefix = "processed/"

# List all objects in the raw/ prefix
response = s3.list_objects_v2(Bucket=bucket_name, Prefix=source_prefix)

# Move each object from raw/ to processed/
if 'Contents' in response:
    for obj in response['Contents']:
        source_key = obj['Key']
        dest_key = dest_prefix + source_key.replace(source_prefix, '')
        print(f"Moving {source_key} to {dest_key}")
        s3.copy_object(Bucket=bucket_name, CopySource={'Bucket': bucket_name, 'Key': source_key}, Key=dest_key)
        s3.delete_object(Bucket=bucket_name, Key=source_key)
