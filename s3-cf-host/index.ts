import cloudfront = require('@aws-cdk/aws-cloudfront');
import origins = require('@aws-cdk/aws-cloudfront-origins');
import s3 = require('@aws-cdk/aws-s3');
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import acm = require('@aws-cdk/aws-certificatemanager');
import cdk = require('@aws-cdk/core');

class s3CloudFrontStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Destination');
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'static.javydekoning.com',
      'arn:aws:acm:us-east-1:922457306128:certificate/00d49676-e969-4672-8121-016204898648'
    );
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      domainNames: ['static.javydekoning.com'],
      certificate,
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
    });

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./content')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/images/*.jpg'],
    });
  }
}

const app = new cdk.App();

new s3CloudFrontStack(app, 's3CloudFrontStack');

app.synth();
