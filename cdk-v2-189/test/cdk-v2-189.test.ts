import * as cdk from "aws-cdk-lib";
import { Match, Annotations } from "aws-cdk-lib/assertions";
import { CfnVPCEndpoint } from "aws-cdk-lib/aws-ec2";
import { CfnBucket } from "aws-cdk-lib/aws-s3";

class TagChecker implements cdk.IAspect {
	visit(node: any): void {
		if (node instanceof CfnVPCEndpoint) {
			const tags = [
				...(cdk.Stack.of(node).resolve(node.tags) || []),
				...(cdk.Stack.of(node).resolve(node.cdkTagManager.renderTags()) || [])
			];
			const nameTag = tags?.find((tag: any) => tag.key === "Name")?.value;
			if (!nameTag) {
				cdk.Annotations.of(node).addError("Name tag is missing");
			} else {
				console.log(`Name tag is present with value: ${nameTag}`);
			}
		}

		if (node instanceof CfnBucket) {
			const tags = [...(cdk.Stack.of(node).resolve(node.tags.renderTags()) || [])];
			const nameTag = tags?.find((tag: any) => tag.key === "Name")?.value;

			if (!nameTag) {
				console.log("No Name tag found in bucket tags");
				console.log(`Tags found: ${JSON.stringify(tags)}`);
				cdk.Annotations.of(node).addError("Name tag is missing");
			} else {
				console.log(`Name tag is present with value: ${nameTag}`);
			}
		}
	}
}

test("VPC Endpoint will have Correct Tags", () => {
	const app = new cdk.App();
	const stack = new cdk.Stack(app, "MyTestStack");
	const endpoint = new CfnVPCEndpoint(stack, "MockVPCEndpoint", {
		serviceName: "com.amazonaws.vpce.us-east-1.vpce-svc-12345678",
		vpcId: "vpc-12345678",
		tags: [
			{
				key: "IrrelevantTag",
				value: "IrrelevantValue"
			}
		]
	});

	const bucket = new CfnBucket(stack, "MockBucket", {
		tags: [
			{
				key: "IrrelevantBucketTag",
				value: "IrrelevantBucketValue"
			}
		]
	});
	cdk.Tags.of(bucket).add("Name", "ValidBucketName");
	cdk.Tags.of(endpoint).add("Name", "ValidName");
	cdk.Tags.of(stack).add("StackTag", "StackValue");

	// THEN
	cdk.Aspects.of(app).add(new TagChecker());
	app.synth();

	const match = Match.stringLikeRegexp(`.*Name tag is missing.*`);
	Annotations.fromStack(stack).hasNoError("*", match);
});
