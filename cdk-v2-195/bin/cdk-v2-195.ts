#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CfnVPCEndpoint } from "aws-cdk-lib/aws-ec2";
import { CdkV2195Stack } from "../lib/cdk-v2-195-stack";

const app = new cdk.App();
const stack = new CdkV2195Stack(app, "CdkV2195Stack");

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
	}
}

cdk.Aspects.of(stack).add(new TagChecker());
