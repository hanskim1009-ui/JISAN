/**
 * 센터 상세 콘텐츠: 업무분야별 상세 페이지(/센터/분야)와 상황별 안내 글(/센터/guide/글)
 * 내용은 content/center-pages/{센터}.json 에 있습니다. 다른 법무법인 센터의 상세 페이지 구성을 조사해 썼고,
 * 법률 내용은 게시 전 담당 변호사 검토가 필요합니다(review 항목은 화면에 나오지 않음).
 */
import crime from "@/content/center-pages/crime.json"
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

export type Seo = { title: string; description: string; keywords: string[] }
export type Section = { title: string; body?: string[]; bullets?: string[] }
export type Faq = { q: string; a: string }
export type Table = { title: string; columns: string[]; rows: string[][]; note?: string }

export type AreaPage = {
  slug: string
  areaName: string
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
  sources?: string[]
}

const all = [crime, sexCrime, drug, divorce, adultery, inheritance, corporate, medical, civil, construction, insolvency, schoolViolence] as unknown as CenterPages[]

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
  return g ? `/${center}/guide/${g.slug}` : undefined
}

/** 센터 메인의 업무분야 카드 → 상세 페이지 주소 */
export function areaHref(center: string, areaName: string) {
  const a = getCenterPages(center)?.areaPages.find((p) => p.areaName === areaName)
  return a ? `/${center}/${a.slug}` : undefined
}

export const allCenterPages = all
