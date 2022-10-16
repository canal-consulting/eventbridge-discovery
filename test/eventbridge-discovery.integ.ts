import { App } from 'aws-cdk-lib';
// @ts-ignore
import { TestStack } from './util';

const app = new App();
new TestStack(app, 'integ-stack');
app.synth();
