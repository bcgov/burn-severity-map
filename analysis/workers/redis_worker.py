import os
import redis
import json
from models import BsJob,BarcAnalysisResult
from barc_analysis import InterimBurnSeverity
logger = logging.getLogger(__name__)

def run():
    queue_name = os.getenv('JOB_QUEUE')
    host = os.getenv('REDIS_HOST','localhost')
    redis_port = os.getenv('REDIS_PORT',6379)
    redis_database = os.getenv('REDIS_DATABASE', 0)
    redis_password = os.getenv('REDIS_PASSWORD')
    
    redis_client = redis.Redis(host=host, port=redis_port, db=redis_database,password=redis_password)
    logger.info(f"Listening for jobs on Redis queue: {queue_name}")

    while True:
        queue, message = redis_client.blpop(queue_name)
        if not message:
            continue
        queue, message = redis_client.blpop(queue_name)
        try:
            job = BsJob.model_validate(message)
        except ValidationError as e:
            logger.error("Invalid queue message: %s", e)
            continue
        try:
            bs_job = run_analysis(job=job)
            logger.info("Completed job-id: %s",job.job_id))
        except Exception as e:
            logger.exception("Exception while running(run_analysis) job-id: %s year: %s \n %s", bs_job.fire, bs_job.year, bs_job.status, e)



def run_analysis(job: BsJob):
    bs_job = InterimBurnSeverity(
        fire=job.fire,
        year=job.jear,
        sensor=job.sensor,
        output_folder=job.output_folder,
        object_storage=job.object_storage,
        start_date=job.start_date,
        end_date=job.end_date,
        cloud_cover=job.cloud,
        image_ids=job.image_ids,
        logger=logger
    )
    try:
        result = bs_job.gather_spatial()
        if not result:
            raise RuntimeError("Failed to gather spatial data")
        barc, meta = bs_job.calculate_severity()
        if barc is None:
            raise RuntimeError("Failed to calculate burn severity")
        bs_job.conversion(barc, meta)
        response = BarcAnalysisResult(
            status="SUCCESS",
            fire= job.fire
            year= job.year
        )
    finally:
        del bs_job




