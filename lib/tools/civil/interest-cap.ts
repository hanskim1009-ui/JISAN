/**
 * 최고이자율 확인 — 사무소 사건관리 프로그램의 이자제한법·대부업법 최고이율 표를 그대로 옮김.
 * 받은(받기로 한) 이자를 연 이율로 환산해 계약 당시 최고이율과 비교합니다.
 */
import rates from "../../../content/tools/civil/rates.json"
import { diffDays, parseISODate, roundHalfUp } from "./format"

type CapRow = { from: string | null; to: string | null; rate: number }
type LenderRow = { from: string | null; to: string | null; registered: number; unregistered: number }

const INTEREST_CAP: CapRow[] = rates.interestCap
const LENDER_CAP: LenderRow[] = rates.lenderCap

/** 이 날 전에 맺은 계약은 최고이율이 여러 번 바뀌어 이 계산기로 확인하지 않음 */
export const CAP_TABLE_FLOOR = "2018-02-08"

/** 이자제한법 최고이자율이 적용되지 않는 원금 (이자제한법 제2조 제5항: 10만원 미만) */
export const MIN_PRINCIPAL = 100_000

export type LenderKind = "personal" | "registered" | "unregistered"

/** 이 날 이후 불법사금융업자(미등록 대부업자 등)와 맺은 계약은 이자 약정 전부 무효 (대부업법 제11조 제1항, 2025. 1. 21. 개정 부칙 제3조) */
export const ILLEGAL_LENDER_NO_INTEREST_FROM = "2025-07-22"

export const LENDER_KINDS: { value: LenderKind; label: string; law: string; penalty: string }[] = [
  { value: "personal", label: "개인 사이 등 일반 금전거래", law: "이자제한법 제2조", penalty: "이자제한법 제8조" },
  { value: "registered", label: "등록된 대부업자·금융회사", law: "대부업법 제8조", penalty: "대부업법 제19조" },
  { value: "unregistered", label: "등록하지 않은 대부업자", law: "대부업법 제11조, 이자제한법 제2조", penalty: "대부업법 제19조" },
]

/** 계약일 기준 이자제한법 최고이율(%) */
export function interestCapOn(day: string): { from: string | null; to: string | null; rate: number } {
  for (const row of INTEREST_CAP) {
    if (row.from && day < row.from) continue
    if (!row.to || day <= row.to) return row
  }
  return { from: "2021-07-07", to: null, rate: 20 }
}

/** 계약일 기준 대부업법 최고이율(%) */
export function lenderCapOn(day: string): LenderRow {
  for (const row of LENDER_CAP) {
    if (row.from && day < row.from) continue
    if (!row.to || day <= row.to) return row
  }
  return { from: "2021-07-07", to: null, registered: 20, unregistered: 20 }
}

export type InterestCapInput = {
  /** 빌려준 돈(약정 원금) */
  principal: number
  /** 받았거나 받기로 한 이자 합계 (수수료·사례금 등 포함) */
  interest: number
  /** 미리 떼고 준 이자(선이자) */
  prepaid?: number
  /** 빌려준 날 */
  start: string
  /** 갚기로 한 날(또는 갚은 날) */
  end: string
  /** 계약일 (비우면 빌려준 날) */
  contractDate?: string
  lender: LenderKind
}

export type InterestCapResult = {
  /** 실제로 받은 원금 (선이자를 뺀 돈) */
  principal: number
  /** 이자로 보는 돈 합계 (선이자 포함) */
  interest: number
  days: number
  /** 연 환산 이율(%) — 표시용 */
  annualPercent: number
  capPercent: number
  capLaw: string
  /** 최고이율을 넘겨 받으면 처벌하는 조문 */
  penaltyLaw: string
  /** 최고이율로 계산한 이 기간의 이자 한도 (원 미만 버림) */
  maxInterest: number
  over: boolean
  /** 한도를 넘는 이자 */
  excess: number
  contractDate: string
  smallLoan: boolean
}

export function calcInterestCap(input: InterestCapInput): InterestCapResult {
  const prepaid = Math.max(0, input.prepaid ?? 0)
  if (!Number.isSafeInteger(input.principal) || input.principal <= 0) throw new Error("빌려준 돈을 입력하세요.")
  if (!Number.isSafeInteger(input.interest) || input.interest < 0) throw new Error("이자를 입력하세요.")
  if (prepaid >= input.principal) throw new Error("선이자가 빌려준 돈보다 많습니다.")
  if (parseISODate(input.start) === null || parseISODate(input.end) === null) throw new Error("날짜를 확인해 주세요.")
  const days = diffDays(input.start, input.end)
  if (days <= 0) throw new Error("갚는 날은 빌려준 날보다 뒤여야 합니다.")
  const contractDate = input.contractDate && parseISODate(input.contractDate) !== null ? input.contractDate : input.start
  if (contractDate < CAP_TABLE_FLOOR) throw new Error("2018. 2. 8. 전에 맺은 계약은 당시 최고이율이 달라 이 계산기로 확인할 수 없습니다.")

  // 선이자를 뗀 경우 실제 받은 돈을 원금으로 본다 (이자제한법 제3조)
  const principal = input.principal - prepaid
  const interest = input.interest + prepaid

  const kind = LENDER_KINDS.find((k) => k.value === input.lender) ?? LENDER_KINDS[0]
  let capPercent: number
  let capLaw = kind.law
  if (input.lender === "registered") capPercent = lenderCapOn(contractDate).registered
  else if (input.lender === "unregistered") {
    // 2025. 7. 22. 이후 계약은 이자를 아예 받을 수 없음 (사건관리 프로그램 표에는 없는 개정 반영)
    if (contractDate >= ILLEGAL_LENDER_NO_INTEREST_FROM) {
      capPercent = 0
      capLaw = "대부업법 제11조 제1항"
    } else capPercent = lenderCapOn(contractDate).unregistered
  } else capPercent = interestCapOn(contractDate).rate

  // 한도 = 원금 × 최고이율 × 일수 ÷ 365
  const capNum = BigInt(principal) * BigInt(capPercent) * BigInt(days)
  const capDen = BigInt(100 * 365)
  const maxInterest = Number(capNum / capDen)
  // 받은 이자 × 100 × 365 > 원금 × 최고이율 × 일수 이면 초과
  const over = BigInt(interest) * capDen > capNum
  const excess = over ? interest - maxInterest : 0
  const annualPercent = Number(roundHalfUp(BigInt(interest) * BigInt(365 * 10_000), BigInt(principal) * BigInt(days))) / 100

  return {
    principal,
    interest,
    days,
    annualPercent,
    capPercent,
    capLaw,
    penaltyLaw: kind.penalty,
    maxInterest,
    over,
    excess,
    contractDate,
    smallLoan: input.principal < MIN_PRINCIPAL,
  }
}
