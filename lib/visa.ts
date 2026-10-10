/**
 * 체류자격(비자)별 안내: /visa, /visa/[code] 와 외국어판 /{언어}/visa.
 * 내용은 content/visa/{언어}/{code}.json, 화면 문구와 공통 안내는 content/visa/{언어}/_ui.json.
 * 번역 파일이 없는 언어·자격은 페이지를 만들지 않습니다(서버 전용, 빌드 때 읽음).
 * 법률 내용은 게시 전 담당 변호사 검토가 필요합니다. 번역 방법은 content/visa/TRANSLATE.md.
 */
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { HREFLANG, LANGS, type Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/fmt"
import { centerBase, getCenter } from "@/lib/centers"
import { getGuide } from "@/lib/center-pages"

/** 목록 순서 = 이 순서 (주소에 쓰는 소문자-하이픈 코드) */
export const VISA_SLUGS = ["e-9", "h-2", "e-7", "d-2", "d-4", "d-10", "f-6", "f-2", "f-4", "f-5", "c-3", "g-1"] as const
export type VisaSlug = (typeof VISA_SLUGS)[number]

export const VISA_GROUPS = ["work", "study", "family", "short"] as const
export type VisaGroup = (typeof VISA_GROUPS)[number]

/** 관련 링크: 센터 첫 화면 또는 그 센터의 안내 글. 주소·제목은 언어별 센터에서 찾음 */
export type VisaRelated = { center: "foreigner" | "crime" | "family"; guide?: string }

export type VisaItem = { title: string; body: string }

export type VisaDoc = {
  /** 화면에 보이는 자격 기호 (번역하지 않음) */
  code: string
  slug: VisaSlug
  /** 자격 이름 (예: 비전문취업) */
  name: string
  group: VisaGroup
  /** 목록 칸의 한 줄 설명 */
  summary: string
  seo: { title: string; description: string }
  /** 이 자격이 무엇인지 (문단) */
  about: string[]
  /** 법적 문제가 생기면 체류에 생기는 일 (이 자격에 맞춘 것) */
  impact: { lead: string; items: VisaItem[] }
  /** 이 자격에서 자주 생기는 문제 */
  issues: { title: string; body: string[] }[]
  faqs: { q: string; a: string }[]
  /** 이럴 때 바로 상담하세요 */
  consultWhen: string[]
  related: VisaRelated[]
  /** 근거 법령·자료 표기 */
  laws: string[]
}

export type VisaUi = {
  ui: {
    listTitle: string
    listLead: string
    listSeoTitle: string
    listSeoDescription: string
    groups: Record<VisaGroup, string>
    home: string
    crumb: string
    about: string
    impact: string
    issues: string
    faq: string
    consultWhen: string
    related: string
    laws: string
    basis: string
    notice: string
    readMore: string
    otherVisas: string
    ctaTitle: string
    ctaLead: string
    ctaButton: string
    /** 한국어판만: 전화 안내 한 줄 ({phone} 자리에 번호). 외국어판에는 넣지 않음(메신저로만 문의) */
    ctaPhone?: string
  }
  /** 모든 자격에 공통인 '처분 결과별로 체류에 생기는 일' */
  common: { title: string; lead: string; items: VisaItem[] }
}

const DIR = path.join(process.cwd(), "content", "visa")

function readJson(file: string): unknown {
  try {
    if (!existsSync(file)) return undefined
    return JSON.parse(readFileSync(file, "utf8"))
  } catch {
    return undefined
  }
}

const isStr = (x: unknown): x is string => typeof x === "string" && x.trim().length > 0
const isStrArr = (x: unknown): x is string[] => Array.isArray(x) && x.length > 0 && x.every(isStr)
const isItems = (x: unknown): x is VisaItem[] =>
  Array.isArray(x) && x.length > 0 && x.every((i) => i && typeof i === "object" && isStr((i as VisaItem).title) && isStr((i as VisaItem).body))

/** 모양 확인: 잘못된 곳 목록 (비어 있으면 통과). content/visa/check.mjs 도 같은 기준 */
export function visaDocErrors(x: unknown, slug?: string): string[] {
  const e: string[] = []
  if (!x || typeof x !== "object") return ["객체가 아님"]
  const d = x as Partial<VisaDoc>
  if (!isStr(d.code)) e.push("code")
  if (!d.slug || !(VISA_SLUGS as readonly string[]).includes(d.slug)) e.push("slug")
  if (slug && d.slug !== slug) e.push(`slug 가 파일 이름(${slug})과 다름`)
  if (!isStr(d.name)) e.push("name")
  if (!d.group || !(VISA_GROUPS as readonly string[]).includes(d.group)) e.push("group")
  if (!isStr(d.summary)) e.push("summary")
  if (!d.seo || !isStr(d.seo.title) || !isStr(d.seo.description)) e.push("seo")
  if (!isStrArr(d.about)) e.push("about")
  if (!d.impact || !isStr(d.impact.lead) || !isItems(d.impact.items)) e.push("impact")
  if (!Array.isArray(d.issues) || d.issues.length === 0 || !d.issues.every((i) => isStr(i?.title) && isStrArr(i?.body))) e.push("issues")
  if (!Array.isArray(d.faqs) || d.faqs.length === 0 || !d.faqs.every((f) => isStr(f?.q) && isStr(f?.a))) e.push("faqs")
  if (!isStrArr(d.consultWhen)) e.push("consultWhen")
  if (!Array.isArray(d.related) || !d.related.every((r) => r && ["foreigner", "crime", "family"].includes(r.center))) e.push("related")
  if (!isStrArr(d.laws)) e.push("laws")
  return e
}

export function visaUiErrors(x: unknown): string[] {
  if (!x || typeof x !== "object") return ["객체가 아님"]
  const u = x as Partial<VisaUi>
  const e: string[] = []
  const keys: (keyof VisaUi["ui"])[] = [
    "listTitle", "listLead", "listSeoTitle", "listSeoDescription", "home", "crumb", "about", "impact", "issues", "faq",
    "consultWhen", "related", "laws", "basis", "notice", "readMore", "otherVisas", "ctaTitle", "ctaLead", "ctaButton",
  ]
  if (!u.ui) e.push("ui")
  else {
    for (const k of keys) if (!isStr(u.ui[k])) e.push(`ui.${k}`)
    for (const g of VISA_GROUPS) if (!isStr(u.ui.groups?.[g])) e.push(`ui.groups.${g}`)
  }
  if (!u.common || !isStr(u.common.title) || !isStr(u.common.lead) || !isItems(u.common.items)) e.push("common")
  return e
}

const uiCache = new Map<Lang, VisaUi | null>()
const docCache = new Map<string, VisaDoc | null>()

/** 그 언어의 화면 문구 (없거나 깨졌으면 undefined → 그 언어 페이지 없음) */
export function getVisaUi(lang: Lang): VisaUi | undefined {
  if (!uiCache.has(lang)) {
    const x = readJson(path.join(DIR, lang, "_ui.json"))
    uiCache.set(lang, visaUiErrors(x).length === 0 ? (x as VisaUi) : null)
  }
  return uiCache.get(lang) ?? undefined
}

export function getVisa(lang: Lang, slug: string): VisaDoc | undefined {
  if (!(VISA_SLUGS as readonly string[]).includes(slug)) return undefined
  const key = `${lang}/${slug}`
  if (!docCache.has(key)) {
    const x = readJson(path.join(DIR, lang, `${slug}.json`))
    docCache.set(key, visaDocErrors(x, slug).length === 0 ? (x as VisaDoc) : null)
  }
  return docCache.get(key) ?? undefined
}

/** 화면 문구와 자격 파일이 모두 있는 것만, 정해진 순서로 */
export function visaList(lang: Lang): VisaDoc[] {
  if (!getVisaUi(lang)) return []
  return VISA_SLUGS.flatMap((s) => getVisa(lang, s) ?? [])
}

/** generateStaticParams 용: 번역이 없으면 빈 배열 */
export function visaStaticParams(lang: Lang) {
  return visaList(lang).map((d) => ({ code: d.slug }))
}

/** 이 페이지(목록 또는 자격)가 있는 언어 */
export function visaLangs(slug?: string): Lang[] {
  return LANGS.filter((l) => getVisaUi(l) && (!slug || getVisa(l, slug)))
}

export const visaPath = (lang: Lang, slug?: string) => L(lang, slug ? `/visa/${slug}` : "/visa")

/** canonical + hreflang: 그 페이지가 있는 언어끼리만 연결 */
export function visaAlternates(lang: Lang, slug?: string) {
  const langs = visaLangs(slug)
  const languages: Record<string, string> = Object.fromEntries(langs.map((l) => [HREFLANG[l], visaPath(l, slug)]))
  if (langs.includes("ko")) languages["x-default"] = visaPath("ko", slug)
  return { canonical: visaPath(lang, slug), languages: langs.length > 1 ? languages : undefined }
}

/** 센터 종류 → 언어별 센터 slug (한국어 가사 분야는 이혼센터) */
function centerSlug(kind: VisaRelated["center"], lang: Lang) {
  if (lang === "ko") return kind === "family" ? "divorce" : kind
  return `${kind}-${lang}`
}

/** 관련 링크: 그 언어에 있는 센터·안내 글만 */
export function visaRelatedLinks(lang: Lang, doc: VisaDoc): { href: string; label: string }[] {
  const seen = new Set<string>()
  const out: { href: string; label: string }[] = []
  for (const r of doc.related) {
    const slug = centerSlug(r.center, lang)
    const c = getCenter(slug)
    if (!c) continue
    const base = centerBase(c)
    let link: { href: string; label: string } | undefined
    if (r.guide) {
      const g = getGuide(slug, r.guide)
      if (g) link = { href: `${base}/guide/${g.slug}`, label: g.title }
    } else link = { href: base, label: c.name }
    if (link && !seen.has(link.href)) {
      seen.add(link.href)
      out.push(link)
    }
  }
  return out
}
