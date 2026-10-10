/**
 * 죄명 검색: 띄어쓰기 무시, 한글 초성(ㅇㅈㅇㅈ → 음주운전)과 섞어 쓴 말(음ㅈ운)도 찾음.
 * 이름·다른 이름은 초성까지, 법률 이름·조문(예: "148조의2")은 글자 그대로 찾음.
 */
import type { Crime } from "@/lib/tools/prosecution-types"
import type { CrimeSummary } from "@/lib/tools/prosecution"

const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"

const norm = (s: string) => s.toLowerCase().replace(/[\sㆍ·.,()/]+/g, "")

/** 글자 하나가 검색 글자 하나와 맞는지 (검색 글자가 초성이면 그 초성으로 시작하는 음절도 맞음) */
function charMatch(t: string, q: string) {
  if (t === q) return true
  if (!CHO.includes(q)) return false
  const code = t.charCodeAt(0) - 0xac00
  return code >= 0 && code < 11172 && CHO[Math.floor(code / 588)] === q
}

/** 이미 다듬은 글자(t, q)끼리 초성 포함 비교. prefix 면 앞부분만 */
function matchNorm(t: string, q: string, prefix = false): boolean {
  if (!q) return true
  if (prefix ? t.startsWith(q) : t.includes(q)) return true
  if (![...q].some((ch) => CHO.includes(ch))) return false
  outer: for (let i = 0; i + q.length <= (prefix ? Math.min(t.length, q.length) : t.length); i++) {
    for (let j = 0; j < q.length; j++) if (!charMatch(t[i + j], q[j])) continue outer
    return true
  }
  return false
}

export function matchKo(target: string, query: string): boolean {
  return matchNorm(norm(target), norm(query))
}

/** 이름·다른 이름·묶음·법률 이름·조문 중 하나라도 맞으면 */
export function crimeMatches(c: Pick<Crime, "name" | "aliases" | "group"> & { lawName?: string; law?: string }, query: string): boolean {
  const q = norm(query)
  if (!q) return true
  return [c.name, c.group, ...(c.aliases ?? [])].some((s) => matchNorm(norm(s), q)) || [c.lawName ?? "", c.law ?? ""].some((s) => norm(s).includes(q))
}

type Prepared = { c: CrimeSummary; name: string; aliases: string[]; group: string; lawName: string; law: string }

/** 목록마다 다듬은 글자를 한 번만 만들어 둠 */
const prepCache = new WeakMap<CrimeSummary[], Prepared[]>()

function prepare(list: CrimeSummary[]): Prepared[] {
  let p = prepCache.get(list)
  if (!p) {
    p = list.map((c) => ({ c, name: norm(c.name), aliases: (c.aliases ?? []).map(norm), group: norm(c.group), lawName: norm(c.lawName), law: norm(c.law) }))
    prepCache.set(list, p)
  }
  return p
}

/**
 * 검색 결과를 맞는 정도 순으로: 이름 같음 → 이름 앞부분 → 이름 포함 → 다른 이름 → 초성(앞부분 → 중간) → 묶음·법률 이름 → 조문.
 * 같은 점수면 짧은 이름 → 원래 순서 (형법 → 특별법).
 */
export function searchCrimes(list: CrimeSummary[], query: string): CrimeSummary[] {
  const q = norm(query)
  if (!q) return list
  const scored: { c: CrimeSummary; s: number; i: number; len: number }[] = []
  prepare(list).forEach((p, i) => {
    let s = -1
    if (p.name === q) s = 0
    else if (p.name.startsWith(q)) s = 1
    else if (p.name.includes(q)) s = 2
    else if (p.aliases.some((a) => a.includes(q))) s = 3
    else if (matchNorm(p.name, q, true)) s = 4
    else if (matchNorm(p.name, q) || p.aliases.some((a) => matchNorm(a, q))) s = 5
    else if (p.group === q || p.lawName.includes(q)) s = 6
    else if (p.law.includes(q)) s = 7
    if (s >= 0) scored.push({ c: p.c, s, i, len: p.name.length })
  })
  return scored.sort((a, b) => a.s - b.s || a.len - b.len || a.i - b.i).map((x) => x.c)
}

/* ---------- 외국어판 ---------- */

/** 외국어 검색용 다듬기: 소문자, 악센트·성조 표시 빼기(lừa đảo → luadao), 띄어쓰기·문장부호 빼기 */
export const normIntl = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")

type PreparedIntl = { c: CrimeSummary; name: string; aliases: string[]; ko: string; group: string; lawName: string; law: string }

const prepIntlCache = new WeakMap<CrimeSummary[], PreparedIntl[]>()

/**
 * 외국어판 검색: 번역된 이름 → 다른 이름 → 한국어 이름 → 묶음·법률 이름 → 조문.
 * label 은 묶음·법률 이름을 그 언어로 바꾸는 함수 (화면 사전).
 */
export function searchCrimesIntl(list: CrimeSummary[], query: string, label: { group: (g: string) => string; law: (l: string) => string }): CrimeSummary[] {
  const q = normIntl(query)
  if (!q) return list
  let prepared = prepIntlCache.get(list)
  if (!prepared) {
    prepared = list.map((c) => ({
      c,
      name: normIntl(c.name),
      aliases: (c.aliases ?? []).map(normIntl),
      ko: norm(c.ko ?? ""),
      group: normIntl(label.group(c.group)),
      lawName: normIntl(label.law(c.lawName)),
      law: normIntl(c.law),
    }))
    prepIntlCache.set(list, prepared)
  }
  const qk = norm(query)
  const scored: { c: CrimeSummary; s: number; i: number; len: number }[] = []
  prepared.forEach((p, i) => {
    let s = -1
    if (p.name === q) s = 0
    else if (p.name.startsWith(q)) s = 1
    else if (p.name.includes(q)) s = 2
    else if (p.aliases.some((a) => a.includes(q))) s = 3
    else if (p.ko && qk && matchNorm(p.ko, qk)) s = 4
    else if (p.group.includes(q) || p.lawName.includes(q)) s = 6
    else if (p.law.includes(q)) s = 7
    if (s >= 0) scored.push({ c: p.c, s, i, len: p.name.length })
  })
  return scored.sort((a, b) => a.s - b.s || a.len - b.len || a.i - b.i).map((x) => x.c)
}
