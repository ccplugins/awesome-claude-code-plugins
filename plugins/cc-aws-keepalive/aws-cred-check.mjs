#!/usr/bin/env node
// UserPromptSubmit hook: proactive AWS credential expiry check.
// Warns via the hook JSON protocol if expired or nearing expiry (never blocks).
// Optionally auto-renews credentials when within autoLoginMinutes window.
import { execFileSync, spawn } from "node:child_process";
import { loadConfig, getRemaining, formatTime, tryAcquireAutoLoginLock, releaseAutoLoginLock } from "./lib.mjs";

const config = loadConfig();
const warnSeconds = config.warnMinutes * 60;
const autoLoginSeconds = (config.autoLoginMinutes || 0) * 60;
let remaining = null;
const notices = [];

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
  try {
    execFileSync("aws", ["sts", "get-caller-identity", "--profile", config.profile], {
      stdio: "ignore",
      timeout: 10_000,
      shell: process.platform === "win32",
    });
    process.exit(0); // Valid, can't determine remaining time
  } catch {
    remaining = -1;
  }
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
      notices.push(`AWS auto-login started in background (${formatTime(remaining)} remaining).`);
    } catch {
      releaseAutoLoginLock();
      notices.push(`Auto-login failed. Run manually: ${config.loginCmd}`);
    }
  }
}

if (remaining <= 0) {
  const action = config.loginCmd
    ? `Run: ${config.loginCmd}`
    : "Re-authenticate";
  notices.push(`⚠ AWS credentials EXPIRED. ${action} in another terminal — CC will auto-retry via awsAuthRefresh.`);
} else if (remaining <= warnSeconds) {
  const hint = config.loginCmd ? ` Run soon: ${config.loginCmd}` : " Re-authenticate soon.";
  notices.push(`AWS session expires in ${formatTime(remaining)}.${hint}`);
}

if (notices.length) {
  process.stdout.write(`${JSON.stringify({ systemMessage: notices.join("\n") })}\n`);
}
