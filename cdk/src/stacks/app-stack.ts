import { join } from "path";
import { Construct } from "constructs";
import { BundlingOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { homedir } from "os";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Bucket } from "aws-cdk-lib/aws-s3";

interface AppStackProps extends StackProps {
  readonly dynamoDbTable: TableV2;

  readonly sourceDirFilepath: string;

  readonly staticSiteBucket: Bucket;

  readonly apiUrl: string | undefined;
}

export class AppStack extends Stack {
  public readonly lambda: Function;

  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    this.lambda = new Function(this, "DemoLambda", {
      runtime: Runtime.JAVA_21,
      // handler: 'com.cgtfarmer.app.Handler',
      handler:
        "io.micronaut.function.aws.proxy.payload2.APIGatewayV2HTTPEventFunction",
      code: Code.fromAsset(join(__dirname, "../../../api/"), {
        bundling: {
          image: Runtime.JAVA_21.bundlingImage,
          user: "root",
          command: [
            "/bin/sh",
            "-c",
            "./gradlew build -PoutDir=/tmp --no-daemon && "
              + "cp -v /tmp/libs/*-all-optimized.jar /asset-output/ &&"
              // Clean out the build artifacts to avoid
              // ownership/permission conflicts in local development
              + "./gradlew clean"
          ],
          // Mounting host machine filesystem location for caching. Keeping
          // separate to avoid ownership/permissions issues
          volumes: [
            {
              hostPath: join(homedir(), ".gradle-cdk"),
              containerPath: "/root/.gradle"
            }
          ],
          outputType: BundlingOutput.ARCHIVED
        }
      }),
      environment: {
        MICRONAUT_ENVIRONMENTS: "cloud",
        MICRONAUT_SERVER_CONTEXT_PATH: "/api",
        LOGGER_LEVELS_ROOT: "DEBUG", // DEBUG
        LOGGER_LEVELS_COM_CGTFARMER: "TRACE", // TRACE
        DDB_TABLE_NAME: props.dynamoDbTable.tableName
      },
      memorySize: 1024,
      timeout: Duration.seconds(30)
    });

    props.dynamoDbTable.grantReadWriteData(this.lambda);

    const sourceDirectory = Source.asset(props.sourceDirFilepath, {
      bundling: {
        image: Runtime.NODEJS_20_X.bundlingImage,
        environment: {
          VITE_API_URL: props.apiUrl
            ? `${props.apiUrl}/api`
            : "/api"
        },
        command: [
          "bash",
          "-c",
          `npm install && \
          npm run build && \
          cp -r ./dist/* /asset-output/`
        ],
        volumes: [
          {
            hostPath: join(__dirname, "..", "..", "..", "shared"),
            containerPath: "/shared"
          }
        ]
      }
    });

    new BucketDeployment(this, "S3BucketDeployment", {
      sources: [sourceDirectory],
      // exclude: ['../../cdk'],
      destinationBucket: props.staticSiteBucket
    });
  }
}
