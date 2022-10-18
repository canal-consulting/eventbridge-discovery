import json
import os
from datetime import datetime
from typing import Dict, List
from urllib.parse import unquote_plus

import boto3
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.data_classes import S3Event, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext

EVENT_BUS = os.environ.get("EVENT_BUS")

logger = Logger()
tracer = Tracer()
eventbridge = boto3.client("events")
s3 = boto3.client("s3")


@tracer.capture_method
def send_events(events: List):
    """
    Send events to EventBridge
    """

    logger.info("Sending %d events to EventBridge", len(events))
    for i in range(0, len(events), 10):
        eventbridge.put_events(Entries=events[i : i + 10])


@logger.inject_lambda_context(log_event=True)
@event_source(data_class=S3Event)
def lambda_handler(event: S3Event, context: LambdaContext):
    bucket_name = event.bucket_name
    logger.info(f"event bus: {EVENT_BUS}")
    for record in event.records:
        object_key = unquote_plus(record.s3.get_object.key)
        logger.info(f"Processing {bucket_name}/{object_key}")
        events = s3_to_events(bucket_name, record, EVENT_BUS, "s3")
        if len(events) > 0:
            send_events(events)


def s3_to_events(
    s3_bucket: str,
    s3_record: S3Event.record,
    event_bus_name: str,
    source: str,
) -> List[Dict]:

    object_key = unquote_plus(s3_record.s3.get_object.key)
    raw_object = s3.get_object(Bucket=s3_bucket, Key=object_key)
    raw_data = json.loads(raw_object["Body"].read().decode("utf-8"))
    return [
        {
            "Time": datetime.now(),
            "Source": source,
            "Resources": [s3_record.s3.get_object.key],
            "EventBusName": event_bus_name,
            "DetailType": "s3",
            "Detail": json.dumps(item),
        }
        for item in raw_data
    ]
