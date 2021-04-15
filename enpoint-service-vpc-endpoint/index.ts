import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecsp = require('@aws-cdk/aws-ecs-patterns');
import cdk = require('@aws-cdk/core');

class EndpointServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //ServiceVPC
    const rightVpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2,
      cidr: '192.168.101.0',
    });

    const svc = new ecsp.NetworkLoadBalancedFargateService(this, 'exampleSvc', {
      vpc: rightVpc,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('containous/whoami'),
        containerPort: 80,
      },
    });

    const endPointService = new ec2.VpcEndpointService(this, 'endpoint', {
      acceptanceRequired: false,
      vpcEndpointServiceLoadBalancers: [svc.loadBalancer],
    });

    //Service Consuming VPC
    const leftVpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2,
      cidr: '192.168.100.0',
    });

    const sg = new ec2.SecurityGroup(this, 'sgEndpoint', {
      vpc: leftVpc,
      allowAllOutbound: true,
    });

    sg.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    leftVpc.addInterfaceEndpoint('endpoint', {
      service: {
        name: endPointService.vpcEndpointServiceName,
        port: 80,
        privateDnsDefault: false,
      },
      securityGroups: [sg],
    });
  }
}

const app = new cdk.App();

new EndpointServiceStack(app, 'EndpointServiceStack');

app.synth();
