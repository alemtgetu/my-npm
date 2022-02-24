import * as cdk from '@aws-cdk/core'

export interface LamdaStackProps extends cdk.StackProps {
    // Prevent any name conflicts with StackProps base class
    // and this help track and manage application.yaml content
    LambdaCdkConfig: {
      readonly application: string
      readonly lambdaRuntime: string
      readonly stageName: string
      readonly srcPath: string
      readonly functions: [
        {
          functionName: string
          apiGateway: boolean
          handler: string
          roleArn: string
          memorySize: number
          timeout: number
          methods: [string]
        }
      ]
    }
  }

// module.exports = La