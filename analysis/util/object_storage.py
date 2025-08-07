import boto3
from botocore.client import Config
import os

import hashlib # Import hashlib for MD5 calculation

class ObjectStorage:
    def __init__(self):
        self.S3_ENDPOINT = os.getenv('S3_ENDPOINT')
        self.S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
        self.S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')
        self.S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')
        self.S3_RESULT_FOLDER = os.getenv('S3_RESULT_FOLDER','burn-severity')

        # establish S3 connection
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=self.S3_ACCESS_KEY,
            aws_secret_access_key=self.S3_SECRET_KEY,
            endpoint_url=self.S3_ENDPOINT,
            verify=False,
            config=Config(signature_version='s3v4')
            )
        self.S3_RESULT_FOLDER = 'burn-severity'

    
    def write_image(self, file_path: str, raster):
        raster.seek(0)
        hasher = hashlib.sha256()
        raster.seek(0)
        local_sha256 = hasher.hexdigest()
        self.s3_client.put_object(Bucket=self.S3_BUCKET_NAME,
                                  Key=f'{self.S3_RESULT_FOLDER}/{file_path}',
                                  Body=raster,
                                  ContentType='image/tiff',
                                  ChecksumAlgorithm='SHA256',
                                  ChecksumSHA256=local_sha256
                                  )

        
    def write_shape(self, file_path: str, zip_buffer) -> bool:

        zip_buffer.seek(0)
        hasher = hashlib.sha256()
        hasher.update(zip_buffer.getvalue())
        zip_buffer.seek(0)
        local_sha256 = hasher.hexdigest()
        self.s3_client.put_object(Bucket=self.S3_BUCKET_NAME,
                                  Key=f'{self.S3_RESULT_FOLDER}/{file_path}',
                                  Body=zip_buffer,
                                  ContentType='application/zip',
                                  ChecksumAlgorithm='SHA256',
                                  ChecksumSHA256=local_sha256
                                  )

    
    def write_json(self, file_path: str, geo_json) -> bool:

        hasher = hashlib.sha256()
        hasher.update(geo_json)
        local_sha256 = hasher.hexdigest()
        self.s3_client.put_object(Bucket=self.S3_BUCKET_NAME,
                                  Key=f'{self.S3_RESULT_FOLDER}/{file_path}',
                                  Body=geo_json,
                                  ContentType='application/geo+json',
                                  ChecksumAlgorithm='SHA256',
                                  ChecksumSHA256=local_sha256
                                  )
