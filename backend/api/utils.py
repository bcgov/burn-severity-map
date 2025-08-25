import os
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError


S3_ENDPOINT = os.getenv("S3_ENDPOINT")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# Assert that all required environment variables are set
assert S3_ENDPOINT is not None, "Missing environment variable: S3_ENDPOINT"
assert S3_ACCESS_KEY is not None, "Missing environment variable: S3_ACCESS_KEY"
assert S3_SECRET_KEY is not None, "Missing environment variable: S3_SECRET_KEY"
assert S3_BUCKET_NAME is not None, "Missing environment variable: S3_BUCKET_NAME"

# establish S3 connection
s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    endpoint_url=S3_ENDPOINT,
    #config=Config(signature_version='s3v4')
)

def s3_list_objects(bucket_name=S3_BUCKET_NAME, file_prefix=""):
    """Lists files in an S3-compliant bucket with an optional prefix."""
    obj_list = []
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=f"burn-severity/{file_prefix}")
        if 'Contents' in response:
            print(f"Files in bucket '{bucket_name}' (prefix: '{file_prefix}'):")
            for obj in response['Contents']:
                # print(f"- {obj['Key']} (Size: {obj['Size']} bytes)")

                # only append file that are not directories
                if not obj['Key'].endswith('$') and not obj['Key'].endswith('/') and not obj['Key'].endswith('catalogs'):
                    obj_list.append(obj['Key'])

            return obj_list
        else:
            print(f"No files found in bucket '{bucket_name}' with prefix '{file_prefix}'.")
    except Exception as e:
        print(f"Error listing files: {e}")


def s3_get_presigned_url(obj, expiration_seconds=3600):

    """
        Generates a presigned URL to retrieve an S3 object.

        :param object_key: The S3 object key (path to the file).
        :param expiration_seconds: The number of seconds the URL is valid for.
        :return: The presigned URL, or None if an error occurs.
        """
    try:
        response = s3_client.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': S3_BUCKET_NAME, 'Key': obj},
            ExpiresIn=expiration_seconds
        )
        return response
    except ClientError as e:
        return f"ClientError generating presigned URL for {obj}: {e}"
    except Exception as e:
        return f"Error generating presigned URL for {obj}: {e}"