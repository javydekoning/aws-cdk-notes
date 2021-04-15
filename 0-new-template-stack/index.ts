import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');

class TemplateStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
  }
}

const app = new cdk.App();

new TemplateStack(app, 'TemplateStack');

app.synth();
