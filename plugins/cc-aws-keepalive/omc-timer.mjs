#!/usr/bin/env node
// OMC HUD integration: intercepts stdout, appends AWS session timer.
// Called via `import` from aws-hud-wrapper.mjs — do not run standalone.
import { loadConfig, getRemaining, formatTime } from "./lib.mjs";

function awsTimer() {
  try {
    const config = loadConfig();
    const info = getRemaining(config);
    if (!info) return "";
    const text = formatTime(info.remaining);
    const warnSec = config.timerWarnMinutes * 60;
    if (info.remaining <= 0) return `\x1b[31maws:${text}\x1b[0m`;
    if (info.remaining <= warnSec) return `\x1b[33maws:${text}\x1b[0m`;
    return `aws:${text}`;
  } catch { return ""; }
}

let patched = false;
export function patchStdout() {
  if (patched) return;
  patched = true;
  const chunks = [];
  const origWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = (chunk, encoding, callback) => {
    if (typeof chunk === "string") {
      chunks.push(chunk);
    } else if (Buffer.isBuffer(chunk)) {
      chunks.push(chunk.toString(typeof encoding === "string" ? encoding : "utf8"));
    } else if (chunk instanceof Uint8Array) {
      chunks.push(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
        .toString(typeof encoding === "string" ? encoding : "utf8"));
    } else {
      chunks.push(String(chunk));
    }
    if (typeof encoding === "function") encoding();
    else if (typeof callback === "function") callback();
    return true;
  };
  process.on("exit", () => {
    process.stdout.write = origWrite;
    const raw = chunks.join("");
    const lines = raw.split(/\r?\n/);
    // Remove trailing empty element from split (artifact of trailing \n)
    if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
    const timer = awsTimer();
    if (lines.length > 0 && timer) {
      const idx = lines.findIndex(l => l.length > 0);
      if (idx !== -1) lines[idx] += " | " + timer;
      else lines.push(timer);
    } else if (timer) {
      lines.push(timer);
    }
    if (lines.length > 0) origWrite(lines.join("\n") + "\n");
  });
}
