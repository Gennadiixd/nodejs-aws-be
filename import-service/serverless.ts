import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "import-service",
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-1",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: ["arn:aws:s3:::app-78523-public"],
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: ["arn:aws:s3:::app-78523-public/*"],
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: [
          {
            "Fn::GetAtt": ["SQSQueue", "Arn"],
          },
        ],
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: [
          {
            Ref: "SNSTopic",
          },
        ],
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SQS_URL: {
        Ref: "SQSQueue",
      },
      SNS_ARN: {
        Ref: "SNSTopic",
      },
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "gennadiixd@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
        },
      },
      GatewayResponseDenied: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'",
          },
          ResponseType: "ACCESS_DENIED",
          RestApiId: { Ref: "ApiGatewayRestApi" },
        },
      },
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'",
          },
          ResponseType: "UNAUTHORIZED",
          RestApiId: { Ref: "ApiGatewayRestApi" },
        },
      },
    },
  },
  functions: {
    importProductsFile: {
      handler: "handler.importProductsFile",
      events: [
        {
          http: {
            method: "get",
            path: "import",
            cors: {
              origins: "*",
              headers: "*",
            },
            authorizer: {
              name: "basicAuthorizer",
              type: "token",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization",
              arn:
                "arn:aws:lambda:eu-west-1:048230540485:function:authorization-service-dev-basicAuthorizer",
            },
          },
        },
      ],
    },
    importFileParser: {
      handler: "handler.importFileParser",
      events: [
        {
          s3: {
            bucket: "app-78523-public",
            event: "s3:ObjectCreated:*",
            rules: [{ prefix: "uploaded/", suffix: "csv" }],
            existing: true,
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: "handler.catalogBatchProcess",
      events: [
        {
          sqs: {
            batchSize: 5,
            // just one of method to get arn of SQS
            arn: {
              "Fn::GetAtt": ["SQSQueue", "Arn"],
            },
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
