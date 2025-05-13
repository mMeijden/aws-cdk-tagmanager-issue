import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as CdkV2189 from "../lib/cdk-v2-189-stack";

test("VPC Endpoint will have Correct Tags", () => {
	const app = new cdk.App();
	// WHEN
	const stack = new CdkV2189.CdkV2189Stack(app, "MyTestStack");
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
