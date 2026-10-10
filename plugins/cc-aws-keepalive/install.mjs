#!/usr/bin/env node
// Cross-platform installer for cc-aws-keepalive
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, realpathSync, chmodSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const home = homedir();
const configDir = join(home, ".config", "cc-aws-keepalive");
const configFile = join(configDir, "config.json");
const scriptDir = resolve(__dirname);

// Detect OMC
const claudeConfigDir = process.env.CLAUDE_CONFIG_DIR || join(home, ".claude");
const omcHud = join(claudeConfigDir, "hud", "omc-hud.mjs");
const hasOmc = existsSync(omcHud);

// Detect existing settings
let settings = {};
const settingsPath = join(claudeConfigDir, "settings.json");
if (existsSync(settingsPath)) {
  try {
    settings = JSON.parse(readFileSync(settingsPath, "utf8"));
  } catch { /* ignore */ }
}

console.log("cc-aws-keepalive installer\n");

// 1. Config
if (!existsSync(configFile)) {
  mkdirSync(configDir, { recursive: true, mode: 0o700 });
  copyFileSync(join(__dirname, "config.example.json"), configFile);
  if (process.platform !== "win32") {
    chmodSync(configFile, 0o600);
  }
  console.log(`Created: ${configFile}`);
  console.log("Edit it to set your AWS profile, expiration field, and login command.\n");
} else {
  console.log(`Config exists: ${configFile} (not overwritten)\n`);
}

// 2. Detect plugin vs manual install — true only when running from CC's plugin cache
// Use realpathSync to handle macOS /var → /private/var symlink resolution
const pluginCachePath = join(claudeConfigDir, "plugins", "cache");
const normPath = (p) => process.platform === "win32" ? p.toLowerCase() : p;
const isPlugin = existsSync(pluginCachePath)
  ? normPath(realpathSync(scriptDir)).startsWith(normPath(realpathSync(pluginCachePath)))
  : false;

// 3. Core settings (always needed)
console.log("=== Add to ~/.claude/settings.json ===\n");

if (isPlugin) {
  console.log("Plugin detected — the UserPromptSubmit hook is auto-registered.");
  console.log("You only need to add the credential settings:\n");
  console.log(JSON.stringify({
    awsCredentialExport: `node ${scriptDir}/aws-cred-export.mjs`,
    awsAuthRefresh: `node ${scriptDir}/aws-auth-refresh.mjs`,
  }, null, 2));
} else {
  console.log("Core (credential refresh + proactive hook):\n");
  console.log(JSON.stringify({
    awsCredentialExport: `node ${scriptDir}/aws-cred-export.mjs`,
    awsAuthRefresh: `node ${scriptDir}/aws-auth-refresh.mjs`,
    hooks: {
      UserPromptSubmit: [{
        matcher: "",
        hooks: [{
          type: "command",
          command: `node ${scriptDir}/aws-cred-check.mjs`,
        }],
      }],
    },
  }, null, 2));
}

// 4. Status line timer
const MARKER = "// [cc-aws-keepalive:timer-start]";

if (hasOmc) {
  // Clean up legacy patch from omc-hud.mjs if present (old installer versions patched it directly)
  const hudContent = readFileSync(omcHud, "utf8");
  if (hudContent.includes(MARKER)) {
    const hLines = hudContent.split(/\r?\n/);
    const startIdx = hLines.findIndex(l => l.includes(MARKER));
    let endIdx = hLines.findIndex(l => l.includes("// [cc-aws-keepalive:timer-end]"));
    if (endIdx === -1) endIdx = Math.min(startIdx + 2, hLines.length - 1);
    if (startIdx !== -1) {
      let removeStart = startIdx;
      let removeEnd = endIdx;
      if (removeStart > 0 && hLines[removeStart - 1].trim() === "") removeStart--;
      if (removeEnd < hLines.length - 1 && hLines[removeEnd + 1].trim() === "") removeEnd++;
      hLines.splice(removeStart, removeEnd - removeStart + 1);
      writeFileSync(omcHud, hLines.join("\n"));
      console.log("\n\nRemoved legacy patch from omc-hud.mjs.");
    }
  }

  // Create wrapper script that survives OMC updates (lives outside omc-hud.mjs)
  const wrapperPath = join(dirname(omcHud), "aws-hud-wrapper.mjs");
  const timerUrl = pathToFileURL(join(scriptDir, "omc-timer.mjs")).href;
  const wrapper = [
    '#!/usr/bin/env node',
    '// AWS timer wrapper: intercepts OMC HUD stdout, appends AWS session timer.',
    '// Created by cc-aws-keepalive. OMC-update-safe (lives outside omc-hud.mjs).',
    'import { pathToFileURL } from "node:url";',
    'import { join } from "node:path";',
    'import { homedir } from "node:os";',
    '',
    'try {',
    `  const { patchStdout } = await import("${timerUrl}");`,
    '  patchStdout();',
    '} catch { /* cc-aws-keepalive not available — continue without timer */ }',
    '',
    'const configDir = process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");',
    'await import(pathToFileURL(join(configDir, "hud", "omc-hud.mjs")).href);',
    '',
  ].join("\n");
  writeFileSync(wrapperPath, wrapper);

  // Update statusLine in settings.json to use the wrapper
  if (existsSync(settingsPath)) {
    try {
      const current = JSON.parse(readFileSync(settingsPath, "utf8"));
      const sl = current.statusLine;
      if (sl && typeof sl.command === "string" && sl.command.includes("omc-hud.mjs") && !sl.command.includes("aws-hud-wrapper.mjs")) {
        current.statusLine.command = sl.command.replace("omc-hud.mjs", "aws-hud-wrapper.mjs");
        writeFileSync(settingsPath, JSON.stringify(current, null, 2) + "\n");
        console.log("\n\nOMC HUD wrapper installed — AWS timer shows inline (e.g., aws:5h23m).");
        console.log("Survives OMC updates (no patching of omc-hud.mjs).");
      } else {
        console.log("\n\nOMC HUD wrapper created at: " + wrapperPath);
        console.log("Update your statusLine command to use aws-hud-wrapper.mjs instead of omc-hud.mjs.");
      }
    } catch {
      console.log("\n\nOMC HUD wrapper created at: " + wrapperPath);
      console.log("Update your statusLine command to use aws-hud-wrapper.mjs instead of omc-hud.mjs.");
    }
  }
} else {
  console.log("\n\nOptional — show session timer in status bar:\n");
  console.log(JSON.stringify({
    statusLine: {
      type: "command",
      command: `node ${scriptDir}/aws-statusline.mjs`,
    },
  }, null, 2));
}

// 5. Auto-update settings.json credential paths on plugin version change
if (isPlugin && existsSync(settingsPath)) {
  try {
    const current = JSON.parse(readFileSync(settingsPath, "utf8"));
    let updated = false;
    for (const [key, script] of [
      ["awsCredentialExport", "aws-cred-export.mjs"],
      ["awsAuthRefresh", "aws-auth-refresh.mjs"],
    ]) {
      const val = current[key];
      if (typeof val !== "string") continue;
      // Replace only this plugin's cache segment, preserving wrapper commands/flags.
      // The marketplace directory varies (for example, cc-aws-keepalive or
      // awesome-claude-code-plugins), so do not hard-code it.
      const versionRe = /[/\\]plugins[/\\]cache[/\\][^/\\]+[/\\]cc-aws-keepalive[/\\][^/\\]+/;
      const newSegment = scriptDir.match(versionRe)?.[0];
      if (newSegment && versionRe.test(val) && !val.includes(scriptDir)) {
        current[key] = val.replace(versionRe, newSegment);
        updated = true;
      }
    }
    if (updated) {
      writeFileSync(settingsPath, JSON.stringify(current, null, 2) + "\n");
      console.log("\nUpdated settings.json credential paths to current plugin version.");
    }
  } catch { /* settings.json parse failed — skip */ }
}

console.log("\nDone.");
