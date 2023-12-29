import boto3
import os

s3_client = boto3.client(
    service_name = 's3',
    region_name = 'us-east-2',
    aws_access_key_id= os.environ.get('AWS_ACCESS_KEY'),
    aws_secret_access_key= os.environ.get('AWS_SECRET_KEY'),
)