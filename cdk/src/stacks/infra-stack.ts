import { Construct } from "constructs";
import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Billing,
  Capacity,
  TableClass,
  TableV2
} from "aws-cdk-lib/aws-dynamodb";
import { DefaultBucket } from "@cgtfarmer/cgtfarmer-cdk-lib/s3";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { CloudFrontOacServicePrincipal } from "@cgtfarmer/cgtfarmer-cdk-lib/iam";

interface InfraStackProps extends StackProps {
  readonly cloudFrontDistributionArn: string | undefined;

  readonly removalPolicy: RemovalPolicy;
}

export class InfraStack extends Stack {
  public readonly dynamoDbTable: TableV2;

  public readonly staticSiteBucket: Bucket;

  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    this.dynamoDbTable = new TableV2(this, "DemoUserTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(1),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 1 })
      }),
      removalPolicy: RemovalPolicy.DESTROY
    });

    this.staticSiteBucket = new DefaultBucket(this, "S3Bucket", {
      removalPolicy: props.removalPolicy
    });

    if (props.cloudFrontDistributionArn) {
      const cloudFrontOacServicePrincipal = new CloudFrontOacServicePrincipal(
        props.cloudFrontDistributionArn
      );

      this.staticSiteBucket.grantRead(cloudFrontOacServicePrincipal);
    }
  }
}
