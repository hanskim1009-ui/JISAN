/**
 * 양형기준 선고형 계산기 데이터 형식 (2026년 양형기준).
 * 범죄군별 데이터는 content/tools/sentencing/{groupId}.json (SentencingGroup) 에 있습니다.
 */

/** 형량 범위 한 칸. 원문 그대로의 text 를 늘 함께 둡니다 (예: "1년6월 - 4년", "- 1년", "11년 이상, 무기") */
export type Range = {
  text: string
  /** 하한 (개월). 원문이 "- 1년" 처럼 하한이 없으면 null */
  min: number | null
  /** 상한 (개월). "11년 이상" 처럼 상한이 없으면 null */
  max: number | null
  /** 무기징역 포함 */
  life?: boolean
  /** 사형 포함 */
  death?: boolean
  /** 형종이 벌금이면 "fine" (min/max 는 원 단위). 기본은 징역(개월) */
  unit?: "month" | "fine"
}

/** 유형 하나 (예: 일반사기 제2유형 "1억 원 이상, 5억 원 미만") */
export type SentType = {
  /** 유형 번호 (원문 "1", "2" … 또는 "1-가") */
  no: string
  /** 구분 이름 (원문 그대로, 짧게) */
  name: string
  /** 유형의 정의 (양형인자의 정의 부분에서, 쉬운 말로 1~2문장) */
  desc?: string
  mitigated: Range
  basic: Range
  aggravated: Range
}

/** 양형인자 하나 */
export type Factor = {
  /** 범죄 안에서 고유한 영문 id */
  id: string
  /** 원문 이름 (예: "처벌불원 또는 실질적 피해 회복") */
  label: string
  /** 정의를 쉬운 말로 1문장 (선택) */
  desc?: string
  /** 특정 유형에만 적용되면 그 유형 번호들 */
  onlyTypes?: string[]
  /** 행위자/기타인자이지만 행위인자와 같은 비중으로 평가하는 인자 (예: 처벌불원) */
  actWeight?: boolean
}

export type FactorSet = { act: Factor[]; actor: Factor[] }

/** 집행유예 참작사유 */
export type ProbationFactors = {
  negativeMajor: string[]
  negativeGeneral: string[]
  positiveMajor: string[]
  positiveGeneral: string[]
}

/** 범죄 하나 (범죄군 안의 세부 범죄. 예: 사기범죄 > "일반사기", "조직적 사기") */
export type SentCrime = {
  id: string
  name: string
  /** 적용 조문·구성요건 요약 (짧게) */
  scope?: string
  types: SentType[]
  special: { aggravating: FactorSet; mitigating: FactorSet }
  general: { aggravating: FactorSet; mitigating: FactorSet }
  /** 이 범죄에만 따로 정한 집행유예 참작사유 (없으면 범죄군 공통 사용) */
  probation?: ProbationFactors
  /** 이 범죄 특유의 주의사항 (동종경합 처리 등, 쉬운 말 1~3개) */
  notes?: string[]
}

export type SentencingGroup = {
  /** 영문 id (파일 이름과 같음, 예: "fraud") */
  id: string
  /** 범죄군 이름 (예: "사기범죄") */
  name: string
  /** 적용 범위 요약 (어떤 죄에 적용되는지 1~2문장) */
  scope: string
  crimes: SentCrime[]
  /** 범죄군 공통 집행유예 참작사유 */
  probation?: ProbationFactors
  /** 범죄군 공통 주의사항 (짧게) */
  notes?: string[]
}
