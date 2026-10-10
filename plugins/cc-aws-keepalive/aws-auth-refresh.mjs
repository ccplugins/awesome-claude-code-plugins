#!/usr/bin/env node
// Called by Claude Code (awsAuthRefresh) when Bedrock auth fails.
// Tries auto-login if configured, otherwise prompts user to re-auth manually.
import { execSync, execFileSync } from "node:child_process";
import { loadConfig, getRemaining, formatTime, tryAcquireAutoLoginLock, releaseAutoLoginLock, sleepSync } from "./lib.mjs";

const config = loadConfig();

// Check if a background auto-login (from cred-check) already refreshed creds
const info = getRemaining(config);
if (info && info.remaining > 0) {
  console.log(
    `Credentials refreshed (valid for ${formatTime(info.remaining)}). Retrying...`
  );
  process.exit(0);
}

// No expiration field — fall back to STS
if (!info) {
  try {
    execFileSync("aws", ["sts", "get-caller-identity", "--profile", config.profile], {
      stdio: "ignore",
      timeout: 15_000,
      shell: process.platform === "win32",
    });
    console.log("Credentials valid. Retrying...");
    process.exit(0);
  } catch {
    // Creds expired
  }
}

// Try auto-login synchronously (user is blocked anyway — CC waits for this script)
// Only use autoLoginCmd — loginCmd may be interactive and hang without a TTY
const autoCmd = config.autoLoginCmd;
if (autoCmd) {
  if (!tryAcquireAutoLoginLock()) {
    // Another session is already running auto-login — wait for it
    console.log("Another session is already re-authenticating. Waiting...");
    const waitStart = Date.now();
    while (Date.now() - waitStart < 180_000) {
      const check = getRemaining(config);
      if (check && check.remaining > 0) {
        console.log(
          `Credentials refreshed by another session (valid for ${formatTime(check.remaining)}). Retrying...`
        );
        process.exit(0);
      }
      if (!check) {
        try {
          execFileSync("aws", ["sts", "get-caller-identity", "--profile", config.profile], {
            stdio: "ignore",
            timeout: 15_000,
            shell: process.platform === "win32",
          });
          console.log("Credentials refreshed by another session. Retrying...");
          process.exit(0);
        } catch { /* still invalid */ }
      }
      sleepSync(3000);
    }
    console.log("Timed out waiting for the other session to complete re-authentication.");
  } else {
    console.log("AWS credentials expired. Running auto-login...");
    try {
      execSync(autoCmd, { stdio: "inherit", timeout: 180_000 });
      releaseAutoLoginLock();
      const refreshed = getRemaining(config);
      let refreshedOk = Boolean(refreshed && refreshed.remaining > 0);
      if (!refreshed) {
        try {
          execFileSync("aws", ["sts", "get-caller-identity", "--profile", config.profile], {
            stdio: "ignore",
            timeout: 15_000,
            shell: process.platform === "win32",
          });
          refreshedOk = true;
        } catch { /* still invalid */ }
      }
      if (refreshedOk) {
        await import("./credential-sync.mjs").then(m => m.syncCredentials(config)).catch(e => {
          process.stderr.write(`cc-aws-keepalive: sync failed: ${e.message}\n`);
        });
        const validity = refreshed ? ` (valid for ${formatTime(refreshed.remaining)})` : "";
        console.log(`Auto-login succeeded${validity}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        process.exit(0);
      }
    } catch {
      releaseAutoLoginLock();
      console.log("Auto-login failed.");
    }
  }
}

console.log("");
console.log("AWS credentials expired.");
if (config.loginCmd) {
  console.log(`Run in another terminal:  ${config.loginCmd}`);
} else {
  console.log("Re-authenticate in another terminal.");
}
console.log(
  "Then come back here - CC will retry automatically on your next message."
);
console.log("");
process.exit(1);
