export type AnkiCard = {
  id: number
  heading: string
  title: string
  // The answer, one entry per row
  back: string[]
}

declare module 'claude-code' {
  interface PluginState {
    'anki-band': {
      card: AnkiCard | null
      isRevealed: boolean
      // null while AnkiConnect is unreachable
      due: number | null
      reviewed: number
      isPaused: boolean
    }
  }
}
