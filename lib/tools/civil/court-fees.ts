/**
 * 인지액·송달료 계산 — 사무소 사건관리 프로그램(전자소송 계산기와 같은 단계별 절사)을 그대로 옮김.
 * 홈페이지에는 자주 묻는 사건 종류만 둡니다.
 */
import { formatNumber } from "./format"

/** 1회 송달료 (2026. 7. 1.부터, 국내 통상우편 요금 인상 반영) */
export const DELIVERY_UNIT = 5_640

/** 소액사건 상한 (소액사건심판규칙 제1조의2) */
export const SMALL_CLAIM_LIMIT = 30_000_000

export type FeeStep = { label: string; expr: string; value: number; note?: string }
export type Stamp = { amount: number; steps: FeeStep[] }

/** 100원 미만 절사 (민사소송 등 인지법 제2조 제2항) */
export function floor100(n: number): number {
  return Math.floor(n / 100) * 100
}

/** 종이 인지 원액: 1천원 미만은 1,000원, 이상은 100원 미만 절사 */
export function paperFloor(raw: number): number {
  if (raw < 1000) return 1000
  return floor100(raw)
}

/** 1심 소장 인지 요율 (민사소송 등 인지법 제2조 제1항, 절사 전) */
export function sb(s: number): number {
  if (s < 10_000_000) return s * 0.005
  if (s < 100_000_000) return s * 0.0045 + 5000
  if (s < 1_000_000_000) return s * 0.004 + 55_000
  return s * 0.0035 + 555_000
}

export function sogaRateExpr(soga: number): string {
  const amt = formatNumber(soga)
  if (soga < 10_000_000) return `${amt} × 50/10,000`
  if (soga < 100_000_000) return `${amt} × 45/10,000 + 5,000`
  if (soga < 1_000_000_000) return `${amt} × 40/10,000 + 55,000`
  return `${amt} × 35/10,000 + 555,000`
}

const NOTE_FLOOR = "100원 미만 버림"

function elecStep(paper: number, electronic: boolean): { final: number; step?: FeeStep } {
  if (!electronic) return { final: paper }
  const final = floor100(paper * 0.9)
  return { final, step: { label: "전자소송 할인(10%)", expr: `${formatNumber(paper)} × 0.9`, value: final, note: NOTE_FLOOR } }
}

function withElec(steps: FeeStep[], paper: number, electronic: boolean): Stamp {
  const { final, step } = elecStep(paper, electronic)
  return { amount: final, steps: step ? [...steps, step] : steps }
}

/** 1심 소장 */
export function stampFirst(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga))
  return withElec([{ label: "1심 인지(종이 기준)", expr: sogaRateExpr(soga), value: paper, note: NOTE_FLOOR }], paper, electronic)
}

/** 항소장: 1심 종이 인지 × 1.5 */
export function stampAppeal(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga))
  const inst = floor100(paper * 1.5)
  return withElec(
    [
      { label: "1심 인지(종이 기준)", expr: sogaRateExpr(soga), value: paper, note: NOTE_FLOOR },
      { label: "항소심(1.5배)", expr: `${formatNumber(paper)} × 1.5`, value: inst, note: NOTE_FLOOR },
    ],
    inst,
    electronic,
  )
}

/** 상고장: 1심 종이 인지 × 2 */
export function stampFinal(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga))
  const inst = floor100(paper * 2)
  return withElec(
    [
      { label: "1심 인지(종이 기준)", expr: sogaRateExpr(soga), value: paper, note: NOTE_FLOOR },
      { label: "상고심(2배)", expr: `${formatNumber(paper)} × 2`, value: inst, note: NOTE_FLOOR },
    ],
    inst,
    electronic,
  )
}

/** 민사조정 신청: 소장 요율 × 1/10 */
export function stampMediation(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga) * 0.1)
  return withElec([{ label: "조정 신청(1/10)", expr: `(${sogaRateExpr(soga)}) × 1/10`, value: paper, note: NOTE_FLOOR }], paper, electronic)
}

/** 지급명령 신청: 소장 요율 ÷ 10 */
export function stampPaymentOrder(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga) / 10)
  return withElec([{ label: "지급명령(1/10)", expr: `(${sogaRateExpr(soga)}) ÷ 10`, value: paper, note: NOTE_FLOOR }], paper, electronic)
}

function instanceLabel(multiplier: number): string {
  return multiplier === 1.5 ? "항소심(1.5배)" : "상고심(2배)"
}

/** 가사 가류·나류(정액 20,000원). 항소 ×1.5, 상고 ×2 */
export function stampFamilyFixed(multiplier: number, electronic = true): Stamp {
  const paper = 20_000
  const steps: FeeStep[] = [{ label: "가사소송 정액(종이 기준)", expr: "정액", value: paper }]
  let inst = paper
  if (multiplier !== 1) {
    inst = floor100(paper * multiplier)
    steps.push({ label: instanceLabel(multiplier), expr: `${formatNumber(paper)} × ${multiplier === 1.5 ? "1.5" : "2"}`, value: inst, note: NOTE_FLOOR })
  }
  return withElec(steps, inst, electronic)
}

/**
 * 가사 다류(손해배상 등)·재산분할: 민사 요율 × 1/2.
 * 항소·상고는 배수와 전자 할인을 한 번에 곱한 뒤 절사 (전자소송 계산기와 같음).
 */
export function stampFamilyHalf(soga: number, multiplier: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga) * 0.5)
  const steps: FeeStep[] = [{ label: "가사 1심(민사 요율 × 1/2)", expr: `(${sogaRateExpr(soga)}) × 1/2`, value: paper, note: NOTE_FLOOR }]
  if (multiplier === 1) return withElec(steps, paper, electronic)
  const mul = multiplier === 1.5 ? "1.5" : "2"
  if (electronic) {
    const final = floor100(paper * multiplier * 0.9)
    steps.push({ label: `${instanceLabel(multiplier)}·전자소송 할인`, expr: `${formatNumber(paper)} × ${mul} × 0.9`, value: final, note: NOTE_FLOOR })
    return { amount: final, steps }
  }
  const final = floor100(paper * multiplier)
  steps.push({ label: instanceLabel(multiplier), expr: `${formatNumber(paper)} × ${mul}`, value: final, note: NOTE_FLOOR })
  return { amount: final, steps }
}

/* ── 사건 종류 ─────────────────────────────────────────────── */

export type CaseKind =
  | "civil" // 민사 소송 (1심은 소가로 소액/단독·합의 구분)
  | "payment-order" // 지급명령
  | "mediation" // 민사조정
  | "family-fixed" // 가사 가류·나류 (이혼 등)
  | "family-damages" // 가사 다류 (위자료 등 손해배상)
  | "family-division" // 재산분할 심판 (마류)

export type Instance = 1 | 2 | 3

export const CASE_KINDS: { value: CaseKind; label: string; hasInstance: boolean; needsSoga: boolean; parties: "opponent" | "both" }[] = [
  { value: "civil", label: "민사 소송", hasInstance: true, needsSoga: true, parties: "opponent" },
  { value: "payment-order", label: "지급명령 신청", hasInstance: false, needsSoga: true, parties: "both" },
  { value: "mediation", label: "민사조정 신청", hasInstance: false, needsSoga: true, parties: "both" },
  { value: "family-fixed", label: "이혼 등 가사소송(가류·나류)", hasInstance: true, needsSoga: false, parties: "opponent" },
  { value: "family-damages", label: "위자료 등 가사소송(다류)", hasInstance: true, needsSoga: true, parties: "opponent" },
  { value: "family-division", label: "재산분할 심판", hasInstance: true, needsSoga: true, parties: "opponent" },
]

export type CourtFeeInput = {
  kind: CaseKind
  soga: number
  instance: Instance
  electronic: boolean
  /** 상대방(피고·피항소인·상대방·채무자) 수 */
  opponents: number
  /** 신청인(원고·채권자) 수 — 지급명령·조정만 씀 */
  applicants: number
}

export type CourtFeeResult = {
  caseLabel: string
  stamp: Stamp
  delivery: { amount: number; rounds: number; persons: number; expr: string; personsLabel: string }
  total: number
}

function delivery(persons: number, rounds: number, personsLabel: string) {
  const amount = DELIVERY_UNIT * persons * rounds
  return { amount, rounds, persons, personsLabel, expr: `${formatNumber(DELIVERY_UNIT)}원 × ${personsLabel} ${persons}명 × ${rounds}회` }
}

export function calcCourtFees(input: CourtFeeInput): CourtFeeResult {
  const { kind, soga, instance, electronic } = input
  const df = Math.max(1, Math.floor(input.opponents))
  const pl = Math.max(1, Math.floor(input.applicants))
  const meta = CASE_KINDS.find((k) => k.value === kind)
  if (!meta) throw new Error("사건 종류를 고르세요.")
  if (meta.needsSoga && (!Number.isSafeInteger(soga) || soga <= 0)) throw new Error("소송목적의 값(소가)을 입력하세요.")
  const mul = instance === 1 ? 1 : instance === 2 ? 1.5 : 2

  let stamp: Stamp
  let dl: CourtFeeResult["delivery"]
  let caseLabel = meta.label

  switch (kind) {
    case "civil":
      if (instance === 1) {
        stamp = stampFirst(soga, electronic)
        if (soga <= SMALL_CLAIM_LIMIT) {
          caseLabel = "민사 1심 소액사건"
          dl = delivery(df, 10, "피고")
        } else {
          caseLabel = "민사 1심 단독·합의사건"
          dl = delivery(df, 15, "피고")
        }
      } else if (instance === 2) {
        stamp = stampAppeal(soga, electronic)
        caseLabel = "민사 항소"
        dl = delivery(df, 12, "피항소인")
      } else {
        stamp = stampFinal(soga, electronic)
        caseLabel = "민사 상고"
        dl = delivery(df, 8, "피상고인")
      }
      break
    case "payment-order":
      stamp = stampPaymentOrder(soga, electronic)
      dl = delivery(pl + df, 6, "채권자·채무자")
      break
    case "mediation":
      stamp = stampMediation(soga, electronic)
      dl = delivery(pl + df, 5, "신청인·상대방")
      break
    case "family-fixed":
    case "family-damages": {
      stamp = kind === "family-fixed" ? stampFamilyFixed(mul, electronic) : stampFamilyHalf(soga, mul, electronic)
      const who = instance === 1 ? "피고" : instance === 2 ? "피항소인" : "피상고인"
      dl = delivery(df, instance === 1 ? 15 : instance === 2 ? 12 : 8, who)
      caseLabel = `${meta.label} ${instance === 1 ? "1심" : instance === 2 ? "항소" : "상고"}`
      break
    }
    case "family-division":
      // 재산분할 항고는 1.5배, 재항고는 2배
      stamp = stampFamilyHalf(soga, mul, electronic)
      dl = delivery(df, 12, "상대방")
      caseLabel = `재산분할 심판 ${instance === 1 ? "1심" : instance === 2 ? "항고" : "재항고"}`
      break
  }

  return { caseLabel, stamp, delivery: dl, total: stamp.amount + dl.amount }
}
