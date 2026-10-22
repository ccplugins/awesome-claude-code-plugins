import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderNode } from 'claude-code'

import type { AnkiCard } from '../types'

const ANKI = 'http://127.0.0.1:8765'
const REFRESH_MS = 5 * 60_000
// Anki's own default for new cards a day, used when no deck limit can be read
const DEFAULT_NEW_PER_DAY = 20
const LIMIT_TTL_MS = 10 * 60_000

// Set from the plugin's options in register.
let QUERY = ''
// -1: the deck's own new-card limit when the query names one deck, else Anki's default
let NEW_PER_DAY = -1
let HEADING = ''
let FRONT = ''
let BACK = ''
let SHOW_WHEN_IDLE = false
// 0: never sync with AnkiWeb
let SYNC_AFTER = 0

// Grades since the last sync was asked for, and since the last one Anki took.
let sinceSync = 0
let unsynced = 0

const GRADES = [
  { ease: 1, label: 'Again' },
  { ease: 2, label: 'Hard' },
  { ease: 3, label: 'Good' },
  { ease: 4, label: 'Easy' },
] as const

const current = atom({ plugin: 'anki-band', key: 'card' } as const, null as AnkiCard | null)
const isRevealed = atom({ plugin: 'anki-band', key: 'isRevealed' } as const, false)
const dueCount = atom({ plugin: 'anki-band', key: 'due' } as const, null as number | null)
const reviewed = atom({ plugin: 'anki-band', key: 'reviewed' } as const, 0)
const isPaused = atom({ plugin: 'anki-band', key: 'isPaused' } as const, false)

type CardInfo = {
  cardId: number
  due: number
  queue: number
  modelName: string
  deckName: string
  question: string
  answer: string
  fields: Record<string, { value: string; order: number } | undefined>
}

async function anki<T>($: EngineInterface, action: string, params: object = {}): Promise<T> {
  const res = await $.http.fetch(ANKI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, version: 6, params }),
  })
  const body = JSON.parse(res.text) as { result: T; error: string | null }
  if (body.error) throw new Error(body.error)
  return body.result
}

const find = ($: EngineInterface, query: string) => anki<number[]>($, 'findCards', { query: `${QUERY} ${query}`.trim() })

// The one deck a query names (`deck:Japanese`, `deck:"Core 2k"`, `"deck:Core 2k"`), when it names exactly
// one and without a wildcard; its new-card limit is then the deck's own.
export function singleDeck(query: string): string | undefined {
  const decks = [...query.matchAll(/(?:^|\s)(?:"deck:([^"]+)"|deck:"([^"]+)"|deck:(\S+))/g)].map(m => m[1] ?? m[2] ?? m[3] ?? '')
  return decks.length === 1 && decks[0] && !decks[0].includes('*') ? decks[0] : undefined
}

let limitCache: { value: number; at: number } | undefined

async function newPerDay($: EngineInterface): Promise<number> {
  if (NEW_PER_DAY >= 0) return NEW_PER_DAY
  const now = await $.clock.now()
  if (limitCache && now - limitCache.at < LIMIT_TTL_MS) return limitCache.value
  const deck = singleDeck(QUERY)
  let value = DEFAULT_NEW_PER_DAY
  if (deck !== undefined) {
    const config = await anki<{ new?: { perDay?: number } } | false>($, 'getDeckConfig', { deck }).catch(() => false as const)
    if (config && typeof config.new?.perDay === 'number') value = config.new.perDay
  }
  limitCache = { value, at: now }
  return value
}

async function newRoom($: EngineInterface): Promise<number> {
  return Math.max(0, (await newPerDay($)) - (await find($, 'introduced:1')).length)
}

async function countDue($: EngineInterface): Promise<number> {
  const [learning, reviews, room, fresh] = await Promise.all([
    learningDueNow($),
    find($, 'is:due -is:learn'),
    newRoom($),
    find($, 'is:new -is:suspended -is:buried'),
  ])
  return learning.length + reviews.length + Math.min(room, fresh.length)
}

// Learning steps first (they are minutes apart), then reviews, then new cards
// in Anki's own new-card position.
async function nextCard($: EngineInterface): Promise<CardInfo | undefined> {
  const [learning] = await learningDueNow($)
  if (learning) return learning
  const reviews = await find($, 'is:due -is:learn')
  if (reviews.length > 0) return (await cardsInfo($, reviews.slice(0, 1)))[0]
  if ((await newRoom($)) === 0) return undefined
  const id = await firstByPosition($, await find($, 'is:new -is:suspended -is:buried'))
  return id === undefined ? undefined : (await cardsInfo($, [id]))[0]
}

// Anki's is:due counts a learning card as due up to 20 minutes early (its
// learn-ahead limit), which would hand back the card just graded. Only steps
// that have come due count; an intraday step (queue 1) keeps a timestamp.
async function learningDueNow($: EngineInterface): Promise<CardInfo[]> {
  const ids = await find($, 'is:due is:learn')
  if (ids.length === 0) return []
  const now = (await $.clock.now()) / 1000
  return (await cardsInfo($, ids)).filter(card => card.queue !== 1 || card.due <= now).sort((a, b) => a.due - b.due)
}

// cardsInfo carries each card's rendered HTML (tens of KB with styling), so a
// large deck is over the 4 MB fetch limit: cards are read in chunks, new-card
// positions kept.
const INFO_CHUNK = 40
const positions = new Map<number, number>()

async function cardsInfo($: EngineInterface, ids: number[]): Promise<CardInfo[]> {
  const infos: CardInfo[] = []
  for (let i = 0; i < ids.length; i += INFO_CHUNK) {
    infos.push(...(await anki<CardInfo[]>($, 'cardsInfo', { cards: ids.slice(i, i + INFO_CHUNK) })))
  }
  return infos
}

async function readPositions($: EngineInterface, ids: number[]): Promise<void> {
  for (const info of await cardsInfo($, ids.filter(id => !positions.has(id)))) {
    positions.set(info.cardId, info.due)
  }
}

const byPosition = (ids: number[]) => [...ids].sort((a, b) => (positions.get(a) ?? 0) - (positions.get(b) ?? 0) || a - b)

// Past this, Anki refuses a prop:pos bound (a 32-bit number).
const MAX_POSITION = 2 ** 30

// The new cards at the lowest position, found with Anki's own search: the prop:pos bound grows
// until a card matches, then halves back to that position, each step a findCards of card ids
// only. Undefined where nothing matches at any bound.
async function lowestPosition($: EngineInterface): Promise<{ ids: number[]; bound: number } | undefined> {
  const upTo = (n: number) => find($, `is:new -is:suspended -is:buried prop:pos<=${n}`)
  let lo = 0
  let hi = 1
  let ids = await upTo(hi)
  while (ids.length === 0) {
    if (hi >= MAX_POSITION) return undefined
    lo = hi
    hi *= 4
    ids = await upTo(hi)
  }
  while (ids.length > 1 && hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2)
    const below = await upTo(mid)
    if (below.length > 0) [hi, ids] = [mid, below]
    else lo = mid
  }
  return { ids, bound: hi }
}

// Reading every new card's cardsInfo to sort them is megabytes on a large deck, so the search
// narrows it to a card or two first. An Anki without prop:pos refuses it (an error) or ignores
// it (cards past the bound); either way, every new card is read as before.
async function firstByPosition($: EngineInterface, ids: number[]): Promise<number | undefined> {
  if (ids.length === 0) return undefined
  const lowest = await lowestPosition($).catch(() => undefined)
  const isNew = new Set(ids)
  const found = lowest?.ids.filter(id => isNew.has(id)) ?? []
  if (lowest && found.length > 0) {
    await readPositions($, found)
    if (found.every(id => (positions.get(id) ?? Infinity) <= lowest.bound)) return byPosition(found)[0]
  }
  await readPositions($, ids)
  return byPosition(ids)[0]
}

// A card's HTML as one line of plain text: styles, scripts, sound tags and collapsed details dropped.
export function text(html: string): string {
  return html
    .replace(/<(style|script|details)[\s\S]*?<\/\1>/gi, '')
    .replace(/\[sound:[^\]]*\]/g, '')
    .replace(/<br\s*\/?>|<\/(p|div|li|dd|h\d)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, code: string) => {
      const c = code.toLowerCase()
      if (c.startsWith('#x')) return String.fromCodePoint(parseInt(c.slice(2), 16))
      if (c.startsWith('#')) return String.fromCodePoint(parseInt(c.slice(1), 10))
      return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[c] ?? ''
    })
    .replace(/\s+/g, ' ')
    .trim()
}

// Anki's own template syntax: {{Field}}; {{#Field}}…{{/Field}} kept when the field has text,
// {{^Field}}…{{/Field}} when it has none. Each line of the result is one row, as plain text.
export function fill(template: string, fields: Record<string, string>): string[] {
  const section = /\{\{([#^])\s*([^}]+?)\s*\}\}([\s\S]*?)\{\{\/\s*\2\s*\}\}/g
  let out = template
  // Nested sections resolve from the inside out, a pass at a time.
  for (let pass = 0; pass < 5 && /\{\{[#^]/.test(out); pass++) {
    out = out.replace(section, (_, kind: string, name: string, body: string) =>
      (kind === '#') === (text(fields[name] ?? '') !== '') ? body : '',
    )
  }
  return out
    .replace(/\{\{\s*([^#^/}][^}]*?)\s*\}\}/g, (_, name: string) => fields[name] ?? '')
    .split('\n')
    .map(text)
    .filter(Boolean)
}

// The card as the band shows it: the options' templates over the note's fields where set, else
// Anki's own rendering of the card (the answer side after its <hr id=answer>) under the deck's name.
export function toCard(info: CardInfo): AnkiCard {
  const fields = Object.fromEntries(Object.entries(info.fields).map(([name, f]) => [name, f?.value ?? '']))
  const answer = info.answer.split(/<hr id=["']?answer["']?\s*\/?>/i)
  return {
    id: info.cardId,
    heading: HEADING ? fill(HEADING, fields).join(' · ') : text(info.deckName).replace(/::/g, ' › '),
    title: FRONT ? fill(FRONT, fields).join(' ') : text(info.question),
    back: BACK ? fill(BACK, fields) : [text(answer.length > 1 ? answer.slice(1).join(' ') : info.answer)].filter(Boolean),
  }
}

function clip(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, Math.max(1, max - 1)).trimEnd()}…`
}

// What next(e) resolves to when nothing beneath drew: core's own drawing, { type: 'engine' }
// (empty above the prompt without a survey), maybe wrapped in Boxes holding nothing else.
export function isEngineOnly(node: RenderNode): boolean {
  if (typeof node === 'string') return false
  if (node.type === 'engine') return true
  return node.type === 'Box' && (node.children ?? []).every(isEngineOnly)
}

// AnkiConnect's sync errors as a toast: it refuses without an AnkiWeb login, and an
// older AnkiConnect refuses when AnkiWeb wants a one-way full sync.
export function syncProblem(message: string): string {
  if (/auth not configured/i.test(message)) return 'Anki is not logged in to AnkiWeb; press Sync in Anki once to log in'
  if (/sync status [2-4]\b/i.test(message)) return 'AnkiWeb wants a full sync; press Sync in Anki to choose a side'
  return clip(message, 120)
}

async function refreshCount($: EngineInterface): Promise<void> {
  if (await read($, isPaused)) {
    $.ui.status('Anki: paused (/anki to resume)')
    return
  }
  try {
    // Anki's own count of cards reviewed today, so it carries across sessions.
    const [due, done] = await Promise.all([countDue($), find($, 'rated:1').then(ids => ids.length)])
    await update($, dueCount, () => due)
    await update($, reviewed, () => done)
    $.ui.status(`Anki: ${due} due${done > 0 ? ` · ${done} done` : ''}`)
  } catch {
    await update($, dueCount, () => null)
    $.ui.status('Anki: AnkiConnect not reachable')
  }
}

async function loadNext($: EngineInterface): Promise<void> {
  try {
    const info = await nextCard($)
    await update($, isRevealed, () => false)
    await update($, current, () => (info ? toCard(info) : null))
  } catch {
    await update($, current, () => null)
  }
  await refreshCount($)
}

async function grade($: EngineInterface, cardId: number, ease: number): Promise<void> {
  try {
    const [isAnswered] = await anki<boolean[]>($, 'answerCards', { answers: [{ cardId, ease }] })
    if (!isAnswered) throw new Error('Anki no longer has that card')
  } catch (err) {
    $.ui.toast(`Anki: ${err instanceof Error ? err.message : String(err)}`)
    return
  }
  sinceSync += 1
  unsynced += 1
  await loadNext($)
  // Once the next card is up: a sync can hold Anki for seconds.
  if (SYNC_AFTER > 0 && sinceSync >= SYNC_AFTER) void sync($)
}

// Never awaited where it would hold a grade or the band; a failure is a toast.
async function sync($: EngineInterface): Promise<void> {
  sinceSync = 0
  const covered = unsynced
  try {
    await anki<null>($, 'sync')
    unsynced = Math.max(0, unsynced - covered)
  } catch (err) {
    $.ui.toast(`Anki sync: ${syncProblem(err instanceof Error ? err.message : String(err))}`)
  }
}

export const register: Register = (on, options) => {
  QUERY = String(options.query ?? '').trim()
  NEW_PER_DAY = Number(options.newPerDay ?? -1)
  HEADING = String(options.heading ?? '')
  FRONT = String(options.front ?? '')
  BACK = String(options.back ?? '')
  SHOW_WHEN_IDLE = options.showWhenIdle === true
  SYNC_AFTER = Math.max(0, Math.floor(Number(options.syncAfter ?? 0)) || 0)
  limitCache = undefined

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'anki',
      description: 'Pause or resume Anki reviews in the band above the prompt',
    })
    $.clock.every(REFRESH_MS, () => void refreshCount($))
    $.clock.after(0, () => void loadNext($))

    return next(e)
  })

  // Grades not yet on AnkiWeb go up as the session ends. Not awaited: the whole end chain
  // shares one short bound, and Anki carries on with a sync once it has the request.
  on('session.end', async ($, e, next) => {
    if (SYNC_AFTER > 0 && unsynced > 0) void sync($)

    return next(e)
  })

  on('command.run', { command: 'anki' }, async $ => {
    await update($, isPaused, paused => !paused)
    const paused = await read($, isPaused)
    await refreshCount($)

    return {
      text: paused ? 'Anki reviews paused. Run /anki to resume.' : 'Anki reviews back on.',
    }
  })

  // Re-pick at each main turn so a card reviewed in Anki meanwhile is not shown
  // again; a card already revealed stays until it is graded.
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined && !(await read($, isRevealed)) && !(await read($, isPaused))) {
      $.clock.after(0, () => void loadNext($))
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const card = await read($, current)
    if (e.props.hasSurvey || (!e.props.isWorking && !SHOW_WHEN_IDLE) || card === null || (await read($, isPaused))) {
      return next(e)
    }
    // While Claude waits, a mod beneath with something to draw here has the band;
    // while it works, the card does.
    if (!e.props.isWorking) {
      const beneath = await next(e)
      if (!isEngineOnly(beneath)) return beneath
    }

    const { Box, Button, Text } = $.ui.resolve(e)
    const shown = await read($, isRevealed)
    const due = (await read($, dueCount)) ?? 0
    const done = await read($, reviewed)
    const width = e.props.bodyColumns
    // Three rows of header and buttons; the back shares what is left.
    const linesEach = Math.max(1, Math.floor((e.props.maxRows - 3) / Math.max(1, card.back.length)))

    return (
      <Box flexDirection="column">
        <Box justifyContent="space-between" gap={2}>
          <Text dimColor wrap="truncate-end">
            {card.heading}
          </Text>
          <Text dimColor>{`${due} due · ${done} done`}</Text>
        </Box>
        <Text bold>{card.title}</Text>
        <Box gap={2}>
          {shown ? (
            GRADES.map(g => (
              <Button key={`grade-${g.ease}`} plain hotkey={String(g.ease)} label={g.label} onPress={() => void grade($, card.id, g.ease)} />
            ))
          ) : (
            <Button key="show" plain hotkey="0" label="Show answer" onPress={() => void update($, isRevealed, () => true)} />
          )}
        </Box>
        {shown &&
          card.back.map((row, i) => (
            <Box key={`back-${i}`}>
              <Text>{clip(row, width * linesEach)}</Text>
            </Box>
          ))}
      </Box>
    )
  })
}
