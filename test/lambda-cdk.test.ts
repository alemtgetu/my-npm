import { expect as expectCDK, haveResource, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { LamdaStackProps, LambdaCdkStack} from '../lib/lambda-cdk-stack';

const testProps:LamdaStackProps = {
  LambdaCdkConfig:{
    application: "test-app",
    lambdaRuntime: "NODEJS_14_X",
    stageName: 'unit-test',
    srcPath: '../lambda-function-repo/src',
    functions: [
      {
        functionName: "test",
        apiGateway: false,
        handler: "index.main_one",
        roleArn: "arn:aws:iam::010805440944:role/service-Role-ForLamdaCdk",
        memorySize: 1024,
        timeout: 30,
        methods: ['GET']
      }
    ]
  }
}
test('Lambda Funtion', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LambdaCdkStack(app, 'MyTestStack', testProps);
    // THEN
    // console.log(stack)
    expectCDK(stack).to(countResources('AWS::Lambda::Function', 1));
    // expectCDK(stack).to(haveResource("AWS::Lambda::Function",{
    //   VisibilityTimeout: 600
    // }));
});


