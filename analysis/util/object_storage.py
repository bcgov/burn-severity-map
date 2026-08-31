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

    
    def write_image(self, file_path: str, raster, delete: bool=False):
        raster.seek(0)
        hasher = hashlib.sha256()
        raster.seek(0)
        local_sha256 = hasher.hexdigest()

        if delete:
            pattern = file_path.split('_')[-1]
            prefix = f'{self.S3_MAIN_DIR}/{os.path.dirname(file_path)}'

            response = self.s3_client.list_objects_v2(Bucket=self.S3_BUCKET, Prefix=prefix)
            objects = response.get('Contents', [])
            files_to_delete = [{'Key': obj['Key']} for obj in objects if pattern in obj['Key']]

            if files_to_delete:
                for i in range(0, len(files_to_delete), 1000):
                    chunk = files_to_delete[i : i + 1000]
                    self.s3_client.delete_objects(
                        Bucket=self.S3_BUCKET, Delete={'Objects': chunk}
                    )

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
