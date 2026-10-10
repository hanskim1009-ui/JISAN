/**
 * 구형·양형 계산기 외국어판 데이터 (서버 전용, 빌드 때 읽음).
 *
 * 번역은 원본 데이터를 고치지 않고 글자만 덮어씁니다(overlay). 구조·값·조건은 원본 그대로.
 *   원문  content/tools/i18n/ko/{prosecution-crimes,prosecution-ui,sentencing-groups,sentencing-ui,num-format}.json
 *   번역  content/tools/i18n/{lang}/ 같은 이름
 *   목록  content/tools/i18n/prosecution-ids.json, sentencing-ids.json (번역하는 죄명·범죄군)
 * 원문은 check-crimes.mjs --write-ko 로 원본 데이터에서 뽑고, 번역 검사도 그 스크립트로 합니다.
 *
 * 한 언어의 화면 문구·표기·죄명 번역 파일 중 하나라도 없거나 원문에 있는 키가 빠지면 그 언어 계산기는 없는 것으로 봅니다
 * (페이지 notFound, 데이터 주소 정적 생성 안 함). 원본 데이터가 번역 뒤에 바뀌어 맞지 않게 된 죄명은 그 죄명만 뺍니다.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { FOREIGN_LANGS, type ForeignLang, type Lang } from "@/lib/langs"
import { toolAlternates, toolText } from "@/lib/tools/i18n"
import { isNumFmt, type NumFmt } from "./tool-num-fmt"
import type { Crime, Question, Tier } from "./prosecution-types"
import { HAS_PENALTY, PROSECUTION_UI_KO, type CrimeSummary, type ProsecutionUI } from "./prosecution"
import { loadCrimes, makeChunks } from "./prosecution-data"
import type { FactorSet, ProbationFactors, SentCrime, SentencingGroup } from "./sentencing-types"
import { SENTENCING_UI_KO, probationFits, type GroupSummary, type SentencingUI } from "./sentencing"
import { loadGroup } from "./sentencing-data"

const DIR = path.join(process.cwd(), "content", "tools", "i18n")

export type CrimeTool = "prosecution" | "sentencing"

function readJson(file: string): unknown {
  try {
    return JSON.parse(readFileSync(path.join(DIR, file), "utf8"))
  } catch {
    return undefined
  }
}

/** 개수를 맞추지 않아도 되는 목록 (검색어): 없어도 되고, 있으면 글자 목록 */
const FREE_LISTS = new Set(["aliases"])

/**
 * 번역이 원문과 같은 모양인지: 원문의 모든 키(밑줄로 시작하는 설명 키는 빼고)가 있고, 목록 길이가 같고,
 * 원문이 빈 글자가 아니면 번역도 빈 글자가 아님. 번역에만 있는 키는 상관없음 (check-crimes.mjs 와 같은 기준)
 */
export function sameShape(ko: unknown, tr: unknown): boolean {
  if (typeof ko === "string") return typeof tr === "string" && (ko.trim() === "" || tr.trim() !== "")
  if (Array.isArray(ko)) return Array.isArray(tr) && tr.length === ko.length && ko.every((v, i) => sameShape(v, tr[i]))
  if (ko && typeof ko === "object") {
    if (!tr || typeof tr !== "object" || Array.isArray(tr)) return false
    return Object.entries(ko).every(([k, v]) => {
      const t = (tr as Record<string, unknown>)[k]
      if (k.startsWith("_")) return true
      if (FREE_LISTS.has(k)) return t === undefined || (Array.isArray(t) && t.every((x) => typeof x === "string"))
      return sameShape(v, t)
    })
  }
  return true
}

const isForeign = (lang: string): lang is ForeignLang => (FOREIGN_LANGS as string[]).includes(lang)

/** 원문과 같은 모양인 번역 파일만 (없거나 키가 빠지면 undefined) */
function readDict<T>(lang: ForeignLang, file: string, ko: T): T | undefined {
  const tr = readJson(`${lang}/${file}`)
  return tr !== undefined && sameShape(ko, tr) ? (tr as T) : undefined
}

/** 금액·기간 표기 (외국어만) */
export function numFormat(lang: ForeignLang): NumFmt | undefined {
  const x = readJson(`${lang}/num-format.json`)
  return isNumFmt(x) ? x : undefined
}

/* ---------- 구형 ---------- */

/** 죄명 하나에서 번역하는 글자 (ko/prosecution-crimes.json 의 한 항목) */
export type CrimeText = {
  name: string
  aliases?: string[]
  statutory: string
  law?: string
  questions: Record<string, { label: string; help?: string; options?: Record<string, string>; unit?: string }>
  tiers: { sentence?: string; note?: string }[]
  notes?: string[]
  ref?: { label: string }
}

const KO_CRIMES = () => (readJson("ko/prosecution-crimes.json") ?? {}) as Record<string, CrimeText>

/** 번역할 죄명 id (고른 순서) */
export function prosecutionIds(): string[] {
  const x = readJson("prosecution-ids.json")
  return Array.isArray(x) ? x.map((r) => (r && typeof r.id === "string" ? r.id : "")).filter(Boolean) : []
}

/**
 * 원본 죄명 + 번역 글자. 원본에 있는 글자 칸이 번역에 없으면(원본이 번역 뒤에 바뀐 경우) null.
 * 구조(질문 id·보기 값·조건·벌금 규칙)는 원본 그대로
 */
export function applyCrime(c: Crime, t: CrimeText | undefined): Crime | null {
  if (!t || typeof t.name !== "string" || !t.name) return null
  if (c.statutory && !t.statutory) return null
  if (c.law && !t.law) return null
  const questions: Question[] = []
  for (const q of c.questions) {
    const qt = t.questions?.[q.id]
    if (!qt?.label || (q.help && !qt.help)) return null
    if (q.type === "select") {
      const options = q.options.map((o) => ({ value: o.value, label: qt.options?.[String(o.value)] ?? "" }))
      if (options.some((o) => !o.label)) return null
      questions.push({ ...q, label: qt.label, ...(q.help ? { help: qt.help } : {}), options })
    } else {
      if (q.unit && !qt.unit) return null
      questions.push({ ...q, label: qt.label, ...(q.help ? { help: qt.help } : {}), unit: qt.unit ?? q.unit })
    }
  }
  if (!Array.isArray(t.tiers) || t.tiers.length !== c.tiers.length) return null
  const tiers: Tier[] = []
  for (const [i, tier] of c.tiers.entries()) {
    const tt = t.tiers[i] ?? {}
    if ((tier.sentence && !tt.sentence) || (tier.note && !tt.note)) return null
    tiers.push({
      ...tier,
      ...(tier.sentence ? { sentence: tt.sentence, penalty: HAS_PENALTY.test(tier.sentence) } : {}),
      ...(tier.note ? { note: tt.note } : {}),
    })
  }
  if ((c.notes?.length ?? 0) !== (t.notes?.length ?? 0)) return null
  if (c.ref && !t.ref?.label) return null
  const aliases = (t.aliases ?? []).filter((a) => typeof a === "string" && a.trim())
  // 한국어 다른 이름은 외국어 검색에 쓰지 않음 (한국어 죄명은 목록의 ko 로 찾음)
  const { aliases: _koAliases, ...rest } = c
  void _koAliases
  return {
    ...rest,
    name: t.name,
    law: c.law ? t.law! : "",
    statutory: c.statutory ? t.statutory : "",
    ...(aliases.length ? { aliases } : {}),
    questions,
    tiers,
    ...(c.notes?.length ? { notes: t.notes } : {}),
    ...(c.ref ? { ref: { href: c.ref.href, label: t.ref!.label } } : {}),
  }
}

type IntlProsecution = { ui: ProsecutionUI; num: NumFmt; crimes: Crime[]; index: CrimeSummary[]; chunks: Map<string, Crime[]> }

const pCache = new Map<ForeignLang, IntlProsecution | null>()

/** 한 언어의 구형 계산기 (번역이 다 갖춰지지 않으면 null) */
export function prosecutionIntl(lang: ForeignLang): IntlProsecution | null {
  if (pCache.has(lang)) return pCache.get(lang)!
  let out: IntlProsecution | null = null
  const ui = readDict(lang, "prosecution-ui.json", PROSECUTION_UI_KO)
  const num = numFormat(lang)
  const ko = KO_CRIMES()
  const tr = readDict(lang, "prosecution-crimes.json", ko)
  if (ui && num && tr) {
    const byId = new Map(loadCrimes().map((c) => [c.id, c]))
    const crimes: Crime[] = []
    const korean = new Map<string, string>()
    for (const id of prosecutionIds()) {
      const src = byId.get(id)
      const c = src ? applyCrime(src, tr[id]) : null
      if (!c) {
        if (src) console.warn(`[tool-data-i18n] ${lang} 구형: "${id}" 는 원본 데이터가 번역 뒤에 바뀌어 뺐습니다 (check-crimes.mjs 확인)`)
        continue
      }
      crimes.push(c)
      korean.set(id, src!.name)
    }
    if (crimes.length) {
      const { chunks, chunkOf } = makeChunks(crimes)
      const index: CrimeSummary[] = crimes.map((c) => ({
        id: c.id,
        name: c.name,
        group: c.group,
        lawName: c.lawName ?? "",
        law: c.law,
        ...(c.aliases?.length ? { aliases: c.aliases } : {}),
        chunk: chunkOf.get(c.id)!,
        ko: korean.get(c.id),
      }))
      out = { ui, num, crimes, index, chunks }
    }
  }
  pCache.set(lang, out)
  return out
}

/** 원본 + 번역 덮어쓰기 (한국어는 원본 그대로). 번역에 없는 죄명이면 undefined */
export function crimeFor(lang: Lang, id: string): Crime | undefined {
  if (lang === "ko") return loadCrimes().find((c) => c.id === id)
  return prosecutionIntl(lang)?.crimes.find((c) => c.id === id)
}

export function prosecutionChunkIds(lang: ForeignLang): string[] {
  return [...(prosecutionIntl(lang)?.chunks.keys() ?? [])]
}

export function prosecutionChunk(lang: ForeignLang, id: string): Crime[] | undefined {
  return prosecutionIntl(lang)?.chunks.get(id)
}

/* ---------- 양형 ---------- */

type ProbText = Partial<Record<keyof ProbationFactors, string[]>>

/** 범죄군 하나에서 번역하는 글자 (ko/sentencing-groups.json 의 한 항목) */
export type GroupText = {
  name: string
  scope: string
  notes?: string[]
  probation?: ProbText
  crimes: Record<
    string,
    {
      name: string
      scope?: string
      types: Record<string, { name: string; desc?: string }>
      factors: Record<string, { label: string; desc?: string }>
      notes?: string[]
      probation?: ProbText
    }
  >
}

const PROB_KEYS: (keyof ProbationFactors)[] = ["negativeMajor", "negativeGeneral", "positiveMajor", "positiveGeneral"]

/** 참작사유 번역: 칸마다 항목 수가 같아야 함 */
function probTr(ko: ProbationFactors | undefined, t: ProbText | undefined): ProbationFactors | null | undefined {
  if (!ko) return undefined
  const out = { negativeMajor: [], negativeGeneral: [], positiveMajor: [], positiveGeneral: [] } as ProbationFactors
  for (const k of PROB_KEYS) {
    const src = ko[k] ?? []
    const tr = t?.[k] ?? []
    if (src.length !== tr.length || tr.some((s) => typeof s !== "string" || !s.trim())) return null
    out[k] = tr
  }
  return out
}

/** 원본 범죄군 + 번역 글자. 집행유예 참작사유는 세부 범죄별로 미리 골라 둠 (번역문으로는 "(○○ 유형)" 꼬리표를 가릴 수 없어서) */
export function applyGroup(g: SentencingGroup, t: GroupText | undefined): SentencingGroup | null {
  if (!t?.name || (g.scope && !t.scope)) return null
  if ((g.notes?.length ?? 0) !== (t.notes?.length ?? 0)) return null
  const groupProb = probTr(g.probation, t.probation)
  if (groupProb === null) return null
  const names = g.crimes.map((c) => c.name)
  const crimes: SentCrime[] = []
  for (const c of g.crimes) {
    const ct = t.crimes?.[c.id]
    if (!ct?.name || (c.scope && !ct.scope) || (c.notes?.length ?? 0) !== (ct.notes?.length ?? 0)) return null
    const types = c.types.map((x) => {
      const tt = ct.types?.[x.no]
      return tt?.name && (!x.desc || tt.desc) ? { ...x, name: tt.name, ...(x.desc ? { desc: tt.desc } : {}) } : null
    })
    if (types.some((x) => !x)) return null
    let ok = true
    const set = (s: FactorSet): FactorSet => {
      const f = (list: FactorSet["act"]) =>
        list.map((x) => {
          const ft = ct.factors?.[x.id]
          if (!ft?.label || (x.desc && !ft.desc)) ok = false
          return { ...x, label: ft?.label ?? x.label, ...(x.desc ? { desc: ft?.desc } : {}) }
        })
      return { act: f(s.act), actor: f(s.actor) }
    }
    const special = { aggravating: set(c.special.aggravating), mitigating: set(c.special.mitigating) }
    const general = { aggravating: set(c.general.aggravating), mitigating: set(c.general.mitigating) }
    if (!ok) return null
    // 이 범죄에 쓰는 참작사유(범죄 것 또는 범죄군 공통)에서 다른 세부 범죄 전용 사유를 빼고 번역문으로
    const koProb = c.probation ?? g.probation
    const trProb = c.probation ? probTr(c.probation, ct.probation) : groupProb
    if (trProb === null) return null
    let probation: ProbationFactors | undefined
    if (koProb && trProb) {
      probation = { negativeMajor: [], negativeGeneral: [], positiveMajor: [], positiveGeneral: [] }
      for (const k of PROB_KEYS) probation[k] = (koProb[k] ?? []).flatMap((label, i) => (probationFits(label, c.name, names) ? [trProb[k][i]] : []))
    }
    crimes.push({
      ...c,
      name: ct.name,
      ...(c.scope ? { scope: ct.scope } : {}),
      types: types as SentCrime["types"],
      special,
      general,
      ...(probation ? { probation } : {}),
      ...(c.notes?.length ? { notes: ct.notes } : {}),
    })
  }
  return {
    ...g,
    name: t.name,
    scope: g.scope ? t.scope : "",
    crimes,
    ...(groupProb ? { probation: groupProb } : {}),
    ...(g.notes?.length ? { notes: t.notes } : {}),
  }
}

/** 번역할 범죄군 id (고른 순서) */
export function sentencingIds(): string[] {
  const x = readJson("sentencing-ids.json")
  return Array.isArray(x) ? x.map((r) => (r && typeof r.id === "string" ? r.id : "")).filter(Boolean) : []
}

type IntlSentencing = { ui: SentencingUI; num: NumFmt; groups: SentencingGroup[]; index: GroupSummary[] }

const sCache = new Map<ForeignLang, IntlSentencing | null>()

/** 한 언어의 양형 계산기 (번역이 다 갖춰지지 않으면 null) */
export function sentencingIntl(lang: ForeignLang): IntlSentencing | null {
  if (sCache.has(lang)) return sCache.get(lang)!
  let out: IntlSentencing | null = null
  const ui = readDict(lang, "sentencing-ui.json", SENTENCING_UI_KO)
  const num = numFormat(lang)
  const ko = (readJson("ko/sentencing-groups.json") ?? {}) as Record<string, GroupText>
  const tr = readDict(lang, "sentencing-groups.json", ko)
  if (ui && num && tr) {
    const groups: SentencingGroup[] = []
    for (const id of sentencingIds()) {
      const src = loadGroup(id)
      const g = src ? applyGroup(src, tr[id]) : null
      if (!g) {
        if (src) console.warn(`[tool-data-i18n] ${lang} 양형: "${id}" 는 원본 데이터가 번역 뒤에 바뀌어 뺐습니다 (check-crimes.mjs 확인)`)
        continue
      }
      groups.push(g)
    }
    if (groups.length) out = { ui, num, groups, index: groups.map((g) => ({ id: g.id, name: g.name, crimes: g.crimes.map((c) => ({ id: c.id, name: c.name })) })) }
  }
  sCache.set(lang, out)
  return out
}

/** 원본 + 번역 덮어쓰기 (한국어는 원본 그대로) */
export function groupFor(lang: Lang, id: string): SentencingGroup | undefined {
  if (lang === "ko") return loadGroup(id)
  return sentencingIntl(lang)?.groups.find((g) => g.id === id)
}

/* ---------- 언어·주소 ---------- */

/** 번역이 갖춰진 외국어 (사이트맵·메뉴·hreflang 용). 공통 틀(ToolShell)의 사전 common.json 도 있어야 함 */
export function crimeToolLangs(tool: CrimeTool): ForeignLang[] {
  return FOREIGN_LANGS.filter((l) => toolText(l, "common") !== undefined && (tool === "prosecution" ? prosecutionIntl(l) : sentencingIntl(l)) !== null)
}

export function crimeToolAvailable(tool: CrimeTool, lang: string): lang is ForeignLang {
  return isForeign(lang) && crimeToolLangs(tool).includes(lang)
}

/** canonical + 언어별 주소 (lib/tools/i18n.ts 의 toolAlternates). 번역된 외국어가 없으면 한국어는 지금처럼 canonical 만 */
export function crimeToolAlternates(tool: CrimeTool, lang: Lang) {
  return toolAlternates(lang, `/tools/${tool}`, ["ko", ...crimeToolLangs(tool)])
}
