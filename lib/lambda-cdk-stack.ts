import * as cdk from '@aws-cdk/core'
import { Runtime, Code, Function } from '@aws-cdk/aws-lambda'
import * as path from 'path'
import { Role } from '@aws-cdk/aws-iam'
import * as apigateway from '@aws-cdk/aws-apigateway'
import { LamdaStackProps } from './lambda-cdk-props'

export {LamdaStackProps} //from './lambda-cdk-props'

export class LambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: LamdaStackProps) {
    super(scope, id, props)

    // console.log('Props below *** ')
    // if (props.functions)
    console.log(props.LambdaCdkConfig)

    // Get Lambda Runtime object from props or use NODEJS object as default if no runtime exist in
    const appRuntime: Runtime =
      props.LambdaCdkConfig.lambdaRuntime &&
      (<any>Runtime)[props.LambdaCdkConfig.lambdaRuntime]
        ? (<any>Runtime)[props.LambdaCdkConfig.lambdaRuntime]
        : Runtime.NODEJS_14_X

    // create lambda for each funtion in the application
    props.LambdaCdkConfig.functions.forEach(func => {
      // Import Role using ARN; the role for the service should be created with the required policies
      let role = Role.fromRoleArn(
        this,
        `${func.functionName}-role`,
        func.roleArn
      )

      // Create the Lambda handler
      let lambda_func = new Function(
        this,
        `${func.functionName}-lambdaFuntion`,
        {
          functionName: func.functionName,
          runtime: appRuntime,
          memorySize: func.memorySize,
          timeout: cdk.Duration.seconds(func.timeout),
          handler: func.handler,
          role: role,
          code: Code.fromAsset(path.join(__dirname, props.LambdaCdkConfig.srcPath)),
          environment: {
            REGION: cdk.Stack.of(this).region,
            AVAILABILITY_ZONES: JSON.stringify(
              cdk.Stack.of(this).availabilityZones
            ),
          },
        }
      )

      // Create the apiGateway with REST protocol
      // cloudWatchRole (service role for APIGateway) will be created - profile used to deploy stack must have the previlage to create a role
      // at this time the only option if profile or user can not create role is to disable ApiGateway clouldwatch logs
      if (func.apiGateway) {
        const api = new apigateway.RestApi(
          this,
          `${func.functionName}-lambda-api`,
          {
            restApiName: 'Lambda Cdk API Service',
            description: 'This servic is deployed using the cdk lambda funtion',
            // cloudWatchRole: false
            deployOptions: {
              stageName: 'dev',
            },
          }
        )

        const apiIntegration = new apigateway.LambdaIntegration(lambda_func, {
          requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        })

        const resource = api.root.addResource(props.LambdaCdkConfig.application)
        func.methods.forEach(mtd => {
          resource.addMethod(mtd, apiIntegration)
        })
      }
    })
  }
}
