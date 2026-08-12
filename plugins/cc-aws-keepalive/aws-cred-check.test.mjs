import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const homes = [];

function configuredHome(expiration) {
  const home = mkdtempSync(join(tmpdir(), "cc-hook-"));
  homes.push(home);
  mkdirSync(join(home, ".aws"), { recursive: true });
  mkdirSync(join(home, ".config", "cc-aws-keepalive"), { recursive: true });
  writeFileSync(join(home, ".aws", "credentials"), [
    "[default]",
    "aws_access_key_id = AKID",
    "aws_secret_access_key = SECRET",
    "aws_session_token = TOKEN",
    `x_security_token_expires = ${expiration}`,
  ].join("\n"));
  writeFileSync(join(home, ".config", "cc-aws-keepalive", "config.json"), JSON.stringify({
    profile: "default",
    expirationField: "x_security_token_expires",
    warnMinutes: 30,
  }));
  return home;
}

afterEach(() => {
  for (const home of homes.splice(0)) rmSync(home, { recursive: true, force: true });
});

describe("UserPromptSubmit output", () => {
  it("emits an expired warning as non-blocking hook JSON", () => {
    const home = configuredHome(Math.floor(Date.now() / 1000) - 60);
    const result = spawnSync(process.execPath, ["aws-cred-check.mjs"], {
      cwd: new URL(".", import.meta.url),
      env: { ...process.env, HOME: home, USERPROFILE: home },
      encoding: "utf8",
    });

    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.match(output.systemMessage, /credentials EXPIRED/);
    assert.equal(output.decision, undefined);
  });

  it("emits a near-expiry warning as hook JSON", () => {
    const home = configuredHome(Math.floor(Date.now() / 1000) + 10 * 60);
    const result = spawnSync(process.execPath, ["aws-cred-check.mjs"], {
      cwd: new URL(".", import.meta.url),
      env: { ...process.env, HOME: home, USERPROFILE: home },
      encoding: "utf8",
    });

    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.match(output.systemMessage, /session expires in/);
  });
});
