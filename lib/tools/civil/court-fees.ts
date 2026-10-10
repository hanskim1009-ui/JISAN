/**
 * 인지액·송달료 계산 — 사무소 사건관리 프로그램(전자소송 계산기와 같은 단계별 절사)을 그대로 옮김.
 * 홈페이지에는 자주 묻는 사건 종류만 둡니다.
 * 화면 문구(사건 종류·단계 이름, 식의 낱말, 입력 오류)는 content/tools/i18n/{언어}/court-fees.json.
 * 식(expr)은 숫자 자리표시자가 든 틀과 숫자로 돌려주고, 화면에서 언어별 숫자 표기로 채웁니다.
 */

/** 1회 송달료 (2026. 7. 1.부터, 국내 통상우편 요금 인상 반영) */
export const DELIVERY_UNIT = 5_640

/** 소액사건 상한 (소액사건심판규칙 제1조의2) */
export const SMALL_CLAIM_LIMIT = 30_000_000

/** 계산 단계 이름 (사전 steps 의 키) */
export type FeeStepKey = "first" | "appeal" | "final" | "elec" | "mediation" | "paymentOrder" | "familyFixed" | "familyHalf" | "appealElec" | "finalElec"
/** 식: "{s} × {r}/{d}" 같은 틀 + 자리표시자 숫자. "fixed" 는 정액(사전 ui.fixedExpr) */
export type FeeExpr = { t: string; v: Record<string, number> } | "fixed"
/** floored: 100원 미만을 버린 단계 (사전 ui.floorNote 를 붙임) */
export type FeeStep = { label: FeeStepKey; expr: FeeExpr; value: number; floored: boolean }
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

/** 1심 소장 인지 요율 식 (sb 와 같은 구간) */
export function sogaRateExpr(soga: number): { t: string; v: Record<string, number> } {
  const d = 10_000
  if (soga < 10_000_000) return { t: "{s} × {r}/{d}", v: { s: soga, r: 50, d } }
  if (soga < 100_000_000) return { t: "{s} × {r}/{d} + {a}", v: { s: soga, r: 45, d, a: 5000 } }
  if (soga < 1_000_000_000) return { t: "{s} × {r}/{d} + {a}", v: { s: soga, r: 40, d, a: 55_000 } }
  return { t: "{s} × {r}/{d} + {a}", v: { s: soga, r: 35, d, a: 555_000 } }
}

/** 요율 식을 괄호로 묶어 뒤에 연산을 붙임: "({s} × …) × 1/10" */
function rateThen(soga: number, tail: string): FeeExpr {
  const r = sogaRateExpr(soga)
  return { t: `(${r.t}) ${tail}`, v: r.v }
}

/** "{p} × {m}" (배수·할인율) */
const times = (p: number, m: number): FeeExpr => ({ t: "{p} × {m}", v: { p, m } })

function elecStep(paper: number, electronic: boolean): { final: number; step?: FeeStep } {
  if (!electronic) return { final: paper }
  const final = floor100(paper * 0.9)
  return { final, step: { label: "elec", expr: times(paper, 0.9), value: final, floored: true } }
}

function withElec(steps: FeeStep[], paper: number, electronic: boolean): Stamp {
  const { final, step } = elecStep(paper, electronic)
  return { amount: final, steps: step ? [...steps, step] : steps }
}

/** 1심 소장 */
export function stampFirst(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga))
  return withElec([{ label: "first", expr: sogaRateExpr(soga), value: paper, floored: true }], paper, electronic)
}

/** 항소장: 1심 종이 인지 × 1.5 */
export function stampAppeal(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga))
  const inst = floor100(paper * 1.5)
  return withElec(
    [
      { label: "first", expr: sogaRateExpr(soga), value: paper, floored: true },
      { label: "appeal", expr: times(paper, 1.5), value: inst, floored: true },
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
      { label: "first", expr: sogaRateExpr(soga), value: paper, floored: true },
      { label: "final", expr: times(paper, 2), value: inst, floored: true },
    ],
    inst,
    electronic,
  )
}

/** 민사조정 신청: 소장 요율 × 1/10 */
export function stampMediation(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga) * 0.1)
  return withElec([{ label: "mediation", expr: rateThen(soga, "× 1/10"), value: paper, floored: true }], paper, electronic)
}

/** 지급명령 신청: 소장 요율 ÷ 10 */
export function stampPaymentOrder(soga: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga) / 10)
  return withElec([{ label: "paymentOrder", expr: rateThen(soga, "÷ 10"), value: paper, floored: true }], paper, electronic)
}

function instanceLabel(multiplier: number): "appeal" | "final" {
  return multiplier === 1.5 ? "appeal" : "final"
}

/** 가사 가류·나류(정액 20,000원). 항소 ×1.5, 상고 ×2 */
export function stampFamilyFixed(multiplier: number, electronic = true): Stamp {
  const paper = 20_000
  const steps: FeeStep[] = [{ label: "familyFixed", expr: "fixed", value: paper, floored: false }]
  let inst = paper
  if (multiplier !== 1) {
    inst = floor100(paper * multiplier)
    steps.push({ label: instanceLabel(multiplier), expr: times(paper, multiplier === 1.5 ? 1.5 : 2), value: inst, floored: true })
  }
  return withElec(steps, inst, electronic)
}

/**
 * 가사 다류(손해배상 등)·재산분할: 민사 요율 × 1/2.
 * 항소·상고는 배수와 전자 할인을 한 번에 곱한 뒤 절사 (전자소송 계산기와 같음).
 */
export function stampFamilyHalf(soga: number, multiplier: number, electronic = true): Stamp {
  const paper = paperFloor(sb(soga) * 0.5)
  const steps: FeeStep[] = [{ label: "familyHalf", expr: rateThen(soga, "× 1/2"), value: paper, floored: true }]
  if (multiplier === 1) return withElec(steps, paper, electronic)
  const mul = multiplier === 1.5 ? 1.5 : 2
  if (electronic) {
    const final = floor100(paper * multiplier * 0.9)
    steps.push({ label: multiplier === 1.5 ? "appealElec" : "finalElec", expr: { t: "{p} × {m} × {e}", v: { p: paper, m: mul, e: 0.9 } }, value: final, floored: true })
    return { amount: final, steps }
  }
  const final = floor100(paper * multiplier)
  steps.push({ label: instanceLabel(multiplier), expr: times(paper, mul), value: final, floored: true })
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

/** 사건 종류 (이름은 사전 kinds) */
export const CASE_KINDS: { value: CaseKind; hasInstance: boolean; needsSoga: boolean; parties: "opponent" | "both" }[] = [
  { value: "civil", hasInstance: true, needsSoga: true, parties: "both" },
  { value: "payment-order", hasInstance: false, needsSoga: true, parties: "both" },
  { value: "mediation", hasInstance: false, needsSoga: true, parties: "both" },
  { value: "family-fixed", hasInstance: true, needsSoga: false, parties: "both" },
  { value: "family-damages", hasInstance: true, needsSoga: true, parties: "both" },
  { value: "family-division", hasInstance: true, needsSoga: true, parties: "both" },
]

/**
 * 송달료를 셀 사람 구분 (사전 who 의 키). 송달료는 원고·피고 등 당사자 모두의 수로 셈:
 * 당사자, 채권자·채무자, 신청인·상대방 (defendant·appellee·finalAppellee·opponent 는 예전 키, 사전 호환용)
 */
export type DeliveryWho = "parties" | "defendant" | "appellee" | "finalAppellee" | "poParties" | "medParties" | "opponent"

/**
 * 결과 제목의 사건 이름: key 가 사건 종류(CaseKind)면 사전 kinds, 아니면 사전 cases.
 * instance 가 있으면 "{사건 종류} {심급}" (재산분할은 1심·항고·재항고, 그 밖은 1심·항소·상고)
 */
export type CaseName = { key: CaseKind | "civilSmall" | "civilFirst" | "civilAppeal" | "civilFinal"; instance?: Instance }

/** 입력 오류 (code 는 사전 ui.errors 의 키) */
export class CourtFeeError extends Error {
  constructor(public code: "kind" | "soga") {
    super(code)
  }
}

export type CourtFeeInput = {
  kind: CaseKind
  soga: number
  instance: Instance
  electronic: boolean
  /** 상대방(피고·피항소인·상대방·채무자) 수 */
  opponents: number
  /** 신청인(원고·채권자·청구인) 수 */
  applicants: number
}

export type CourtFeeResult = {
  caseName: CaseName
  stamp: Stamp
  /** 송달료 = DELIVERY_UNIT × persons × rounds */
  delivery: { amount: number; rounds: number; persons: number; who: DeliveryWho }
  total: number
}

function delivery(persons: number, rounds: number, who: DeliveryWho) {
  const amount = DELIVERY_UNIT * persons * rounds
  return { amount, rounds, persons, who }
}

export function calcCourtFees(input: CourtFeeInput): CourtFeeResult {
  const { kind, soga, instance, electronic } = input
  const df = Math.max(1, Math.floor(input.opponents))
  const pl = Math.max(1, Math.floor(input.applicants))
  const meta = CASE_KINDS.find((k) => k.value === kind)
  if (!meta) throw new CourtFeeError("kind")
  if (meta.needsSoga && (!Number.isSafeInteger(soga) || soga <= 0)) throw new CourtFeeError("soga")
  const mul = instance === 1 ? 1 : instance === 2 ? 1.5 : 2

  let stamp: Stamp
  let dl: CourtFeeResult["delivery"]
  let caseName: CaseName = { key: kind }

  switch (kind) {
    case "civil":
      if (instance === 1) {
        stamp = stampFirst(soga, electronic)
        if (soga <= SMALL_CLAIM_LIMIT) {
          caseName = { key: "civilSmall" }
          dl = delivery(pl + df, 10, "parties")
        } else {
          caseName = { key: "civilFirst" }
          dl = delivery(pl + df, 15, "parties")
        }
      } else if (instance === 2) {
        stamp = stampAppeal(soga, electronic)
        caseName = { key: "civilAppeal" }
        dl = delivery(pl + df, 12, "parties")
      } else {
        stamp = stampFinal(soga, electronic)
        caseName = { key: "civilFinal" }
        dl = delivery(pl + df, 8, "parties")
      }
      break
    case "payment-order":
      stamp = stampPaymentOrder(soga, electronic)
      dl = delivery(pl + df, 6, "poParties")
      break
    case "mediation":
      stamp = stampMediation(soga, electronic)
      dl = delivery(pl + df, 5, "medParties")
      break
    case "family-fixed":
    case "family-damages": {
      stamp = kind === "family-fixed" ? stampFamilyFixed(mul, electronic) : stampFamilyHalf(soga, mul, electronic)
      dl = delivery(pl + df, instance === 1 ? 15 : instance === 2 ? 12 : 8, "parties")
      caseName = { key: kind, instance }
      break
    }
    case "family-division":
      // 재산분할 항고는 1.5배, 재항고는 2배
      stamp = stampFamilyHalf(soga, mul, electronic)
      dl = delivery(pl + df, 12, "parties")
      caseName = { key: kind, instance }
      break
  }

  return { caseName, stamp, delivery: dl, total: stamp.amount + dl.amount }
}
