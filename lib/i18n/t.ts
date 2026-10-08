import type { Lang } from "@/lib/langs"
import { fmt, type Dict, type TFn } from "@/lib/i18n/fmt"
import en from "@/lib/i18n/site/en.json"
import zh from "@/lib/i18n/site/zh.json"
import vi from "@/lib/i18n/site/vi.json"
import ru from "@/lib/i18n/site/ru.json"
import mn from "@/lib/i18n/site/mn.json"

/**
 * 메인 사이트 번역 (서버 컴포넌트 전용 — 브라우저 컴포넌트는 dictFor 로 고른 사전과 makeT 사용): 한국어 문장 자체가 열쇠입니다. t("법인 소개") → 영어면 "About us".
 * 번역 파일(lib/i18n/site/{언어}.json)에 없으면 한국어 그대로 나오고, 그 목록은 scripts/i18n-keys 로 뽑습니다.
 * {name} 같은 자리표시는 vars 로 채웁니다.
 */
const MAPS: Record<Exclude<Lang, "ko">, Record<string, string>> = { en, zh, vi, ru, mn }

export type { TFn }

/** I18N_COLLECT=파일경로 로 실행하면 번역이 없는 한국어 문장을 그 파일에 모읍니다 (번역 목록 만들기용) */
const COLLECT = process.env.I18N_COLLECT
function miss(ko: string) {
  if (!COLLECT || typeof window !== "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ;(eval("require")("fs") as typeof import("fs")).appendFileSync(COLLECT, JSON.stringify(ko) + "\n")
}

export function tr(lang: Lang, ko: string, vars?: Record<string, string | number>) {
  if (lang === "ko") return fmt(ko, vars)
  const v = MAPS[lang][ko]
  if (v === undefined) miss(ko)
  return fmt(v ?? ko, vars)
}

/** 브라우저 컴포넌트에 넘길 작은 사전: 필요한 한국어 문장들만 그 언어로 */
export function dictFor(lang: Lang, keys: Iterable<string>): Dict {
  if (lang === "ko") return {}
  const out: Dict = {}
  for (const k of keys) {
    const v = MAPS[lang][k]
    if (v !== undefined) out[k] = v
    else miss(k)
  }
  return out
}

/** const t = T(lang) */
export const T = (lang: Lang): TFn => (ko, vars) => tr(lang, ko, vars)

export { L } from "@/lib/i18n/fmt"
