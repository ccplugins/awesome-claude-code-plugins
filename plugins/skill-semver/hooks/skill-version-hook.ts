#!/usr/bin/env npx tsx

/**
 * Skill Version Hook v1.1.0
 *
 * SKILL.md 파일이 수정될 때 자동으로 버전 백업을 생성합니다.
 *
 * Hook Event: PostToolUse (Write, Edit tools)
 *
 * 동작:
 * 1. Write/Edit 도구가 SKILL.md를 수정했는지 확인
 * 2. SKILL.md에서 버전 정보 추출 (pre-release 지원: 1.0.0-alpha, 1.0.0-beta.1)
 * 3. releases/ 폴더에 버전별 백업 생성
 * 4. CHANGELOG.md 업데이트
 * 5. Last Updated 날짜 자동 업데이트
 * 6. 로그 출력
 *
 * 파일 명명 규칙: v{VERSION}_{YYYY-MM-DD}_SKILL.md
 *
 * Changelog:
 * - v1.1.0: Pre-release 지원, Last Updated 자동화, 경로 버그 수정, 성능 최적화
 * - v1.0.0: 초기 버전
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

interface PostToolUseInput {
  session_id: string;
  tool_name: string;
  tool_input: {
    file_path?: string;
    content?: string;
    old_string?: string;
    new_string?: string;
  };
  tool_output?: {
    success?: boolean;
    error?: string;
  };
  transcript_path?: string;
}

interface HookResult {
  continue: boolean;
  message?: string;
}

// ============================================================================
// Constants
// ============================================================================

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const LOG_DIR = path.join(PROJECT_DIR, ".claude", "hooks", "logs");

// ============================================================================
// Main Hook
// ============================================================================

async function main(): Promise<void> {
  try {
    // Read input from stdin
    const inputData = fs.readFileSync(0, "utf-8");
    const input: PostToolUseInput = JSON.parse(inputData);

    const result = await processHook(input);

    // Output result
    console.log(JSON.stringify(result));
  } catch (error: any) {
    // Graceful degradation - don't block the session
    console.log(
      JSON.stringify({
        continue: true,
        message: `[skill-version-hook] Error: ${error.message}`,
      })
    );
  }
}

async function processHook(input: PostToolUseInput): Promise<HookResult> {
  const { tool_name, tool_input, tool_output } = input;

  // 1. Check if this is a Write or Edit tool
  if (tool_name !== "Write" && tool_name !== "Edit") {
    return { continue: true };
  }

  // 2. Check if the tool succeeded
  if (tool_output?.success === false) {
    return { continue: true };
  }

  // 3. Check if the file is a SKILL.md
  const filePath = tool_input?.file_path;
  if (!filePath || !isSkillMdFile(filePath)) {
    return { continue: true };
  }

  // 4. Extract skill name from path
  const skillName = extractSkillName(filePath);
  if (!skillName) {
    return { continue: true };
  }

  // 5. Read the SKILL.md content once (optimization: single read)
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (error: any) {
    log(`[skill-version-hook] Failed to read ${filePath}: ${error.message}`);
    return { continue: true };
  }

  // 6. Extract version from content (supports pre-release: 1.0.0-alpha, 1.0.0-beta.1)
  const version = extractVersionFromContent(content);
  if (!version) {
    log(`[skill-version-hook] No version found in ${filePath}, skipping backup`);
    return {
      continue: true,
      message: `[skill-version-hook] No version header found in ${skillName}/SKILL.md`,
    };
  }

  // 7. Create releases directory if needed
  const releasesDir = path.join(path.dirname(filePath), "releases");
  if (!fs.existsSync(releasesDir)) {
    fs.mkdirSync(releasesDir, { recursive: true });
  }

  // 8. Generate backup filename (sanitize pre-release for filename)
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const safeVersion = version.replace(/[^a-zA-Z0-9.-]/g, "-");
  const backupFilename = `v${safeVersion}_${today}_SKILL.md`;
  const backupPath = path.join(releasesDir, backupFilename);

  // 9. Check if backup already exists for this version
  if (fs.existsSync(backupPath)) {
    log(`[skill-version-hook] Backup already exists: ${backupFilename}`);
    return {
      continue: true,
      message: `[skill-version-hook] Backup already exists for ${skillName} v${version}`,
    };
  }

  // 10. Update Last Updated date in SKILL.md
  const updatedContent = updateLastUpdated(content, today);
  if (updatedContent !== content) {
    try {
      fs.writeFileSync(filePath, updatedContent, "utf-8");
      content = updatedContent;
      log(`[skill-version-hook] Updated Last Updated to ${today}`);
    } catch (error: any) {
      log(`[skill-version-hook] Failed to update Last Updated: ${error.message}`);
    }
  }

  // 11. Create backup
  try {
    fs.writeFileSync(backupPath, content, "utf-8");
    log(`[skill-version-hook] Created backup: ${backupFilename}`);

    // 12. Update CHANGELOG.md
    const changelogPath = path.join(path.dirname(filePath), "CHANGELOG.md");
    updateChangelog(changelogPath, skillName, version, today);

    // 13. Add initial development notice for 0.x.x versions
    const versionNote = version.startsWith("0.")
      ? " (Initial Development)"
      : "";

    return {
      continue: true,
      message: `[skill-version-hook] Backed up ${skillName}/SKILL.md to releases/${backupFilename}${versionNote}`,
    };
  } catch (error: any) {
    log(`[skill-version-hook] Failed to create backup: ${error.message}`);
    return {
      continue: true,
      message: `[skill-version-hook] Failed to backup: ${error.message}`,
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if the file path is a SKILL.md file
 * Fixed: Use regex for cross-platform path separator compatibility
 */
function isSkillMdFile(filePath: string): boolean {
  // Normalize path and convert to forward slashes for consistent matching
  const normalizedPath = path.normalize(filePath).replace(/\\/g, "/");

  // Check if it ends with SKILL.md
  if (!normalizedPath.endsWith("SKILL.md")) {
    return false;
  }

  // Check if it's in the skills directory (supports both .claude/skills and plugin skills/)
  // Using regex for cross-platform compatibility
  const isInClaudeSkills = /\.claude\/skills\//.test(normalizedPath);
  const isInPluginSkills = /\/skills\/[^/]+\/SKILL\.md$/.test(normalizedPath);

  if (!isInClaudeSkills && !isInPluginSkills) {
    return false;
  }

  // Exclude files in releases/ directory
  if (/\/releases\//.test(normalizedPath)) {
    return false;
  }

  return true;
}

/**
 * Extract skill name from file path
 * e.g., /path/.claude/skills/autonomous-feature-builder/SKILL.md -> autonomous-feature-builder
 * e.g., /path/skills/my-skill/SKILL.md -> my-skill
 */
function extractSkillName(filePath: string): string | null {
  const normalizedPath = path.normalize(filePath);

  // Try .claude/skills pattern first
  let match = normalizedPath.match(/\.claude[\/\\]skills[\/\\]([^\/\\]+)[\/\\]SKILL\.md$/);
  if (match) return match[1];

  // Try plugin skills/ pattern
  match = normalizedPath.match(/skills[\/\\]([^\/\\]+)[\/\\]SKILL\.md$/);
  return match ? match[1] : null;
}

/**
 * Extract version from SKILL.md content
 * Supports semantic versioning with pre-release:
 * - **Version**: 3.1.0
 * - **Version**: 1.0.0-alpha
 * - **Version**: 2.0.0-beta.1
 * - Version: 3.1.0
 * - # Skill Name v3.1.0
 */
function extractVersionFromContent(content: string): string | null {
  // Semantic versioning regex with optional pre-release and build metadata
  // Format: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
  const semverPattern = /(\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?(?:\+[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?)/;

  // Try different version patterns (ordered by priority)
  const patterns = [
    new RegExp(`\\*\\*Version\\*\\*:\\s*${semverPattern.source}`, "i"),
    new RegExp(`Version:\\s*${semverPattern.source}`, "i"),
    new RegExp(`^#.*v${semverPattern.source}`, "im"),
    new RegExp(`version[:\\s]+${semverPattern.source}`, "i"),
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Update Last Updated date in SKILL.md content
 * Looks for patterns like:
 * - **Last Updated**: 2026-01-30
 * - Last Updated: 2026-01-30
 */
function updateLastUpdated(content: string, newDate: string): string {
  // Try different Last Updated patterns
  const patterns = [
    /(\*\*Last Updated\*\*:\s*)(\d{4}-\d{2}-\d{2})/i,
    /(Last Updated:\s*)(\d{4}-\d{2}-\d{2})/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(content)) {
      return content.replace(pattern, `$1${newDate}`);
    }
  }

  // No Last Updated found, return unchanged
  return content;
}

/**
 * Update or create CHANGELOG.md with new version entry
 */
function updateChangelog(
  changelogPath: string,
  skillName: string,
  version: string,
  date: string
): void {
  try {
    const header = `# Changelog - ${skillName}

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

`;

    const newEntry = `## [${version}] - ${date}

### Changed
- Version ${version} snapshot created

---

`;

    if (!fs.existsSync(changelogPath)) {
      // Create new CHANGELOG.md
      fs.writeFileSync(changelogPath, header + newEntry, "utf-8");
      log(`[skill-version-hook] Created CHANGELOG.md for ${skillName}`);
    } else {
      // Check if version entry already exists
      const content = fs.readFileSync(changelogPath, "utf-8");
      if (content.includes(`## [${version}]`)) {
        log(`[skill-version-hook] CHANGELOG entry for v${version} already exists`);
        return;
      }

      // Insert new entry after the header (after first ---)
      const insertIndex = content.indexOf("---\n");
      if (insertIndex !== -1) {
        const newContent =
          content.slice(0, insertIndex + 4) +
          "\n" +
          newEntry +
          content.slice(insertIndex + 4);
        fs.writeFileSync(changelogPath, newContent, "utf-8");
      } else {
        // Fallback: append to end
        fs.appendFileSync(changelogPath, "\n" + newEntry, "utf-8");
      }
      log(`[skill-version-hook] Updated CHANGELOG.md with v${version}`);
    }
  } catch (error: any) {
    log(`[skill-version-hook] Failed to update CHANGELOG: ${error.message}`);
  }
}

/**
 * Write log to file
 */
function log(message: string): void {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }

    const logFile = path.join(LOG_DIR, "skill-version-hook.log");
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(logFile, logEntry);
  } catch {
    // Ignore logging errors
  }
}

// ============================================================================
// Entry Point
// ============================================================================

main();
