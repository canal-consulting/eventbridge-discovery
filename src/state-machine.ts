import { Duration } from 'aws-cdk-lib';
import { Rule } from 'aws-cdk-lib/aws-events';
import { SfnStateMachine } from 'aws-cdk-lib/aws-events-targets';
import { Pass, StateMachine, Wait, WaitTime } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { EventBridgeTypes } from './enums';

export interface StateMachineProps {
  readonly detailType: EventBridgeTypes;
}

export class EventBridgeSfn extends Construct {
  constructor(scope: Construct, id: string, props: StateMachineProps) {
    super(scope, id);

    const waitTask = new Wait(this, 'waitUntil', {
      time: WaitTime.duration(Duration.seconds(120)),
    });

    const passTask = new Pass(this, 'pass');

    const schemaMachineDefinition = waitTask.next(passTask);

    const schemaMachine = new StateMachine(this, 'schema', {
      definition: schemaMachineDefinition,
      timeout: Duration.days(90),
    });

    const sfnTarget = new SfnStateMachine(schemaMachine);
    new Rule(this, 'schema-discovery', {
      targets: [sfnTarget],
      enabled: true,
      eventPattern: {
        source: ['aws.schemas'],
        detailType: [props.detailType],
        resources: ['arn:aws:schemas:us-west-2:570405429484:schema/discovered-schemas/s3@Modelbroker.logs'],
      },
    });
  }
}
