import { Duration, Stack, StackProps, Tags } from "aws-cdk-lib";
import { CfnVPCEndpoint } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class CdkV2195Stack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const endpoint = new CfnVPCEndpoint(this, "MockVPCEndpoint", {
			serviceName: "com.amazonaws.vpce.us-east-1.vpce-svc-12345678",
			vpcId: "vpc-12345678",
			tags: [
				{
					key: "IrrelevantTag",
					value: "IrrelevantValue"
				}
			]
		});
		Tags.of(endpoint).add("Name", "ValidName");
	}
}
