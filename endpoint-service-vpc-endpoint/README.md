# Example VPC endpoint service (AWS PrivateLink)

You can create your own application in your VPC and configure it as an AWS PrivateLink-powered service (referred to as 
an endpoint service).

The image below shows what this stack creates. Take note that there is no connectivity between the `Left (Service Consuming)` and `Right (Service Providing)` VPC.

The exposed service will have an IP local to the `Left (Service Consuming)` VPC. The DNS domain name will be publicly 
resolvable to a **PRIVATE** IP

![diagram](/endpoint-service-vpc-endpoint/diagram.png)