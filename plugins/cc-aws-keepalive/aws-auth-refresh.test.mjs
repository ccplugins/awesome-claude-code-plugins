import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { delimiter, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const homes = [];

afterEach(() => {
  for (const home of homes.splice(0)) rmSync(home, { recursive: true, force: true });
});

describe("reactive auto-login verification", { skip: process.platform === "win32" }, () => {
  it("falls back to STS after login when expirationField is empty", () => {
    const home = mkdtempSync(join(tmpdir(), "cc-refresh-"));
    homes.push(home);
    const bin = join(home, "bin");
    const configDir = join(home, ".config", "cc-aws-keepalive");
    mkdirSync(bin, { recursive: true });
    mkdirSync(configDir, { recursive: true });

    const marker = join(home, ".aws-valid");
    const aws = join(bin, "aws");
    const login = join(bin, "login");
    writeFileSync(aws, `#!/bin/sh\ntest -f '${marker}'\n`);
    writeFileSync(login, `#!/bin/sh\ntouch '${marker}'\n`);
    chmodSync(aws, 0o755);
    chmodSync(login, 0o755);
    writeFileSync(join(configDir, "config.json"), JSON.stringify({
      profile: "default",
      expirationField: "",
      autoLoginCmd: login,
    }));

    const result = spawnSync(process.execPath, ["aws-auth-refresh.mjs"], {
      cwd: new URL(".", import.meta.url),
      env: { ...process.env, HOME: home, USERPROFILE: home, PATH: `${bin}${delimiter}${process.env.PATH}` },
      encoding: "utf8",
      timeout: 10_000,
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /Auto-login succeeded\. Retrying/);
  });
});
