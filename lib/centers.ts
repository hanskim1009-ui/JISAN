/**
 * 센터 사이트 설정
 * 센터별 내용은 lib/center-data/{slug}.ts에 있습니다. 파일을 추가하고 아래 centers 목록에 넣으면
 * jisanlaw.com/{slug} 에 센터 전용 사이트가 생깁니다.
 * 각 센터의 문구는 다른 법무법인 센터 사이트 20여 곳을 조사해 그 형식을 따라 썼습니다.
 * 센터 사이트에는 그 센터의 메뉴·사례·변호사만 보이고, 다른 분야는 보이지 않습니다.
 *
 * 처벌 기준·FAQ 등 법률 내용은 게시 전 담당 변호사 검수가 필요합니다.
 * 광고 규정: '전문', 승소율·석방률, 결과 보장 표현은 쓰지 않습니다.
 */

/** dark: 형사·성범죄·마약·기업 / warm: 이혼·상간·의료·민사·회생파산·학교폭력 (건설부동산은 dark) */
export type CenterTone = "dark" | "warm"

export type CenterStage = {
  label: string
  hint: string
  /** 페이지 안 이동(#process) 또는 tel: 링크 */
  href: string
  /** 체포·구속 등 급한 단계: 강조 표시하고 전화로 연결 */
  urgent?: boolean
}

export type CenterArea = { name: string; law?: string; desc: string; href?: string }

/** 기준표 (처벌 기준, 처분 1~9호, 신청 요건 비교 등) */
export type CenterTable = { title: string; nav?: string; columns: string[]; rows: string[][]; note?: string }

export type CenterProcess = { title: string; steps: { title: string; desc: string }[] }

export type Center = {
  slug: string
  /** 센터 화면 언어 (없으면 한국어). 영어·중국어 센터는 basePath 주소로 보입니다 */
  lang?: Lang
  /** 주소 (없으면 /slug). 예: 영어 외국인센터 "/en/foreigner" (next.config 의 rewrites 로 연결) */
  basePath?: string
  /** 같은 센터의 다른 언어판 주소 (언어 전환 버튼) */
  alternates?: Partial<Record<Lang, string>>
  name: string
  /** 메인 사이트 카드에 쓰는 한 줄 설명 */
  summary: string
  tone: CenterTone
  seo: { title: string; description: string; keywords: string[] }
  hero: { title: string; sub: string }
  stageTitle: string
  stages: CenterStage[]
  /** 센터 소개 (인사말 형식) */
  intro?: { title: string; body: string[] }
  /** '이런 분께 필요합니다' 같은 상황 목록 */
  situations?: { title: string; items: string[] }
  areasTitle: string
  areas: CenterArea[]
  table?: CenterTable
  /** '초기 대응이 중요한 이유', '센터의 대응 원칙' 등 */
  points?: { title: string; items: { title: string; desc: string }[] }
  processes: CenterProcess[]
  /** 담당 변호사 (lib/lawyers.ts의 slug) + 센터에서 보여 줄 경력 한 줄 */
  lawyers: { slug: string; note: string }[]
  faqs: { q: string; a: string }[]
  form: { caseType: string; stageOptions: string[] }
  closing: string
  /** 담당 변호사 네이버 블로그 (최신 글이 센터 페이지에 자동으로 보입니다) */
  blog?: { id: string; title: string }
}

import type { Lang } from "@/lib/center-i18n"
import { crime } from "@/lib/center-data/crime"
import { sexCrime } from "@/lib/center-data/sex-crime"
import { drug } from "@/lib/center-data/drug"
import { divorce } from "@/lib/center-data/divorce"
import { adultery } from "@/lib/center-data/adultery"
import { corporate } from "@/lib/center-data/corporate"
import { civil } from "@/lib/center-data/civil"
import { insolvency } from "@/lib/center-data/insolvency"
import { schoolViolence } from "@/lib/center-data/school-violence"
import { inheritance } from "@/lib/center-data/inheritance"
import { medical } from "@/lib/center-data/medical"
import { construction } from "@/lib/center-data/construction"
import { foreigner } from "@/lib/center-data/foreigner"

/** 메인 사이트에 보이는 (한국어) 센터 */
export const centers: Center[] = [crime, sexCrime, drug, divorce, adultery, inheritance, corporate, medical, civil, construction, insolvency, schoolViolence, foreigner]

/** 외국어판 센터: 메인 사이트 목록에는 없고, 주소(basePath)와 언어 전환으로만 들어옵니다 */
export const foreignCenters: Center[] = []

/** 페이지를 만드는 모든 센터 */
export const allCenters: Center[] = [...centers, ...foreignCenters]

export function getCenter(slug: string) {
  return allCenters.find((c) => c.slug === slug)
}

/** 센터 주소 앞부분: /crime, /en/foreigner */
export function centerBase(c: Pick<Center, "slug" | "basePath">) {
  return c.basePath ?? `/${c.slug}`
}
