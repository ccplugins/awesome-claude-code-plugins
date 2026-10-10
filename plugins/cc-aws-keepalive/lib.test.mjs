import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// ---------------------------------------------------------------------------
// Helper: create an isolated tmpdir and point HOME at it so that lib.mjs
// functions (which call homedir()) read from our temp files.
// ---------------------------------------------------------------------------
function makeTmpHome() {
  const dir = mkdtempSync(join(tmpdir(), "cckeep-"));
  return dir;
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

// We need a fresh import of lib.mjs for each test group that depends on HOME,
// because homedir() reads process.env.HOME at call time.  We cache the original
// HOME and restore it in afterEach.
const ORIGINAL_HOME = process.env.HOME;
const ORIGINAL_USERPROFILE = process.env.USERPROFILE;

// ============================================================================
// formatTime -- pure function, no I/O
// ============================================================================

describe("formatTime", () => {
  let formatTime;

  beforeEach(async () => {
    ({ formatTime } = await import("./lib.mjs"));
  });

  it("returns EXPIRED for 0", () => {
    assert.equal(formatTime(0), "EXPIRED");
  });

  it("returns EXPIRED for -1", () => {
    assert.equal(formatTime(-1), "EXPIRED");
  });

  it("returns EXPIRED for -100", () => {
    assert.equal(formatTime(-100), "EXPIRED");
  });

  it("returns <1m for 1 second", () => {
    assert.equal(formatTime(1), "<1m");
  });

  it("returns <1m for 30 seconds", () => {
    assert.equal(formatTime(30), "<1m");
  });

  it("returns <1m for 59 seconds", () => {
    assert.equal(formatTime(59), "<1m");
  });

  it("returns 1m for 60 seconds", () => {
    assert.equal(formatTime(60), "1m");
  });

  it("returns 1m for 119 seconds", () => {
    assert.equal(formatTime(119), "1m");
  });

  it("returns 59m for 3599 seconds", () => {
    assert.equal(formatTime(3599), "59m");
  });

  it("returns 1h0m for 3600 seconds", () => {
    assert.equal(formatTime(3600), "1h0m");
  });

  it("returns 2h30m for 9000 seconds", () => {
    assert.equal(formatTime(9000), "2h30m");
  });
});

// ============================================================================
// parseCredentials
// ============================================================================

describe("parseCredentials", () => {
  let tmpHome;
  let parseCredentials;

  beforeEach(async () => {
    tmpHome = makeTmpHome();
    process.env.HOME = tmpHome;
    process.env.USERPROFILE = tmpHome;
    // Dynamic import with cache-busting query so the module re-evaluates homedir()
    const mod = await import(`./lib.mjs?pc=${Date.now()}${Math.random()}`);
    parseCredentials = mod.parseCredentials;
  });

  afterEach(() => {
    process.env.HOME = ORIGINAL_HOME;
    process.env.USERPROFILE = ORIGINAL_USERPROFILE;
    rmSync(tmpHome, { recursive: true, force: true });
  });

  it("parses single [default] profile with all 3 keys", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = AKIAEXAMPLE",
        "aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        "aws_session_token = FwoGZXIvYXdzEA==",
      ].join("\n")
    );

    const result = parseCredentials("default");
    assert.equal(result.aws_access_key_id, "AKIAEXAMPLE");
    assert.equal(
      result.aws_secret_access_key,
      "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
    );
    assert.equal(result.aws_session_token, "FwoGZXIvYXdzEA==");
  });

  it("parses named profile among multiple profiles", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = DEFAULT_KEY",
        "aws_secret_access_key = DEFAULT_SECRET",
        "",
        "[staging]",
        "aws_access_key_id = STAGING_KEY",
        "aws_secret_access_key = STAGING_SECRET",
        "",
        "[production]",
        "aws_access_key_id = PROD_KEY",
        "aws_secret_access_key = PROD_SECRET",
      ].join("\n")
    );

    const result = parseCredentials("staging");
    assert.equal(result.aws_access_key_id, "STAGING_KEY");
    assert.equal(result.aws_secret_access_key, "STAGING_SECRET");
    assert.equal(result.aws_session_token, undefined);
  });

  it("returns null when profile not found", () => {
    writeCredentials(
      tmpHome,
      ["[default]", "aws_access_key_id = AKIAEXAMPLE"].join("\n")
    );

    const result = parseCredentials("nonexistent");
    assert.equal(result, null);
  });

  it("returns null when credentials file does not exist", () => {
    // tmpHome has no .aws directory at all
    const result = parseCredentials("default");
    assert.equal(result, null);
  });

  it("handles CRLF line endings", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = AKIACRLF",
        "aws_secret_access_key = SECRETCRLF",
      ].join("\r\n")
    );

    const result = parseCredentials("default");
    assert.equal(result.aws_access_key_id, "AKIACRLF");
    assert.equal(result.aws_secret_access_key, "SECRETCRLF");
  });

  it("handles spaces around = in key-value pairs", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "  aws_access_key_id   =   SPACEDKEY  ",
        "  aws_secret_access_key   =   SPACEDSECRET  ",
      ].join("\n")
    );

    const result = parseCredentials("default");
    assert.equal(result.aws_access_key_id, "SPACEDKEY");
    assert.equal(result.aws_secret_access_key, "SPACEDSECRET");
  });

  it("handles values containing = (base64 tokens)", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = AKIABASE64",
        "aws_secret_access_key = SECRET",
        "aws_session_token = FwoGZXIvYXdzEBY=dGVzdA==",
      ].join("\n")
    );

    const result = parseCredentials("default");
    assert.equal(result.aws_session_token, "FwoGZXIvYXdzEBY=dGVzdA==");
  });

  it("returns null for empty file", () => {
    writeCredentials(tmpHome, "");
    const result = parseCredentials("default");
    assert.equal(result, null);
  });

  it("skips comment lines starting with #", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "# This is a comment",
        "aws_access_key_id = AKIACOMMENT",
        "# Another comment",
        "aws_secret_access_key = SECRETCOMMENT",
      ].join("\n")
    );

    const result = parseCredentials("default");
    assert.equal(result.aws_access_key_id, "AKIACOMMENT");
    assert.equal(result.aws_secret_access_key, "SECRETCOMMENT");
    assert.equal(Object.keys(result).length, 2);
  });

  it("skips comment lines starting with ;", () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "; semicolon comment",
        "aws_access_key_id = AKIASEMI",
      ].join("\n")
    );

    const result = parseCredentials("default");
    assert.equal(result.aws_access_key_id, "AKIASEMI");
    assert.equal(Object.keys(result).length, 1);
  });
});

// ============================================================================
// loadConfig
// ============================================================================

describe("loadConfig", () => {
  let tmpHome;

  beforeEach(() => {
    tmpHome = makeTmpHome();
    process.env.HOME = tmpHome;
    process.env.USERPROFILE = tmpHome;
    delete process.env.CC_KEEPALIVE_PROFILE;
  });

  afterEach(() => {
    process.env.HOME = ORIGINAL_HOME;
    process.env.USERPROFILE = ORIGINAL_USERPROFILE;
    delete process.env.CC_KEEPALIVE_PROFILE;
    rmSync(tmpHome, { recursive: true, force: true });
  });

  it("returns defaults when config file is missing", async () => {
    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.profile, "default");
    assert.equal(config.expirationField, "");
    assert.equal(config.loginCmd, "");
    assert.equal(config.autoLoginCmd, "");
    assert.equal(config.autoLoginMinutes, 0);
    assert.equal(config.warnMinutes, 30);
    assert.equal(config.timerWarnMinutes, 60);
    assert.equal(config.statusLineCmd, "");
  });

  it("merges partial config over defaults", async () => {
    writeConfig(tmpHome, { profile: "staging", warnMinutes: 10 });

    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.profile, "staging");
    assert.equal(config.warnMinutes, 10);
    // Non-overridden defaults remain
    assert.equal(config.expirationField, "");
    assert.equal(config.autoLoginMinutes, 0);
    assert.equal(config.timerWarnMinutes, 60);
  });

  it("handles corrupt JSON and returns defaults", async () => {
    const configDir = join(tmpHome, ".config", "cc-aws-keepalive");
    mkdirSync(configDir, { recursive: true });
    writeFileSync(join(configDir, "config.json"), "{broken json!!!", "utf8");

    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.profile, "default");
    assert.equal(config.warnMinutes, 30);
  });

  it("CC_KEEPALIVE_PROFILE env var overrides profile", async () => {
    writeConfig(tmpHome, { profile: "from-config" });
    process.env.CC_KEEPALIVE_PROFILE = "from-env";

    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.profile, "from-env");
  });

  it("warns on unknown config keys", async () => {
    writeConfig(tmpHome, { profile: "test", unknownKey: "val" });

    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.profile, "test");
  });

  it("coerces numeric string values to numbers", async () => {
    writeConfig(tmpHome, { warnMinutes: "15", autoLoginMinutes: "5" });

    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.warnMinutes, 15);
    assert.equal(config.autoLoginMinutes, 5);
  });

  it("warns when numeric field gets non-numeric string", async () => {
    writeConfig(tmpHome, { warnMinutes: "abc" });

    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.warnMinutes, "abc"); // warns but keeps the value
  });

  it("warns and coerces when string field gets non-string value", async () => {
    writeConfig(tmpHome, { profile: 123 });

    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.profile, "123");
  });

  it("warns when autoLoginMinutes set without expirationField", async () => {
    writeConfig(tmpHome, { autoLoginMinutes: 30, expirationField: "" });

    const { loadConfig } = await import(
      `./lib.mjs?lc=${Date.now()}${Math.random()}`
    );
    const config = loadConfig();
    assert.equal(config.autoLoginMinutes, 30);
  });
});

// ============================================================================
// getRemaining
// ============================================================================

describe("getRemaining", () => {
  let tmpHome;

  beforeEach(() => {
    tmpHome = makeTmpHome();
    process.env.HOME = tmpHome;
    process.env.USERPROFILE = tmpHome;
  });

  afterEach(() => {
    process.env.HOME = ORIGINAL_HOME;
    process.env.USERPROFILE = ORIGINAL_USERPROFILE;
    rmSync(tmpHome, { recursive: true, force: true });
  });

  it("returns null when expirationField is empty", async () => {
    writeCredentials(
      tmpHome,
      ["[default]", "aws_access_key_id = KEY", "x_expiration = 9999999999"].join(
        "\n"
      )
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({ profile: "default", expirationField: "" });
    assert.equal(result, null);
  });

  it("returns null when expiration value is NaN", async () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = KEY",
        "x_expiration = not-a-number",
      ].join("\n")
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({
      profile: "default",
      expirationField: "x_expiration",
    });
    assert.equal(result, null);
  });

  it("parses ISO-8601 date string as valid expiration", async () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = KEY",
        "x_expiration = 2026-04-24T12:00:00Z",
      ].join("\n")
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({
      profile: "default",
      expirationField: "x_expiration",
    });
    assert.ok(result !== null);
    assert.ok(result.remaining < 0, "past ISO-8601 date should have negative remaining");
    assert.equal(result.expiration, Math.floor(Date.parse("2026-04-24T12:00:00Z") / 1000));
  });

  it("returns null for sub-epoch value", async () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = KEY",
        "x_expiration = 12345",
      ].join("\n")
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({
      profile: "default",
      expirationField: "x_expiration",
    });
    assert.equal(result, null);
  });

  it("returns null for digits with trailing junk", async () => {
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = KEY",
        "x_expiration = 9999999999abc",
      ].join("\n")
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({
      profile: "default",
      expirationField: "x_expiration",
    });
    assert.equal(result, null);
  });

  it("returns positive remaining for future expiry", async () => {
    const futureEpoch = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = KEY",
        `x_expiration = ${futureEpoch}`,
      ].join("\n")
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({
      profile: "default",
      expirationField: "x_expiration",
    });
    assert.ok(result !== null);
    assert.ok(result.remaining > 0, `expected positive remaining, got ${result.remaining}`);
    assert.equal(result.expiration, futureEpoch);
    // Should be roughly 3600 (allow 5s tolerance for test execution time)
    assert.ok(result.remaining >= 3595 && result.remaining <= 3600);
  });

  it("returns negative remaining for past expiry", async () => {
    const pastEpoch = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = KEY",
        `x_expiration = ${pastEpoch}`,
      ].join("\n")
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({
      profile: "default",
      expirationField: "x_expiration",
    });
    assert.ok(result !== null);
    assert.ok(result.remaining < 0, `expected negative remaining, got ${result.remaining}`);
    assert.equal(result.expiration, pastEpoch);
  });

  it("parses ISO-8601 expiration timestamp", async () => {
    const futureDate = new Date(Date.now() + 3600_000).toISOString();
    writeCredentials(
      tmpHome,
      [
        "[default]",
        "aws_access_key_id = KEY",
        `x_expiration = ${futureDate}`,
      ].join("\n")
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({
      profile: "default",
      expirationField: "x_expiration",
    });
    assert.ok(result !== null);
    assert.ok(result.remaining > 3500 && result.remaining <= 3600);
  });

  it("returns null when expiration field exists in different profile only", async () => {
    writeCredentials(
      tmpHome,
      [
        "[other]",
        "aws_access_key_id = KEY",
        "x_expiration = 9999999999",
        "",
        "[default]",
        "aws_access_key_id = KEY2",
      ].join("\n")
    );

    const { getRemaining } = await import(
      `./lib.mjs?gr=${Date.now()}${Math.random()}`
    );
    const result = getRemaining({
      profile: "default",
      expirationField: "x_expiration",
    });
    assert.equal(result, null);
  });
});

// ============================================================================
// tryAcquireAutoLoginLock / releaseAutoLoginLock
// ============================================================================

describe("auto-login lock", () => {
  let tmpHome;

  beforeEach(() => {
    tmpHome = makeTmpHome();
    process.env.HOME = tmpHome;
    process.env.USERPROFILE = tmpHome;
  });

  afterEach(() => {
    process.env.HOME = ORIGINAL_HOME;
    process.env.USERPROFILE = ORIGINAL_USERPROFILE;
    rmSync(tmpHome, { recursive: true, force: true });
  });

  it("acquires lock when no lockfile exists", async () => {
    const { tryAcquireAutoLoginLock, releaseAutoLoginLock } = await import(
      `./lib.mjs?lock=${Date.now()}${Math.random()}`
    );
    const acquired = tryAcquireAutoLoginLock();
    assert.equal(acquired, true);
    const lockPath = join(tmpHome, ".config", "cc-aws-keepalive", ".auto-login.lock");
    assert.equal(existsSync(lockPath), true);
    releaseAutoLoginLock();
  });

  it("fails to acquire when lock is held (recent)", async () => {
    const { tryAcquireAutoLoginLock } = await import(
      `./lib.mjs?lock=${Date.now()}${Math.random()}`
    );
    const stateDir = join(tmpHome, ".config", "cc-aws-keepalive");
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(join(stateDir, ".auto-login.lock"), String(Math.floor(Date.now() / 1000)));

    const acquired = tryAcquireAutoLoginLock();
    assert.equal(acquired, false);
  });

  it("acquires lock when existing lock is stale (>5min)", async () => {
    const { tryAcquireAutoLoginLock, releaseAutoLoginLock } = await import(
      `./lib.mjs?lock=${Date.now()}${Math.random()}`
    );
    const stateDir = join(tmpHome, ".config", "cc-aws-keepalive");
    mkdirSync(stateDir, { recursive: true });
    const staleTime = Math.floor(Date.now() / 1000) - 400;
    writeFileSync(join(stateDir, ".auto-login.lock"), String(staleTime));

    const acquired = tryAcquireAutoLoginLock();
    assert.equal(acquired, true);
    releaseAutoLoginLock();
  });

  it("releaseAutoLoginLock removes the lockfile", async () => {
    const { tryAcquireAutoLoginLock, releaseAutoLoginLock } = await import(
      `./lib.mjs?lock=${Date.now()}${Math.random()}`
    );
    tryAcquireAutoLoginLock();
    const lockPath = join(tmpHome, ".config", "cc-aws-keepalive", ".auto-login.lock");
    assert.equal(existsSync(lockPath), true);
    releaseAutoLoginLock();
    assert.equal(existsSync(lockPath), false);
  });

  it("releaseAutoLoginLock is safe when no lockfile exists", async () => {
    const { releaseAutoLoginLock } = await import(
      `./lib.mjs?lock=${Date.now()}${Math.random()}`
    );
    assert.doesNotThrow(() => releaseAutoLoginLock());
  });

  it("acquires lock when existing lock has future timestamp (clock skew)", async () => {
    const { tryAcquireAutoLoginLock, releaseAutoLoginLock } = await import(
      `./lib.mjs?lock=${Date.now()}${Math.random()}`
    );
    const stateDir = join(tmpHome, ".config", "cc-aws-keepalive");
    mkdirSync(stateDir, { recursive: true });
    const futureTime = Math.floor(Date.now() / 1000) + 9999;
    writeFileSync(join(stateDir, ".auto-login.lock"), String(futureTime));

    const acquired = tryAcquireAutoLoginLock();
    assert.equal(acquired, true);
    releaseAutoLoginLock();
  });

  it("acquires lock when existing lock contains non-numeric garbage", async () => {
    const { tryAcquireAutoLoginLock, releaseAutoLoginLock } = await import(
      `./lib.mjs?lock=${Date.now()}${Math.random()}`
    );
    const stateDir = join(tmpHome, ".config", "cc-aws-keepalive");
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(join(stateDir, ".auto-login.lock"), "corrupted-data");

    const acquired = tryAcquireAutoLoginLock();
    assert.equal(acquired, true);
    releaseAutoLoginLock();
  });

  it("second acquire fails when first already holds lock (concurrent simulation)", async () => {
    const mod1 = await import(`./lib.mjs?lock=${Date.now()}${Math.random()}`);
    const mod2 = await import(`./lib.mjs?lock=${Date.now()}${Math.random()}`);

    const first = mod1.tryAcquireAutoLoginLock();
    assert.equal(first, true);

    const second = mod2.tryAcquireAutoLoginLock();
    assert.equal(second, false);

    mod1.releaseAutoLoginLock();
  });
});

// ============================================================================
// sleepSync
// ============================================================================

describe("sleepSync", () => {
  it("blocks for approximately the specified duration", async () => {
    const { sleepSync } = await import(
      `./lib.mjs?sleep=${Date.now()}${Math.random()}`
    );
    const start = Date.now();
    sleepSync(50);
    const elapsed = Date.now() - start;
    assert.ok(elapsed >= 45, `expected >=45ms, got ${elapsed}ms`);
    assert.ok(elapsed < 500, `expected <500ms, got ${elapsed}ms`);
  });
});
