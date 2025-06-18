import os
import boto3
from botocore.client import Config


S3_ENDPOINT = os.getenv("S3_ENPOINT")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")


s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    endpoint_url=S3_ENDPOINT,
    #config=Config(signature_version='s3v4')
)

def s3_list_files(bucket_name=S3_BUCKET_NAME, prefix=""):
    """Lists files in an S3-compliant bucket with an optional prefix."""
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        if 'Contents' in response:
            print(f"Files in bucket '{bucket_name}' (prefix: '{prefix}'):")
            for obj in response['Contents']:
                print(f"- {obj['Key']} (Size: {obj['Size']} bytes)")
        else:
            print(f"No files found in bucket '{bucket_name}' with prefix '{prefix}'.")
    except Exception as e:
        print(f"Error listing files: {e}")

def s3_get_presigned_url(object_key, expiration_seconds=3600):

    """
        Generates a presigned URL to retrieve an S3 object.

        :param object_key: The S3 object key (path to the file).
        :param expiration_seconds: The number of seconds the URL is valid for.
        :return: The presigned URL, or None if an error occurs.
        """
    try:
        response = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': S3_BUCKET_NAME, 'Key': object_key},
            ExpiresIn=expiration_seconds
        )
        return response
    except Exception as e:
        print(f"Error generating presigned URL for {object_key}: {e}")
        return None