/**
 * 양육비 계산 (SCS damages_calc `_op_child_support`·`lookup_child_support` 를 옮김).
 * 표는 2021년 양육비 산정기준표(최신판)만 씁니다.
 */
import table from "@/content/tools/child-support-2021.json"

export type SupportRow = {
  age0: number
  age1: number
  inc0: number
  /** null = 상한 없음 (1,200만 원 이상 칸) */
  inc1: number | null
  lo: number
  /** null = 상한 없음 */
  hi: number | null
  std: number
}

export const SUPPORT_TABLE = table as { revision: string; title: string; unit: string; basis: string; rows: SupportRow[] }

export const MAX_CHILD_AGE = 18

export type StandardLookup = {
  age: number
  income: number
  /** "6~8세" */
  ageBand: string
  /** "400만~499만 원" */
  incomeBand: string
  rangeLo: number
  rangeHi: number | null
  standard: number
}

const man = (won: number) => `${Math.round(won / 10000).toLocaleString("ko-KR")}만`

function incomeBandText(r: SupportRow): string {
  if (r.inc1 === null) return `${man(r.inc0)} 원 이상`
  if (r.inc0 === 0) return `${man(r.inc1)} 원 이하`
  return `${man(r.inc0)}~${man(r.inc1)} 원`
}

/**
 * 나이·부모 합산 월소득으로 표준양육비 찾기.
 * 표의 소득 칸은 만 원 단위(199만·200만…)라 그 사이 금액(예: 1,995,000원)은 아랫칸에 넣습니다.
 */
export function lookupStandard(age: number, income: number): StandardLookup {
  if (!Number.isInteger(age) || age < 0 || age > MAX_CHILD_AGE) throw new Error("자녀 나이는 0세부터 18세까지 입력해 주세요.")
  const inc = Math.max(0, Math.floor(income))
  const band = SUPPORT_TABLE.rows.filter((r) => r.age0 <= age && age <= r.age1)
  const row = [...band].reverse().find((r) => r.inc0 <= inc)
  if (!row) throw new Error("해당 나이·소득의 양육비 산정기준이 없습니다.")
  return {
    age,
    income: inc,
    ageBand: `${row.age0}~${row.age1}세`,
    incomeBand: incomeBandText(row),
    rangeLo: row.lo,
    rangeHi: row.hi,
    standard: row.std,
  }
}

/** 반올림한 정수 나눗셈 a*b/c (0.5 올림). 큰 소득에서도 정확하게 BigInt 로 */
function mulDivRound(a: number, b: number, c: number): number {
  const A = BigInt(a)
  const B = BigInt(b)
  const C = BigInt(c)
  return Number((A * B * BigInt(2) + C) / (C * BigInt(2)))
}

export type ChildSupportInput = {
  age: number
  /** 아이를 키우는 부모(양육자)의 월 소득, 세전 */
  carerIncome: number
  /** 아이와 따로 사는 부모(비양육자)의 월 소득, 세전 */
  otherIncome: number
  /** 가산·감산 (원, 음수면 감산). SCS 의 adj_children·adj_region·adj_wealth·adj_rehab 를 더한 값과 같음 */
  adjustment?: number
}

export type ChildSupportOne = StandardLookup & {
  adjustment: number
  /** 표준양육비 + 가감, 0 미만이면 0 */
  adjusted: number
  carerIncome: number
  otherIncome: number
  /** 비양육자 소득 비율 (0~1). 두 사람 소득이 모두 0이면 null */
  otherRatio: number | null
  carerShare: number | null
  otherShare: number | null
}

/** 자녀 1명 */
export function childSupportOne(input: ChildSupportInput): ChildSupportOne {
  const carer = Math.max(0, Math.floor(input.carerIncome))
  const other = Math.max(0, Math.floor(input.otherIncome))
  const income = carer + other
  const t = lookupStandard(input.age, income)
  const adj = Math.trunc(input.adjustment ?? 0)
  const adjusted = Math.max(t.standard + adj, 0)
  // SCS: 비양육자 몫 = 적용 양육비 × 비양육자 소득 / 합산 소득 (원 단위 반올림), 나머지가 양육자 몫
  const otherShare = income > 0 ? mulDivRound(adjusted, other, income) : null
  return {
    ...t,
    adjustment: adj,
    adjusted,
    carerIncome: carer,
    otherIncome: other,
    otherRatio: income > 0 ? other / income : null,
    carerShare: otherShare === null ? null : adjusted - otherShare,
    otherShare,
  }
}

export type ChildSupportResult = {
  children: ChildSupportOne[]
  income: number
  otherRatio: number | null
  totalStandard: number
  totalAdjusted: number
  totalOtherShare: number | null
  totalCarerShare: number | null
}

/** 자녀 여러 명: 자녀마다 나이에 맞는 칸을 찾아 더합니다 (표가 자녀 1명당 금액이므로) */
export function childSupport(input: {
  children: { age: number; adjustment?: number }[]
  carerIncome: number
  otherIncome: number
}): ChildSupportResult {
  if (input.children.length === 0) throw new Error("자녀를 한 명 이상 입력해 주세요.")
  const rows = input.children.map((c) =>
    childSupportOne({ age: c.age, adjustment: c.adjustment, carerIncome: input.carerIncome, otherIncome: input.otherIncome }),
  )
  const sum = (f: (r: ChildSupportOne) => number) => rows.reduce((s, r) => s + f(r), 0)
  const split = rows[0].otherShare !== null
  return {
    children: rows,
    income: rows[0].income,
    otherRatio: rows[0].otherRatio,
    totalStandard: sum((r) => r.standard),
    totalAdjusted: sum((r) => r.adjusted),
    totalOtherShare: split ? sum((r) => r.otherShare ?? 0) : null,
    totalCarerShare: split ? sum((r) => r.carerShare ?? 0) : null,
  }
}
