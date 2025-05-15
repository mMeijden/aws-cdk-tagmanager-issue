#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkV2189Stack } from "../lib/cdk-v2-189-stack";
import { CfnVPCEndpoint } from "aws-cdk-lib/aws-ec2";

const app = new cdk.App();
const stack = new CdkV2189Stack(app, "CdkV2189Stack");
cdk.Tags.of(stack).add("Name", "ValidName");

class TagChecker implements cdk.IAspect {
	visit(node: any): void {
		if (node instanceof CfnVPCEndpoint) {
			const tags = [
				...(cdk.Stack.of(node).resolve(node.tags) || []),
				...(cdk.Stack.of(node).resolve(node.cdkTagManager.renderTags()) || [])
			];
			const nameTag = tags?.find((tag: any) => tag.key === "Name")?.value;
			if (!nameTag) {
				throw new Error("Name tag is missing");
			} else {
				console.log(`Name tag is present with value: ${nameTag}`);
			}
		}
	}
}

cdk.Aspects.of(stack).add(new TagChecker());
