/**
 * 계산기·자가진단 번역 사전 읽기 (서버 전용, 빌드 때 읽음).
 * 사전: content/tools/i18n/{언어}/{사전}.json — 한국어(ko)가 원문이자 모양의 기준입니다.
 * 외국어 사전은 한국어 사전의 모든 키가 (빈칸 없이, 같은 자리표시자로) 있어야 쓰고, 하나라도 빠지면
 * 한국어로 채우지 않고 그 도구 페이지를 그 언어로 만들지 않습니다(toolLangs 에서 빠짐).
 * 번역 방법은 content/tools/i18n/TRANSLATE.md, 검사는 node content/tools/i18n/check.mjs.
 */
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { HREFLANG, LANGS, type Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/fmt"
import { HOLIDAY_NAMES } from "@/lib/tools/civil/deadline"
import type { CommonText } from "@/lib/tools/i18n-format"
import type { PoliceSummonsText } from "@/lib/tools/police-summons"
import type koDrunk from "@/content/tools/i18n/ko/drunk-driving.json"
import type koDeadline from "@/content/tools/i18n/ko/deadline.json"
import type koChild from "@/content/tools/i18n/ko/child-support.json"
import type koInheritance from "@/content/tools/i18n/ko/inheritance.json"
import type koReserved from "@/content/tools/i18n/ko/reserved-share.json"

/** 사전 이름 → 모양 (다른 도구는 toolText 의 결과를 직접 형 변환해서 씀) */
export type ToolTexts = {
  common: CommonText
  "police-summons": PoliceSummonsText
  "drunk-driving": typeof koDrunk
  deadline: typeof koDeadline
  "child-support": typeof koChild
  inheritance: typeof koInheritance
  "reserved-share": typeof koReserved
}

const DIR = path.join(process.cwd(), "content", "tools", "i18n")

/** 한국어판에만 있는 키 (외국어판에는 없어야 함): 외국어 사이트는 전화 안내 없이 메신저로만 문의 */
export const KO_ONLY: Record<string, string[]> = { common: ["shell.ctaPhone"] }

/** 도구 페이지가 함께 쓰는 사전 (유류분 계산기는 상속인 입력·순위 이름을 상속분 사전에서 가져옴) */
export const TOOL_DEPS: Record<string, string[]> = { "reserved-share": ["inheritance"] }

/** 길이를 맞추지 않아도 되는 문자열 배열 (검색어) */
const FREE_ARRAYS = new Set(["keywords"])

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",")

/**
 * 번역본이 한국어 원문과 같은 모양인지: 빠진 키·빈칸·자리표시자 차이·배열 길이 (비어 있으면 통과).
 * content/tools/i18n/check.mjs 도 같은 기준.
 */
export function textErrors(ko: unknown, tr: unknown, at = "", skip: string[] = []): string[] {
  if (skip.includes(at)) return []
  if (typeof ko === "string") {
    if (typeof tr !== "string" || tr.trim() === "") return [`${at}: 없음`]
    return placeholders(ko) === placeholders(tr) ? [] : [`${at}: 자리표시자 다름 (${placeholders(ko)} ↔ ${placeholders(tr)})`]
  }
  if (Array.isArray(ko)) {
    if (!Array.isArray(tr)) return [`${at}: 배열이 아님`]
    const key = at.split(".").pop() ?? ""
    if (FREE_ARRAYS.has(key)) return tr.length > 0 && tr.every((x) => typeof x === "string" && x.trim()) ? [] : [`${at}: 빈 배열`]
    if (ko.length !== tr.length) return [`${at}: 개수 ${tr.length} (원문 ${ko.length})`]
    return ko.flatMap((x, i) => textErrors(x, tr[i], `${at}[${i}]`, skip))
  }
  if (ko && typeof ko === "object") {
    if (!tr || typeof tr !== "object" || Array.isArray(tr)) return [`${at}: 객체가 아님`]
    return Object.entries(ko).flatMap(([k, v]) => textErrors(v, (tr as Record<string, unknown>)[k], at ? `${at}.${k}` : k, skip))
  }
  return ko === tr ? [] : [`${at}: 값이 원문과 같아야 함`]
}

/** 사전별 추가 검사 */
function extraErrors(key: string, x: unknown): string[] {
  if (key === "deadline") {
    const h = (x as { holidays?: Record<string, unknown> }).holidays ?? {}
    return HOLIDAY_NAMES.filter((n) => typeof h[n] !== "string" || !(h[n] as string).trim()).map((n) => `holidays.${n}: 없음`)
  }
  return []
}

function readJson(file: string): unknown {
  try {
    if (!existsSync(file)) return undefined
    return JSON.parse(readFileSync(file, "utf8"))
  } catch {
    return undefined
  }
}

const cache = new Map<string, unknown>()

/** 사전이 그 언어로 쓸 수 있는 상태인지 검사한 결과 (오류 목록). 파일이 없으면 ["파일 없음"] */
export function toolTextErrors(lang: Lang, key: string): string[] {
  const ko = readJson(path.join(DIR, "ko", `${key}.json`))
  if (ko === undefined) return ["한국어 원문 없음"]
  if (lang === "ko") return []
  const tr = readJson(path.join(DIR, lang, `${key}.json`))
  if (tr === undefined) return ["파일 없음"]
  const skip = KO_ONLY[key] ?? []
  const e = [...textErrors(ko, tr, "", skip), ...extraErrors(key, tr)]
  for (const p of skip) {
    let cur: unknown = tr
    for (const k of p.split(".")) cur = cur && typeof cur === "object" ? (cur as Record<string, unknown>)[k] : undefined
    if (cur !== undefined) e.push(`${p}: 외국어판에는 넣지 않음`)
  }
  return e
}

/** 그 언어 사전 (없거나 덜 됐으면 undefined → 그 언어 페이지 없음) */
export function toolText<K extends string>(lang: Lang, key: K): (K extends keyof ToolTexts ? ToolTexts[K] : unknown) | undefined {
  const id = `${lang}/${key}`
  if (!cache.has(id)) {
    const ok = toolTextErrors(lang, key).length === 0
    cache.set(id, ok ? readJson(path.join(DIR, lang, `${key}.json`)) : null)
  }
  return (cache.get(id) ?? undefined) as (K extends keyof ToolTexts ? ToolTexts[K] : unknown) | undefined
}

/** 이 도구(사전 이름)의 페이지를 그 언어로 만들 수 있는지: 공통 사전 + 도구 사전 + 함께 쓰는 사전 */
export function toolAvailable(lang: Lang, key: string): boolean {
  return [`common`, key, ...(TOOL_DEPS[key] ?? [])].every((k) => toolText(lang, k) !== undefined)
}

/** 이 도구 페이지가 있는 언어 (한국어 포함) */
export function toolLangs(key: string): Lang[] {
  return LANGS.filter((l) => toolAvailable(l, key))
}

/** canonical + hreflang: 그 페이지가 있는 언어끼리만 연결 (한국어만 있으면 canonical 만) */
export function toolAlternates(lang: Lang, toolPath: string, langs: Lang[]) {
  const canonical = L(lang, toolPath)
  if (langs.length <= 1) return { canonical }
  const languages: Record<string, string> = Object.fromEntries(langs.map((l) => [HREFLANG[l], L(l, toolPath)]))
  if (langs.includes("ko")) languages["x-default"] = toolPath
  return { canonical, languages }
}
