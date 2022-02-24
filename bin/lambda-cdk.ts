#!/usr/bin/env node
import * as cdk from '@aws-cdk/core'
import { LambdaCdkStack, LamdaStackProps } from '../lib/lambda-cdk-stack'

const yaml = require('js-yaml')
const fs = require('fs')
const app = new cdk.App()

async function main() {
  // Load application.yaml file here
  // ToDo - get absolute path of the application yaml from context?
  const config: LamdaStackProps = yaml.load(
    fs.readFileSync('./lambda-function-repo/conf/application.yaml', 'utf8')
  )
  // ToDo - figure out how to use environment ?
  const environment = 'development' // make dynamic

  const lmbdstack = new LambdaCdkStack(app, 'LambdaCdkStack', config)
}

;(async () => {
  try {
    await main()
    console.log('main done!')
  } catch (e) {
    // Deal with the fact the chain failed
    console.error('Failure in main ...')
    console.error(e)
  }
})()
