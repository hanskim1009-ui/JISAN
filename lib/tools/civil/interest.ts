/**
 * 지연이자(지연손해금) 계산 — 사무소 사건관리 프로그램의 이자 계산식을 그대로 옮김.
 * 원금 × 연이율 × 일수 ÷ 365, 원 미만 반올림. 소송촉진법 이율은 바뀐 날을 기준으로 기간을 나눕니다.
 * 화면 문구는 content/tools/i18n/{언어}/interest.json (입력 오류는 InterestError.code → 사전 ui.errors).
 */
import rates from "../../../content/tools/civil/rates.json"
import { addDays, diffDays, parseISODate, percentToMicro, roundHalfUp } from "./format"

export type RateKind = "civil" | "commercial" | "sochok" | "custom"

export type RateRow = { from: string | null; to: string | null; rate: number }

/** 소송촉진 등에 관한 특례법 제3조 이율 (연 %) */
export const SOCHOK_RATES: RateRow[] = rates.sochok
/** 민법 제379조 법정이율 */
export const CIVIL_RATE: number = rates.civil
/** 상법 제54조 상사법정이율 */
export const COMMERCIAL_RATE: number = rates.commercial

/** 이 날짜 전 구간은 소송촉진법 이율 표가 단순화되어 있어 안내를 붙임 */
export const SOCHOK_TABLE_FLOOR = "2003-06-01"

export type InterestSegment = {
  from: string
  to: string
  days: number
  /** 연이율 백만분율 (5% = 50,000) */
  rateMicro: number
  interest: number
}

export type InterestResult = {
  principal: number
  interest: number
  total: number
  days: number
  includeFirst: boolean
  kind: RateKind
  segments: InterestSegment[]
}

export type InterestInput = {
  principal: number
  start: string
  end: string
  kind: RateKind
  /** kind=custom 일 때 연이율(%) */
  customPercent?: string | number
  /** 시작일을 일수에 넣을지 (판결 주문의 "O일부터"처럼 넣는 것이 기본) */
  includeFirst?: boolean
}

/** 입력 오류 (code 는 사전 ui.errors 의 키) */
export class InterestError extends Error {
  constructor(public code: "principal" | "badStart" | "badEnd" | "endBeforeStart" | "badCustom") {
    super(code)
  }
}

const DEN_YEAR = BigInt(365)
const DEN_MICRO = BigInt(1_000_000)

/** 기간 일수. includeFirst 면 시작일도 하루로 셈 */
export function periodDays(start: string, end: string, includeFirst: boolean): number {
  const d = diffDays(start, end)
  if (d < 0) throw new InterestError("endBeforeStart")
  return Math.max(d + (includeFirst ? 1 : 0), 0)
}

/** 해당 날짜의 소송촉진법 이율(백만분율) */
export function sochokRateOn(day: string): number {
  for (const row of SOCHOK_RATES) {
    if (row.from && day < row.from) continue
    if (!row.to || day <= row.to) return row.rate * 10_000
  }
  return 12 * 10_000
}

function presetMicro(kind: RateKind): number {
  if (kind === "commercial") return COMMERCIAL_RATE * 10_000
  return CIVIL_RATE * 10_000
}

/** 원금 × 이율 × 일수 ÷ 365 의 분자 (분모는 365 × 1,000,000) */
function rawNumerator(principal: number, rateMicro: number, days: number): bigint {
  return BigInt(principal) * BigInt(rateMicro) * BigInt(days)
}

export function calcInterest(input: InterestInput): InterestResult {
  const { principal, start, end, kind } = input
  const includeFirst = input.includeFirst ?? true
  if (!Number.isSafeInteger(principal) || principal <= 0) throw new InterestError("principal")
  if (parseISODate(start) === null) throw new InterestError("badStart")
  if (parseISODate(end) === null) throw new InterestError("badEnd")
  if (end < start) throw new InterestError("endBeforeStart")

  const den = DEN_YEAR * DEN_MICRO
  const segments: InterestSegment[] = []
  let totalNum = BigInt(0)

  if (kind === "sochok") {
    let cursor = start
    while (cursor <= end) {
      const rate = sochokRateOn(cursor)
      let next = end
      for (const row of SOCHOK_RATES) {
        const lo = row.from ?? "0001-01-01"
        if (row.rate * 10_000 === rate && row.to && lo <= cursor && cursor <= row.to) {
          next = end < row.to ? end : row.to
          break
        }
      }
      // 첫 구간만 초일 산입 여부를 따르고, 이율이 바뀐 뒤 구간은 그날부터 셈
      const days = periodDays(cursor, next, cursor === start ? includeFirst : true)
      if (days > 0) {
        const num = rawNumerator(principal, rate, days)
        totalNum += num
        segments.push({ from: cursor, to: next, days, rateMicro: rate, interest: Number(roundHalfUp(num, den)) })
      }
      cursor = addDays(next, 1)
    }
  } else {
    let rate: number
    if (kind === "custom") {
      const micro = percentToMicro(input.customPercent ?? "")
      if (micro === null || micro <= 0) throw new InterestError("badCustom")
      rate = micro
    } else {
      rate = presetMicro(kind)
    }
    const days = periodDays(start, end, includeFirst)
    const num = rawNumerator(principal, rate, days)
    totalNum = num
    segments.push({ from: start, to: end, days, rateMicro: rate, interest: Number(roundHalfUp(num, den)) })
  }

  const interest = Number(roundHalfUp(totalNum, den))
  return {
    principal,
    interest,
    total: principal + interest,
    days: segments.reduce((s, x) => s + x.days, 0),
    includeFirst,
    kind,
    segments,
  }
}
