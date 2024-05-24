import json
import base64
from os import environ
import logging
import boto3

from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
rekognition = boto3.client('rekognition')


def lambda_handler(event, context):
    """
    Lambda handler function
    param: event: The event object for the Lambda function.
    param: context: The context object for the lambda function.
    return: The labels found in the image passed in the event
    object.
    """

    try:

        # Determine image source.
        if 'image' in event:
            # Decode the image
            image_bytes = event['image'].encode('utf-8')
            img_b64decoded = base64.b64decode(image_bytes)
            image = {'Bytes': img_b64decoded}
        else:
            raise ValueError(
                'Invalid source. Only image base 64 encoded image bytes are supported.')

        rekognition_response = rekognition.detect_faces(
        Image=image, Attributes=['ALL'])

        if len(rekognition_response['FaceDetails']) != 1:
            raise ValueError(
                'Please upload a picture with only one face')
        
        smile = rekognition_response['FaceDetails'][0]['Smile']
        eyesOpen = rekognition_response['FaceDetails'][0]['EyesOpen']
        
        # 'HAPPY'|'SAD'|'ANGRY'|'CONFUSED'|'DISGUSTED'|'SURPRISED'|'CALM'|'UNKNOWN'|'FEAR'
        Emotions = rekognition_response['FaceDetails'][0]['Emotions']
        result = 'Bad Profile Photo'

        if smile['Value'] == True and eyesOpen['Value'] == True:
            result = 'Good Profile Photo'
            
        lambda_response = {
            "statusCode": 200,
            "body": json.dumps(result)
        }

    except ClientError as err:
        error_message = f"Couldn't analyze image. " + \
            err.response['Error']['Message']

        lambda_response = {
            'statusCode': 400,
            'body': {
                "Error": err.response['Error']['Code'],
                "ErrorMessage": error_message
            }
        }
        logger.error("Error function %s: %s",
            context.invoked_function_arn, error_message)

    except ValueError as val_error:
        lambda_response = {
            'statusCode': 400,
            'body': {
                "Error": "ValueError",
                "ErrorMessage": format(val_error)
            }
        }
        logger.error("Error function %s: %s",
            context.invoked_function_arn, format(val_error))

    return lambda_response
