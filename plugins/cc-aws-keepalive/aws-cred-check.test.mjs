import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, chmodSync } from "node:fs";
import { join, dirname, delimiter } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "aws-cred-check.mjs");

function writeCredentials(home, content) {
  const awsDir = join(home, ".aws");
  mkdirSync(awsDir, { recursive: true });
  writeFileSync(join(awsDir, "credentials"), content, "utf8");
}

function writeConfig(home, obj) {
  const configDir = join(home, ".config", "cc-aws-keepalive");
  mkdirSync(configDir, { recursive: true });
  writeFileSync(join(configDir, "config.json"), JSON.stringify(obj), "utf8");
}

// A fake `aws` on PATH that records each call and answers with FAKE_AWS_EXIT.
function installFakeAws(home) {
  const bin = join(home, "bin");
  mkdirSync(bin, { recursive: true });
  const script = join(bin, "aws");
  writeFileSync(script, `#!/bin/sh\necho "$@" >> "${join(home, "aws-calls.log")}"\nexit "\${FAKE_AWS_EXIT:-0}"\n`);
  chmodSync(script, 0o755);
  return bin;
}

function awsCalls(home) {
  const log = join(home, "aws-calls.log");
  return existsSync(log) ? readFileSync(log, "utf8").trim().split("\n").length : 0;
}

function runCheck(home, env = {}) {
  const res = spawnSync(process.execPath, [SCRIPT], {
    encoding: "utf8",
    env: {
      ...process.env,
      HOME: home,
      USERPROFILE: home,
      PATH: `${join(home, "bin")}${delimiter}${process.env.PATH}`,
      CC_KEEPALIVE_PROFILE: "",
      ...env,
    },
  });
  return res;
}

function systemMessage(res) {
  assert.equal(res.status, 0, `hook must exit 0, stderr: ${res.stderr}`);
  const out = res.stdout.trim();
  if (!out) return null;
  const parsed = JSON.parse(out);
  assert.deepEqual(Object.keys(parsed), ["systemMessage"]);
  return parsed.systemMessage;
}

const now = () => Math.floor(Date.now() / 1000);

describe("aws-cred-check.mjs warnings (expirationField set)", () => {
  let home;
  beforeEach(() => { home = mkdtempSync(join(tmpdir(), "cckeep-check-")); });
  afterEach(() => { rmSync(home, { recursive: true, force: true }); });

  function setup(expiresIn, extra = {}) {
    writeConfig(home, { expirationField: "x_security_token_expires", loginCmd: "saml2aws login", ...extra });
    writeCredentials(home, `[default]\naws_access_key_id = AKIA\nx_security_token_expires = ${now() + expiresIn}\n`);
  }

  it("puts the expired warning in a JSON systemMessage on stdout, not stderr", () => {
    setup(-60);
    const res = runCheck(home);
    const msg = systemMessage(res);
    assert.match(msg, /AWS credentials EXPIRED\. Run: saml2aws login/);
    assert.doesNotMatch(res.stderr, /EXPIRED/);
  });

  it("warns in a systemMessage when the session is close to expiry", () => {
    setup(10 * 60 + 30); // 30 s margin so a slow runner still reads 10m
    assert.match(systemMessage(runCheck(home)), /AWS session expires in 10m\. Run soon: saml2aws login/);
  });

  it("prints nothing when the session is far from expiry", () => {
    setup(5 * 3600);
    const res = runCheck(home);
    assert.equal(systemMessage(res), null);
    assert.equal(res.stdout, "");
  });

  it("joins the auto-login notice and the warning into one JSON object", () => {
    setup(10 * 60 + 30, { autoLoginCmd: "true", autoLoginMinutes: 30 });
    const msg = systemMessage(runCheck(home));
    assert.match(msg, /^AWS auto-login started in background \(10m remaining\)\.\nAWS session expires in 10m/);
  });
});

describe("aws-cred-check.mjs STS fallback (no expirationField)", () => {
  let home;
  beforeEach(() => {
    home = mkdtempSync(join(tmpdir(), "cckeep-check-"));
    installFakeAws(home);
    writeCredentials(home, "[default]\naws_access_key_id = AKIA\n");
  });
  afterEach(() => { rmSync(home, { recursive: true, force: true }); });

  it("calls STS once and reuses a valid answer on the next prompts", () => {
    assert.equal(systemMessage(runCheck(home)), null);
    assert.equal(systemMessage(runCheck(home)), null);
    assert.equal(systemMessage(runCheck(home)), null);
    assert.equal(awsCalls(home), 1);
  });

  it("keeps warning from a cached failed answer without calling STS again", () => {
    assert.match(systemMessage(runCheck(home, { FAKE_AWS_EXIT: "255" })), /AWS credentials EXPIRED/);
    assert.match(systemMessage(runCheck(home, { FAKE_AWS_EXIT: "255" })), /AWS credentials EXPIRED/);
    assert.equal(awsCalls(home), 1);
  });

  it("asks STS again as soon as ~/.aws/credentials changes", () => {
    assert.match(systemMessage(runCheck(home, { FAKE_AWS_EXIT: "255" })), /EXPIRED/);
    writeCredentials(home, "[default]\naws_access_key_id = AKIA-NEW-LOGIN\n");
    assert.equal(systemMessage(runCheck(home)), null);
    assert.equal(awsCalls(home), 2);
  });

  it("asks STS again once the cached answer is 5 minutes old", () => {
    runCheck(home);
    const cacheFile = join(home, ".config", "cc-aws-keepalive", ".sts-check-default.json");
    const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
    writeFileSync(cacheFile, JSON.stringify({ ...cached, checkedAt: cached.checkedAt - 300 }));
    assert.match(systemMessage(runCheck(home, { FAKE_AWS_EXIT: "255" })), /EXPIRED/);
    assert.equal(awsCalls(home), 2);
  });

  it("keeps a separate answer per profile", () => {
    writeCredentials(home, "[default]\naws_access_key_id = AKIA\n[other]\naws_access_key_id = AKIB\n");
    runCheck(home);
    runCheck(home, { CC_KEEPALIVE_PROFILE: "other" });
    assert.equal(awsCalls(home), 2);
    assert.match(readFileSync(join(home, "aws-calls.log"), "utf8"), /--profile other/);
  });
});
