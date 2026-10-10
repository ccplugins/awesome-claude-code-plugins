#!/usr/bin/env node
// Status line: shows AWS session time remaining with color warning.
// Composes with any existing status line command via config.statusLineCmd.
import { execSync } from "node:child_process";
import { loadConfig, getRemaining, formatTime } from "./lib.mjs";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const config = loadConfig();

// Run existing status line command if configured
let original = "";
if (config.statusLineCmd) {
  try {
    original = execSync(config.statusLineCmd, {
      encoding: "utf8",
      timeout: 5000,
    }).trim();
  } catch {
    // Existing statusline failed — continue with just the timer
  }
}

// Build AWS timer
let timer = "";
const info = getRemaining(config);
if (info) {
  const warnSeconds = config.timerWarnMinutes * 60;
  const text = `AWS: ${formatTime(info.remaining)}`;

  if (info.remaining <= 0) {
    timer = `${RED}${text}${RESET}`;
  } else if (info.remaining <= warnSeconds) {
    timer = `${YELLOW}${text}${RESET}`;
  } else {
    timer = text;
  }
}

// Compose
if (original && timer) {
  process.stdout.write(`${original} | ${timer}\n`);
} else {
  process.stdout.write(`${original || timer}\n`);
}
