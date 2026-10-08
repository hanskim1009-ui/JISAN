import type { Lawyer } from "@/lib/lawyers"
import type { Lang } from "@/lib/langs"
import { tr } from "@/lib/i18n/t"
import { lawyerName } from "@/lib/lawyer-name"

/** 변호사 소개 전체를 그 언어로 (이름은 로마자, 사진·주소 같은 값은 그대로) */
const KEEP = new Set(["slug", "image", "blogUrl", "photoImageClassName", "name"])

function deep<T>(v: T, lang: Lang): T {
  if (typeof v === "string") return tr(lang, v) as T
  if (Array.isArray(v)) return v.map((x) => deep(x, lang)) as T
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, KEEP.has(k) ? x : deep(x, lang)])) as T
  return v
}

export function translateLawyer(l: Lawyer, lang: Lang): Lawyer {
  if (lang === "ko") return l
  return { ...deep(l, lang), name: lawyerName(l, lang) }
}

/** 번역 키 모으기용: 변호사 소개 안의 모든 문장 */
export function lawyerStrings(l: Lawyer): string[] {
  const out: string[] = []
  const walk = (v: unknown, k?: string) => {
    if (k && KEEP.has(k)) return
    if (typeof v === "string") out.push(v)
    else if (Array.isArray(v)) v.forEach((x) => walk(x))
    else if (v && typeof v === "object") Object.entries(v).forEach(([kk, x]) => walk(x, kk))
  }
  walk(l)
  return out
}
