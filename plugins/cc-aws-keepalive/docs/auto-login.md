# Auto-login setup

The `autoLoginCmd` feature lets cc-aws-keepalive re-authenticate automatically — no manual terminal switching needed. This section walks through setting it up end-to-end.

## How it triggers

- **Proactive** (before expiry): When you submit a prompt and your session has fewer than `autoLoginMinutes` left, the command fires **in the background**. You keep working while it runs. Rate-limited to once per 5 minutes to avoid spamming.
- **Reactive** (after expiry): When Claude Code hits a Bedrock 403, the command runs **synchronously** with up to 3 minutes for completion. Since you're blocked waiting for credentials anyway, this is fine.

## Requirements

Your `autoLoginCmd` must:

1. **Run without a TTY** — Claude Code hooks have no terminal attached. Interactive prompts hang forever.
2. **Handle password input** — pull it from a keychain/vault, not stdin.
3. **Handle MFA** — either trigger a push notification you approve on your phone, or use a TOTP generator.
4. **Suppress spinner/progress output** — ANSI escape codes from progress bars break pattern matching in expect scripts. Most CLI tools have a `--no-progress` or `--spinner=false` flag.
5. **Pre-select the IAM role** — if your tool shows an interactive role chooser, use a CLI flag to filter or pre-select the role. Otherwise, characters from the password prompt can spill into the role selector.

## Step 1: Store your password securely

Never put passwords in config files or environment variables. Use your OS keychain.

**macOS** (Keychain):
```bash
security add-generic-password -s cc-aws-keepalive -a mylogin -w 'YourPassword123!'
# Verify it works:
security find-generic-password -s cc-aws-keepalive -a mylogin -w
```

**Linux** (libsecret / GNOME Keyring):
```bash
secret-tool store --label="cc-aws-keepalive" service cc-aws-keepalive account mylogin <<< 'YourPassword123!'
# Verify:
secret-tool lookup service cc-aws-keepalive account mylogin
```

**Windows** (Credential Manager via PowerShell):
```powershell
# Store
cmdkey /add:cc-aws-keepalive /user:mylogin /pass:YourPassword123!
# Retrieve (in your automation script)
(New-Object System.Net.NetworkCredential((cmdkey /list:cc-aws-keepalive))).Password
```

Replace `mylogin` with a label that identifies your credential provider account (e.g., `saml2aws`, `awsmyid`).

## Step 2: Write an expect script

[`expect`](https://core.tcl-lang.org/expect/index) drives interactive CLI tools by matching output patterns and sending responses. Install it with `brew install expect` (macOS) or `apt install expect` (Linux).

Here's a template — adapt it to your login tool:

```expect
#!/usr/bin/env expect
# Auto-login script for cc-aws-keepalive
# Adapt the spawn command, password retrieval, and success pattern to your tool.

set timeout 180
log_user 0
set notified 0

# --- Password retrieval ---
# macOS Keychain:
set password [exec security find-generic-password -s cc-aws-keepalive -a mylogin -w]
# Linux libsecret:
# set password [exec secret-tool lookup service cc-aws-keepalive account mylogin]

# --- CLI arguments (optional, for flexibility) ---
set profile [lindex $argv 0]
if {$profile eq ""} { set profile "default" }

# --- Spawn your login tool ---
# Key flags:
#   --spinner=false / --no-progress : suppress ANSI output that breaks expect
#   -r / --role-filter              : skip interactive role chooser
#   -f push / --mfa-mode push       : use push MFA instead of TOTP prompt
#
# Examples:
#   saml2aws:  spawn saml2aws login --profile $profile --skip-prompt --disable-keychain
#   awsmyid:   spawn awsmyid login -p $profile -r bedrock -f push --spinner=false
#   gimme:     spawn gimme-aws-creds --profile $profile
spawn your-login-tool login --profile $profile --spinner=false

expect {
    -re {[Pp]assword} {
        sleep 0.5
        send -- "$password\r"
        exp_continue
    }
    -re {MFA Number:\s*(\d+)} {
        # Okta number matching challenge — show the code in a desktop notification
        # Guard: only notify once per login (tools may retry and output multiple numbers)
        if {!$notified} {
            set notified 1
            set mfa_number $expect_out(1,string)
            # macOS:
            exec osascript -e "display notification \"Enter $mfa_number on your phone\" with title \"AWS MFA\" subtitle \"Number: $mfa_number\" sound name \"Ping\""
            # Linux alternative (requires notify-send):
            # exec notify-send "AWS MFA" "Enter $mfa_number on your phone"
        }
        exp_continue
    }
    -re {push notification|Waiting.*approval|verify.*identity|Please Approve} {
        # Simple push MFA (no number) — just remind to approve
        if {!$notified} {
            set notified 1
            # macOS:
            exec osascript -e {display notification "Check your authenticator app" with title "AWS Login" subtitle "MFA push sent" sound name "Ping"}
            # Linux alternative:
            # exec notify-send "AWS Login" "MFA push sent — check your authenticator app"
        }
        exp_continue
    }
    -re {hoose.*role|Select.*role} {
        # Fallback if role filter didn't work — accept first match
        send "\r"
        exp_continue
    }
    -re {Credentials will expire|Success|Logged in} {
        puts "Auto-login succeeded"
    }
    eof {}
    timeout {
        puts stderr "auto-login timed out after 180s"
        exit 1
    }
}

set result [wait]
exit [lindex $result 3]
```

Save it to `~/.config/cc-aws-keepalive/auto-login.exp` and make it executable:

```bash
chmod +x ~/.config/cc-aws-keepalive/auto-login.exp
```

**Test it manually first:**

```bash
# This should complete the full login without any manual input
expect ~/.config/cc-aws-keepalive/auto-login.exp my-profile
```

If it hangs, run with `log_user 1` (change line 4) to see what the tool is outputting — often it's an unexpected prompt or ANSI escape codes breaking the pattern match.

## Step 3: Configure cc-aws-keepalive

Update your `~/.config/cc-aws-keepalive/config.json`:

```json
{
  "profile": "my-bedrock-profile",
  "expirationField": "x_security_token_expires",
  "loginCmd": "saml2aws login --profile my-bedrock-profile",
  "autoLoginCmd": "expect ~/.config/cc-aws-keepalive/auto-login.exp my-bedrock-profile",
  "autoLoginMinutes": 30,
  "warnMinutes": 30,
  "timerWarnMinutes": 60,
  "statusLineCmd": ""
}
```

Key points:
- `autoLoginCmd` is the full command — it must work when run as `sh -c "your command"` with no TTY
- `autoLoginMinutes` controls how early the proactive trigger fires (30 = re-auth when 30 minutes remain)
- `loginCmd` is still shown in manual warnings as a fallback — it's never run automatically

## Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Script hangs at password prompt | ANSI spinner output breaks the `Password` pattern match | Add `--spinner=false` or `--no-progress` to your spawn command |
| Wrong IAM role selected | Password characters leak into interactive role chooser | Use a role filter flag (`-r`, `--role`, `--role-filter`) to pre-select |
| Password not found | Keychain service/account name mismatch | Run the `security find-generic-password` command manually to verify |
| Times out after 180s | MFA push not approved, or success pattern doesn't match | Set `log_user 1` and run manually to see what the tool outputs after login |
| MFA number not showing | Number matching pattern doesn't match your tool's output | Set `log_user 1`, run manually, and look for the line containing the number. Update the `-re {MFA Number:\s*(\d+)}` pattern to match |
| `spawn: command not found` | `expect` not installed | `brew install expect` (macOS) or `apt install expect` (Linux) |
| Works manually but not from cc-aws-keepalive | PATH differs when run from Claude Code | Use full path to your login tool in the spawn command (e.g., `/usr/local/bin/saml2aws`) |

## Windows alternative

Windows doesn't have `expect`. Use a PowerShell script instead:

```powershell
# auto-login.ps1
$password = (cmdkey /list:cc-aws-keepalive | Select-String "Password").ToString().Split("=")[1].Trim()
echo $password | your-login-tool login --profile $args[0] --stdin-password
```

Set `autoLoginCmd` to: `powershell -File %USERPROFILE%\.config\cc-aws-keepalive\auto-login.ps1 my-profile`
