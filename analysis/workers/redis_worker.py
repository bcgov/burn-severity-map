import os
import socket
import redis
from redis.exceptions import ResponseError
import logging
from pydantic import ValidationError
from models import BsJob
from barc_analysis import run_analysis

logger = logging.getLogger(__name__)
GROUP_NAME = 'bs-worker-group'

def run():
    queue_name = os.getenv('JOB_QUEUE')
    host = os.getenv('REDIS_HOST','localhost')
    redis_port = int(os.getenv('REDIS_PORT',6379))
    redis_database = int(os.getenv('REDIS_DATABASE', 0))
    redis_password = os.getenv('REDIS_PASSWORD')
    
    redis_client = redis.Redis(host=host, 
                               port=redis_port, 
                               db=redis_database,
                               password=redis_password,
                               decode_responses=True
                               )
    consumer_name = f"{socket.gethostname()}-{os.getpid()}"
    logger.info(f"Worker[{consumer_name}] Listening for jobs on Redis queue: {queue_name}")
    
    # Create consumer group if it hasn't been done
    try:
        redis_client.xgroup_create(
            name=queue_name,
            groupname=GROUP_NAME,
            id='$',
            mkstream=True,
        )
        logger.info(f'Created redis consumer group [{GROUP_NAME}] on stream [{queue_name}]')
    except ResponseError as e:
        if 'BUSYGROUP' not in str(e):
            raise
    
    # main processing
    while True:
        try:
            messages = redis_client.xreadgroup(
                groupname=GROUP_NAME,
                consumername=consumer_name,
                streams={queue_name: ">"},
                count=1,
                block=5000)
            
            if not messages:
                continue

            stream_name, entries = messages[0]
            message_id, fields = entries[0]

            job = None

            try:
                # Parse job payload
                raw_job = fields.get('job')
                if not raw_job:
                    raise ValueError("Stream entry missing 'job' field")
                
                job = BsJob.model_validate_json(fields['job'])
                
                run_analysis(job=job)
                # acknowledge success completion
                redis_client.xack(
                    queue_name,
                    GROUP_NAME,
                    message_id,
                )
                logger.info("Completed fire: %s",job.fire)

            except ValidationError as e:
                logger.error("Invalid queue message: %s: %s", 
                            message_id, 
                            e,)

                redis_client.xack(
                    queue_name,
                    GROUP_NAME,
                    message_id,
                )
                
            except Exception as e:
                fire_id = getattr(job, "fire", "Unknown")
                year_val = getattr(job, "year", "Unknown")
                logger.exception("Analysis failed for fire=%s year=%s", fire_id, year_val)

                # DEAD-LETTER QUEUE (DLQ) STRATEGY:
                # Move failed payload to a DLQ stream for manual inspection, then ACK
                dlq_stream = f"{queue_name}-dlq"
                redis_client.xadd(dlq_stream, {
                    'original_message_id': message_id,
                    'error': str(e),
                    'job': fields.get('job', '')
                })
                redis_client.xack(queue_name, GROUP_NAME, message_id)
                logger.warning("Moved message %s to DLQ stream '%s'", message_id, dlq_stream)
        except Exception as e:
            logger.error("Unexpected error in worker loop: %s", e)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    run()


