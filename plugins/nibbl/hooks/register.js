// src/register.tsx
import { read as read4 } from "claude-code";

// src/account.ts
import { update as update3 } from "claude-code";

// src/config.ts
const DEFAULT_API = "https://getnibbl.pages.dev";
const HATCH_AFTER_TURNS = 10;
const HATCH_DELAY_MS = 1500;
const SYNC_EVERY_MS = 150 * 6e4;
const SYNC_SOON_PENDING = 500;
const QUEUE_CAP = 1e3;
const MAX_BATCH = 1e3;
const TRIM_AFTER_413 = 500;
const LEASE_MS = 6e4;
const ORPHAN_MS = 15 * 6e4;
const BEAT_MS = 5 * 6e4;
const BACKOFF_BASE_MS = 6e4;
const BACKOFF_MAX_MS = 60 * 6e4;
const CONFLICT_RETRY_MS = 3e4;
const SESSION_END_WAIT_MS = 2500;
const POST_TIMEOUT_MS = 2e4;
const TICK_MS = 500;
const MOOD_MS = 6e3;
const HEART_MS = 2e3;
const LOOT_MS = 4e3;
const BOX_MS = 6e3;
const SLEEP_AFTER_MS = 3 * 6e4;
const MAX_BUGS = 3;
const HOME_X = 8;
const AWAY_X = 16;
const NIGHT_FROM_HOUR = 2;
const NIGHT_TO_HOUR = 5;
const NAME_MAX = 16;
const LABEL_MAX = 24;
const MIN_FULL_ROWS = 8;
const MIN_FULL_COLUMNS = 60;
const CHECK_COMMAND = /(?:^|[\s;&|(/])(?:test|vitest|jest|pytest|tsc|lint|build)(?=$|[\s;&|):])/;
const COMMIT_COMMAND = /\bgit(?:\s+-[A-Za-z]\s+\S+|\s+--?[\w-]+(?:=\S+)?)*\s+commit(?![\w-])/;
const K = {
  pet: "v1.pet",
  egg: "v1.egg",
  hidden: "v1.hidden",
  lease: "v1.lease",
  syncWait: "v1.syncWait",
  hatchWait: "v1.hatchWait",
  installId: "v1.installId",
  machineHash: "v1.machineHash",
  installSerial: "v1.installSerial",
  spikePet: "pet",
  spikeEggTurns: "eggTurns"
};
const QUEUE_PREFIX = "v1.q.";
const SPIKE_KEYS = ["pet", "eggTurns", "windows", "lastScoredAt", "mode"];

// src/runtime.ts
const rt = {
  options: {},
  ticker: null,
  isRegistered: false,
  tzRead: false,
  anim: { frame: 0, petX: HOME_X, blink: false },
  band: null,
  lastBeat: 0,
  isHatching: false,
  isSyncing: false,
  queueChain: Promise.resolve()
};
const later = ($, work) => {
  $.clock.after(0, () => {
    void work().catch((err) => $.ui.log(`nibbl: ${err instanceof Error ? err.message : String(err)}`, { to: "debug" }));
  });
};
const withTimeout = ($, ms, work) => new Promise((resolve) => {
  const timer = $.clock.after(ms, () => resolve("timeout"));
  work.then(
    (value) => {
      timer.cancel();
      resolve(value);
    },
    () => {
      timer.cancel();
      resolve("timeout");
    }
  );
});

// src/api.ts
const outcomeOf = (status, text) => {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { kind: "offline", reason: `non-JSON answer (${status})` };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return { kind: "offline", reason: `non-object answer (${status})` };
  const body = parsed;
  if (status >= 200 && status < 300) return { kind: "ok", status, body };
  const code = typeof body.error === "string" ? body.error : `http_${status}`;
  const retryAt = typeof body.retryAt === "number" && Number.isFinite(body.retryAt) ? body.retryAt : null;
  return { kind: "error", status, code, retryAt };
};
const post = async ($, base, path, payload) => {
  try {
    const res = await $.http.fetch(`${base}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    return outcomeOf(res.status, res.text);
  } catch (err) {
    return { kind: "offline", reason: err instanceof Error ? err.message : String(err) };
  }
};
const postWithin = async ($, base, path, payload, ms = POST_TIMEOUT_MS) => {
  const out = await withTimeout($, ms, post($, base, path, payload));
  return out === "timeout" ? { kind: "offline", reason: `no answer in ${ms} ms` } : out;
};
const isWait = (v) => typeof v === "object" && v !== null && Number.isFinite(v.until) && Number.isInteger(v.failures);
const backoff = (prev, now) => {
  const failures = (prev?.failures ?? 0) + 1;
  return { failures, until: now + Math.min(BACKOFF_MAX_MS, BACKOFF_BASE_MS * 2 ** (failures - 1)) };
};
const holdUntil = (prev, until) => ({ failures: prev?.failures ?? 0, until });
const LOCAL = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d{1,5})?$/;
const REMOTE = /^https:\/\/[A-Za-z0-9.-]+(?::\d{1,5})?$/;
const pickBase = (env, option) => {
  for (const candidate of [env, option]) {
    if (typeof candidate !== "string") continue;
    const base = candidate.trim().replace(/\/+$/, "");
    if (LOCAL.test(base) || REMOTE.test(base)) return base;
  }
  return DEFAULT_API;
};
const apiBase = async ($) => pickBase(await $.env.get("NIBBL_API"), rt.options.apiBase);

// src/hatch.ts
import { update as update2 } from "claude-code";

// ../../packages/core/src/cells.ts
const toCellPairs = (grid) => {
  const rows = [];
  for (let y = 0; y + 1 < grid.length; y += 2) {
    rows.push(
      grid[y].map((top, x) => {
        const bottom = grid[y + 1][x];
        if (top !== null) return { glyph: "\u2580", fg: top, bg: bottom };
        if (bottom !== null) return { glyph: "\u2584", fg: bottom, bg: null };
        return { glyph: " ", fg: null, bg: null };
      })
    );
  }
  return rows;
};

// ../../packages/core/src/grid.ts
const blankGrid = (width, height) => Array.from({ length: height }, () => Array(width).fill(null));
const inBounds = (grid, x, y) => y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
const setCell = (grid, x, y, color) => {
  if (inBounds(grid, x, y)) grid[y][x] = color;
};

// ../../packages/core/src/palette.ts
const SWEETIE = [
  "#1a1c2c",
  "#5d275d",
  "#b13e53",
  "#ef7d57",
  "#ffcd75",
  "#a7f070",
  "#38b764",
  "#257179",
  "#29366f",
  "#3b5dc9",
  "#41a6f6",
  "#73eff7",
  "#f4f4f4",
  "#94b0c2",
  "#566c86",
  "#333c57"
];
const SWEETIE_RGB = SWEETIE.map(
  (hex) => [1, 3, 5].map((o) => Number.parseInt(hex.slice(o, o + 2), 16))
);
const C = {
  ink: 0,
  plum: 1,
  red: 2,
  orange: 3,
  yellow: 4,
  lime: 5,
  green: 6,
  teal: 7,
  navy: 8,
  blue: 9,
  sky: 10,
  cyan: 11,
  white: 12,
  silver: 13,
  slate: 14,
  dusk: 15
};
const RAMPS = {
  ember: [C.red, C.orange, C.yellow],
  moss: [C.teal, C.green, C.lime],
  ocean: [C.navy, C.blue, C.sky],
  frost: [C.blue, C.sky, C.cyan],
  ghost: [C.slate, C.silver, C.white],
  jam: [C.plum, C.red, C.orange],
  gold: [C.orange, C.yellow, C.white],
  aurora: [C.navy, C.teal, C.cyan]
};
const SHINY_RAMPS = {
  ember: [C.plum, C.orange, C.yellow],
  moss: [C.teal, C.cyan, C.white],
  ocean: [C.dusk, C.blue, C.cyan],
  frost: [C.slate, C.cyan, C.white],
  ghost: [C.plum, C.silver, C.white],
  jam: [C.plum, C.red, C.yellow],
  gold: [C.red, C.yellow, C.white],
  aurora: [C.navy, C.green, C.lime]
};

// ../../packages/core/src/prng.ts
const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return (t ^ t >>> 14) >>> 0;
  };
};
const pickIndex = (rng, n) => rng() % n;

// ../../packages/core/src/draw.ts
const PET_SIZE = 16;
const SIZING = {
  baby: { dw: 2, dh: 2, min: 5 },
  teen: { dw: 1, dh: 1, min: 5 },
  adult: { dw: 0, dh: 0, min: 3 }
};
const EAR_SHAPES = {
  round: [[-3, -1], [-4, -1], [-3, -2], [-4, -2]],
  pointy: [[-3, -1], [-4, -1], [-4, -2], [-4, -3]],
  bunny: [[-3, -1], [-3, -2], [-3, -3], [-3, -4], [-4, -2], [-4, -3]],
  horns: [[-3, -1], [-4, -2], [-4, -3]]
};
const LEAF = [[7, -1], [8, -1], [8, -2], [9, -3], [10, -3], [6, -3]];
const MARK_SHAPES = {
  dot: [[0, 0]],
  star: [[0, 0], [1, 1]],
  heart: [[0, 0], [1, 0], [0, 1]],
  scar: [[0, 0], [1, 0], [2, 0]],
  sparkle: [[0, 0], [0, 1]],
  swirl: [[0, 0], [1, 0], [1, 1]]
};
const MARK_COLORS = {
  dot: [C.plum, C.navy, C.dusk, C.teal],
  star: [C.yellow, C.white, C.cyan, C.orange],
  heart: [C.red, C.plum, C.orange, C.yellow],
  scar: [C.white, C.silver, C.cyan, C.yellow],
  sparkle: [C.cyan, C.white, C.sky, C.yellow],
  swirl: [C.teal, C.lime, C.green, C.sky]
};
const markAnchor = (spot, ey, inset, canHold) => {
  if (spot === "left-cheek") return { x: 4 + inset, y: ey + 2, sx: -1, sy: 1 };
  if (spot === "right-cheek") return { x: 11 - inset, y: ey + 2, sx: 1, sy: 1 };
  if (spot === "forehead") return { x: 7, y: [ey - 1, ey].find((row) => canHold(7, row)) ?? ey - 1, sx: 1, sy: -1 };
  const y = [ey + 5, ey + 4, ey + 3].find((row) => canHold(7, row)) ?? ey + 5;
  return { x: 7, y, sx: 1, sy: 1 };
};
const PATTERN_SALT = 2654435769;
const PLACE_ATTEMPTS = 8;
const SHINY_SPARKLE = [[14, 1, C.white], [15, 0, C.cyan]];
const halves = (g, stage) => ({
  w: Math.max(stage === "adult" ? 3 : 4, g.halfW - SIZING[stage].dw),
  h: Math.max(SIZING[stage].min, g.halfH - SIZING[stage].dh)
});
const insideBody = (g, w, h2, x, y) => {
  const dx2 = 2 * x - 15;
  const dy2 = 2 * y - 18;
  const ellipse = dx2 * dx2 * h2 * h2 + dy2 * dy2 * w * w <= 4 * w * w * h2 * h2;
  if (g.family === "mochi") return ellipse || y >= 9 && y <= 9 + h2 - 1 && Math.abs(dx2) * 25 <= 46 * w;
  if (g.family === "critter") return ellipse || y === 9 + h2 && (Math.abs(dx2) === 5 || Math.abs(dx2) === 7);
  const m5 = 5 * Math.max(0, 9 - y);
  const k = 8 * h2 + m5;
  return dx2 * dx2 * k * k + 64 * w * w * dy2 * dy2 <= 256 * w * w * h2 * h2;
};
const buildMask = (g, stage) => {
  const { w, h: h2 } = halves(g, stage);
  const mask = Array.from({ length: PET_SIZE }, () => Array(PET_SIZE).fill("none"));
  for (let y = 1; y < PET_SIZE; y++) {
    for (let x = 0; x < PET_SIZE; x++) if (insideBody(g, w, h2, x, y)) mask[y][x] = "body";
  }
  const top = bodyTop(mask);
  const put = (x, y, cell) => {
    if (y >= 0 && y < PET_SIZE && x >= 0 && x < PET_SIZE && mask[y][x] === "none") mask[y][x] = cell;
  };
  if (g.head === "leaf") {
    if (g.hat === "none") for (const [x, dy] of LEAF) put(x, top + dy, "leaf");
  } else if (g.head !== "none") {
    for (const [ox, oy] of EAR_SHAPES[g.head]) {
      for (const x of [8 + ox, 7 - ox]) put(x, top + 1 + oy, g.head === "horns" ? "horn" : "body");
    }
  }
  return mask;
};
const bodyTop = (mask) => {
  const y = mask.findIndex((row) => row.includes("body"));
  return y < 0 ? 0 : y;
};
const bodyRows = (mask) => {
  let top = PET_SIZE;
  let bot = 0;
  for (let y = 0; y < PET_SIZE; y++) {
    if (!mask[y].includes("body")) continue;
    if (y < top) top = y;
    bot = y;
  }
  return { top: Math.min(top, bot), bot };
};
const drawPet = (g, stage, expression) => {
  const [shade, base, hi] = (g.shiny ? SHINY_RAMPS : RAMPS)[g.ramp];
  const mask = buildMask(g, stage);
  const isBody = (x, y) => y >= 0 && y < PET_SIZE && x >= 0 && x < PET_SIZE && mask[y][x] === "body";
  const px = blankGrid(PET_SIZE, PET_SIZE);
  for (let y = 0; y < PET_SIZE; y++) {
    for (let x = 0; x < PET_SIZE; x++) {
      const cell = mask[y][x];
      if (cell === "leaf") px[y][x] = C.green;
      else if (cell === "horn") px[y][x] = C.yellow;
      else if (cell === "body") {
        const topLeft = !isBody(x - 1, y) || !isBody(x, y - 1);
        const bottomRight = !isBody(x + 1, y) || !isBody(x, y + 1);
        px[y][x] = topLeft && !bottomRight ? hi : bottomRight && !topLeft ? shade : base;
      }
    }
  }
  const { top, bot } = bodyRows(mask);
  const ey = Math.max(1, (top + bot >> 1) - 1);
  const isFace = (x, y) => y >= ey - 1 && y <= ey + 3 && x >= 3 && x <= 12;
  const paintBody = (x, y, color) => {
    if (isBody(x, y) && !isFace(x, y)) px[y][x] = color;
  };
  const rng = mulberry32(PATTERN_SALT + g.patternVariant >>> 0);
  if (g.belly) {
    for (let y = ey + 4; y < bot; y++) {
      for (let x = 5; x <= 10; x++) {
        const corner = y === bot - 1 && (x === 5 || x === 10);
        if (!corner) paintBody(x, y, hi);
      }
    }
  }
  const inset = stage === "baby" ? 1 : 0;
  const eyeColumns = [5 + inset, 10 - inset];
  const inEyeZone = (x, y) => eyeColumns.some((sx) => y === ey && (x === sx || x === sx + (sx < 8 ? -1 : 1)) || y === ey + 1 && Math.abs(x - sx) <= 1);
  const anchor = markAnchor(g.mark.spot, ey, inset, (x, y) => isBody(x, y) && !inEyeZone(x, y));
  const markPixels = MARK_SHAPES[g.mark.motif].map(([dx, dy]) => [anchor.x + dx * anchor.sx, anchor.y + dy * anchor.sy]).filter(([x, y]) => isBody(x, y) && !inEyeZone(x, y));
  const underMark = (x, y) => markPixels.some(([mx, my]) => mx === x && my === y);
  const span = Math.max(1, bot - top - 3);
  const free = (x, y) => isBody(x, y) && !isFace(x, y) && !underMark(x, y) && px[y][x] !== shade;
  const place = (fits) => {
    for (let attempt = 0; attempt < PLACE_ATTEMPTS; attempt++) {
      const x = 3 + rng() % 10;
      const y = top + 2 + rng() % span;
      if (fits(x, y)) return [x, y];
    }
    return null;
  };
  if (g.pattern === "spots") {
    const fits = (x, y) => free(x, y) && free(x + 1, y);
    let landed = 0;
    for (let i = 0; i < 4; i++) {
      const at = place(fits);
      if (at === null) continue;
      px[at[1]][at[0]] = shade;
      px[at[1]][at[0] + 1] = shade;
      landed++;
    }
    for (let y = bot; landed === 0 && y >= top; y--) {
      for (let x = 3; x <= 11 && landed === 0; x++) {
        if (!fits(x, y)) continue;
        px[y][x] = shade;
        px[y][x + 1] = shade;
        landed++;
      }
    }
  } else if (g.pattern === "stripes") {
    const v = g.patternVariant;
    for (let y = top + 1 + (v & 1); y < ey - 1; y += 2) {
      for (let x = 6 - (v >> 1 & 1); x <= 9 + (v >> 2 & 1); x++) paintBody(x, y, shade);
    }
  } else if (g.pattern === "stars" || g.pattern === "constellation") {
    const count = g.pattern === "stars" ? 3 : 5;
    const star = g.ramp === "ember" || g.ramp === "gold" ? C.white : C.yellow;
    for (let i = 0; i < count; i++) {
      const color = g.pattern === "constellation" && i % 2 === 1 ? C.white : star;
      const at = place(free);
      if (at !== null) px[at[1]][at[0]] = color;
    }
  }
  const face = (x, y, color) => setCell(px, x, y, color);
  for (const sx of eyeColumns) {
    const out = sx < 8 ? -1 : 1;
    if (expression === "blink" || expression === "sleep") {
      face(sx, ey + 1, C.ink);
      face(sx + out, ey + 1, C.ink);
    } else if (expression === "happy") {
      face(sx, ey, C.ink);
      face(sx - 1, ey + 1, C.ink);
      face(sx + 1, ey + 1, C.ink);
    } else if (expression === "sad") {
      face(sx, ey + 1, C.ink);
      face(sx + out, ey, C.ink);
    } else if (expression === "surprised") {
      face(sx, ey, C.ink);
      face(sx, ey + 1, C.ink);
    } else if (g.eyes === "dot") {
      face(sx, ey, C.ink);
    } else if (g.eyes === "big" || g.eyes === "glint") {
      face(sx, ey, g.eyes === "glint" ? C.yellow : C.white);
      face(sx, ey + 1, C.ink);
      face(sx + out, ey, C.ink);
      face(sx + out, ey + 1, C.ink);
    } else if (g.eyes === "wide") {
      face(sx, ey, C.white);
      face(sx, ey + 1, C.ink);
    } else if (g.eyes === "sleepy") {
      face(sx, ey + 1, C.ink);
      face(sx + out, ey + 1, C.ink);
    } else {
      face(sx, ey, C.red);
      face(sx + out, ey, C.red);
      face(sx, ey + 1, C.red);
    }
  }
  if (g.pattern === "freckles") {
    face(4 + inset, ey + 1, shade);
    face(11 - inset, ey + 1, shade);
  }
  if (g.blush) {
    const blush = g.ramp === "jam" ? C.plum : C.red;
    face(4 + inset, ey + 2, blush);
    face(11 - inset, ey + 2, blush);
  }
  const markColor = MARK_COLORS[g.mark.motif].find((c) => c !== shade && c !== base && c !== hi);
  for (const [x, y] of markPixels) px[y][x] = markColor;
  if (expression === "happy") {
    face(6, ey + 2, C.ink);
    face(9, ey + 2, C.ink);
    face(7, ey + 3, C.ink);
    face(8, ey + 3, C.ink);
  } else if (expression === "sad") {
    face(7, ey + 2, C.ink);
    face(8, ey + 2, C.ink);
    face(6, ey + 3, C.ink);
    face(9, ey + 3, C.ink);
  } else if (expression === "surprised") {
    face(7, ey + 2, C.ink);
    face(8, ey + 2, C.ink);
    face(7, ey + 3, C.ink);
    face(8, ey + 3, C.ink);
  } else {
    face(7, ey + 2, C.ink);
    face(8, ey + 2, C.ink);
  }
  if (g.hat === "bow") {
    for (const [x, y] of [[9, top - 1], [10, top - 1], [11, top - 1], [9, top - 2], [11, top - 2]]) {
      setCell(px, x, y, C.red);
    }
  } else if (g.hat === "crown") {
    for (let x = 5; x <= 10; x++) setCell(px, x, top - 1, C.yellow);
    for (const x of [5, 7, 8, 10]) setCell(px, x, top - 2, C.yellow);
  }
  const outlined = px.map((row) => [...row]);
  for (let y = 0; y < PET_SIZE; y++) {
    for (let x = 0; x < PET_SIZE; x++) {
      if (px[y][x] !== null) continue;
      const touches = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(
        ([dx, dy]) => inBounds(px, x + dx, y + dy) && px[y + dy][x + dx] !== null
      );
      if (touches) outlined[y][x] = C.ink;
    }
  }
  if (g.shiny) for (const [x, y, color] of SHINY_SPARKLE) outlined[y][x] = color;
  return outlined;
};

// ../../packages/core/src/scene.ts
const SCENE_W = 32;
const SCENE_H = 16;
const GROUND = SCENE_H - 1;
const clamp = (v, min, max) => Number.isFinite(v) ? Math.min(max, Math.max(min, Math.trunc(v))) : min;
const BUG = [
  [0, 0, C.lime],
  [4, 0, C.lime],
  [2, 0, C.ink],
  [1, 1, C.lime],
  [2, 1, C.lime],
  [3, 1, C.lime]
];
const HEART = [
  [1, 0],
  [3, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [1, 2],
  [2, 2],
  [3, 2],
  [2, 3]
];
const drawGround = (scene) => {
  for (let x = 0; x < SCENE_W; x++) scene[GROUND][x] = x % 2 === 0 ? C.slate : C.dusk;
};
const LOOT = [[1, 0, C.yellow], [0, 1, C.yellow], [1, 1, C.white], [2, 1, C.yellow], [1, 2, C.yellow]];
const BOX_W = 6;
const BOX_H = 5;
const BOX_Y = 8;
const BOX = [];
for (let y = 0; y < BOX_H; y++) {
  for (let x = 0; x < BOX_W; x++) {
    const edge = x === 0 || y === 0 || x === BOX_W - 1 || y === BOX_H - 1;
    const inner = y === 1 ? x === 2 || x === 3 ? C.yellow : C.orange : y === 2 ? C.orange : C.red;
    BOX.push([x, y, edge ? C.ink : inner]);
  }
}
const ZED = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
const LOOT_X = 13;
const LOOT_Y = 2;
const crownOf = (pet) => {
  for (let y = 0; y < pet.length; y++) {
    const xs = [];
    for (let x = 0; x < pet[y].length; x++) if (pet[y][x] !== null && !(y <= 3 && x >= 13)) xs.push(x);
    if (xs.length > 0) return { top: y, mid: Math.floor((xs[0] + xs[xs.length - 1]) / 2) };
  }
  return null;
};
const drawNightcap = (scene, pet, petX, lift) => {
  const crown = crownOf(pet);
  if (!crown) return;
  const y = crown.top - lift;
  const x = petX + crown.mid;
  for (let dx = -1; dx <= 1; dx++) setCell(scene, x + dx, y, C.blue);
  for (let dx = -2; dx <= 2; dx++) setCell(scene, x + dx, y + 1, C.blue);
  setCell(scene, x + 2, y, C.white);
};
const drawBox = (scene, pet, petX, lift) => {
  let left = PET_SIZE;
  let right = -1;
  for (let y = BOX_Y + lift; y < BOX_Y + BOX_H + lift && y < PET_SIZE; y++) {
    for (let x = 0; x < PET_SIZE; x++) {
      if (pet[y][x] === null) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
    }
  }
  if (right < 0) return;
  const onRight = petX + right + 1 + BOX_W <= SCENE_W;
  const bx = onRight ? petX + right + 1 : petX + left - BOX_W;
  for (const [dx, dy, color] of BOX) setCell(scene, bx + dx, BOX_Y + dy, color);
};
const drawScene = (g, opts = {}) => {
  const scene = blankGrid(SCENE_W, SCENE_H);
  drawGround(scene);
  const petX = clamp(opts.petX ?? 6, 0, SCENE_W - PET_SIZE);
  const lift = clamp(opts.lift ?? 0, 0, 3);
  const frame = clamp(opts.frame ?? 0, 0, 1e6);
  const isHome = opts.away !== true;
  if (isHome) {
    for (let x = petX + 4; x <= petX + 11; x++) setCell(scene, x, GROUND - 1, C.dusk);
    const pet = drawPet(g, opts.stage ?? "adult", opts.expression ?? "idle");
    for (let y = 0; y < PET_SIZE; y++) {
      const sy = y - lift;
      if (sy < 0 || sy >= GROUND) continue;
      for (let x = 0; x < PET_SIZE; x++) {
        const cell = pet[y][x];
        if (cell !== null) scene[sy][petX + x] = cell;
      }
    }
    if (opts.nightcap) drawNightcap(scene, pet, petX, lift);
    if (opts.box) drawBox(scene, pet, petX, lift);
  }
  const bugs = clamp(opts.bugs ?? 0, 0, 3);
  for (let i = 0; i < bugs; i++) {
    const bx = SCENE_W - 6 - i * 6;
    for (const [dx, dy, color] of BUG) setCell(scene, bx + dx, GROUND - 2 + dy, color);
  }
  if (opts.heart) for (const [dx, dy] of HEART) setCell(scene, SCENE_W - 8 + dx, 2 + dy, C.red);
  if (isHome) {
    if (g.tier === "legendary") {
      const on = frame % 2 === 0;
      setCell(scene, petX + 1, on ? 2 : 5, C.yellow);
      setCell(scene, petX + 14, on ? 5 : 2, C.white);
    }
    if (g.shiny) {
      const [x, y] = frame % 2 === 0 ? [petX + 15, 2] : [petX + 13, 0];
      if (scene[y][x] === null) scene[y][x] = C.white;
    }
    if (opts.loot) for (const [dx, dy, color] of LOOT) setCell(scene, petX + LOOT_X + dx, LOOT_Y + dy, color);
    if (opts.zzz) {
      const [zx, zy] = frame % 2 === 0 ? [14, 2] : [15, 3];
      for (const [dx, dy] of ZED) setCell(scene, petX + zx + dx, zy + dy, C.white);
    }
  }
  return scene;
};

// ../../packages/core/src/egg.ts
const CRACKS = [
  [],
  [[7, 4], [8, 5], [7, 6]],
  [[7, 4], [8, 5], [7, 6], [9, 7], [10, 8], [9, 9]],
  [[7, 4], [8, 5], [7, 6], [9, 7], [10, 8], [9, 9], [5, 8], [6, 9], [5, 10]]
];
const insideEgg = (x, y) => {
  const dx2 = 2 * x - 15;
  const dy2 = 2 * y - 17;
  return dx2 * dx2 * 36 + dy2 * dy2 * 25 <= 3600;
};
const drawEgg = (cracks) => {
  const egg = blankGrid(PET_SIZE, PET_SIZE);
  for (let y = 0; y < PET_SIZE; y++) {
    for (let x = 0; x < PET_SIZE; x++) {
      if (!insideEgg(x, y)) continue;
      const bottomRight = !insideEgg(x + 1, y) || !insideEgg(x, y + 1);
      egg[y][x] = bottomRight ? C.silver : C.white;
    }
  }
  for (const [x, y] of [[6, 6], [9, 10], [5, 11]]) setCell(egg, x, y, C.sky);
  for (const [x, y] of CRACKS[cracks]) setCell(egg, x, y, C.ink);
  const outlined = egg.map((row) => [...row]);
  for (let y = 0; y < PET_SIZE; y++) {
    for (let x = 0; x < PET_SIZE; x++) {
      if (egg[y][x] !== null) continue;
      const touches = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(
        ([dx, dy]) => inBounds(egg, x + dx, y + dy) && egg[y + dy][x + dx] !== null
      );
      if (touches) outlined[y][x] = C.ink;
    }
  }
  return outlined;
};
const drawEggScene = (cracks, frame = 0) => {
  const scene = blankGrid(SCENE_W, SCENE_H);
  drawGround(scene);
  const wobble = cracks > 0 && frame % 2 === 1 ? 1 : 0;
  const egg = drawEgg(cracks);
  for (let y = 0; y < PET_SIZE - 1; y++) {
    for (let x = 0; x < PET_SIZE; x++) {
      const cell = egg[y][x];
      if (cell !== null) setCell(scene, 8 + x + wobble, y, cell);
    }
  }
  return scene;
};

// ../../packages/core/src/genes.ts
const opt = (value, weight, minTier = "common") => ({ value, weight, minTier });
const POOLS = {
  family: [opt("mochi", 40), opt("critter", 40), opt("sprout", 20)],
  halfW: [opt(5, 1), opt(6, 2), opt(7, 1)],
  halfH: [opt(5, 1), opt(6, 2), opt(7, 1)],
  ramp: [
    opt("ember", 30),
    opt("moss", 30),
    opt("ocean", 30),
    opt("frost", 20, "uncommon"),
    opt("ghost", 20, "uncommon"),
    opt("jam", 20, "rare"),
    opt("gold", 10, "epic"),
    opt("aurora", 10, "legendary")
  ],
  pattern: [
    opt("none", 60),
    opt("spots", 40),
    opt("freckles", 4),
    opt("stripes", 30, "uncommon"),
    opt("stars", 20, "rare"),
    opt("constellation", 10, "epic")
  ],
  belly: [opt(true, 60), opt(false, 40)],
  eyes: [
    opt("dot", 40),
    opt("big", 40),
    opt("wide", 30),
    opt("heart", 4),
    opt("sleepy", 20, "uncommon"),
    opt("glint", 10, "rare")
  ],
  blush: [opt(true, 50), opt(false, 50)],
  head: [
    opt("none", 30),
    opt("round", 30),
    opt("pointy", 30),
    opt("bunny", 20, "uncommon"),
    opt("horns", 10, "rare")
  ]
};
const HAT_BY_TIER = {
  common: "none",
  uncommon: "none",
  rare: "none",
  epic: "bow",
  legendary: "crown"
};
const MARK_MOTIFS = ["dot", "star", "heart", "scar", "sparkle", "swirl"];
const MARK_SPOTS = ["left-cheek", "right-cheek", "forehead", "belly"];

// ../../packages/core/src/odds.ts
const TIERS = ["common", "uncommon", "rare", "epic", "legendary"];
const BP = 1e4;
const TIER_BP = { common: 4e3, uncommon: 3e3, rare: 1800, epic: 900, legendary: 300 };
const SHINY_BP = 400;
const isTier = (x) => typeof x === "string" && TIERS.includes(x);
const tierRank = (t) => TIERS.indexOf(t);
const tierProbability = (t) => TIER_BP[t] / BP;

// ../../packages/core/src/genome.ts
const PATTERN_VARIANTS = 16;
const SHINY_PROBABILITY = SHINY_BP / BP;
const MARK_PROBABILITY = 1 / (MARK_MOTIFS.length * MARK_SPOTS.length);
const eligible = (pool, tier) => pool.filter((o) => tierRank(o.minTier) <= tierRank(tier));
const pick = (rng, pool, tier) => {
  const options = eligible(pool, tier);
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = pickIndex(rng, total);
  for (const o of options) {
    if (r < o.weight) return o.value;
    r -= o.weight;
  }
  return options[options.length - 1].value;
};
const conditional = (pool, tier, value) => {
  const options = eligible(pool, tier);
  const match = options.find((o) => o.value === value);
  return match ? match.weight / options.reduce((s, o) => s + o.weight, 0) : 0;
};
const table = (values, given) => new Map(values.map((v) => [v, TIERS.reduce((sum, t) => sum + tierProbability(t) * given(t, v), 0)]));
const poolTable = (pool) => table(pool.map((o) => String(o.value)), (t, v) => conditional(pool, t, pool.find((o) => String(o.value) === v).value));
const sproutGiven = (t) => conditional(POOLS.family, t, "sprout");
const ODDS = {
  family: poolTable(POOLS.family),
  ramp: poolTable(POOLS.ramp),
  pattern: poolTable(POOLS.pattern),
  eyes: poolTable(POOLS.eyes),
  head: table([...POOLS.head.map((o) => o.value), "leaf"], (t, v) => {
    if (v === "leaf") return sproutGiven(t);
    const head = HAT_BY_TIER[t] === "none" ? conditional(POOLS.head, t, v) : v === "none" ? 1 : 0;
    return (1 - sproutGiven(t)) * head;
  }),
  hat: table([...new Set(Object.values(HAT_BY_TIER))], (t, v) => HAT_BY_TIER[t] === v ? 1 : 0)
};
const markLabel = (m) => `${m.motif} on ${m.spot.replace("-", " ")}`;
const traitOdds = (g) => {
  const of = (gene, value) => ({ gene, value, probability: ODDS[gene].get(value) ?? 0 });
  const odds = [
    of("family", g.family),
    of("ramp", g.ramp),
    of("pattern", g.pattern),
    of("eyes", g.eyes),
    of("head", g.head),
    of("hat", g.hat),
    { gene: "mark", value: markLabel(g.mark), probability: MARK_PROBABILITY }
  ];
  if (g.shiny) odds.push({ gene: "shiny", value: "shiny", probability: SHINY_PROBABILITY });
  return odds;
};
const rarestTrait = (g) => traitOdds(g).reduce((min, t) => t.probability < min.probability ? t : min);
const genome = (seed, tier, shiny) => {
  if (!isTier(tier)) throw new RangeError(`unknown tier: ${String(tier)}`);
  const normalized = seed >>> 0;
  const rng = mulberry32(normalized);
  const family = pick(rng, POOLS.family, tier);
  const g = {
    seed: normalized,
    tier,
    shiny,
    family,
    halfW: pick(rng, POOLS.halfW, tier),
    halfH: pick(rng, POOLS.halfH, tier),
    ramp: pick(rng, POOLS.ramp, tier),
    pattern: pick(rng, POOLS.pattern, tier),
    belly: pick(rng, POOLS.belly, tier),
    eyes: pick(rng, POOLS.eyes, tier),
    blush: pick(rng, POOLS.blush, tier),
    head: pick(rng, POOLS.head, tier),
    hat: HAT_BY_TIER[tier],
    mark: { motif: MARK_MOTIFS[pickIndex(rng, MARK_MOTIFS.length)], spot: MARK_SPOTS[pickIndex(rng, MARK_SPOTS.length)] },
    patternVariant: pickIndex(rng, PATTERN_VARIANTS)
  };
  if (family === "sprout") g.head = "leaf";
  if (g.hat !== "none" && family !== "sprout") g.head = "none";
  return g;
};

// ../../packages/core/src/progression.ts
const HOUR_MS = 36e5;
const SYNC_GRACE_MS = 3 * HOUR_MS;
const FIRST_SYNC_LOOKBACK_MS = 24 * HOUR_MS;
const MAX_LEVEL = 99;
const XP_PER_EVENT = { pet: 2, turn: 3, check_pass: 2, commit: 2, error: 0 };
const CAPS_PER_HOUR = { pet: 5, turn: 20, check_pass: 20, commit: 10 };
const hourOf = (at) => Math.floor(at / HOUR_MS);
const isEventType = (t) => typeof t === "string" && Object.prototype.hasOwnProperty.call(XP_PER_EVENT, t);
const scoreEvents = (events, windows, now, lastSyncAt) => {
  if (!Array.isArray(events) || !Number.isFinite(now) || lastSyncAt !== null && !Number.isFinite(lastSyncAt)) {
    return { xpGained: 0, windows: Object.fromEntries(Object.entries(windows).map(([h2, w]) => [h2, { ...w }])), accepted: 0 };
  }
  const oldest = lastSyncAt === null ? now - FIRST_SYNC_LOOKBACK_MS : lastSyncAt - SYNC_GRACE_MS;
  const next = Object.fromEntries(Object.entries(windows).map(([h2, w]) => [h2, { ...w }]));
  let xpGained = 0;
  let accepted = 0;
  for (const e of events) {
    if (!e || typeof e !== "object") continue;
    if (!isEventType(e.type) || !Number.isFinite(e.at) || e.at > now || e.at < oldest) continue;
    if (e.type === "error") continue;
    const hour = hourOf(e.at);
    const window = next[hour] ??= {};
    const used = window[e.type] ?? 0;
    if (used >= CAPS_PER_HOUR[e.type]) continue;
    window[e.type] = used + 1;
    xpGained += XP_PER_EVENT[e.type];
    accepted++;
  }
  return { xpGained, windows: next, accepted };
};
const xpToNext = (level) => Math.round(10 * level ** 1.4);
const levelFromXp = (xp) => {
  const safe = Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;
  let level = 1;
  let rest = safe;
  while (rest >= xpToNext(level) && level < MAX_LEVEL) {
    rest -= xpToNext(level);
    level++;
  }
  return { level, intoLevel: rest, toNext: xpToNext(level) };
};
const stageForLevel = (level) => level >= 25 ? "adult" : level >= 10 ? "teen" : "baby";

// src/pet.ts
const DEFAULT_NAME = "Nibbl";
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const isInt = (v, min, max = Number.MAX_SAFE_INTEGER) => typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;
const isText = (v) => v === null || typeof v === "string";
const isServerPet = (v) => {
  if (typeof v !== "object" || v === null) return false;
  const p = v;
  return isInt(p.serial, 1, 999999) && typeof p.token === "string" && TOKEN.test(p.token) && isInt(p.seed, -(2 ** 31), 4294967295) && isTier(p.tier) && typeof p.shiny === "boolean" && typeof p.genesis === "boolean" && isInt(p.hatchedAt, 0) && isText(p.name) && isText(p.label) && isInt(p.xp, 0) && isInt(p.level, 1) && isInt(p.heartsHour, 0) && isInt(p.heartsUsed, 0, 5) && (p.lastSyncAt === null || isInt(p.lastSyncAt, 0));
};
const spikePetOf = (v) => {
  if (typeof v !== "object" || v === null) return null;
  const p = v;
  if ("serial" in p) return null;
  if (!isInt(p.seed, -(2 ** 31), 4294967295) || !isTier(p.tier) || typeof p.shiny !== "boolean") return null;
  return {
    seed: p.seed >>> 0,
    tier: p.tier,
    shiny: p.shiny,
    hatchedAt: isInt(p.hatchedAt, 0) ? p.hatchedAt : 0,
    xp: isInt(p.xp, 0) ? p.xp : 0,
    name: typeof p.name === "string" && p.name.length > 0 ? p.name : DEFAULT_NAME
  };
};
const fromOwnerView = (body, token, now) => {
  const pet = {
    serial: body.serial,
    token,
    seed: body.seed,
    tier: body.tier,
    shiny: body.shiny,
    genesis: body.genesis,
    hatchedAt: body.hatchedAt,
    name: body.name ?? null,
    label: body.label ?? null,
    xp: body.xp,
    level: body.level,
    heartsHour: Math.floor(now / HOUR_MS),
    heartsUsed: 0,
    lastSyncAt: null
  };
  return isServerPet(pet) ? { ...pet, seed: pet.seed >>> 0 } : null;
};
const displayName = (name) => name && name.length > 0 ? name : DEFAULT_NAME;
const padSerial = (serial) => String(serial).padStart(6, "0");
const exportCode = (p) => `nibbl1:${p.serial}:${p.token}`;
const CODE = /^nibbl1:(\d{1,6}):([A-Za-z0-9_-]{43})$/;
const parseCode = (raw) => {
  const m = CODE.exec(raw.trim());
  if (!m) return null;
  const serial = Number(m[1]);
  return serial >= 1 ? { serial, token: m[2] } : null;
};
const viewOf = (pet, xp, heartsHour, heartsUsed) => "serial" in pet ? {
  serial: pet.serial,
  seed: pet.seed,
  tier: pet.tier,
  shiny: pet.shiny,
  genesis: pet.genesis,
  name: displayName(pet.name),
  label: pet.label,
  xp,
  heartsHour,
  heartsUsed
} : { serial: null, seed: pet.seed, tier: pet.tier, shiny: pet.shiny, genesis: false, name: pet.name, label: null, xp, heartsHour, heartsUsed };

// src/reactions.ts
const CALM = { bugs: 0, mood: "idle", moodUntil: 0, heartUntil: 0, lootUntil: 0, boxUntil: 0, awaySince: 0, lastActiveAt: 0 };
const onTurnStart = (r, now) => ({ ...r, awaySince: r.awaySince || now, lastActiveAt: now });
const onTurnEnd = (r, now, isAnswer) => ({
  ...r,
  awaySince: 0,
  lootUntil: isAnswer ? now + LOOT_MS : r.lootUntil,
  lastActiveAt: now
});
const onError = (r, now) => ({
  ...r,
  bugs: Math.min(MAX_BUGS, r.bugs + 1),
  mood: "sad",
  moodUntil: now + MOOD_MS,
  lastActiveAt: now
});
const onCheckPass = (r, now) => ({ ...r, bugs: 0, mood: "happy", moodUntil: now + MOOD_MS, lastActiveAt: now });
const onCommit = (r, now) => ({ ...r, boxUntil: now + BOX_MS, lastActiveAt: now });
const onPet = (r, now) => ({ ...r, heartUntil: now + HEART_MS, lastActiveAt: now });
const onActive = (r, now) => ({ ...r, lastActiveAt: now });
const parseUtcOffset = (stdout) => {
  const m = /^([+-])(\d{2})(\d{2})$/.exec(stdout.trim());
  if (!m) return null;
  const minutes = Number(m[2]) * 60 + Number(m[3]);
  return m[1] === "-" ? -minutes : minutes;
};
const localHour = (now, offsetMin) => {
  const minutes = Math.floor(now / 6e4) + offsetMin;
  const ofDay = (minutes % 1440 + 1440) % 1440;
  return Math.floor(ofDay / 60);
};
const isNight = (now, offsetMin) => {
  const hour = localHour(now, offsetMin);
  return hour >= NIGHT_FROM_HOUR && hour < NIGHT_TO_HOUR;
};
const lookOf = (r, now, offsetMin) => {
  if (r.awaySince > 0) return "away";
  if (r.mood === "sad" && now < r.moodUntil) return "oops";
  if (now < r.heartUntil) return "loved";
  if (r.mood === "happy" && now < r.moodUntil) return "yum";
  if (now < r.boxUntil) return "shipped";
  if (now < r.lootUntil) return "loot";
  if (r.lastActiveAt > 0 && now - r.lastActiveAt > SLEEP_AFTER_MS) return "zzz";
  if (isNight(now, offsetMin)) return "night";
  return "chilling";
};
const STATUS = {
  oops: "oops, a bug",
  loved: "loved that",
  yum: "yum, bugs eaten",
  shipped: "shipped a commit",
  loot: "back with loot",
  zzz: "zzz",
  night: "nightcap on",
  chilling: "chilling"
};
const clockText = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1e3));
  const seconds = String(total % 60).padStart(2, "0");
  const minutes = Math.floor(total / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${seconds}` : `${minutes}:${seconds}`;
};
const statusText = (look, now, awaySince) => look === "away" ? `\u26CF on expedition ${clockText(now - awaySince)}` : STATUS[look];
const sceneKeyOf = (r, stage, anim, now, offsetMin) => {
  const look = lookOf(r, now, offsetMin);
  const isWalking = anim.petX !== (r.awaySince > 0 ? AWAY_X : HOME_X);
  const isSleeping = look === "zzz";
  const night = isNight(now, offsetMin);
  const hasLoot = now < r.lootUntil;
  let expression = anim.blink ? "blink" : "idle";
  if (look === "oops") expression = "sad";
  else if (look === "loved" || look === "yum") expression = "happy";
  else if (isSleeping) expression = "sleep";
  else if (night && anim.frame % 16 < 2) expression = "surprised";
  return {
    stage,
    expression,
    petX: anim.petX,
    // loot and zzz write at fixed scene rows, so the pet never hops while either shows
    lift: isSleeping || hasLoot ? 0 : isWalking ? anim.frame % 2 : Math.floor(anim.frame / 2) % 2,
    bugs: r.bugs,
    heart: now < r.heartUntil,
    frame: anim.frame % 2,
    away: r.awaySince > 0 && !isWalking,
    loot: hasLoot,
    box: now < r.boxUntil,
    nightcap: night,
    zzz: isSleeping
  };
};
const stepAnim = (anim, r, roll) => {
  const target = r.awaySince > 0 ? AWAY_X : HOME_X;
  const petX = anim.petX < target ? anim.petX + 1 : anim.petX > target ? anim.petX - 1 : anim.petX;
  return { frame: (anim.frame + 1) % 1e5, petX, blink: !anim.blink && roll < 0.08 };
};

// src/hud.ts
const xpBar = (into, toNext, width = 5) => {
  const filled = toNext > 0 ? Math.min(width, Math.round(width * into / toNext)) : 0;
  return "\u2593".repeat(filled) + "\u2591".repeat(width - filled);
};
const heartsBar = (left, max = CAPS_PER_HOUR.pet) => "\u2665".repeat(left) + "\u2661".repeat(Math.max(0, max - left));
const pct = (p) => {
  const v = p * 100;
  return v >= 10 ? v.toFixed(0) : v >= 1 ? v.toFixed(1) : v.toFixed(2);
};
const rarestLine = (g) => {
  const t = rarestTrait(g);
  const label = t.gene === "mark" || t.gene === "shiny" ? t.value : `${t.value} ${t.gene}`;
  return `${label} ${pct(t.probability)}% odds`;
};
const tierText = (p) => `${p.tier}${p.shiny ? " \xB7 shiny" : ""}${p.genesis ? " \xB7 Genesis" : ""}`;
const serialOf = (p) => typeof p.serial === "number" && Number.isInteger(p.serial) ? p.serial : null;
const titleOf = (p) => {
  const serial = serialOf(p);
  return serial === null ? `${p.name} \xB7 syncing` : `${p.name} #${padSerial(serial)}${p.label ? ` \xB7 ${p.label}` : ""}`;
};
const xpLineOf = (xp) => {
  const lv = levelFromXp(xp);
  return `lvl ${lv.level}  ${xpBar(lv.intoLevel, lv.toNext)} ${lv.intoLevel}/${lv.toNext}`;
};
const heartsLeftOf = (p, now) => Math.floor(now / HOUR_MS) === p.heartsHour ? Math.max(0, CAPS_PER_HOUR.pet - p.heartsUsed) : CAPS_PER_HOUR.pet;
const hudLines = (view, turns, r, now, tz) => {
  if (!view) {
    const shown = Math.min(turns, HATCH_AFTER_TURNS);
    const status2 = turns >= HATCH_AFTER_TURNS ? "hatching..." : "keep working to hatch it";
    return { title: "Egg", xp: `turns ${shown}/${HATCH_AFTER_TURNS}`, hearts: "", status: status2, compact: `Egg \xB7 turns ${shown}/${HATCH_AFTER_TURNS} \xB7 ${status2}` };
  }
  const hearts = heartsBar(heartsLeftOf(view, now));
  const status = statusText(lookOf(r, now, tz), now, r.awaySince);
  const serial = serialOf(view);
  const short = serial === null ? view.name : `${view.name} #${padSerial(serial)}`;
  return { title: titleOf(view), xp: xpLineOf(view.xp), hearts, status, compact: `${short} \xB7 lvl ${levelFromXp(view.xp).level} ${hearts} \xB7 ${status}` };
};
const hudKey = (lines) => Object.values(lines).join("\n");
const utcText = (at) => `${new Date(at).toISOString().slice(0, 16).replace("T", " ")} UTC`;
const cardUrl = (base, serial) => `${base}/p/${serial}`;
const boardUrl = (base, serial) => `${base}/leaderboard/?me=${serial}`;
const statsText = (view, g, now, sync) => {
  const lv = levelFromXp(view.xp);
  const lines = [
    titleOf(view),
    tierText(view),
    `lvl ${lv.level}, ${view.xp} xp (${lv.intoLevel}/${lv.toNext} to next)  ${xpBar(lv.intoLevel, lv.toNext)}`,
    `hearts this hour: ${heartsBar(heartsLeftOf(view, now))}`,
    `rarest trait: ${rarestLine(g)}`
  ];
  const serial = serialOf(view);
  if (serial === null) lines.push("not on the server yet: it links on the next hatch call");
  else lines.push(`card: ${cardUrl(sync.base, serial)}`, `leaderboard: ${boardUrl(sync.base, serial)}`);
  const waiting = `${sync.pending} event${sync.pending === 1 ? "" : "s"} waiting`;
  lines.push(`sync: ${waiting}, ${sync.lastSyncAt === null ? "never synced" : `last sync ${utcText(sync.lastSyncAt)}`}`);
  return lines.join("\n");
};
const eggStatsText = (turns) => `Egg: ${Math.min(turns, HATCH_AFTER_TURNS)}/${HATCH_AFTER_TURNS} answered turns. It hatches after ${HATCH_AFTER_TURNS}.`;
const oddsText = (view, g) => {
  const lines = [
    "Hatch odds (rolled on the server, the same for everyone):",
    TIERS.map((t) => `${t} ${TIER_BP[t] / 100}%`).join(" \xB7 "),
    `shiny ${SHINY_BP / 100}% on top of any tier`
  ];
  if (!view || !g) return [...lines, "Your egg shows its traits when it hatches."].join("\n");
  lines.push(`${view.name}'s traits:`);
  for (const t of traitOdds(g)) lines.push(`  ${t.gene} ${t.value} ${pct(t.probability)}%`);
  lines.push(`rarest: ${rarestLine(g)}`);
  return lines.join("\n");
};

// src/identity.ts
const HEX = "0123456789abcdef";
const toHex = (buffer) => {
  let out = "";
  for (const byte of new Uint8Array(buffer)) out += HEX[byte >> 4] + HEX[byte & 15];
  return out;
};
const sha256Hex = async (text) => toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
const machineHashOf = (platformId) => sha256Hex(`${platformId}nibbl`);
const parseIoreg = (stdout) => /"IOPlatformUUID" = "([0-9A-F-]+)"/.exec(stdout)?.[1] ?? null;
const parseMachineId = (text) => {
  const id = text.trim();
  return /^[0-9a-f]{32}$/.test(id) ? id : null;
};
const parseMachineGuid = (stdout) => /MachineGuid\s+REG_SZ\s+([0-9A-Fa-f-]{36})/.exec(stdout)?.[1] ?? null;
const readPlatformId = async ($) => {
  try {
    const mac = await $.process.run(["ioreg", "-rd1", "-c", "IOPlatformExpertDevice"], { timeoutMs: 5e3 });
    const id = mac.exitCode === 0 ? parseIoreg(mac.stdout) : null;
    if (id) return id;
  } catch {
  }
  try {
    const id = parseMachineId(await $.fs.read("/etc/machine-id"));
    if (id) return id;
  } catch {
  }
  try {
    const id = parseMachineId(await $.fs.read("/var/lib/dbus/machine-id"));
    if (id) return id;
  } catch {
  }
  try {
    const win = await $.process.run(["reg", "query", "HKLM\\SOFTWARE\\Microsoft\\Cryptography", "/v", "MachineGuid"], { timeoutMs: 5e3 });
    const id = win.exitCode === 0 ? parseMachineGuid(win.stdout) : null;
    if (id) return id;
  } catch {
  }
  return null;
};
const HASH = /^[0-9a-f]{64}$/;
const machineIdentity = async ($) => {
  const saved = await $.store.get(K.installId);
  const pet = await $.store.get(K.pet);
  const installSerial = await $.store.get(K.installSerial);
  if (typeof saved === "string" && saved.length >= 16 && installSerial !== void 0 && pet?.serial === installSerial) {
    return { hash: await machineHashOf(saved), source: "install" };
  }
  const cached = await $.store.get(K.machineHash);
  if (typeof cached === "string" && HASH.test(cached)) return { hash: cached, source: "cache" };
  const platformId = await readPlatformId($);
  if (platformId) {
    const hash = await machineHashOf(platformId);
    await $.store.set(K.machineHash, hash);
    return { hash, source: "platform" };
  }
  if (typeof saved === "string" && saved.length >= 16) return { hash: await machineHashOf(saved), source: "install" };
  const fresh = crypto.randomUUID();
  await $.store.set(K.installId, fresh);
  return { hash: await machineHashOf(fresh), source: "install" };
};

// src/model.ts
import { read, update } from "claude-code";

// src/queue.ts
const TYPES = ["pet", "turn", "check_pass", "commit", "error", "hide"];
const emptyQueue = (now) => ({ beat: now, next: 1, events: [] });
const queueOf = (v) => {
  if (typeof v !== "object" || v === null) return null;
  const q = v;
  if (!Number.isFinite(q.beat) || !Number.isInteger(q.next) || !Array.isArray(q.events)) return null;
  const events = q.events.filter(
    (e) => typeof e === "object" && e !== null && TYPES.includes(e.type) && Number.isFinite(e.at) && Number.isInteger(e.n) && Number.isFinite(e.g)
  );
  let maxN = 0;
  for (const e of events) maxN = Math.max(maxN, e.n);
  return { beat: q.beat, next: Math.max(q.next, maxN + 1), events: events.length > QUEUE_CAP ? events.slice(events.length - QUEUE_CAP) : events };
};
const append = (q, type, at, g, cap = QUEUE_CAP) => {
  const events = [...q.events, { type, at, n: q.next, g }];
  return { beat: at, next: q.next + 1, events: events.length > cap ? events.slice(events.length - cap) : events };
};
const toWire = (events) => events.map((e) => ({ type: e.type, at: e.at }));
const takeBatch = (queues, max = MAX_BATCH) => {
  const upTo = {};
  const lines = Object.entries(queues).map(([key, q]) => ({ key, events: [...q.events].sort((x, y) => x.n - y.n), i: 0 }));
  const events = [];
  while (events.length < max) {
    let pick2 = null;
    for (const line of lines) {
      const head = line.events[line.i];
      if (head && (!pick2 || head.at < pick2.events[pick2.i].at)) pick2 = line;
    }
    if (!pick2) break;
    const e = pick2.events[pick2.i++];
    upTo[pick2.key] = e.n;
    events.push(e);
  }
  events.sort((x, y) => x.at - y.at);
  return { events, upTo };
};
const removeUpTo = (q, n) => ({ ...q, events: q.events.filter((e) => e.n > n) });
const keepNewest = (q, count) => ({ ...q, events: q.events.slice(Math.max(0, q.events.length - count)) });
const pendingGain = (queues) => {
  let sum = 0;
  for (const q of queues) for (const e of q.events) sum += e.g;
  return sum;
};
const countEvents = (queues) => {
  let n = 0;
  for (const q of queues) n += q.events.length;
  return n;
};
const localWindows = (base, queues, now, lastSyncAt) => {
  const events = [];
  for (const q of queues) for (const e of q.events) if (e.type !== "hide") events.push({ type: e.type, at: e.at });
  events.sort((a, b) => a.at - b.at);
  const start2 = base.heartsUsed > 0 ? { [base.heartsHour]: { pet: base.heartsUsed } } : {};
  return scoreEvents(events, start2, now, lastSyncAt).windows;
};
const gainFor = (type, at, windows, lastSyncAt) => type === "hide" ? 0 : scoreEvents([{ type, at }], windows, at, lastSyncAt).xpGained;
const heartsUsedAt = (windows, now) => Math.min(CAPS_PER_HOUR.pet, windows[Math.floor(now / HOUR_MS)]?.pet ?? 0);
const isOrphan = (q, now) => now - q.beat >= ORPHAN_MS;
const sendable = (all, own, now) => Object.fromEntries(Object.entries(all).filter(([key, q]) => key === own || isOrphan(q, now)));
const isSyncDue = (lastSyncAt, pending, now) => pending > 0 && (lastSyncAt === null || now - lastSyncAt >= SYNC_EVERY_MS || pending >= SYNC_SOON_PENDING);

// src/state.ts
import { atom } from "claude-code";
const loadedAtom = atom({ plugin: "nibbl", key: "v1.loaded" }, false);
const petAtom = atom({ plugin: "nibbl", key: "v1.pet" }, null);
const eggAtom = atom({ plugin: "nibbl", key: "v1.eggTurns" }, 0);
const hiddenAtom = atom({ plugin: "nibbl", key: "v1.hidden" }, false);
const reactAtom = atom({ plugin: "nibbl", key: "v1.react" }, CALM);
const tzAtom = atom({ plugin: "nibbl", key: "v1.tzOffsetMin" }, 0);

// src/store.ts
const loadPet = async ($) => {
  const v = await $.store.get(K.pet);
  return isServerPet(v) ? v : null;
};
const savePet = async ($, pet) => {
  await $.store.set(K.pet, pet);
};
const loadSpike = async ($) => spikePetOf(await $.store.get(K.spikePet));
const forgetSpike = async ($) => {
  for (const key of SPIKE_KEYS) await $.store.delete(key);
};
const loadEggTurns = async ($) => {
  for (const key of [K.egg, K.spikeEggTurns]) {
    const turns = await $.store.get(key);
    if (typeof turns === "number" && Number.isInteger(turns) && turns >= 0) return turns;
  }
  return 0;
};
const loadWait = async ($, key) => {
  const v = await $.store.get(key);
  return isWait(v) ? v : null;
};
const queueKey = (sid) => `${QUEUE_PREFIX}${sid}`;
const loadQueues = async ($) => {
  const out = {};
  for (const key of await $.store.keys()) {
    if (!key.startsWith(QUEUE_PREFIX)) continue;
    const q = queueOf(await $.store.get(key));
    if (q) out[key] = q;
  }
  return out;
};
const dropQueues = async ($) => {
  for (const key of await $.store.keys()) if (key.startsWith(QUEUE_PREFIX)) await $.store.delete(key);
};
const editQueue = ($, key, edit) => {
  const run = rt.queueChain.then(async () => {
    const next = await edit(queueOf(await $.store.get(key)));
    if (next) await $.store.set(key, next);
    else await $.store.delete(key);
    return next;
  });
  rt.queueChain = run.catch(() => void 0);
  return run;
};
const isLease = (v) => typeof v === "object" && v !== null && typeof v.owner === "string" && Number.isFinite(v.until);
const tryLease = async ($, owner, now) => {
  const held = await $.store.get(K.lease);
  if (isLease(held) && held.owner !== owner && held.until > now) return false;
  await $.store.set(K.lease, { owner, until: now + LEASE_MS });
  const check = await $.store.get(K.lease);
  return isLease(check) && check.owner === owner;
};
const releaseLease = async ($, owner) => {
  const held = await $.store.get(K.lease);
  if (isLease(held) && held.owner === owner) await $.store.delete(K.lease);
};

// src/model.ts
const refreshView = async ($, announce = false) => {
  const now = await $.clock.now();
  const pet = await loadPet($);
  const spike = pet ? null : await loadSpike($);
  const queues = Object.values(await loadQueues($));
  const hour = Math.floor(now / HOUR_MS);
  let view = null;
  if (pet) view = viewOf(pet, pet.xp + pendingGain(queues), hour, heartsUsedAt(localWindows(pet, queues, now, pet.lastSyncAt), now));
  else if (spike) view = viewOf(spike, spike.xp + pendingGain(queues), hour, heartsUsedAt(localWindows({ heartsHour: hour, heartsUsed: 0 }, queues, now, null), now));
  const prev = await read($, petAtom);
  await update($, petAtom, () => view);
  if (announce && prev && view && prev.serial === view.serial) {
    const was = levelFromXp(prev.xp).level;
    const is = levelFromXp(view.xp).level;
    if (is > was) $.ui.toast(`${view.name} reached level ${is}!`);
  }
  return view;
};
const ensureLoaded = async ($) => {
  if (await read($, loadedAtom)) return;
  const isHidden = await $.store.get(K.hidden) === true;
  const turns = await loadEggTurns($);
  await update($, hiddenAtom, () => isHidden);
  await update($, eggAtom, () => turns);
  await refreshView($);
  await update($, loadedAtom, () => true);
};

// src/cells.ts
const TERMINAL_DEFAULT = 16777216;
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const toBase64 = (bytes) => {
  let out = "";
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
    out += B64[n >> 18 & 63] + B64[n >> 12 & 63] + B64[n >> 6 & 63] + B64[n & 63];
  }
  const rest = bytes.length - i;
  if (rest === 1) {
    const n = bytes[i] << 16;
    out += B64[n >> 18 & 63] + B64[n >> 12 & 63] + "==";
  } else if (rest === 2) {
    const n = bytes[i] << 16 | bytes[i + 1] << 8;
    out += B64[n >> 18 & 63] + B64[n >> 12 & 63] + B64[n >> 6 & 63] + "=";
  }
  return out;
};
const rgbOf = (index) => {
  if (index === null) return TERMINAL_DEFAULT;
  const rgb = SWEETIE_RGB[index];
  return rgb ? rgb[0] << 16 | rgb[1] << 8 | rgb[2] : TERMINAL_DEFAULT;
};
const writeU32 = (out, offset, v) => {
  out[offset] = v & 255;
  out[offset + 1] = v >>> 8 & 255;
  out[offset + 2] = v >>> 16 & 255;
  out[offset + 3] = v >>> 24 & 255;
};
const encodeRaster = (pairs) => {
  const rows = pairs.length;
  const columns = pairs[0]?.length ?? 0;
  const out = new Uint8Array(rows * columns * 12);
  let o = 0;
  for (const row of pairs) {
    for (const cell of row) {
      writeU32(out, o, cell.glyph.codePointAt(0) ?? 32);
      writeU32(out, o + 4, rgbOf(cell.fg));
      writeU32(out, o + 8, rgbOf(cell.bg));
      o += 12;
    }
  }
  return { columns, rows, cells: toBase64(out) };
};

// src/scene.ts
const genomes = /* @__PURE__ */ new Map();
const genomeOf = (seed, tier, shiny) => {
  const key = `${seed}.${tier}.${shiny ? 1 : 0}`;
  let g = genomes.get(key);
  if (!g) {
    g = genome(seed, tier, shiny);
    genomes.set(key, g);
  }
  return g;
};
const cache = /* @__PURE__ */ new Map();
const remember = (id, make) => {
  let cells = cache.get(id);
  if (!cells) {
    if (cache.size > 512) cache.clear();
    cells = make();
    cache.set(id, cells);
  }
  return cells;
};
const petCells = (g, key) => {
  const id = `${g.seed}.${g.tier}.${g.shiny ? 1 : 0}|${JSON.stringify(key)}`;
  return { id, cells: remember(id, () => encodeRaster(toCellPairs(drawScene(g, key)))) };
};
const eggCracks = (turns) => Math.max(0, Math.min(3, Math.floor(turns * 3 / HATCH_AFTER_TURNS)));
const eggCells = (turns, frame) => {
  const cracks = eggCracks(turns);
  const id = `egg|${cracks}|${frame % 2}`;
  return { id, cells: remember(id, () => encodeRaster(toCellPairs(drawEggScene(cracks, frame % 2)))) };
};
const frameOf = (view, turns, r, anim, now, tz) => {
  const lines = hudLines(view, turns, r, now, tz);
  const hud = `${lines.status}|${lines.hearts}`;
  if (!view) return { ...eggCells(turns, anim.frame), hud };
  const g = genomeOf(view.seed, view.tier, view.shiny);
  return { ...petCells(g, sceneKeyOf(r, stageForLevel(levelFromXp(view.xp).level), anim, now, tz)), hud };
};

// src/hatch.ts
const hatchNow = async ($, why, opts = {}) => {
  if (rt.isHatching) return "busy";
  rt.isHatching = true;
  let owner = null;
  try {
    const now = await $.clock.now();
    const wait = await loadWait($, K.hatchWait);
    if (wait && wait.until > now) return "waiting";
    if (!opts.isLeased) {
      const sid = await $.session.id();
      if (!await tryLease($, sid, now)) return "busy";
      owner = sid;
    }
    const id = await machineIdentity($);
    if (id.source === "install") {
      const here = await loadPet($);
      const isFreshEgg = why === "egg" && here === null && await loadSpike($) === null;
      const isInstallPet = why === "reauth" && here !== null && await $.store.get(K.installSerial) === here.serial;
      if (!isFreshEgg && !isInstallPet) {
        const next = backoff(wait, now);
        await $.store.set(K.hatchWait, next);
        $.ui.log(`nibbl: hatch (${why}) held: no platform id; next try after ${new Date(next.until).toISOString()}`, { to: "debug" });
        return "failed";
      }
    }
    const out = await postWithin($, await apiBase($), "/api/hatch", { machineHash: id.hash });
    if (out.kind !== "ok") {
      const next = out.kind === "error" && out.status === 429 && out.retryAt !== null ? holdUntil(wait, out.retryAt) : backoff(wait, now);
      await $.store.set(K.hatchWait, next);
      $.ui.log(`nibbl: hatch failed with ${out.kind === "error" ? out.code : out.reason}; next try after ${new Date(next.until).toISOString()}`, { to: "debug" });
      return "failed";
    }
    const fresh = fromOwnerView(out.body, out.body.token, now);
    if (!fresh) {
      await $.store.set(K.hatchWait, backoff(wait, now));
      $.ui.log("nibbl: hatch answered an unexpected shape", { to: "debug" });
      return "failed";
    }
    await $.store.delete(K.hatchWait);
    const old = await loadPet($);
    const isSamePet = old !== null && old.serial === fresh.serial;
    if (why === "reauth" && old && !isSamePet && id.source === "install") {
      $.ui.log("nibbl: re-hatch by install id answered another pet; kept the local one", { to: "debug" });
      return "failed";
    }
    if (why === "reauth" && old && !isSamePet) {
      await $.store.delete(K.pet);
      await dropQueues($);
      await $.store.set(K.egg, 0);
      await update2($, eggAtom, () => 0);
      await refreshView($);
      $.ui.toast(`${displayName(old.name)} #${padSerial(old.serial)} now lives on another machine. A new egg appeared here.`);
      return "moved";
    }
    await savePet($, isSamePet && old ? { ...fresh, heartsHour: old.heartsHour, heartsUsed: old.heartsUsed, lastSyncAt: old.lastSyncAt } : fresh);
    await $.store.delete(K.egg);
    if (id.source === "install") await $.store.set(K.installSerial, fresh.serial);
    else await $.store.delete(K.installSerial);
    await forgetSpike($);
    await update2($, eggAtom, () => 0);
    await refreshView($);
    const name = displayName(fresh.name);
    if (why === "egg") {
      $.ui.toast(`${name} hatched! #${padSerial(fresh.serial)} \xB7 ${tierText(fresh)} \xB7 rarest: ${rarestLine(genomeOf(fresh.seed, fresh.tier, fresh.shiny))}`);
    }
    if (why === "spike") $.ui.toast(`${name} is now #${padSerial(fresh.serial)}, synced with the nibbl server.`);
    return "hatched";
  } finally {
    if (owner !== null) await releaseLease($, owner);
    rt.isHatching = false;
  }
};

// src/messages.ts
const nameErrorText = (field, code, retryAt, now) => {
  const max = field === "name" ? NAME_MAX : LABEL_MAX;
  const reason = code.startsWith(`${field}_`) ? code.slice(field.length + 1) : code;
  if (reason === "empty") return `A ${field} needs at least one letter or digit.`;
  if (reason === "too_long") return `A ${field} is at most ${max} characters.`;
  if (reason === "invalid_chars") {
    return `A ${field} may use letters, digits, spaces and . , ' ! ? & + ( ) _ - only, and may not look like a serial such as #42.`;
  }
  if (reason === "url") return `A ${field} cannot look like a link.`;
  if (reason === "blocked") return `That ${field} is not allowed. Try another one.`;
  if (reason === "rate_limited" && field === "name") {
    return retryAt === null ? "You can rename once a week." : `You can rename once a week. Next rename from ${utcText(retryAt)}.`;
  }
  if (reason === "rate_limited") {
    const seconds = retryAt === null ? 60 : Math.max(1, Math.ceil((retryAt - now) / 1e3));
    return `Labels change at most once a minute. Try again in ${seconds}s.`;
  }
  return `The server answered ${code}. Try again later.`;
};
const importErrorText = (status) => {
  if (status === 401) return "The server did not accept that code. Check it, or export a fresh one on the other machine.";
  if (status === 400) return "The server could not use that code. Check that you copied all of it, or export a fresh one.";
  if (status === 429) return "The server asked for a pause. Try the import again in a while.";
  return "The server could not finish the import. Try again later.";
};

// src/account.ts
const EXPORT_MARK = "Export code for ";
const exportSerialOf = (text) => {
  const m = /^Export code for [^#]* #(\d{6}) /.exec(text);
  return m ? Number(m[1]) : null;
};
const textOrNull = (v) => typeof v === "string" && v.length > 0 ? v : null;
const nameCommand = async ($, field, text) => {
  const pet = await loadPet($);
  if (!pet) {
    if (await loadSpike($)) return "Your nibbl is still linking to the server. Try again in a minute.";
    return field === "name" ? "Hatch the egg first, then name it." : "Hatch the egg first, then give it a label.";
  }
  const max = field === "name" ? NAME_MAX : LABEL_MAX;
  if (field === "name" && text.length === 0) return `Usage: /nibbl name <text>, 1 to ${NAME_MAX} characters.`;
  if ([...text].length > max) return `A ${field} is at most ${max} characters.`;
  const base = await apiBase($);
  const call = (p) => postWithin($, base, "/api/name", { serial: p.serial, token: p.token, [field]: text });
  let sent = pet;
  let out = await call(pet);
  if (out.kind === "error" && out.status === 401) {
    const result = await hatchNow($, "reauth");
    const fresh = result === "hatched" ? await loadPet($) : null;
    if (fresh) {
      sent = fresh;
      out = await call(fresh);
    }
  }
  if (out.kind === "offline") return "Nibbl is offline right now. Try again later.";
  if (out.kind === "error" && out.status === 401) return `Could not reach your pet's account. Try /nibbl ${field} again later.`;
  if (out.kind === "error") return nameErrorText(field, out.code, out.retryAt, await $.clock.now());
  const name = textOrNull(out.body.name);
  const label = textOrNull(out.body.label);
  const latest = await loadPet($);
  if (latest && latest.serial === sent.serial) {
    await savePet($, { ...latest, name, label });
    await refreshView($);
  }
  if (field === "name") return `Renamed to ${displayName(name)}.`;
  return label ? `Label set to "${label}".` : "Label cleared.";
};
const exportCommand = async ($) => {
  const pet = await loadPet($);
  if (!pet) return "Nothing to export yet: hatch the egg first.";
  return `${EXPORT_MARK}${displayName(pet.name)} #${padSerial(pet.serial)} is shown on screen only, not sent to the model. Keep it secret: anyone with it owns your pet. On the other machine run /nibbl import <code>.`;
};
const importCommand = async ($, rest) => {
  const [raw = "", flag = ""] = rest.split(/\s+/);
  const code = parseCode(raw);
  if (!code) return "That does not look like a nibbl code. A code looks like nibbl1:<serial>:<token>, from /nibbl export on the other machine.";
  const old = await loadPet($);
  if (old && old.serial !== code.serial && flag !== "replace") {
    return `This machine already has ${displayName(old.name)} #${padSerial(old.serial)}. Run /nibbl export first and keep its code, then /nibbl import <code> replace.`;
  }
  const spike = old ? null : await loadSpike($);
  if (spike && flag !== "replace") {
    return `This machine already has ${displayName(spike.name)}, still linking to the server. Importing would replace it: run /nibbl import <code> replace if you are sure.`;
  }
  const now = await $.clock.now();
  const id = await machineIdentity($);
  const out = await postWithin($, await apiBase($), "/api/import", { serial: code.serial, token: code.token, machineHash: id.hash });
  if (out.kind === "offline") return "Nibbl is offline right now. Try the import again later.";
  if (out.kind === "error") {
    return importErrorText(out.status);
  }
  const pet = fromOwnerView(out.body, code.token, now);
  if (!pet) return "Import failed: the server answered something unexpected.";
  const isSame = old !== null && old.serial === pet.serial;
  if (!isSame) await dropQueues($);
  await savePet($, isSame && old ? { ...pet, heartsHour: old.heartsHour, heartsUsed: old.heartsUsed, lastSyncAt: old.lastSyncAt } : pet);
  for (const key of [K.egg, K.hatchWait, K.syncWait]) await $.store.delete(key);
  if (id.source === "install") await $.store.set(K.installSerial, pet.serial);
  else await $.store.delete(K.installSerial);
  await forgetSpike($);
  await update3($, eggAtom, () => 0);
  await refreshView($);
  return `${displayName(pet.name)} #${padSerial(pet.serial)} now lives on this machine.`;
};

// src/commands.ts
import { read as read2, update as update5 } from "claude-code";

// src/events.ts
import { update as update4 } from "claude-code";

// src/sync.ts
const isCount = (v) => typeof v === "number" && Number.isInteger(v) && v >= 0;
const fail = async ($, reason, code, next) => {
  await $.store.set(K.syncWait, next);
  $.ui.log(`nibbl: sync (${reason}) failed with ${code}; next try after ${new Date(next.until).toISOString()}`, { to: "debug" });
  return "failed";
};
const clearSent = async ($, upTo) => {
  for (const [key, n] of Object.entries(upTo)) await editQueue($, key, (q) => q ? removeUpTo(q, n) : null);
};
const send = async ($, sid, pet, now, reason, mayReauth = true) => {
  const own = queueKey(sid);
  const all = await loadQueues($);
  for (const [key, q] of Object.entries(all)) if (key !== own && q.events.length === 0 && isOrphan(q, now)) await $.store.delete(key);
  const batch = takeBatch(sendable(all, own, now));
  if (batch.events.length === 0) return "empty";
  const wait = await loadWait($, K.syncWait);
  const out = await postWithin($, await apiBase($), "/api/sync", { serial: pet.serial, token: pet.token, events: toWire(batch.events) });
  if (out.kind === "offline") return fail($, reason, `offline (${out.reason})`, backoff(wait, now));
  if (out.kind === "ok") {
    const { xp, level, heartsLeft } = out.body;
    if (!isCount(xp) || !isCount(level) || !isCount(heartsLeft)) return fail($, reason, "bad_shape", backoff(wait, now));
    const latest = await loadPet($);
    if (!latest || latest.serial !== pet.serial) {
      $.ui.log(`nibbl: sync (${reason}) answer for #${pet.serial} ignored: the pet here changed`, { to: "debug" });
      await $.store.delete(K.syncWait);
      return "synced";
    }
    await savePet($, {
      ...latest,
      xp,
      level,
      heartsHour: Math.floor(now / HOUR_MS),
      heartsUsed: Math.min(5, Math.max(0, 5 - heartsLeft)),
      lastSyncAt: now
    });
    await clearSent($, batch.upTo);
    await $.store.delete(K.syncWait);
    return "synced";
  }
  if ((out.status === 401 || out.code === "invalid_token" || out.code === "invalid_serial") && mayReauth) {
    const result = await hatchNow($, "reauth", { isLeased: true });
    if (result === "moved") return "failed";
    const fresh = result === "hatched" ? await loadPet($) : null;
    return fresh ? send($, sid, fresh, now, reason, false) : fail($, reason, out.code, backoff(wait, now));
  }
  if (out.status === 409) return fail($, reason, out.code, holdUntil(wait, now + CONFLICT_RETRY_MS));
  if (out.status === 429) return fail($, reason, out.code, holdUntil(wait, Math.max(now + 1e3, out.retryAt ?? now + CONFLICT_RETRY_MS)));
  if (out.status === 413) {
    for (const key of Object.keys(batch.upTo)) await editQueue($, key, (q) => q ? keepNewest(q, TRIM_AFTER_413) : null);
    return fail($, reason, out.code, backoff(wait, now));
  }
  if (out.status === 400 && out.code === "invalid_events") {
    await clearSent($, batch.upTo);
    $.ui.log(`nibbl: sync (${reason}) dropped a batch the server called invalid_events`, { to: "debug" });
    return "failed";
  }
  return fail($, reason, out.code, backoff(wait, now));
};
const syncNow = async ($, reason) => {
  if (rt.isSyncing) return "busy";
  rt.isSyncing = true;
  let owner = null;
  try {
    const pet = await loadPet($);
    if (!pet) return "no-pet";
    const now = await $.clock.now();
    const wait = await loadWait($, K.syncWait);
    if (wait && wait.until > now) return "waiting";
    const sid = await $.session.id();
    if (!await tryLease($, sid, now)) return "busy";
    owner = sid;
    const result = await send($, sid, pet, now, reason);
    if (result === "synced") await refreshView($, true);
    return result;
  } finally {
    if (owner !== null) await releaseLease($, owner);
    rt.isSyncing = false;
  }
};
const syncIfDue = async ($) => {
  const pet = await loadPet($);
  if (!pet) return "no-pet";
  const now = await $.clock.now();
  const mine = sendable(await loadQueues($), queueKey(await $.session.id()), now);
  return isSyncDue(pet.lastSyncAt, countEvents(Object.values(mine)), now) ? syncNow($, "schedule") : "not-due";
};

// src/events.ts
const react = async ($, change) => {
  const now = await $.clock.now();
  await update4($, reactAtom, (r) => change(r, now));
};
const recordEvent = async ($, type) => {
  const pet = await loadPet($);
  const spike = pet ? null : await loadSpike($);
  if (!pet && !spike) return 0;
  const now = await $.clock.now();
  const own = queueKey(await $.session.id());
  const lastSyncAt = pet?.lastSyncAt ?? null;
  const base = pet ?? { heartsHour: 0, heartsUsed: 0 };
  let gained = 0;
  await editQueue($, own, async (mine) => {
    const others = await loadQueues($);
    delete others[own];
    const current = mine ?? emptyQueue(now);
    gained = gainFor(type, now, localWindows(base, [current, ...Object.values(others)], now, lastSyncAt), lastSyncAt);
    return append(current, type, now, gained);
  });
  await refreshView($, true);
  if (pet) later($, () => syncIfDue($));
  return gained;
};
const toolFinished = async ($, command, isError) => {
  if (isError) {
    await react($, onError);
    await recordEvent($, "error");
  } else if (CHECK_COMMAND.test(command)) {
    await react($, onCheckPass);
    await recordEvent($, "check_pass");
  } else {
    await react($, onActive);
  }
  if (!isError && COMMIT_COMMAND.test(command)) {
    await react($, onCommit);
    await recordEvent($, "commit");
  }
};
const petPressed = async ($) => {
  await react($, onPet);
  await recordEvent($, "pet");
};

// src/help.ts
const COMMAND_DESCRIPTION = "Your nibbl: stats, pet, name, label, odds, export, import, hide";
const COMMAND_HINT = "[pet | name <text> | label <text> | odds | export | import <code> | hide]";
const HELP = [
  "/nibbl                 stats, card and leaderboard links",
  "/nibbl pet             pet it (or ctrl+x tab, then p, on the band)",
  "/nibbl name <text>     rename your pet (once a week, up to 16 characters)",
  "/nibbl label <text>    set a label (up to 24 characters); /nibbl label alone clears it",
  "/nibbl odds            hatch odds and your pet's traits",
  "/nibbl export          show the secret code that moves your pet",
  "/nibbl import <code>   move a pet to this machine",
  "/nibbl hide            hide or show the band"
].join("\n");
const splitArgs = (args) => {
  const trimmed = args.trim();
  const space = trimmed.search(/\s/);
  if (space < 0) return { verb: trimmed.toLowerCase(), rest: "" };
  return { verb: trimmed.slice(0, space).toLowerCase(), rest: trimmed.slice(space + 1).trim() };
};

// src/commands.ts
const statsCommand = async ($) => {
  const view = await refreshView($);
  if (!view) return eggStatsText(await read2($, eggAtom));
  const pet = await loadPet($);
  const pending = countEvents(Object.values(await loadQueues($)));
  return statsText(view, genomeOf(view.seed, view.tier, view.shiny), await $.clock.now(), {
    base: await apiBase($),
    pending,
    lastSyncAt: pet?.lastSyncAt ?? null
  });
};
const oddsCommand = async ($) => {
  const view = await refreshView($);
  return oddsText(view, view ? genomeOf(view.seed, view.tier, view.shiny) : null);
};
const hideCommand = async ($) => {
  const isHidden = !await read2($, hiddenAtom);
  await update5($, hiddenAtom, () => isHidden);
  await $.store.set(K.hidden, isHidden);
  if (isHidden) await recordEvent($, "hide");
  return isHidden ? "Nibbl is hidden. It keeps living and syncing; /nibbl hide brings it back." : "Nibbl is back.";
};
const petCommand = async ($) => {
  const before = await refreshView($);
  if (!before) return "The egg wobbles. It hatches after a few more turns.";
  const hadHeart = heartsLeftOf(before, await $.clock.now()) > 0;
  await petPressed($);
  if (!hadHeart) return `${before.name} loves it \u2665  no XP left this hour, hearts come back next hour.`;
  const after = await refreshView($) ?? before;
  return `${after.name} loves it \u2665  hearts this hour: ${heartsBar(heartsLeftOf(after, await $.clock.now()))}`;
};
const runCommand = async ($, args) => {
  await ensureLoaded($);
  const { verb, rest } = splitArgs(args);
  if (verb === "") return statsCommand($);
  if (verb === "pet") return petCommand($);
  if (verb === "odds") return oddsCommand($);
  if (verb === "hide") return hideCommand($);
  if (verb === "name") return nameCommand($, "name", rest);
  if (verb === "label") return nameCommand($, "label", rest);
  if (verb === "export") return exportCommand($);
  if (verb === "import") return importCommand($, rest);
  return HELP;
};

// src/lifecycle.ts
import { update as update6 } from "claude-code";

// src/ticker.ts
import { read as read3 } from "claude-code";
const ensureRunning = async ($) => {
  if (!rt.isRegistered) {
    try {
      await $.command.register({ name: "nibbl", description: COMMAND_DESCRIPTION, argumentHint: COMMAND_HINT });
      rt.isRegistered = true;
    } catch (err) {
      $.ui.log(`nibbl: /nibbl registration failed: ${err instanceof Error ? err.message : String(err)}`, { to: "debug" });
    }
  }
  if (rt.ticker) return;
  rt.ticker = $.clock.every(TICK_MS, () => {
    void tick($).catch(() => void 0);
  });
};
const beat = async ($, now) => {
  if (now - rt.lastBeat < BEAT_MS) return;
  rt.lastBeat = now;
  const own = queueKey(await $.session.id());
  await editQueue($, own, (q) => q ? { ...q, beat: now } : null);
};
const tick = async ($) => {
  const now = await $.clock.now();
  await beat($, now);
  const r = await read3($, reactAtom);
  rt.anim = stepAnim(rt.anim, r, Math.random());
  const band = rt.band;
  if (!band) return;
  const view = await read3($, petAtom);
  const turns = await read3($, eggAtom);
  const tz = await read3($, tzAtom);
  if (hudKey(hudLines(view, turns, r, now, tz)) !== band.hud) {
    $.ui.invalidate("ui.render");
    return;
  }
  if (band.sceneId === null) return;
  const frame = frameOf(view, turns, r, rt.anim, now, tz);
  if (frame.id === band.sceneId) return;
  const painted = await $.ui.blit({ requestId: band.requestId, key: "scene", cells: frame.cells.cells });
  if (painted.deny !== void 0) {
    rt.band = null;
    $.ui.invalidate("ui.render");
    return;
  }
  band.sceneId = frame.id;
};

// src/lifecycle.ts
const readTimezone = async ($) => {
  if (rt.tzRead) return;
  rt.tzRead = true;
  let offset = -new Date(await $.clock.now()).getTimezoneOffset();
  try {
    const out = await $.process.run(["date", "+%z"], { timeoutMs: 3e3 });
    const parsed = out.exitCode === 0 ? parseUtcOffset(out.stdout) : null;
    if (parsed !== null) offset = parsed;
  } catch {
  }
  await update6($, tzAtom, () => offset);
};
const hatchAndSync = async ($, why) => {
  if (await loadPet($)) return "busy";
  const result = await hatchNow($, why);
  if (result === "hatched") await syncNow($, "hatch");
  return result;
};
const maybeMigrate = async ($) => {
  if (!await loadPet($) && await loadSpike($)) later($, () => hatchAndSync($, "spike"));
};
const start = async ($) => {
  await ensureLoaded($);
  await readTimezone($);
  await ensureRunning($);
  await maybeMigrate($);
};
const onAnsweredTurn = async ($) => {
  const pet = await loadPet($);
  const spike = pet ? null : await loadSpike($);
  if (pet || spike) {
    await recordEvent($, "turn");
    if (spike) later($, () => hatchAndSync($, "spike"));
    return;
  }
  const turns = await loadEggTurns($) + 1;
  await $.store.set(K.egg, turns);
  await update6($, eggAtom, () => turns);
  if (turns >= HATCH_AFTER_TURNS) {
    $.clock.after(HATCH_DELAY_MS, () => {
      void hatchAndSync($, "egg").catch((err) => $.ui.log(`nibbl: hatch: ${err instanceof Error ? err.message : String(err)}`, { to: "debug" }));
    });
  }
};

// src/register.tsx
export const register = (on, options) => {
  rt.options = options;
  on("session.start", async ($, e, next) => {
    await start($);
    await react($, onActive);
    return next(e);
  });
  on("turn.start", async ($, e, next) => {
    await start($);
    await react($, onTurnStart);
    return next(e);
  });
  on("turn.complete", async ($, e, next) => {
    if (e.agentId !== void 0) return next(e);
    await ensureLoaded($);
    const isAnswer = e.reason === "answer";
    await react($, (r, now) => onTurnEnd(r, now, isAnswer));
    if (isAnswer) await onAnsweredTurn($);
    return next(e);
  });
  on("tool.call", async ($, e, next) => {
    const ran = await next(e);
    if (ran.deny !== void 0 || e.agentId !== void 0) return ran;
    await ensureLoaded($);
    const command = e.tool === "Bash" ? String(e.command ?? "") : "";
    await toolFinished($, command, ran.isError === true);
    return ran;
  });
  on("ui.press", { plugin: "nibbl", element: "pet" }, async ($, e, next) => {
    await ensureLoaded($);
    await petPressed($);
    return next(e);
  });
  on("command.run", { command: "nibbl" }, async ($, e) => ({ text: await runCommand($, e.args) }));
  on("session.end", async ($, e, next) => {
    try {
      await withTimeout($, Math.max(0, Math.min(SESSION_END_WAIT_MS, next.budget.remainingMs - 250)), syncNow($, "session-end"));
    } catch (err) {
      $.ui.log(`nibbl: session end: ${err instanceof Error ? err.message : String(err)}`, { to: "debug" });
    }
    return next(e);
  });
  on("ui.render", { component: "AbovePrompt" }, async ($, e, next) => {
    if (e.props.hasSurvey || await read4($, hiddenAtom)) {
      rt.band = null;
      return next(e);
    }
    const now = await $.clock.now();
    const view = await read4($, petAtom);
    const turns = await read4($, eggAtom);
    const r = await read4($, reactAtom);
    const tz = await read4($, tzAtom);
    const frame = frameOf(view, turns, r, rt.anim, now, tz);
    const lines = hudLines(view, turns, r, now, tz);
    const isFull = e.surface === "terminal" && e.props.maxRows >= MIN_FULL_ROWS && e.props.bodyColumns >= MIN_FULL_COLUMNS;
    rt.band = { requestId: e.requestId, sceneId: isFull ? frame.id : null, hud: hudKey(lines) };
    const { Box, Text, Button } = $.ui.resolve(e);
    if (isFull && e.surface === "terminal") {
      const { Raster } = $.ui.resolve(e);
      const scene = /* @__PURE__ */ h(Raster, { key: "scene", columns: frame.cells.columns, rows: frame.cells.rows, cells: frame.cells.cells });
      if (!view) {
        return /* @__PURE__ */ h(Box, { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: e.props.bodyColumns }, /* @__PURE__ */ h(Box, { flexDirection: "column", alignItems: "flex-end", marginRight: 1 }, /* @__PURE__ */ h(Text, { color: "#ffcd75", bold: true }, lines.title), /* @__PURE__ */ h(Text, null, lines.xp), /* @__PURE__ */ h(Text, { dimColor: true, italic: true }, lines.status)), scene);
      }
      return /* @__PURE__ */ h(Box, { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: e.props.bodyColumns }, /* @__PURE__ */ h(Box, { flexDirection: "column", alignItems: "flex-end", marginRight: 1 }, /* @__PURE__ */ h(Text, { color: "#ef7d57", bold: true }, lines.title), /* @__PURE__ */ h(Text, null, lines.xp), /* @__PURE__ */ h(Text, { color: "#b13e53" }, lines.hearts), /* @__PURE__ */ h(Text, { dimColor: true, italic: true }, lines.status), /* @__PURE__ */ h(Button, { key: "pet", label: "\u2665", hotkey: "p", onPress: () => {
      } })), scene);
    }
    if (!view) {
      return /* @__PURE__ */ h(Box, { flexDirection: "row", width: e.props.bodyColumns }, /* @__PURE__ */ h(Text, null, lines.compact));
    }
    return /* @__PURE__ */ h(Box, { flexDirection: "row", width: e.props.bodyColumns }, /* @__PURE__ */ h(Text, null, lines.compact), /* @__PURE__ */ h(Text, null, " "), /* @__PURE__ */ h(Button, { key: "pet", label: "\u2665", hotkey: "p", onPress: () => {
    } }));
  }).catch(($, e, next) => next(e));
  on("ui.render", { component: "CommandOutput", props: { command: "nibbl" } }, async ($, e, next) => {
    if (!e.props.text.startsWith(EXPORT_MARK)) return next(e);
    const pet = await loadPet($);
    if (!pet || pet.serial !== exportSerialOf(e.props.text)) return next(e);
    const { Box, Text } = $.ui.resolve(e);
    return /* @__PURE__ */ h(Box, { flexDirection: "column" }, /* @__PURE__ */ h(Text, null, e.props.text), /* @__PURE__ */ h(Text, { color: "#ffcd75", bold: true }, exportCode(pet)));
  }).catch(($, e, next) => next(e));
};
