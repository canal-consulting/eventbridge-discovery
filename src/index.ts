import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { EventBus, IEventBus } from 'aws-cdk-lib/aws-events';
import { BlockPublicAccess, Bucket, BucketEncryption, IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class EventBridgeDiscovery extends Construct {
  public readonly eventBucket: IBucket;
  public readonly eventBus: IEventBus;

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
    this.eventBus.archive('discovery-event-bus-archive', {
      archiveName: 'events-archive',
      description: 'An archive of the model broker events',
      eventPattern: {
        account: [Stack.of(this).account],
      },
      retention: Duration.days(7),
    });
  }
}
