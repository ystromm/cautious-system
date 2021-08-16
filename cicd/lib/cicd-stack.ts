import * as cdk from '@aws-cdk/core';
import * as  codebuild from '@aws-cdk/aws-codebuild';

export class CicdStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const gitHubSource = codebuild.Source.gitHub({
            owner: 'ystromm',
            repo: 'cautious-system',
            webhook: true, // optional, default: true if `webhookFilters` were provided, false otherwise
            webhookTriggersBatchBuild: true, // optional, default is false
            webhookFilters: [
                codebuild.FilterGroup
                    .inEventOf(codebuild.EventAction.PUSH)
                    .andBranchIs('main'),
            ], // optional, by default all pushes and Pull Requests will trigger a build
        });

        new codebuild.Project(this, "schema-api-build", {
            source: gitHubSource,
            buildSpec: codebuild.BuildSpec.fromSourceFilename("schema-api/buildspec.yml")
        })
    }
}
