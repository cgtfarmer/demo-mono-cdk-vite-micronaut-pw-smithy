#!/usr/bin/env node

import { App, Environment, RemovalPolicy } from "aws-cdk-lib";

import { NetworkStack } from "../stacks/network-stack";
import { AppStack } from "../stacks/app-stack";
import { InfraStack } from "../stacks/infra-stack";

const cdkEnvironment: Environment = {
  account: '<AWS_ACCOUNT_ID>',
  region: "us-east-1"
};

const app = new App();

new NetworkStack(app, "DemoNetworkStack", {
  env: cdkEnvironment,
  apiLambdaArn: undefined,
  cloudFrontVerifyHeader: "123-xyz-abc",
  staticSiteBucketArn: undefined,
  httpApiAllowedOrigins: []
});

const infraStack = new InfraStack(app, "DemoInfraStack", {
  env: cdkEnvironment,
  cloudFrontDistributionArn: undefined,
  removalPolicy: RemovalPolicy.DESTROY
});

new AppStack(app, "DemoAppStack", {
  env: cdkEnvironment,
  dynamoDbTable: infraStack.dynamoDbTable,
  staticSiteBucket: infraStack.staticSiteBucket,
  sourceDirFilepath: "../ui",
  apiUrl: undefined
});
