#!/usr/bin/env node
// Reads current AWS credentials from ~/.aws/credentials for the configured profile.
// Used by Claude Code's awsCredentialExport to bypass in-memory SDK cache.
import { loadConfig, parseCredentials } from "./lib.mjs";

if (process.stdout.isTTY) {
  process.stderr.write("WARNING: Writing credentials to terminal. This script is meant for awsCredentialExport only.\n");
}

const config = loadConfig();
const creds = parseCredentials(config.profile);

if (!creds || !creds.aws_access_key_id || !creds.aws_secret_access_key) {
  process.stderr.write(`No credentials found for profile [${config.profile}]\n`);
  process.exit(1);
}

const output = {
  Credentials: {
    AccessKeyId: creds.aws_access_key_id,
    SecretAccessKey: creds.aws_secret_access_key,
    SessionToken: creds.aws_session_token || "",
  },
};

process.stdout.write(JSON.stringify(output) + "\n");
