import boto3
from botocore.client import Config
import os
from io import BytesIO
import hashlib # Import hashlib for MD5 calculation

class ObjectStorage:
    def __init__(self):
        self.S3_ENDPOINT = os.getenv('S3_ENDPOINT')
        self.S3_ACCESS_ID = os.getenv('S3_ACCESS_ID')
        self.S3_KEY = os.getenv('S3_KEY')
        self.S3_BUCKET = os.getenv('S3_BUCKET')
        self.S3_MAIN_DIR = os.getenv('MAIN_DIR')

        # establish S3 connection
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=self.S3_ACCESS_ID,
            aws_secret_access_key=self.S3_KEY,
            endpoint_url=self.S3_ENDPOINT,
            verify=False,
            config=Config(signature_version='s3v4')
            )

    
    def write_image(self, file_path: str, raster):
        raster.seek(0)
        hasher = hashlib.sha256()
        raster.seek(0)
        local_sha256 = hasher.hexdigest()
        self.s3_client.put_object(Bucket=self.S3_BUCKET,
                                  Key=f'{self.S3_MAIN_DIR}/{file_path}',
                                  Body=raster,
                                  ContentType='image/tiff',
                                #   ChecksumAlgorithm='SHA256',
                                #   ChecksumSHA256=local_sha256
                                  )

        
    def write_shape(self, file_path: str, zip_buffer) -> bool:

        zip_buffer.seek(0)
        hasher = hashlib.sha256()
        hasher.update(zip_buffer.getvalue())
        zip_buffer.seek(0)
        local_sha256 = hasher.hexdigest()
        self.s3_client.put_object(Bucket=self.S3_BUCKET,
                                  Key=f'{self.S3_MAIN_DIR}/{file_path}',
                                  Body=zip_buffer,
                                  ContentType='application/zip',
                                #   ChecksumAlgorithm='SHA256',
                                #   ChecksumSHA256=local_sha256
                                  )

    
    def write_json(self, file_path: str, geo_json) -> bool:

        hasher = hashlib.sha256()
        hasher.update(geo_json)
        local_sha256 = hasher.hexdigest()
        self.s3_client.put_object(Bucket=self.S3_BUCKET,
                                  Key=f'{self.S3_MAIN_DIR}/{file_path}',
                                  Body=geo_json,
                                  ContentType='application/geo+json',
                                #   ChecksumAlgorithm='SHA256',
                                #   ChecksumSHA256=local_sha256
                                  )
    def write_pdf(self, file_path: str, pdf_buffer: BytesIO) -> bool:
        pdf_buffer.seek(0)
        hasher = hashlib.sha256()
        hasher.update(pdf_buffer.getvalue())
        pdf_buffer.seek(0)
        local_sha256 = hasher.hexdigest()

        self.s3_client.put_object(
            Bucket=self.S3_BUCKET,
            Key=f'{self.S3_MAIN_DIR}/{file_path}',
            Body=pdf_buffer,
            ContentType='application/pdf',
            # ChecksumAlgorithm='SHA256',
            # ChecksumSHA256=local_sha256
        )
        return True
