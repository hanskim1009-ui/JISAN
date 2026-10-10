/**
 * 구형 예상 계산기 데이터 형식.
 * 죄명별 데이터는 content/tools/prosecution/*.json (Crime[]) 에 있습니다.
 * 출처(문서 이름)는 화면·데이터 어디에도 적지 않습니다.
 */

/** 사용자에게 묻는 항목 */
export type Question =
  | {
      id: string
      label: string
      type: "select"
      options: { value: string; label: string }[]
      /** 짧은 도움말 (선택) */
      help?: string
    }
  | {
      id: string
      label: string
      type: "number"
      /** 단위: "주"(상해 진단), "만원"(피해액), "회"(전과), "%"(혈중알코올농도) 등 */
      unit: string
      min?: number
      max?: number
      step?: number
      help?: string
    }

/** 조건 하나: 답(q)과 값 비교 */
export type Cond = {
  q: string
  op: "eq" | "neq" | "in" | "gte" | "gt" | "lte" | "lt"
  value: string | number | (string | number)[]
}

/** 예상 처리 단계 (무거운 순) */
export type Level =
  | "detention" // 구속 수사 검토
  | "trial" // 정식재판 청구(구공판) - 징역형 구형 예상
  | "trial-fine" // 정식재판이지만 벌금 구형 예상
  | "summary" // 약식기소(벌금)
  | "suspension" // 기소유예 가능
  | "family-court" // 가정법원·소년부 송치 가능

export type FineRule = {
  /** 기본 벌금 (원) */
  base: number
  /** 가중: 숫자 질문 q 의 값이 over 를 넘는 1단위마다 amount 원 */
  perUnit?: { q: string; over: number; amount: number }
  /** 상한 (원, 법정 상한 등) */
  max?: number
  /** "이상" 같은 표현이 붙는 최소 기준이면 true */
  atLeast?: boolean
}

export type Tier = {
  level: Level
  /** OR 로 묶인 AND 조건들. [] 이면 항상 해당 (마지막 기본값으로 사용) */
  when: Cond[][]
  /** 예상 구형 (징역형 등) 문장: 예 "징역 1년 6월 이상", "징역 8월 ~ 1년" */
  sentence?: string
  /** 예상 벌금 */
  fine?: FineRule
  /** 이 결과에 덧붙일 설명 (짧게, 쉬운 말) */
  note?: string
}

export type Crime = {
  /** 영문 소문자-하이픈 (예: "injury", "drunk-driving") */
  id: string
  /** 죄명 (예: "상해") */
  name: string
  /** 근거 조문 (예: "형법 제257조 제1항") */
  law: string
  /** 묶음 (예: "폭력", "성범죄", "재산", "교통", "마약", "사이버", "공무", "기타") */
  group: string
  /** 현행 법정형 (2026년 기준). 바뀐 법이면 현행으로 */
  statutory: string
  /** 검색용 다른 이름 (예: ["폭행치상"]) */
  aliases?: string[]
  questions: Question[]
  /** 무거운 순서. 처음 맞는 것이 결과 */
  tiers: Tier[]
  /** 죄명 공통 참고 (예: "합의 여부가 처분에 크게 영향") */
  notes?: string[]
  /**
   * 기준을 어디서 왔는지 (화면에 문서 이름은 쓰지 않음)
   * - 없음: 수사기관 처리 기준
   * - "guideline-x2": 처리 기준이 없어 2026 양형기준 권고범위의 2배(법정형 상한 이내)로 추정
   */
  basis?: "guideline-x2"
  /** 구형 기준이 없어 다른 계산기로 안내하는 죄명 (이때 questions·tiers 는 비어 있어도 됨) */
  ref?: { href: string; label: string }
  /** 특별법 법률 이름 (묶음·검색용, 예: "도로교통법") */
  lawName?: string
}
