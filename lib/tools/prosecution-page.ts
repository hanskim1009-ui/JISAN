/**
 * 죄명별 안내 페이지 (/tools/prosecution/{id}, /{언어}/tools/prosecution/{id}) 와 죄명 모음 (/tools/prosecution/crimes) 데이터. 서버 전용.
 * 문구 원문: content/tools/i18n/ko/prosecution-page.json. 외국어는 같은 모양의 {언어}/prosecution-page.json 이 있고
 * 그 언어 구형 계산기 번역이 다 갖춰졌을 때만 페이지를 만듭니다 (번역된 죄명만).
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { FOREIGN_LANGS, type ForeignLang, type Lang } from "@/lib/langs"
import koPage from "@/content/tools/i18n/ko/prosecution-page.json"
import type { Crime } from "./prosecution-types"
import { PROSECUTION_UI_KO, groupRank, type ProsecutionUI } from "./prosecution"
import { loadCrimes } from "./prosecution-data"
import { crimeToolAvailable, prosecutionIntl, sameShape } from "./tool-data-i18n"
import type { NumFmt } from "./tool-num-fmt"

export type CrimePageText = typeof koPage

const DIR = path.join(process.cwd(), "content", "tools", "i18n")
const textCache = new Map<Lang, CrimePageText | null>()

/** 그 언어 죄명 페이지 문구 (없거나 원문 키가 빠지면 null) */
export function crimePageText(lang: Lang): CrimePageText | null {
  if (lang === "ko") return koPage
  if (textCache.has(lang)) return textCache.get(lang)!
  let out: CrimePageText | null = null
  try {
    const tr: unknown = JSON.parse(readFileSync(path.join(DIR, lang, "prosecution-page.json"), "utf8"))
    if (sameShape(koPage, tr)) out = tr as CrimePageText
  } catch {
    out = null
  }
  textCache.set(lang, out)
  return out
}

export type CrimePageSet = {
  lang: Lang
  text: CrimePageText
  ui: ProsecutionUI
  num?: NumFmt
  crimes: Crime[]
  /** 묶음·법률 이름을 화면 언어로 */
  group: (g: string) => string
  law: (l: string) => string
}

/** 한 언어의 죄명 페이지 묶음 (페이지가 없는 언어면 null) */
export function crimePageSet(lang: Lang): CrimePageSet | null {
  const text = crimePageText(lang)
  if (!text) return null
  if (lang === "ko") return { lang, text, ui: PROSECUTION_UI_KO, crimes: loadCrimes(), group: (g) => g, law: (l) => l }
  if (!crimeToolAvailable("prosecution", lang)) return null
  const p = prosecutionIntl(lang)
  if (!p) return null
  const groups: Record<string, string> = p.ui.groups
  const laws: Record<string, string> = p.ui.laws
  return { lang, text, ui: p.ui, num: p.num, crimes: p.crimes, group: (g) => groups[g] ?? g, law: (l) => laws[l] ?? l }
}

/** 죄명 페이지가 있는 언어 */
export function crimePageLangs(): Lang[] {
  return (["ko", ...FOREIGN_LANGS] as Lang[]).filter((l) => crimePageSet(l) !== null)
}

/** 죄명 하나가 페이지를 가진 언어 (hreflang) */
export function crimePageLangsFor(id: string): Lang[] {
  return crimePageLangs().filter((l) => crimePageSet(l)!.crimes.some((c) => c.id === id))
}

/** 같은 법률(형법은 같은 묶음) → 같은 묶음 순으로 가까운 죄명 몇 개 */
export function relatedCrimes(set: CrimePageSet, crime: Crime, n = 8): Crime[] {
  const others = set.crimes.filter((c) => c.id !== crime.id)
  const sameLaw = crime.lawName && crime.lawName !== "형법" ? others.filter((c) => c.lawName === crime.lawName) : []
  const sameGroup = others.filter((c) => c.group === crime.group && !sameLaw.includes(c))
  return [...sameLaw, ...sameGroup].slice(0, n)
}

/** 죄명 모음: 묶음별 (정해 둔 순서 → 가나다) */
export function crimesByGroup(set: CrimePageSet): [string, Crime[]][] {
  const m = new Map<string, Crime[]>()
  for (const c of set.crimes) {
    const arr = m.get(c.group)
    if (arr) arr.push(c)
    else m.set(c.group, [c])
  }
  return [...m.entries()].sort(([a], [b]) => groupRank(a) - groupRank(b) || a.localeCompare(b, "ko"))
}

/** 죄명 페이지에 쓸 수 없는 id (같은 자리의 다른 주소와 겹침) */
export const RESERVED_IDS = new Set(["data", "crimes"])

export function crimePageIds(lang: Lang): string[] {
  return (crimePageSet(lang)?.crimes ?? []).map((c) => c.id).filter((id) => !RESERVED_IDS.has(id))
}

export function crimePageCrime(lang: Lang, id: string): { set: CrimePageSet; crime: Crime } | null {
  if (RESERVED_IDS.has(id)) return null
  const set = crimePageSet(lang)
  const crime = set?.crimes.find((c) => c.id === id)
  return set && crime ? { set, crime } : null
}
