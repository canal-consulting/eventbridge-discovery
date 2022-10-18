import * as path from 'path';
import { AccessPoint } from '@aws-cdk/aws-s3objectlambda-alpha';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { CfnDiscoverer } from 'aws-cdk-lib/aws-eventschemas';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';

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

    const s3ToEventBusLambda = new lambda.DockerImageFunction(this, 's3-to-eventbus', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, './lambdas/s3-to-eventbus')),
      timeout: Duration.seconds(60),
      memorySize: 512,
      description: 's3 to eventbus schema',
      environment: {
        EVENT_BUS: this.eventBus.eventBusName,
      },
    });

    new AccessPoint(this, 's3-lambda-access-point', {
      bucket: this.eventBucket,
      handler: s3ToEventBusLambda,
      cloudWatchMetricsEnabled: true,
      supportsGetObjectPartNumber: true,
      supportsGetObjectRange: true,
      payload: {
        prop: 'value',
      },
    });

    this.eventBus.grantPutEventsTo(s3ToEventBusLambda);
    this.eventBucket.addObjectCreatedNotification(new LambdaDestination(s3ToEventBusLambda));
    this.eventBucket.grantRead(s3ToEventBusLambda);

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
