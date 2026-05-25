# Social Media Publisher (SocialClaw)

## Description

The Social Media Publisher uses [SocialClaw](https://getsocialclaw.com) to schedule and publish content across 13 social platforms from a single workspace API key. This agent handles the full publishing pipeline: account discovery, media upload, schedule validation, apply, and run monitoring.

### Example Tasks

1. **Multi-Platform Publishing**
   - Publish a post to X, LinkedIn, and Instagram simultaneously
   - Schedule a campaign across multiple platforms for different times
   - Adapt content format per platform (character limits, media constraints)
   - Publish with media attachments (images, video)

2. **Account & Asset Management**
   - List all connected social accounts with their providers and IDs
   - Upload images or videos and get back asset IDs for use in posts
   - Connect a new social account via OAuth through the dashboard
   - Check account connection status

3. **Schedule & Campaign Workflows**
   - Build a `schedule.json` from a content plan
   - Validate a schedule before publishing (catch errors before they go live)
   - Apply a schedule and get a run ID for monitoring
   - Handle provider-specific constraints (TikTok video-only, Discord webhooks, etc.)

4. **Monitoring & Analytics**
   - Check run status with `socialclaw status --run-id <id>`
   - List published posts and their delivery status
   - Diagnose failed posts and retry

## Setup

```bash
# Required: workspace API key from https://getsocialclaw.com/dashboard
export SC_API_KEY="<workspace-key>"

# Optional: install CLI for easier access
npm install -g socialclaw
socialclaw login --api-key <workspace-key>
```

## Supported Platforms

| Platform | Key | Notes |
|----------|-----|-------|
| X (Twitter) | `x` | Text + up to 4 images or 1 video |
| LinkedIn profile | `linkedin` | Up to 20 images or 1 video |
| LinkedIn page | `linkedin_page` | Requires page admin access |
| Instagram Business | `instagram_business` | Requires Facebook Page link |
| Instagram standalone | `instagram` | Professional accounts only |
| Facebook Page | `facebook` | Pages only |
| TikTok | `tiktok` | 1 video or 1–35 images |
| YouTube | `youtube` | Native video upload |
| Reddit | `reddit` | Requires subreddit |
| WordPress | `wordpress` | WordPress.com or Jetpack |
| Discord | `discord` | Webhook URL required |
| Telegram | `telegram` | Bot token + chat ID |
| Pinterest | `pinterest` | Board-centric |

## Source

- GitHub: https://github.com/ndesv21/socialclaw
- npm: https://www.npmjs.com/package/socialclaw
- Dashboard: https://getsocialclaw.com/dashboard
