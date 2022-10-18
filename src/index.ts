import * as path from 'path';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Archive, EventBus } from 'aws-cdk-lib/aws-events';
import { CfnDiscoverer } from 'aws-cdk-lib/aws-eventschemas';
import { DockerImageCode, DockerImageFunction } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import { EventBridgeTypes } from './enums';
import { EventBridgeSfn } from './state-machine';

export class EventBridgeDiscovery extends Construct {
  public readonly eventBucket: Bucket;
  public readonly eventBus: EventBus;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.eventBucket = new Bucket(this, 'event-bucket', {
      bucketName: 'eventbridge-discovery-test',
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      enforceSSL: true,
    });

    this.eventBus = new EventBus(this, 'discovery-eventbus', {
      eventBusName: 'discovery-eventbus',
    });

    this.eventBus.applyRemovalPolicy(RemovalPolicy.DESTROY);

    new Archive(this, 'discovery-archive', {
      sourceEventBus: this.eventBus,
      retention: Duration.days(7),
      eventPattern: {
        source: ['s3'],
        detailType: ['modelbroker.logs'],
      },
    });

    const s3ToEventBusLambda = new DockerImageFunction(this, 's3-to-eventbus', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, './lambdas/s3-to-eventbus')),
      timeout: Duration.seconds(60),
      memorySize: 512,
      description: 's3 to eventbus schema',
      environment: {
        EVENT_BUS: this.eventBus.eventBusName,
        DETAIL_TYPE: 'modelbroker.logs',
        SOURCE: 's3',
      },
    });

    this.eventBus.grantPutEventsTo(s3ToEventBusLambda);
    this.eventBucket.addObjectCreatedNotification(new LambdaDestination(s3ToEventBusLambda));
    this.eventBucket.grantRead(s3ToEventBusLambda);

    new EventBridgeSfn(this, 'schema-created-sfn', {
      detailType: EventBridgeTypes.SchemaCreated,
    });

    new EventBridgeSfn(this, 'schema-version-created-sfn', {
      detailType: EventBridgeTypes.SchemaVersionCreated,
    });

    new CfnDiscoverer(this, 'event-discoverer', {
      sourceArn: this.eventBus.eventBusArn,
      crossAccount: false,
    });

    new CfnOutput(this, 'event-bucket-name', {
      value: this.eventBucket.bucketName,
    });

    new CfnOutput(this, 'eventbus-name', {
      value: this.eventBus.eventBusName,
    });
  }
}
