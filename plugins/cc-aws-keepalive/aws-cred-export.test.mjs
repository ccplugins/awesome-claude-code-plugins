import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "aws-cred-export.mjs");

function makeTmpHome() {
  return mkdtempSync(join(tmpdir(), "cckeep-export-"));
}

function writeCredentials(home, content) {
  const awsDir = join(home, ".aws");
  mkdirSync(awsDir, { recursive: true });
  writeFileSync(join(awsDir, "credentials"), content, "utf8");
}

// ============================================================================
// aws-cred-export.mjs -- spawned as a subprocess
// ============================================================================

describe("aws-cred-export.mjs", () => {
  let tmpHome;

  beforeEach(() => {
    tmpHome = makeTmpHome();
  });

  afterEach(() => {
    rmSync(tmpHome, { recursive: true, force: true });
  });

  it("outputs valid JSON with all 3 credential fields", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = AKIAEXAMPLE",
        "aws_secret_access_key = SECRET123",
        "aws_session_token = TOKEN456==",
      ].join("\n")
    );

    const stdout = execFileSync("node", [SCRIPT], {
      env: { ...process.env, HOME: tmpHome, USERPROFILE: tmpHome },
      encoding: "utf8",
    });

    const parsed = JSON.parse(stdout.trim());
    assert.equal(parsed.Credentials.AccessKeyId, "AKIAEXAMPLE");
    assert.equal(parsed.Credentials.SecretAccessKey, "SECRET123");
    assert.equal(parsed.Credentials.SessionToken, "TOKEN456==");
  });

  it("exits with code 1 when no credentials exist", () => {
    // tmpHome has no .aws directory
    try {
      execFileSync("node", [SCRIPT], {
        env: { ...process.env, HOME: tmpHome, USERPROFILE: tmpHome },
        encoding: "utf8",
      });
      assert.fail("expected script to exit with code 1");
    } catch (err) {
      assert.equal(err.status, 1);
      assert.ok(
        err.stderr.includes("No credentials found"),
        `expected stderr to mention missing credentials, got: ${err.stderr}`
      );
    }
  });

  it("outputs empty SessionToken when aws_session_token is missing", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = AKIANOSSN",
        "aws_secret_access_key = SECRETNOSSN",
      ].join("\n")
    );

    const stdout = execFileSync("node", [SCRIPT], {
      env: { ...process.env, HOME: tmpHome, USERPROFILE: tmpHome },
      encoding: "utf8",
    });

    const parsed = JSON.parse(stdout.trim());
    assert.equal(parsed.Credentials.AccessKeyId, "AKIANOSSN");
    assert.equal(parsed.Credentials.SecretAccessKey, "SECRETNOSSN");
    assert.equal(parsed.Credentials.SessionToken, "");
  });
});
