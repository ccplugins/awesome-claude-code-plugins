# oh-my-android

Lets Claude Code see and drive the Android Emulator and real Android phones through the MCP server of [Oh My Android](https://github.com/ateymoori/oh-my-android), a free, open-source (MIT) macOS app.

18 MCP tools: screenshots where 1 px = 1 dp, UI tree with dp coordinates, tap and type, dark mode, font scale, locale / RTL, TalkBack, logcat, accessibility audit, app data.

## Requirements

- macOS 26 or later
- The Oh My Android app:

```
brew install --cask ateymoori/tap/oh-my-android
```

The plugin starts `/Applications/Oh My Android.app/Contents/MacOS/ohmyandroid-mcp` over stdio.

## Install

From this marketplace:

```
/plugin marketplace add ccplugins/awesome-claude-code-plugins
/plugin install oh-my-android@awesome-claude-code-plugins
```

Or from the upstream repo:

```
/plugin marketplace add ateymoori/oh-my-android
/plugin install oh-my-android@oh-my-android
```

## Source

https://github.com/ateymoori/oh-my-android
