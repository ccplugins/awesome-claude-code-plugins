import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const homes = [];

afterEach(() => {
  for (const home of homes.splice(0)) rmSync(home, { recursive: true, force: true });
});

describe("aggregate marketplace upgrades", () => {
  it("updates credential paths without hard-coding the marketplace name", () => {
    const home = mkdtempSync(join(tmpdir(), "cc-install-"));
    homes.push(home);
    const pluginDir = join(home, ".claude", "plugins", "cache", "awesome-claude-code-plugins", "cc-aws-keepalive", "0.5.1-ccplugins.1");
    mkdirSync(pluginDir, { recursive: true });
    for (const file of ["install.mjs", "config.example.json", "aws-statusline.mjs", "omc-timer.mjs"]) {
      cpSync(join(dirname(fileURLToPath(import.meta.url)), file), join(pluginDir, file));
    }
    const settingsPath = join(home, ".claude", "settings.json");
    writeFileSync(settingsPath, JSON.stringify({
      awsCredentialExport: "node ~/.claude/plugins/cache/awesome-claude-code-plugins/cc-aws-keepalive/0.4.0/aws-cred-export.mjs",
      awsAuthRefresh: "node ~/.claude/plugins/cache/other-marketplace/cc-aws-keepalive/0.4.0/aws-auth-refresh.mjs",
    }));

    const result = spawnSync(process.execPath, [join(pluginDir, "install.mjs")], {
      env: { ...process.env, HOME: home, USERPROFILE: home },
      encoding: "utf8",
    });

    assert.equal(result.status, 0, result.stderr);
    const settings = JSON.parse(readFileSync(settingsPath, "utf8"));
    assert.match(settings.awsCredentialExport, /awesome-claude-code-plugins[/\\]cc-aws-keepalive[/\\]0\.5\.1-ccplugins\.1/);
    assert.match(settings.awsAuthRefresh, /awesome-claude-code-plugins[/\\]cc-aws-keepalive[/\\]0\.5\.1-ccplugins\.1/);
  });
});
