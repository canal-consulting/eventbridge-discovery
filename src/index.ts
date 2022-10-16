import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { EventBucket } from './constructs';

export class EventBridgeDiscovery extends Construct {
  public readonly eventBucket: IBucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.eventBucket = new EventBucket(this, 'event-bucket');
  }
}
