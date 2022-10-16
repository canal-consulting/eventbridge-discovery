import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class EventBridgeDiscovery extends Construct {
  public readonly eventBucket: Bucket;
  public readonly eventBus: EventBus;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Event Bucket
    this.eventBucket = new Bucket(this, 'event-bucket', {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      enforceSSL: true,
    });

    // Event Bus
    this.eventBus = new EventBus(this, 'discovery-event-bus', {
      eventBusName: 'discovery-event-bus',
    });

    this.eventBus.applyRemovalPolicy(RemovalPolicy.DESTROY);

    new CfnOutput(this, 'event-bucket-name', {
      value: this.eventBucket.bucketName,
    });

    new CfnOutput(this, 'event-bus-name', {
      value: this.eventBus.eventBusName,
    });
  }
}
