# Credential sync

Optionally sync credentials to remote machines after every successful login. Useful when you develop on multiple machines that share the same AWS profile.

Sync fires automatically:
- **Proactive**: On each prompt submission when credentials are fresh (debounced by `syncCooldownSeconds`)
- **Reactive**: After a successful `autoLoginCmd` re-authentication

## Configuration

Add a `syncTargets` array to your `~/.config/cc-aws-keepalive/config.json`:

```json
{
  "profile": "my-bedrock-profile",
  "expirationField": "x_security_token_expires",
  "syncTargets": [
    {
      "type": "ssh",
      "host": "my-remote-machine.local",
      "user": "myuser"
    }
  ],
  "syncTimeoutSeconds": 15,
  "syncCooldownSeconds": 60
}
```

| Field | Description |
|-------|-------------|
| `syncTargets` | Array of sync targets (empty = disabled) |
| `syncTimeoutSeconds` | Timeout per sync operation in seconds (default: 15). Uses seconds (not minutes) because sync operations complete in seconds, unlike session lifetimes |
| `syncCooldownSeconds` | Minimum seconds between syncs (default: 60) |

## Sync types

### SSH

Copies credentials to a remote `~/.aws/credentials` file via SSH. Uses key-based auth by default.

```json
{
  "type": "ssh",
  "host": "remote-machine.local",
  "user": "remoteuser",
  "remoteProfile": "default",
  "remotePath": "~/.aws/credentials",
  "sshArgs": "-p 2222"
}
```

| Field | Description |
|-------|-------------|
| `host` | Remote hostname (required) |
| `user` | SSH username (optional — uses SSH config default) |
| `remoteProfile` | Profile name on the remote file (default: same as local `profile`) |
| `remotePath` | Remote credentials file path (default: `~/.aws/credentials`) |
| `sshArgs` | Additional SSH arguments as a string or array (optional). Use array form for paths with spaces: `["-i", "/path/to/key"]` |
| `acceptNewHostKey` | Set to `true` only to opt into trust-on-first-use. The secure default requires a previously verified host key in `known_hosts` |

The remote write is atomic (write to `.tmp` then `mv`). Credentials are piped via stdin — never in command arguments or environment variables. Password authentication is intentionally unsupported; use an SSH key or agent and verify the host key before enabling sync.

### Webhook

Posts credentials to an HTTPS endpoint. Refuses non-HTTPS URLs.

```json
{
  "type": "webhook",
  "url": "https://my-service.example.com/aws-creds",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer ${MY_SECRET_TOKEN}"
  }
}
```

| Field | Description |
|-------|-------------|
| `url` | HTTPS endpoint (required — HTTP refused) |
| `method` | HTTP method (default: `POST`) |
| `headers` | Custom headers; supports `${ENV_VAR}` interpolation (optional) |
| `remoteProfile` | Profile name in the JSON payload (default: same as local `profile`) |

Payload format:
```json
{
  "profile": "my-profile",
  "credentials": {
    "aws_access_key_id": "...",
    "aws_secret_access_key": "...",
    "aws_session_token": "..."
  },
  "timestamp": 1716000000000
}
```

### Command

Runs a custom command and pipes credential JSON to its stdin.

```json
{
  "type": "command",
  "command": "/path/to/my-sync-script.sh"
}
```

| Field | Description |
|-------|-------------|
| `command` | Shell command to execute (required) |
| `remoteProfile` | Profile name in the JSON payload (default: same as local `profile`) |

Stdin JSON format:
```json
{
  "profile": "my-profile",
  "credentials": {
    "aws_access_key_id": "...",
    "aws_secret_access_key": "...",
    "aws_session_token": "..."
  },
  "expiration": "2024-01-01T12:00:00Z",
  "timestamp": 1716000000000
}
```

## Security

- **Session tokens only**: Sync is refused if no `aws_session_token` is present (will never sync long-lived IAM keys)
- **HTTPS enforced**: Webhook targets must use `https://`; also refuses if `NODE_TLS_REJECT_UNAUTHORIZED=0`
- **Stdin transport**: Credentials are piped via stdin, never passed as CLI arguments or environment variables
- **Atomic writes**: SSH sync writes to a `.tmp` file then atomically renames — no partial reads on the remote
- **Verified SSH hosts by default**: SSH uses `StrictHostKeyChecking=yes`, so credentials are never sent to an unknown host. Pre-populate `~/.ssh/known_hosts` after verifying the fingerprint. Trust-on-first-use requires the explicit `acceptNewHostKey: true` opt-in and can expose credentials if the first connection is intercepted
- **Fire-and-forget**: Sync runs in the background and never blocks your Claude Code session
