# Configuration

Edit `~/.config/cc-aws-keepalive/config.json`:

```json
{
  "profile": "my-bedrock-profile",
  "expirationField": "x_security_token_expires",
  "loginCmd": "saml2aws login --profile my-bedrock-profile",
  "autoLoginCmd": "",
  "autoLoginMinutes": 30,
  "warnMinutes": 30,
  "timerWarnMinutes": 60,
  "statusLineCmd": ""
}
```

| Field | Description |
|-------|-------------|
| `profile` | AWS profile name in `~/.aws/credentials` |
| `expirationField` | Field storing session expiration as unix timestamp. Leave empty to fall back to `aws sts get-caller-identity`, which can only detect expired vs. valid, not time remaining. The prompt hook reuses its answer for 5 minutes, or until `~/.aws/credentials` changes, so it costs one network call per 5 minutes rather than one per prompt |
| `loginCmd` | Command to re-authenticate (shown in warnings so you can copy-paste it) |
| `autoLoginCmd` | Command for fully automated re-authentication. Must work without a TTY — see [Auto-login setup](auto-login.md) |
| `autoLoginMinutes` | Auto-run `autoLoginCmd` when session has fewer than this many minutes left (0 = disabled). Requires `expirationField`. Rate-limited to once per 5 minutes |
| `warnMinutes` | Minutes before expiry to start showing warnings |
| `timerWarnMinutes` | Minutes before expiry to turn the statusline timer red |
| `statusLineCmd` | Existing status line command to compose with (leave empty for standalone) |

**Environment variables:**

| Variable | Description |
|----------|-------------|
| `CC_KEEPALIVE_PROFILE` | Overrides `profile` from config. Useful for multi-account setups where different terminals use different AWS accounts |

**Common `expirationField` values by provider:**

| Provider | `expirationField` value |
|----------|------------------------|
| saml2aws | `x_security_token_expires` |
| gimme-aws-creds | `x_security_token_expires` |
| awsmyid | `awsmyid_session_expiration` |
| aws-google-auth | `x_security_token_expires` |

Check your `~/.aws/credentials` after authenticating to find the field name for your provider.

## Credential providers

Works with any tool that **materializes temporary credentials** (`aws_access_key_id`, `aws_secret_access_key`, `aws_session_token`) into `~/.aws/credentials`:

- **saml2aws**
- **gimme-aws-creds** (Okta)
- **aws-google-auth**
- **onelogin-aws-cli**
- Any corporate SAML/OIDC CLI that writes to `~/.aws/credentials`

> **Note:** Plain `aws sso login` stores tokens in `~/.aws/sso/cache/`, not in `~/.aws/credentials`. If you use AWS SSO, you need a tool that exports the session to the credentials file, or use `aws configure export-credentials --profile myprofile --format process`.

## Status line timer

What the optional timer shows, and how it combines with other status line plugins, is in [Usage](usage.md#status-line-timer).

## Limitations

- **Proactive time-remaining warnings** require `expirationField`. Without it, the STS fallback can only detect valid vs. expired — not "expires in 20 minutes" — and because its answer is reused for 5 minutes, it can notice an expiry up to 5 minutes late.
- **Fully automated re-authentication** requires an `autoLoginCmd` that can drive your login tool non-interactively. See [Auto-login setup](auto-login.md) for a complete walkthrough.
