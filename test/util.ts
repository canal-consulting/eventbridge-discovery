import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { Construct } from 'constructs';
import { EventBridgeDiscovery } from '../src';

export class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new EventBridgeDiscovery(this, 'eb-construct');
  }
}

export function getTestAssets(app: App) {
  const stack = new TestStack(app, 'test-stack');

  const assert = Template.fromStack(stack);
  return {
    assert,
    stack,
    app,
  };
}
