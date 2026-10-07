/**
 * 업무사례 · 감사일기 · 칼럼
 *
 * 지금은 이 파일의 목록에서 읽습니다. 홈페이지용 Supabase 프로젝트를 만들면
 * 아래 get 함수들만 Supabase에서 읽도록 바꾸고, 직원은 관리 화면에서 입력합니다.
 * 목록이 비어 있으면 메인의 해당 섹션과 메뉴가 숨겨집니다.
 * 단, 개발 미리보기에서는 예시 글(lib/samples.ts)로 채워 보여 줍니다 (lib/preview.ts).
 *
 * 광고 규정: 의뢰인 동의를 받은 것만, 누구인지 알 수 없게 고쳐서 싣습니다.
 * 결과는 처분·판결명만 적고 비율·누적 건수·결과 보장 표현은 쓰지 않습니다.
 */

import { SHOW_SAMPLES } from "@/lib/preview"
import { sampleCases, sampleColumns, sampleDiary } from "@/lib/samples"
import crimeColumns from "@/content/columns/crime.json"
import sexCrimeColumns from "@/content/columns/sex-crime.json"
import drugColumns from "@/content/columns/drug.json"
import divorceColumns from "@/content/columns/divorce.json"
import adulteryColumns from "@/content/columns/adultery.json"
import inheritanceColumns from "@/content/columns/inheritance.json"
import corporateColumns from "@/content/columns/corporate.json"
import medicalColumns from "@/content/columns/medical.json"
import civilColumns from "@/content/columns/civil.json"
import constructionColumns from "@/content/columns/construction.json"
import insolvencyColumns from "@/content/columns/insolvency.json"
import schoolViolenceColumns from "@/content/columns/school-violence.json"

export type CaseField = "형사" | "가사" | "기업" | "민사"

export type CaseItem = {
  /** 개발 미리보기용 예시 글 */
  sample?: boolean
  /** 주소에 쓰는 영문·숫자 (예: "2025-12-embezzlement") */
  id: string
  field: CaseField
  /** 센터 사이트에도 보이게 할 센터 slug (예: "crime", "sex-crime") */
  centers?: string[]
  /** 처분·판결 시기 "2025.12" */
  decidedOn: string
  /** 의뢰인의 상황 한 줄 — 목록 제목 */
  situation: string
  /** 죄명·사건 종류 (예: "업무상횡령") */
  caseType: string
  /** 피의자·피고인·피해자·원고·피고·회사 등 */
  clientRole: string
  /** 수사·1심·항소심·조정·협상 등 */
  stage: string
  /** 처분·판결명 (예: "혐의없음", "집행유예", "조정 성립") */
  result: string
  /** 상세: 쟁점 */
  issue: string
  /** 상세: 변호사가 한 일 */
  work: string
  /** lib/lawyers.ts slug */
  lawyers: string[]
}

export type DiaryEntry = {
  sample?: boolean
  id: string
  /** "2025-12-03" */
  date: string
  /** 무엇이 왔는지 그대로 (예: "귤 한 상자") */
  title: string
  /** 세 문장 안팎. 결과를 자랑하는 문장은 쓰지 않습니다 */
  body: string
  field: CaseField
  /** /public 아래 경로. 송장·이름·번호·얼굴은 가린 사진만 */
  photos: string[]
  /** 글쓴 직원 (예: "직원 이○○") */
  author: string
}

/** 칼럼 본문 한 덩어리: 소제목, 문단, 목록 */
export type ColumnBlock = { type: "h2"; text: string } | { type: "p"; text: string } | { type: "ul"; items: string[] }

export type ColumnItem = {
  sample?: boolean
  /** 주소에 쓰는 영문·숫자 (예: "police-summons-first-steps") */
  id: string
  field: CaseField
  /** 이 칼럼을 함께 보여 줄 센터 slug */
  centers?: string[]
  /** "2026-10-06" */
  date: string
  /** 의뢰인이 검색하는 말로 (예: "경찰 출석 요구를 받았을 때 먼저 할 일") */
  title: string
  /** 목록·검색 결과에 보이는 두 문장 안팎 */
  summary: string
  body: ColumnBlock[]
  /** 쓴 변호사 (lib/lawyers.ts slug). 직원이 초안을 써도 변호사 이름으로 나갑니다 */
  author: string
  /** 같은 글을 네이버 블로그에 요약해 올렸다면 그 주소 */
  blogPost?: string
}

const cases: CaseItem[] = []

const diary: DiaryEntry[] = []

/**
 * 칼럼: content/columns/{센터}.json (센터마다 담당 변호사 이름으로 씀)
 * 같은 날짜 안에서는 센터를 번갈아 섞어, 최신 글 목록에 한 센터 글만 몰리지 않게 합니다.
 */
const columnFiles = [
  crimeColumns, divorceColumns, corporateColumns, civilColumns, sexCrimeColumns, adulteryColumns,
  medicalColumns, constructionColumns, drugColumns, inheritanceColumns, insolvencyColumns, schoolViolenceColumns,
] as unknown as ColumnItem[][]

function interleave<T>(lists: T[][]): T[] {
  const out: T[] = []
  const max = Math.max(0, ...lists.map((l) => l.length))
  for (let i = 0; i < max; i++) for (const l of lists) if (l[i]) out.push(l[i])
  return out
}

const columns: ColumnItem[] = interleave(columnFiles)

export function getCases(opts: { field?: CaseField; center?: string; limit?: number } = {}) {
  let list = [...(cases.length > 0 || !SHOW_SAMPLES ? cases : sampleCases)].sort((a, b) => b.decidedOn.localeCompare(a.decidedOn))
  if (opts.field) list = list.filter((c) => c.field === opts.field)
  if (opts.center) list = list.filter((c) => c.centers?.includes(opts.center!))
  return opts.limit ? list.slice(0, opts.limit) : list
}

export function getCase(id: string) {
  return getCases().find((c) => c.id === id)
}

export function getDiary(opts: { limit?: number } = {}) {
  const list = [...(diary.length > 0 || !SHOW_SAMPLES ? diary : sampleDiary)].sort((a, b) => b.date.localeCompare(a.date))
  return opts.limit ? list.slice(0, opts.limit) : list
}

export function getColumns(opts: { field?: CaseField; center?: string; author?: string; limit?: number } = {}) {
  let list = [...(columns.length > 0 || !SHOW_SAMPLES ? columns : sampleColumns)].sort((a, b) => b.date.localeCompare(a.date))
  if (opts.field) list = list.filter((c) => c.field === opts.field)
  if (opts.center) list = list.filter((c) => c.centers?.includes(opts.center!))
  if (opts.author) list = list.filter((c) => c.author === opts.author)
  return opts.limit ? list.slice(0, opts.limit) : list
}

export function getColumn(id: string) {
  return getColumns().find((c) => c.id === id)
}
