/**
 * 구형 예상 계산 엔진. 화면(클라이언트)과 시험 스크립트에서 같이 씁니다.
 * 데이터 읽기(fs)는 서버 전용인 lib/tools/prosecution-data.ts 에 있습니다.
 */
import type { Cond, Crime, FineRule, Level, Tier } from "./prosecution-types"

export type { Cond, Crime, FineRule, Level, Question, Tier } from "./prosecution-types"

/** 처음 페이지에 넘기는 가벼운 목록 한 줄. 죄명 데이터는 chunk 주소(/tools/prosecution/data/{chunk})에서 받음 */
export type CrimeSummary = {
  id: string
  name: string
  group: string
  /** 법률 이름 (예: "형법", "도로교통법"). 데이터에 없으면 law 에서 뽑음 */
  lawName: string
  /** 근거 조문 (조문 번호 검색용) */
  law: string
  aliases?: string[]
  chunk: string
}

/** 묶음 보여 주는 순서 (없는 묶음은 뒤에 가나다순, 기타는 맨 뒤) */
export const GROUP_ORDER = ["폭력", "성범죄", "재산", "교통", "마약", "사이버", "명예", "공무", "기타"]

export const groupRank = (g: string) => (g === "기타" ? 999 : GROUP_ORDER.includes(g) ? GROUP_ORDER.indexOf(g) : 500)

/** 법률 이름 다듬기: 가운뎃점(ㆍ)을 ·로, 띄어쓰기 하나로 */
export const tidyLawName = (s: string) => s.replace(/ㆍ/g, "·").replace(/\s+/g, " ").trim()

/** 근거 조문에서 법률 이름 뽑기: "도로교통법 제148조의2 제1항" → "도로교통법" */
export function lawNameOf(law: string): string {
  const m = law.trim().match(/^(.+?)(?=\s*(?:제\s*\d|\(|,|\/|$))/)
  return tidyLawName(m?.[1] ?? "") || "기타"
}

/** 사용자의 답. 숫자 질문은 number, 선택 질문은 string. 아직 안 답한 것은 없음 */
export type Answers = Record<string, string | number | undefined>

export type Evaluation = {
  tier: Tier
  /** crime.tiers 안의 순서 */
  tierIndex: number
  level: Level
  /** 처리 단계 이름 (예: "약식 벌금") */
  levelLabel: string
  /** 단계 쉬운 설명 */
  levelDesc: string
  /** 단계 막대 위치 (STEPS 안의 순서) */
  step: number
  /** 예상 구형 문장 (징역형 등) */
  sentence?: string
  /** 예상 벌금 (원, 만원 단위로 반올림) */
  fineAmount?: number
  /** 보기 좋은 벌금 (예: "150만원", "1,500만원 이상") */
  fineText?: string
  note?: string
}

/** 단계 막대: 가벼운 것 → 무거운 것 (trial·trial-fine 은 같은 칸) */
export const STEPS: { key: string; short: string; label: string; desc: string; levels: Level[] }[] = [
  {
    key: "family-court",
    short: "가정법원",
    label: "가정법원 송치 가능",
    desc: "가정보호·소년보호 사건: 형사처벌 대신 가정법원이 상담·접근 제한·사회봉사 같은 보호처분을 내리는 절차",
    levels: ["family-court"],
  },
  {
    key: "suspension",
    short: "기소유예",
    label: "기소유예 가능",
    desc: "기소유예: 잘못은 인정되지만 여러 사정을 참작해 검사가 재판에 넘기지 않고 끝내는 처분",
    levels: ["suspension"],
  },
  {
    key: "summary",
    short: "약식벌금",
    label: "약식 벌금",
    desc: "약식기소: 법정에 나가는 재판 없이 서류로 벌금을 정하는 절차",
    levels: ["summary"],
  },
  {
    key: "trial",
    short: "정식재판",
    label: "정식재판",
    desc: "정식재판(구공판): 검사가 법원에 재판을 청구해 법정에서 판사 앞에 서는 절차",
    levels: ["trial", "trial-fine"],
  },
  {
    key: "detention",
    short: "구속검토",
    label: "구속 검토",
    desc: "구속: 도망하거나 증거를 없앨 우려가 있을 때 법원 영장을 받아 가둔 채 수사·재판하는 것",
    levels: ["detention"],
  },
]

/** 결과 제목에 쓰는 단계 이름 (trial-fine 은 따로) */
export const LEVEL_LABEL: Record<Level, string> = {
  detention: "구속 검토",
  trial: "정식재판 (징역형 구형)",
  "trial-fine": "정식재판 (벌금형 구형)",
  summary: "약식 벌금",
  suspension: "기소유예 가능",
  "family-court": "가정법원 송치 가능",
}

const toNum = (v: unknown): number | undefined => {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

const same = (a: unknown, b: unknown) => {
  const na = toNum(a)
  const nb = toNum(b)
  if (na !== undefined && nb !== undefined) return na === nb
  return String(a) === String(b)
}

/** 조건 하나. 답이 없으면 항상 false */
export function matchCond(c: Cond, answers: Answers): boolean {
  const a = answers[c.q]
  if (a === undefined || a === "") return false
  switch (c.op) {
    case "eq":
      return same(a, c.value)
    case "neq":
      return !same(a, c.value)
    case "in":
      return (Array.isArray(c.value) ? c.value : [c.value]).some((v) => same(a, v))
    default: {
      const x = toNum(a)
      const y = toNum(c.value)
      if (x === undefined || y === undefined) return false
      if (c.op === "gte") return x >= y
      if (c.op === "gt") return x > y
      if (c.op === "lte") return x <= y
      return x < y
    }
  }
}

/** OR-of-AND. [] 이면 항상 맞음 */
export function matchWhen(when: Cond[][], answers: Answers): boolean {
  if (when.length === 0) return true
  return when.some((and) => and.every((c) => matchCond(c, answers)))
}

/** 벌금 계산: base + max(0, 값 - over) × amount, max 로 상한. 만원 단위 반올림 */
export function calcFine(rule: FineRule, answers: Answers): number {
  let amount = rule.base
  if (rule.perUnit) {
    const v = toNum(answers[rule.perUnit.q])
    // 부동소수 오차(0.08-0.03 등) 정리
    if (v !== undefined) amount += Math.max(0, Math.round((v - rule.perUnit.over) * 1e6) / 1e6) * rule.perUnit.amount
  }
  if (rule.max !== undefined) amount = Math.min(amount, rule.max)
  return Math.max(0, Math.round(amount / 10000) * 10000)
}

/** 원 → "150만원", "1,200만원", "1억 5,000만원" */
export function formatWon(won: number): string {
  if (won < 10000) return `${won.toLocaleString("ko-KR")}원`
  const man = Math.round(won / 10000)
  const eok = Math.floor(man / 10000)
  const rest = man % 10000
  if (eok === 0) return `${rest.toLocaleString("ko-KR")}만원`
  return rest === 0 ? `${eok.toLocaleString("ko-KR")}억원` : `${eok.toLocaleString("ko-KR")}억 ${rest.toLocaleString("ko-KR")}만원`
}

export function formatFine(rule: FineRule, answers: Answers): { amount: number; text: string } {
  const amount = calcFine(rule, answers)
  return { amount, text: formatWon(amount) + (rule.atLeast ? " 이상" : "") }
}

/** 모든 질문에 답했는지 */
export function isComplete(crime: Crime, answers: Answers): boolean {
  return crime.questions.every((q) => {
    const a = answers[q.id]
    return a !== undefined && a !== "" && (q.type === "select" || toNum(a) !== undefined)
  })
}

/** 첫 번째로 맞는 tier 를 결과로. 맞는 것이 없으면 null */
export function evaluate(crime: Crime, answers: Answers): Evaluation | null {
  const tierIndex = crime.tiers.findIndex((t) => matchWhen(t.when, answers))
  if (tierIndex < 0) return null
  const tier = crime.tiers[tierIndex]
  const step = Math.max(
    0,
    STEPS.findIndex((s) => s.levels.includes(tier.level)),
  )
  // 금액 비례 벌금에 0 을 넣으면 "0원 이상"이 되므로 금액이 없으면 벌금 줄을 숨김
  const fineRaw = tier.fine ? formatFine(tier.fine, answers) : undefined
  const fine = fineRaw && fineRaw.amount > 0 ? fineRaw : undefined
  return {
    tier,
    tierIndex,
    level: tier.level,
    levelLabel: LEVEL_LABEL[tier.level] ?? tier.level,
    levelDesc: STEPS[step].desc,
    step,
    sentence: tier.sentence,
    fineAmount: fine?.amount,
    fineText: fine?.text,
    note: tier.note,
  }
}
