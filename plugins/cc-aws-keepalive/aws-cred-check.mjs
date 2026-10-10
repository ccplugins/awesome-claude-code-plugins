#!/usr/bin/env node
// UserPromptSubmit hook: proactive AWS credential expiry check.
// Warns via a JSON systemMessage on stdout, the only hook output Claude Code shows the user
// on exit 0 (stderr is dropped). Never blocks — blocked prompts are discarded by CC.
// Optionally auto-renews credentials when within autoLoginMinutes window.
import { execFileSync, spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { loadConfig, getRemaining, formatTime, tryAcquireAutoLoginLock, releaseAutoLoginLock, STATE_DIR } from "./lib.mjs";

// The STS fallback costs a network round trip, so its answer is reused for this long
// unless ~/.aws/credentials changes (a re-login rewrites it and forces a fresh check).
const STS_CACHE_SECONDS = 300;

const config = loadConfig();
const warnSeconds = config.warnMinutes * 60;
const autoLoginSeconds = (config.autoLoginMinutes || 0) * 60;
const messages = [];
let remaining = null;

function stsValid(profile) {
  let stamp = "";
  try {
    const st = statSync(join(homedir(), ".aws", "credentials"));
    stamp = `${st.mtimeMs}:${st.size}`;
  } catch { /* no credentials file — STS may still resolve the profile */ }
  const cacheFile = join(STATE_DIR, `.sts-check-${profile}.json`);
  const now = Math.floor(Date.now() / 1000);
  try {
    const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
    const age = now - cached.checkedAt;
    if (cached.stamp === stamp && age >= 0 && age < STS_CACHE_SECONDS) return cached.valid === true;
  } catch { /* no cache or unreadable — ask STS */ }
  let valid;
  try {
    execFileSync("aws", ["sts", "get-caller-identity", "--profile", profile], {
      stdio: "ignore",
      timeout: 10_000,
      shell: process.platform === "win32",
    });
    valid = true;
  } catch {
    valid = false;
  }
  try {
    mkdirSync(STATE_DIR, { recursive: true });
    writeFileSync(cacheFile, JSON.stringify({ stamp, checkedAt: now, valid }));
  } catch { /* cache is best effort */ }
  return valid;
}

const info = getRemaining(config);
if (info) {
  remaining = info.remaining;
  if (remaining > 0 && config.syncTargets?.length) {
    import("./credential-sync.mjs").then(m => m.syncCredentials(config)).catch(e => {
      process.stderr.write(`cc-aws-keepalive: sync failed: ${e.message}\n`);
    });
  }
} else {
  // No expiration field, or field configured but unresolvable — fall back to STS
  if (stsValid(config.profile)) process.exit(0); // Valid, can't determine remaining time
  remaining = -1;
}

// Auto-login: re-authenticate when within the configured window
// Only use autoLoginCmd (designed for non-interactive use), never loginCmd (may need a TTY)
const autoCmd = config.autoLoginCmd;
if (autoLoginSeconds > 0 && autoCmd && remaining > 0 && remaining <= autoLoginSeconds) {
  if (tryAcquireAutoLoginLock()) {
    try {
      const child = spawn(autoCmd, {
        shell: true,
        detached: true,
        stdio: "ignore",
      });
      child.unref();
      messages.push(`AWS auto-login started in background (${formatTime(remaining)} remaining).`);
    } catch {
      releaseAutoLoginLock();
      messages.push(`Auto-login failed. Run manually: ${config.loginCmd}`);
    }
  }
}

if (remaining <= 0) {
  const action = config.loginCmd
    ? `Run: ${config.loginCmd}`
    : "Re-authenticate";
  messages.push(
    `⚠ AWS credentials EXPIRED. ${action} in another terminal — CC will auto-retry via awsAuthRefresh.`
  );
} else if (remaining <= warnSeconds) {
  const hint = config.loginCmd ? ` Run soon: ${config.loginCmd}` : " Re-authenticate soon.";
  messages.push(`AWS session expires in ${formatTime(remaining)}.${hint}`);
}

if (messages.length) {
  process.stdout.write(JSON.stringify({ systemMessage: messages.join("\n") }) + "\n");
}
