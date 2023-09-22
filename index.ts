import { context, getOctokit } from "@actions/github";
import * as core from "@actions/core";
import fs from "fs";

process.on("unhandledRejection", handleError);
main().catch(handleError);

async function main(): Promise<void> {
  const token = core.getInput("github-token", { required: true });
  const script = core.getInput("script", { required: true });

  const github = getOctokit(token);

  const result = await github.rest.repos.getContent({
    mediaType: {
      format: "raw",
    },
    owner: context.repo.owner,
    repo: context.repo.repo,
    path: script,
  });

  // @ts-ignore
  fs.writeFileSync("./issue-bot.ts", result.data);

  await require("./issue-bot.ts")({
    github,
    context,
    core,
  });
}

function handleError(err: any): void {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
}
