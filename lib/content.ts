/**
 * 업무사례 · 감사일기
 *
 * 지금은 이 파일의 목록에서 읽습니다. 홈페이지용 Supabase 프로젝트를 만들면
 * 아래 get 함수들만 Supabase에서 읽도록 바꾸고, 직원은 관리 화면에서 입력합니다.
 * 목록이 비어 있으면 메인의 해당 섹션과 메뉴가 숨겨집니다.
 *
 * 광고 규정: 의뢰인 동의를 받은 것만, 누구인지 알 수 없게 고쳐서 싣습니다.
 * 결과는 처분·판결명만 적고 비율·누적 건수·결과 보장 표현은 쓰지 않습니다.
 */

export type CaseField = "형사" | "가사" | "기업" | "민사"

export type CaseItem = {
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

const cases: CaseItem[] = []

const diary: DiaryEntry[] = []

export function getCases(opts: { field?: CaseField; center?: string; limit?: number } = {}) {
  let list = [...cases].sort((a, b) => b.decidedOn.localeCompare(a.decidedOn))
  if (opts.field) list = list.filter((c) => c.field === opts.field)
  if (opts.center) list = list.filter((c) => c.centers?.includes(opts.center!))
  return opts.limit ? list.slice(0, opts.limit) : list
}

export function getCase(id: string) {
  return cases.find((c) => c.id === id)
}

export function getDiary(opts: { limit?: number } = {}) {
  const list = [...diary].sort((a, b) => b.date.localeCompare(a.date))
  return opts.limit ? list.slice(0, opts.limit) : list
}
