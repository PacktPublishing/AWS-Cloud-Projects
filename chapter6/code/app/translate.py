import boto3
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("SourceLanguageCode")
parser.add_argument("TargetLanguageCode")
parser.add_argument("SourceFile")
args = parser.parse_args()


translate = boto3.client('translate')

localFile = args.SourceFile
file = open(localFile, "rb")
data = file.read()
file.close()


result = translate.translate_document(
    Document={
            "Content": data,
            "ContentType": "text/html"
        },
    SourceLanguageCode=args.SourceLanguageCode,
    TargetLanguageCode=args.TargetLanguageCode
)
if "TranslatedDocument" in result:
    fileName = localFile.split("/")[-1]
    tmpfile = f"{args.TargetLanguageCode}-{fileName}"
    with open(tmpfile,  'w') as f:
        f.write(result["TranslatedDocument"]["Content"].decode('utf-8'))
        

    print("Translated document ", tmpfile)