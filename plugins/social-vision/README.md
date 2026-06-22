# 🎬 social-vision

**Paste a social media link. Claude watches the video for you.**

social-vision is a Claude Code plugin that lets you drop in an Instagram, TikTok,
YouTube, or X (Twitter) link — and Claude will *actually understand it*. It
listens to the audio, reads the text and graphics on screen, reads the caption,
and then tells you what the video is really about.

No copy-pasting transcripts. No "I can't watch videos." Just paste and ask.

---

## What it can do

- 🎧 **Transcribe the audio** — word for word, with timestamps.
- 👀 **See what's on screen** — on-screen captions, charts, graphics, products, the setting — Claude looks at the actual frames.
- 📝 **Read the caption** — including hashtags, mentions, and links.
- 🧠 **Explain it** — a full breakdown: what's said, what's shown, and what it's trying to get you to do.
- 🖼️ **Handle photo posts too** — Instagram carousels and X image posts are read slide by slide.

### Supported links

| Platform | Reels / Videos / Shorts | Photo posts & carousels |
|----------|:----------------------:|:-----------------------:|
| Instagram | ✅ | ✅ |
| TikTok | ✅ | — |
| YouTube + Shorts | ✅ | — |
| X / Twitter | ✅ | ✅ |
| A video file on your computer | ✅ | — |

---

## Install

In Claude Code:

```
/plugin marketplace add Shivang0/social-vision
/plugin install social-vision@social-vision
/reload-plugins
```

That's it. No keys, no accounts, no sign-ups.

> Prefer to run it from a local checkout? Clone the repo and
> `/plugin marketplace add /path/to/social-vision` instead.

---

## Use it

Just paste a link into Claude Code:

> analyze https://www.instagram.com/reel/XXXXXXXX/

or use the command:

> /analyze https://www.tiktok.com/@someone/video/123456789

Claude takes care of the rest and gives you the full breakdown. You can then ask
follow-ups like *"just give me the hook,"* *"list every stat it mentioned,"* or
*"summarize it in 3 bullets."*

### Example

**You:**

> /analyze https://www.instagram.com/reel/XXXXXXXX/

**social-vision** (after ~30–60s):

> **Reel by @creator — "How the new LinkedIn algorithm works"**
> Instagram · 99s · 1,975 likes
>
> **TL;DR** — A talking-head reel arguing likes no longer matter; saves, comments, and dwell time now drive reach.
>
> **Full transcript (verbatim, with timestamps)**
> `[00:00]` I grew my LinkedIn followers to over 210,000 by using the new algorithm to my advantage…
> `[00:16]` LinkedIn replaced its engagement-based system with a 150-billion-parameter model…
> *…complete, nothing dropped…*
>
> **On screen** — creator at a podcast mic; text overlays "saves 5×", "comments 15×"; a ranked chart: Text 2–4% ‹ Video 5.6% ‹ Carousel 6.6%.
>
> **Caption** — "LinkedIn's new algorithm doesn't care how many likes you get… comment PLAYBOOK 👇 #linkedintips"
>
> **Takeaway** — Educational hook + lead magnet: optimize for saves / long comments / carousels; "comment PLAYBOOK" funnels to a paid program.

Then keep asking: *"list every stat,"* *"just the hook,"* *"summarize in 3 bullets,"* *"what's the call to action?"*

> Works the same for a **TikTok**, **YouTube Short**, **X post**, or a local `.mp4`. Image carousels come back slide-by-slide.

### First run takes a few minutes ⏳

The very first time you use it, social-vision quietly sets itself up — it
installs the small tools it needs to download and transcribe videos. You may be
asked to approve an install or two. **This happens once.** Every run after that
is fast.

It automatically picks the best transcription engine for your computer (Apple
Silicon Macs, NVIDIA GPUs, and regular laptops are all handled), and everything
runs **on your own machine** — your videos are never uploaded anywhere.

---

## 🔑 Private or login-only content

Some posts can only be viewed when you're logged in — most **Instagram photo
posts and carousels**, private accounts, and many **X/Twitter posts**.

To analyze those, **stay logged into that platform in your normal web browser**
(Chrome, Firefox, Safari, Edge, or Brave). When Claude hits a login wall, it will
ask which browser you use, then borrow your existing login to fetch the post.

- It only does this **when you say yes** — it never touches your browser otherwise.
- On a Mac, your system may pop up a keychain prompt to allow it; that's normal.
- TikTok and YouTube are usually public, so they work without any of this.

---

## 🔒 Privacy

- Everything runs **locally on your computer**. Videos and audio are not sent to any third party.
- Your browser login is only used when you explicitly approve it for a private post, and it stays on your machine.
- Downloaded videos and results are saved under `~/.social-vision/` so you can find or delete them anytime.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "ffmpeg could not be installed" | Run the one-line command Claude shows you (e.g. `brew install ffmpeg` on Mac, `winget install Gyan.FFmpeg` on Windows, `sudo apt install ffmpeg` on Linux). |
| A link suddenly stops downloading | Platforms change often. Ask Claude to update the downloader — it can refresh the tool automatically. |
| "Needs login" on a public-looking post | Tell Claude which browser you're logged into; it'll retry using your session. |
| Transcript looks repetitive/empty | The video probably has little or no speech (music only). The on-screen visuals still get analyzed. |

---

## Notes

- This tool downloads content for your own personal analysis. Respect each
  platform's terms of service and the rights of content creators.

## License

MIT — see [LICENSE](LICENSE).
