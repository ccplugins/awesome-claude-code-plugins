#!/usr/bin/env node
// phd-citation-verifier v0.2.0 — APA 7 한국어 + CrossRef DOI 보강
// 사용: node run.mjs --query "Kahneman thinking fast slow 2011" [--type book]

import { argv, exit } from 'node:process';

const args = parseArgs(argv.slice(2));
if (!args.query) {
  console.error('Usage: node run.mjs --query "<title or author year>" [--type article|book|thesis]');
  exit(1);
}

const url = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(args.query)}&rows=5`;
const res = await fetch(url, { headers: { 'User-Agent': 'phd-citation-verifier/0.2.0 (mailto:dpyeye@gmail.com)' } });
if (!res.ok) {
  console.error(`CrossRef error: ${res.status}`);
  exit(2);
}
const json = await res.json();
const items = json.message?.items ?? [];

if (items.length === 0) {
  console.log('CrossRef 미발견 — DOI 없음. 수동 입력 필요.');
  exit(0);
}

console.log(`Found ${items.length} candidates:\n`);
items.forEach((it, i) => {
  const authors = (it.author ?? []).slice(0, 3).map(a => `${a.family ?? ''} ${a.given?.[0] ?? ''}.`.trim());
  const etAl = (it.author?.length ?? 0) >= 3 ? ' et al.' : '';
  const year = it.issued?.['date-parts']?.[0]?.[0] ?? '?';
  const title = it.title?.[0] ?? '';
  const journal = it['container-title']?.[0] ?? '';
  const vol = it.volume ?? '';
  const issue = it.issue ? `(${it.issue})` : '';
  const pages = it.page ?? '';
  const doi = it.DOI ?? '';

  const apa = `${authors[0] ?? ''}${etAl} (${year}). ${title}. ${journal}${vol ? `, ${vol}${issue}` : ''}${pages ? `, ${pages}` : ''}. https://doi.org/${doi}`;
  console.log(`[${i + 1}] APA 7:`);
  console.log(`    ${apa}`);
  console.log(`    In-text: (${authors[0]?.split(' ')[0] ?? '저자'}${etAl ? ' 외' : ''}, ${year})`);
  console.log(`    DOI: ${doi}\n`);
});

console.log('⚠️  추측 금지: 후보 중 정확한 매칭만 사용. 제목 유사도 직접 확인 필요.');

function parseArgs(arr) {
  const out = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].startsWith('--')) out[arr[i].slice(2)] = arr[i + 1];
  }
  return out;
}
