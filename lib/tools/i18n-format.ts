/**
 * 계산기 번역 공용 (브라우저·서버 모두): 자리표시자 채우기, 언어별 숫자·금액·날짜 표기, 계산 결과 문장 키.
 * 사전 파일은 content/tools/i18n/{언어}/*.json, 서버에서 읽는 것은 lib/tools/i18n.ts.
 */
import type { Lang } from "@/lib/langs"
import { fmt } from "@/lib/i18n/fmt"
import { formatDateKo, parseISODate } from "@/lib/tools/civil/format"
import type koCommon from "@/content/tools/i18n/ko/common.json"

export { fmt }

/** common.json 모양 (외국어판은 shell.ctaPhone 이 없음) */
export type CommonText = Omit<typeof koCommon, "shell"> & { shell: Omit<typeof koCommon.shell, "ctaPhone"> & { ctaPhone?: string } }

export const TOOL_LOCALE: Record<Lang, string> = { ko: "ko-KR", en: "en-US", zh: "zh-CN", vi: "vi-VN", ru: "ru-RU", mn: "mn-MN" }

/** 천 단위 구분 (언어별) */
export function num(lang: Lang, n: number): string {
  return Math.round(n).toLocaleString(TOOL_LOCALE[lang])
}

/** 금액: 사전 units.won 템플릿("{n}원", "KRW {n}" …)에 언어별 숫자를 넣음 */
export function money(lang: Lang, c: Pick<CommonText, "units">, n: number): string {
  return fmt(c.units.won, { n: num(lang, n) })
}

/** 백분율: 숫자는 그대로(소수점 표기만 언어별) */
export function percent(lang: Lang, c: Pick<CommonText, "units">, n: number): string {
  return fmt(c.units.percent, { n: lang === "ko" ? String(n) : n.toLocaleString(TOOL_LOCALE[lang], { maximumFractionDigits: 2 }) })
}

/** 날짜: 한국어는 "2026. 10. 10.(토)", 그 밖은 Intl */
export function dateText(lang: Lang, iso: string, withWeekday = true): string {
  if (lang === "ko") return formatDateKo(iso, withWeekday)
  const t = parseISODate(iso)
  if (t === null) return iso
  return new Intl.DateTimeFormat(TOOL_LOCALE[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(withWeekday ? { weekday: "short" as const } : {}),
    timeZone: "UTC",
  }).format(t)
}

/** 계산 로직이 돌려주는 문장: 사전의 키(점으로 이은 경로) + 자리표시자 값 (값이 다시 문장일 수 있음) */
export type Msg = { k: string; v?: Record<string, string | number | Msg> }

export const msg = (k: string, v?: Msg["v"]): Msg => ({ k, v })

/** 사전에서 키 경로로 문장 찾기 (없으면 키를 그대로 보여 줌 → 검사 스크립트에서 걸러짐) */
export function lookup(dict: unknown, path: string): string {
  let cur: unknown = dict
  for (const p of path.split(".")) {
    if (!cur || typeof cur !== "object") return path
    cur = (cur as Record<string, unknown>)[p]
  }
  return typeof cur === "string" ? cur : path
}

export function say(dict: unknown, m: Msg): string {
  const vars: Record<string, string | number> = {}
  for (const [k, v] of Object.entries(m.v ?? {})) vars[k] = typeof v === "object" ? say(dict, v) : v
  return fmt(lookup(dict, m.k), vars)
}
