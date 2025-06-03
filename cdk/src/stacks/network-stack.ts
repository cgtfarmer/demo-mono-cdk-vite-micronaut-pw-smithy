import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Function } from "aws-cdk-lib/aws-lambda";
import { WafRulesFactory } from "@cgtfarmer/cgtfarmer-cdk-lib/waf";
import {
  HttpApiBehaviorOptionsFactory,
  S3StaticSiteBehaviorOptionsFactory
} from "@cgtfarmer/cgtfarmer-cdk-lib/cloudfront-behavior-options";
import { DefaultCloudFrontInfra } from "@cgtfarmer/cgtfarmer-cdk-lib/cloudfront";
import { HttpApiInfraCloudFront } from "@cgtfarmer/cgtfarmer-cdk-lib/http-api";

interface NetworkStackProps extends StackProps {
  readonly apiLambdaArn: string | undefined;

  readonly staticSiteBucketArn: string | undefined;

  readonly cloudFrontVerifyHeader: string;

  readonly httpApiAllowedOrigins: string[];
}

export class NetworkStack extends Stack {
  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    const httpApiInfra = new HttpApiInfraCloudFront(this, "HttpApiInfra", {
      httpApiDescription: "SmithyDemo",
      placeholderProxyRouteEnabled: false,
      cloudFrontVerifyHeader: props.cloudFrontVerifyHeader,
      httpApiAllowedOrigins: []
    });

    if (props.apiLambdaArn) {
      const apiLambda = Function.fromFunctionArn(
        this,
        "LambdaFunction",
        props.apiLambdaArn
      );

      const demoLambdaIntegration = new HttpLambdaIntegration(
        "DemoLambdaIntegration",
        apiLambda
      );

      httpApiInfra.httpApi.addRoutes({
        path: "/api/health",
        methods: [HttpMethod.GET],
        integration: demoLambdaIntegration
      });

      httpApiInfra.httpApi.addRoutes({
        path: "/api/users",
        methods: [HttpMethod.GET, HttpMethod.POST],
        integration: demoLambdaIntegration
      });

      httpApiInfra.httpApi.addRoutes({
        path: "/api/users/{id}",
        methods: [HttpMethod.GET, HttpMethod.PUT, HttpMethod.DELETE],
        integration: demoLambdaIntegration
      });
    }

    const httpApiBehaviorOptions = HttpApiBehaviorOptionsFactory.create(
      this,
      httpApiInfra.httpApi,
      props.cloudFrontVerifyHeader
    );

    const wafRules = new WafRulesFactory({
      allowsApiAccess: true,
      allowsFileIo: true
    }).create();

    // const distributionDefaultBehavior = props.staticSiteBucketArn
    //   ? S3StaticSiteBehaviorOptionsFactory.createFromBucket(
    //       this,
    //       props.staticSiteBucket
    //     )
    //   : undefined;

    const distributionDefaultBehavior = props.staticSiteBucketArn
      ? S3StaticSiteBehaviorOptionsFactory.createFromBucketArn(
          this,
          props.staticSiteBucketArn
        )
      : undefined;

    new DefaultCloudFrontInfra(this, "CloudFrontInfra", {
      distributionDescription: "SmithyDemo",
      wafRuleProperties: wafRules,
      distributionDefaultBehavior: distributionDefaultBehavior,
      distributionAdditionalBehaviors: {
        "/api/*": httpApiBehaviorOptions
      },
      distributionDomainNames: undefined,
      acmCertDomainName: undefined,
      acmCertSubjectAlternativeNames: undefined,
      hostedZone: undefined,
      removalPolicy: RemovalPolicy.DESTROY
    });
  }
}
