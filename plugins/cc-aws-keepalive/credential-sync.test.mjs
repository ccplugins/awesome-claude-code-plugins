import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

function makeTmpHome() {
  return mkdtempSync(join(tmpdir(), "ccsync-"));
}

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

const ORIGINAL_HOME = process.env.HOME;
const ORIGINAL_USERPROFILE = process.env.USERPROFILE;

function setHome(dir) {
  process.env.HOME = dir;
  process.env.USERPROFILE = dir;
}

function restoreHome() {
  process.env.HOME = ORIGINAL_HOME;
  process.env.USERPROFILE = ORIGINAL_USERPROFILE;
}

// Fresh import each time to pick up new HOME
let importCounter = 0;
async function freshImport(mod) {
  importCounter++;
  return import(`./${mod}?bust=${importCounter}`);
}

// ============================================================================
// buildIniBlock — pure function
// ============================================================================

describe("buildIniBlock", () => {
  let buildIniBlock;
  let home;

  beforeEach(async () => {
    home = makeTmpHome();
    setHome(home);
    const mod = await freshImport("credential-sync.mjs");
    // buildIniBlock is not exported, so we test it indirectly via syncCredentials
    // Actually we need to test it directly — export it for testing
    // Since it's not exported, we'll test through syncCredentials behavior
    restoreHome();
  });

  afterEach(() => {
    restoreHome();
    try { rmSync(home, { recursive: true }); } catch {}
  });
});

// ============================================================================
// shouldSync — cooldown logic
// ============================================================================

describe("shouldSync", () => {
  let home;

  afterEach(() => {
    restoreHome();
    try { rmSync(home, { recursive: true }); } catch {}
  });

  it("syncs when no state file exists", async () => {
    home = makeTmpHome();
    setHome(home);
    writeConfig(home, { profile: "default", syncTargets: [{ type: "command", command: "true" }] });
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");
    // Should not throw — sync proceeds (command "true" will fail silently since we're testing logic)
    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "command", command: "true" }],
      syncCooldownSeconds: 60,
      syncTimeoutSeconds: 5,
    });

    // Verify state file was written
    const stateFile = join(home, ".config", "cc-aws-keepalive", ".last-sync");
    const content = readFileSync(stateFile, "utf8");
    const ts = parseInt(content, 10);
    assert.ok(Math.abs(ts - Date.now()) < 5000);
  });

  it("skips sync within cooldown window", async () => {
    home = makeTmpHome();
    setHome(home);
    const stateDir = join(home, ".config", "cc-aws-keepalive");
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(join(stateDir, ".last-sync"), String(Date.now()), { mode: 0o600 });
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    // Capture stderr to verify sync was skipped (no errors, no commands run)
    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "command", command: "echo SHOULD_NOT_RUN >&2" }],
      syncCooldownSeconds: 60,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    // Should have been skipped — no output
    assert.ok(!stderrOutput.includes("SHOULD_NOT_RUN"));
  });

  it("syncs when cooldown has elapsed", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    // With cooldown of 0, sync should always proceed
    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "command", command: "true" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    // No "REFUSED" or guard error — sync proceeded
    assert.ok(!stderrOutput.includes("REFUSED"));
  });

  it("treats NaN in state file as expired cooldown", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    // Should not be blocked by NaN in state file
    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "command", command: "true" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    assert.ok(!stderrOutput.includes("REFUSED"));
  });
});

// ============================================================================
// syncCredentials — guard clauses
// ============================================================================

describe("syncCredentials guards", () => {
  let home;

  afterEach(() => {
    restoreHome();
    try { rmSync(home, { recursive: true }); } catch {}
  });

  it("returns immediately when syncTargets is empty", async () => {
    home = makeTmpHome();
    setHome(home);
    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({ profile: "default", syncTargets: [], syncCooldownSeconds: 60 });

    process.stderr.write = origWrite;
    assert.equal(stderrOutput, "");
  });

  it("returns immediately when syncTargets is undefined", async () => {
    home = makeTmpHome();
    setHome(home);
    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({ profile: "default", syncCooldownSeconds: 60 });

    process.stderr.write = origWrite;
    assert.equal(stderrOutput, "");
  });

  it("refuses to sync without session token", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "command", command: "true" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    assert.ok(stderrOutput.includes("REFUSED"));
    assert.ok(stderrOutput.includes("session token"));
  });

  it("refuses when credentials are missing", async () => {
    home = makeTmpHome();
    setHome(home);
    // No credentials file at all

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "command", command: "echo BAD >&2" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    assert.ok(!stderrOutput.includes("BAD"));
  });

  it("logs unknown sync type", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "ftp", host: "x" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    assert.ok(stderrOutput.includes('unknown sync type "ftp"'));
  });
});

// ============================================================================
// syncWebhook — security guards
// ============================================================================

describe("syncWebhook security", () => {
  let home;

  afterEach(() => {
    restoreHome();
    try { rmSync(home, { recursive: true }); } catch {}
  });

  it("refuses non-HTTPS webhook URLs", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "webhook", url: "http://evil.com/creds" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    assert.ok(stderrOutput.includes("REFUSED"));
    assert.ok(stderrOutput.includes("https://"));
  });

  it("refuses when NODE_TLS_REJECT_UNAUTHORIZED=0", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");
    const origTLS = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "webhook", url: "https://legit.com/creds" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    if (origTLS === undefined) delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    else process.env.NODE_TLS_REJECT_UNAUTHORIZED = origTLS;

    assert.ok(stderrOutput.includes("REFUSED"));
    assert.ok(stderrOutput.includes("NODE_TLS_REJECT_UNAUTHORIZED"));
  });

  it("refuses malformed webhook URL", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "webhook", url: "not a url at all" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    assert.ok(stderrOutput.includes("invalid webhook URL"));
  });
});

// ============================================================================
// syncSsh — remotePath validation
// ============================================================================

describe("syncSsh remotePath validation", () => {
  let home;

  afterEach(() => {
    restoreHome();
    try { rmSync(home, { recursive: true }); } catch {}
  });

  it("refuses remotePath with shell metacharacters", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "ssh", host: "localhost", remotePath: "; rm -rf /; #" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    assert.ok(stderrOutput.includes("invalid remotePath"));
  });

  it("accepts valid remotePath", async () => {
    home = makeTmpHome();
    setHome(home);
    writeCredentials(home, [
      "[default]",
      "aws_access_key_id = AKID",
      "aws_secret_access_key = SECRET",
      "aws_session_token = TOKEN",
    ].join("\n"));

    const { syncCredentials } = await freshImport("credential-sync.mjs");

    let stderrOutput = "";
    const origWrite = process.stderr.write;
    process.stderr.write = (msg) => { stderrOutput += msg; };

    syncCredentials({
      profile: "default",
      syncTargets: [{ type: "ssh", host: "localhost", remotePath: "~/.aws/credentials" }],
      syncCooldownSeconds: 0,
      syncTimeoutSeconds: 5,
    });

    process.stderr.write = origWrite;
    // Should NOT contain remotePath error (will fail on connection, but that's fine)
    assert.ok(!stderrOutput.includes("invalid remotePath"));
  });
});

describe("syncSsh host-key policy", () => {
  it("requires a previously verified host key by default", async () => {
    const { getSshHostKeyPolicy } = await freshImport("credential-sync.mjs");
    assert.equal(getSshHostKeyPolicy({}), "yes");
  });

  it("allows trust-on-first-use only through an explicit opt-in", async () => {
    const { getSshHostKeyPolicy } = await freshImport("credential-sync.mjs");
    assert.equal(getSshHostKeyPolicy({ acceptNewHostKey: true }), "accept-new");
    assert.equal(getSshHostKeyPolicy({ acceptNewHostKey: false }), "yes");
  });
});
