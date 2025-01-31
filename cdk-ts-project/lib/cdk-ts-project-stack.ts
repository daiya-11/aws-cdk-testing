import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';  // Hier das path-Modul importieren

export class CdkTsProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Erstelle einen S3-Bucket
    const bucket = new s3.Bucket(this, 'MyBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Wichtig für Testumgebungen
    });

    const myLambda = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',  // Muss mit `export const handler` in index.ts übereinstimmen!
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')), // Stelle sicher, dass der Pfad korrekt ist
    });
    

    // Erstelle API Gateway, um die Lambda-Funktion anzusprechen
    const api = new apigateway.LambdaRestApi(this, 'MyApi', {
      handler: myLambda,
    });

    // Stack Output: Gebe die API-URL aus
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url ?? 'No URL',
      description: 'API URL',
    });
  }
}



