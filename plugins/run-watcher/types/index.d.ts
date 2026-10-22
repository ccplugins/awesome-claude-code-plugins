export type RunStatus =
  | 'running'
  | 'pending'
  | 'stalled'
  | 'nan'
  | 'spike'
  | 'crashed'
  | 'done'
  | 'cancelled'
  | 'missing'
  | 'unreachable'

// A Slurm job, by its id and the host it was submitted on (where sacct, squeue and scontrol know it)
export type SlurmJob = { id: string; host: string }

export type Run = {
  // An absolute local path, or `host:path` for a log read over ssh
  path: string
  label: string
  addedAt: number
  mtimeMs: number
  // When the log was last read; remote logs are read less often than local ones
  polledAt: number
  // Read at least once: alerts fire on changes after that, not for the state a log was found in
  isSeen: boolean
  // The path was inferred (a Slurm job's default output, when scontrol could not say). A read that finds the log
  // clears it; one that finds nothing while the job is not pending drops the run
  isGuess: boolean
  // The Slurm job writing the log, when it came from one; kept across sessions with the run
  job?: SlurmJob
  // Slurm's word for the job's state at the last read (`RUNNING`, `OUT_OF_MEMORY`); unset when Slurm knows no such
  // job, except that a job seen to end keeps its ending
  jobState?: string
  // Why the last read over ssh failed, in words (`login to hpc refused …`); unset after a read that worked
  sshError?: string
  status: RunStatus
  step?: number
  losses: number[]
  lastLine: string
}

declare module 'claude-code' {
  interface PluginState {
    'run-watcher': { runs: Run[]; checkedAt: number }
  }
}
