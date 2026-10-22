// How the user's Bash permission rules treat a command: allowed runs on one press, ask and unlisted
// ("default") need a second press, denied can't be run from the row.
export type Risk = 'allow' | 'ask' | 'default' | 'deny'

export type Suggestion = { cmd: string; risk: Risk }

export type Commands = Suggestion[]

// One command's run: its row, exit code (null while running, when stopped, or when it could not start),
// elapsed time, output so far
export type Run = {
  index: number
  cmd: string
  exitCode: number | null
  ms: number
  output: string
  isRunning: boolean
  isStopped: boolean
}

// Which button was pressed once and waits for a second press: a command's index, or -1 for run all
export type Armed = number | null

declare module 'claude-code' {
  interface PluginState {
    'run-suggested': { commands: Commands; armed: Armed; runs: Run[] }
  }
}
