/**
 * 센터 상세 콘텐츠: 업무분야별 상세 페이지(/센터/분야)와 상황별 안내 글(/센터/guide/글)
 * 내용은 content/center-pages/{센터}.json 에 있습니다. 다른 법무법인 센터의 상세 페이지 구성을 조사해 썼고,
 * 법률 내용은 게시 전 담당 변호사 검토가 필요합니다(review 항목은 화면에 나오지 않음).
 */
import crime from "@/content/center-pages/crime.json"
import { centerBase, getCenter } from "@/lib/centers"
import sexCrime from "@/content/center-pages/sex-crime.json"
import drug from "@/content/center-pages/drug.json"
import divorce from "@/content/center-pages/divorce.json"
import adultery from "@/content/center-pages/adultery.json"
import corporate from "@/content/center-pages/corporate.json"
import civil from "@/content/center-pages/civil.json"
import insolvency from "@/content/center-pages/insolvency.json"
import schoolViolence from "@/content/center-pages/school-violence.json"
import inheritance from "@/content/center-pages/inheritance.json"
import medical from "@/content/center-pages/medical.json"
import construction from "@/content/center-pages/construction.json"
import foreigner from "@/content/center-pages/foreigner.json"
import foreignerEn from "@/content/center-pages/foreigner-en.json"
import foreignerZh from "@/content/center-pages/foreigner-zh.json"
import foreignerMn from "@/content/center-pages/foreigner-mn.json"
import foreignerRu from "@/content/center-pages/foreigner-ru.json"
import foreignerVi from "@/content/center-pages/foreigner-vi.json"
import { intlCenterPages } from "@/lib/intl-centers.generated"

export type Seo = { title: string; description: string; keywords: string[] }
export type Section = { title: string; body?: string[]; bullets?: string[] }
export type Faq = { q: string; a: string }
export type Table = { title: string; columns: string[]; rows: string[][]; note?: string }

export type AreaPage = {
  slug: string
  areaName: string
  /** 센터 메인 업무분야 칸의 묶음 이름 (예: 재산범죄, 폭력·상해). 없으면 '주요 업무' */
  group?: string
  /** 업무분야 칸에 보일 한 줄 설명 (없으면 센터 메인 데이터의 설명이나 lead) */
  summary?: string
  /** 업무분야 칸의 근거 법조문 한 줄 (예: 형법 제347조) */
  cardLaw?: string
  title: string
  lead: string
  seo: Seo
  situations?: { title: string; items: string[] }
  law?: { title: string; items: { name: string; text: string }[] }
  table?: Table
  sections: Section[]
  factors?: { title: string; plus?: string[]; minus?: string[] }
  steps?: { title: string; items: { title: string; desc: string }[] }
  checklist?: { title: string; items: string[] }
  faqs?: Faq[]
  review?: string[]
}

export type Guide = {
  slug: string
  /** 센터 첫 화면 '지금 어떤 상황이신가요?'의 버튼 문구와 같으면 그 버튼이 이 글로 연결됨 */
  stage?: string
  /** 안내 글 모음에서 묶는 이름 (예: 수사 단계, 재판 단계, 피해자). 없으면 '상황별 안내' */
  group?: string
  title: string
  lead: string
  seo: Seo
  sections: Section[]
  faqs?: Faq[]
  review?: string[]
}

export type ProcessStep = { title: string; desc: string; period?: string; tip?: string }
export type Process = { title: string; summary?: string; steps: ProcessStep[] }

export type CenterPages = {
  slug: string
  /** 센터 메인 '사건 진행 절차'를 대신하는 자세한 절차 (없으면 센터 메인 데이터의 절차를 씀) */
  processes?: Process[]
  areaPages: AreaPage[]
  guides: Guide[]
  moreFaqs: (Faq & { category: string })[]
  /** 이 센터의 업무분야·안내 글 목록에 함께 보여 줄 다른 센터 (예: 형사센터에 성범죄·마약) */
  includeCenters?: string[]
  sources?: string[]
}

const all = [crime, sexCrime, drug, divorce, adultery, inheritance, corporate, medical, civil, construction, insolvency, schoolViolence, foreigner, foreignerEn, foreignerZh, foreignerVi, foreignerRu, foreignerMn, ...intlCenterPages] as unknown as CenterPages[]

/** 센터 주소 앞부분 (외국어판은 /en/foreigner 처럼) */
const pathOf = (slug: string) => {
  const c = getCenter(slug)
  return c ? centerBase(c) : `/${slug}`
}

export function getCenterPages(center: string): CenterPages | undefined {
  return all.find((c) => c.slug === center)
}

export function getAreaPage(center: string, area: string) {
  return getCenterPages(center)?.areaPages.find((a) => a.slug === area)
}

export function getGuide(center: string, guide: string) {
  return getCenterPages(center)?.guides.find((g) => g.slug === guide)
}

/** 센터 첫 화면 상황 버튼 → 그 상황을 설명하는 안내 글 */
export function stageGuideHref(center: string, label: string) {
  const g = getCenterPages(center)?.guides.find((x) => x.stage === label)
  return g ? `${pathOf(center)}/guide/${g.slug}` : undefined
}

/** 센터 메인의 업무분야 카드 → 상세 페이지 주소 */
export function areaHref(center: string, areaName: string) {
  const a = getCenterPages(center)?.areaPages.find((p) => p.areaName === areaName)
  return a ? `${pathOf(center)}/${a.slug}` : undefined
}

export const allCenterPages = all

export type AreaCard = { name: string; law?: string; desc: string; href: string; group: string }
export type GuideCard = { slug: string; title: string; lead: string; href: string; group: string; stage?: string }

const DEFAULT_AREA_GROUP = "주요 업무"
const DEFAULT_GUIDE_GROUP = "상황별 안내"

/**
 * 센터 업무분야 칸 목록. 상세 페이지(areaPages) 순서대로, 센터 메인 데이터(areas)의 설명·조문을 우선 씀.
 * includeCenters가 있으면 그 센터의 업무분야를 '<센터 이름>' 묶음으로 뒤에 붙임(링크는 그 센터 페이지).
 */
export function areaCards(
  center: string,
  baseAreas: { name: string; law?: string; desc: string; href?: string }[],
  centerName: (slug: string) => string | undefined,
): AreaCard[] {
  const pages = getCenterPages(center)
  const cards: AreaCard[] = []
  const seen = new Set<string>()
  for (const a of pages?.areaPages ?? []) {
    const base = baseAreas.find((b) => b.name === a.areaName)
    cards.push({
      name: a.areaName,
      law: base?.law ?? a.cardLaw,
      desc: base?.desc ?? a.summary ?? a.lead,
      href: `${pathOf(center)}/${a.slug}`,
      group: a.group ?? DEFAULT_AREA_GROUP,
    })
    seen.add(a.areaName)
  }
  for (const b of baseAreas) {
    if (!seen.has(b.name) && b.href) cards.push({ name: b.name, law: b.law, desc: b.desc, href: b.href, group: DEFAULT_AREA_GROUP })
  }
  for (const other of pages?.includeCenters ?? []) {
    const name = centerName(other)
    for (const a of getCenterPages(other)?.areaPages ?? []) {
      cards.push({ name: a.areaName, law: a.cardLaw, desc: a.summary ?? a.lead, href: `${pathOf(other)}/${a.slug}`, group: name ?? other })
    }
  }
  return cards
}

/** 안내 글 목록 (includeCenters의 글은 그 센터 이름으로 묶고 링크는 그 센터로) */
export function guideCards(center: string, centerName: (slug: string) => string | undefined, withIncluded = true): GuideCard[] {
  const pages = getCenterPages(center)
  const own = (pages?.guides ?? []).map((g) => ({
    slug: g.slug, title: g.title, lead: g.lead, href: `${pathOf(center)}/guide/${g.slug}`, group: g.group ?? DEFAULT_GUIDE_GROUP, stage: g.stage,
  }))
  if (!withIncluded) return own
  const inc = (pages?.includeCenters ?? []).flatMap((other) =>
    (getCenterPages(other)?.guides ?? []).map((g) => ({
      slug: `${other}-${g.slug}`, title: g.title, lead: g.lead, href: `${pathOf(other)}/guide/${g.slug}`, group: centerName(other) ?? other,
    })),
  )
  return [...own, ...inc]
}

/** 묶음 이름 순서를 지키며 나눔 */
export function groupBy<T extends { group: string }>(items: T[]) {
  const out: { group: string; items: T[] }[] = []
  for (const it of items) {
    let g = out.find((x) => x.group === it.group)
    if (!g) out.push((g = { group: it.group, items: [] }))
    g.items.push(it)
  }
  return out
}

/**
 * 센터 상세 페이지의 다른 언어판 주소 (검색엔진 hreflang 용).
 * 외국어판 형사·가사·외국인센터는 한국어 원본과 같은 slug 를 씀. 가사센터는 이혼·상간·상속 세 곳을 합친 것이라
 * 한국어 쪽은 slug 가 있는 센터로 연결 (상간의 de-facto-marriage 는 가사센터에서 de-facto-marriage-affair).
 * path: "fraud-embezzlement", "guide/police-summons", "faq", "lawyers/kim-hansol"
 */
const KIND_KO: Record<string, string[]> = { crime: ["crime"], family: ["divorce", "adultery", "inheritance"], foreigner: ["foreigner"] }
const KO_KIND: Record<string, string> = { crime: "crime", divorce: "family", adultery: "family", inheritance: "family", foreigner: "foreigner" }
const FOREIGN = ["en", "zh", "vi", "ru", "mn"] as const

function hasPath(slug: string, path: string) {
  const p = getCenterPages(slug)
  if (!p) return false
  if (path === "faq") return p.moreFaqs.length > 0
  if (path === "guide") return p.guides.length > 0
  if (path.startsWith("lawyers/")) return true
  if (path.startsWith("guide/")) return p.guides.some((g) => `guide/${g.slug}` === path)
  return p.areaPages.some((a) => a.slug === path)
}

export function subPageAlternates(centerSlug: string, path: string): Record<string, string> | undefined {
  const m = centerSlug.match(/^(crime|family|foreigner)-(en|zh|vi|ru|mn)$/)
  const kind = m ? m[1] : KO_KIND[centerSlug]
  if (!kind) return undefined
  const out: Record<string, string> = {}
  // 한국어판
  if (m) {
    for (const ko of KIND_KO[kind]) {
      const p = kind === "family" && ko === "adultery" && path === "de-facto-marriage-affair" ? "de-facto-marriage" : path
      if (kind === "family" && path === "de-facto-marriage" && ko === "adultery") continue
      if (hasPath(ko, p)) {
        out.ko = `/${ko}/${p}`
        break
      }
    }
  } else if (hasPath(centerSlug, path)) out.ko = `/${centerSlug}/${path}`
  // 외국어판
  const fpath = !m && centerSlug === "adultery" && path === "de-facto-marriage" ? "de-facto-marriage-affair" : path
  for (const l of FOREIGN) {
    const slug = `${kind}-${l}`
    if (hasPath(slug, fpath)) out[l === "zh" ? "zh-Hans" : l] = `${pathOf(slug)}/${fpath}`
  }
  return Object.keys(out).length > 1 ? out : undefined
}
