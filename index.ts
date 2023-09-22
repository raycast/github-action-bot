import { context, getOctokit } from "@actions/github";
import { defaults as defaultGitHubOptions } from "@actions/github/lib/utils";
import * as core from "@actions/core";
import fs from "fs";

process.on("unhandledRejection", handleError);
main().catch(handleError);

async function main(): Promise<void> {
  const token = process.env.GITHUB_ACCESS_TOKEN as string;
  const script = process.env.SCRIPT as string;

  console.log(defaultGitHubOptions);

  const github = getOctokit(token, {
    request: { ...defaultGitHubOptions, timeout: 10000 },
  });

  const result = await github.rest.repos.getContent({
    mediaType: {
      format: "raw",
    },
    owner: context.repo.owner,
    repo: context.repo.repo,
    path: script,
  });

  console.log(result.data);

  // // @ts-ignore
  // fs.writeFileSync("./bot.ts", result.data);

  // console.log(result.data);

  // await require("./bot.ts")({
  //   github,
  //   context,
  //   core,
  // });
}

function handleError(err: any): void {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
}

console.log("Hello World");
