import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as CdkV2195 from "../lib/cdk-v2-195-stack";

test("VPC Endpoint will have Correct Tags", () => {
	const app = new cdk.App();
	// WHEN
	const stack = new CdkV2195.CdkV2195Stack(app, "MyTestStack");
	// THEN

	const template = Template.fromStack(stack);

	template.hasResourceProperties("AWS::EC2::VPCEndpoint", {
		Tags: [
			{
				Key: "IrrelevantTag",
				Value: "IrrelevantValue"
			},
			{
				Key: "Name",
				Value: "ValidName"
			}
		]
	});
});
