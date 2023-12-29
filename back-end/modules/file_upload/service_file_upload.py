from database_clients.s3_client import s3_client
from botocore.exceptions import NoCredentialsError
import random
import io
import os        

def upload_misc_to_s3(byte_data, filename):

    object_key = f"misc/{filename}"
    s3_client.put_object(
        Bucket=os.environ.get('S3_BUCKET_NAME'),
        Key=object_key,
        Body=byte_data,
        ACL='public-read',
    )

    url = f"https://{os.environ.get('S3_BUCKET_NAME')}.s3.amazonaws.com/{object_key}"
    return url

def upload_file_to_s3(file_path, s3_bucket, object_key):
    try:
        with open(file_path, 'rb') as f:
            byte_data = f.read()

        s3_client.put_object(
            Bucket=os.environ.get('S3_BUCKET_NAME'),
            Key=object_key,
            Body=byte_data,
            ACL='public-read',
        )
        url = f"https://{s3_bucket}.s3.amazonaws.com/{object_key}"
        return url
    except NoCredentialsError:
        print('Credentials not available')
        return None
    
def upload_image_to_s3_from_byte_data(image_bytes, filename=None):
    if(filename==None):filename = str(random.randint(0,999999999999999999999))+".png"

    object_key = f"images/{filename}"
    s3_client.upload_fileobj(
        io.BytesIO(image_bytes),
        os.environ.get('S3_BUCKET_NAME'),
        object_key, 
        ExtraArgs={'ACL': 'public-read'}
    )
    
    url = f"https://{os.environ.get('S3_BUCKET_NAME')}.s3.amazonaws.com/{object_key}"
    return url
