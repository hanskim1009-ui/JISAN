/**
 * 법정 기한 계산 — 사무소 사건관리 프로그램의 기한 계산식을 그대로 옮김.
 * 첫날은 빼고(민법 제157조, 형사소송법 제66조 제1항) 일수를 세고,
 * 마지막 날이 토·일요일 또는 공휴일이면 그다음 날로 미룹니다(민법 제161조, 형사소송법 제66조 제3항).
 * 절차 이름·기간 표기·근거 문구는 content/tools/i18n/{언어}/deadline.json (procedures, groups).
 */
import holidayData from "../../../content/tools/civil/holidays.json"
import deadlineData from "../../../content/tools/civil/deadlines.json"
import { addDays, parseISODate, weekdayIndex } from "./format"

export type Procedure = {
  id: string
  days: number
  /** 불변기간 여부 */
  fixed: boolean
  /** 송달 효력이 0시에 생기는 경우(전자송달 간주 등)를 고를 수 있는지 */
  zeroHour: boolean
}

/** group: 사전 groups 의 키 (civil, exec, family, criminal, admin) */
export type ProcedureGroup = { group: string; items: Procedure[] }

export const PROCEDURE_GROUPS: ProcedureGroup[] = deadlineData
export const PROCEDURES: Procedure[] = PROCEDURE_GROUPS.flatMap((g) => g.items)

const HOLIDAYS: Record<string, string> = holidayData.days
export const HOLIDAY_RANGE: { from: string; to: string } = holidayData.range

/** 공휴일 이름 (관공서의 공휴일에 관한 규정 기준). 일요일만인 날은 null */
export function holidayName(iso: string): string | null {
  return HOLIDAYS[iso] ?? null
}

export function isHolidayTableCovered(iso: string): boolean {
  return iso >= HOLIDAY_RANGE.from && iso <= HOLIDAY_RANGE.to
}

/** 공휴일 표에 나오는 이름 전부 (사전 holidays 의 키와 맞아야 함) */
export const HOLIDAY_NAMES: string[] = [...new Set(Object.values(HOLIDAYS))]

/** 쉬는 날인 이유: 공휴일(이름은 한국어 원래 이름 → 사전 holidays 로 번역) 또는 토·일요일 */
export type RestReason = { holiday: string } | { weekday: "sat" | "sun" }

/** 토·일요일 또는 공휴일이면 그 이유, 아니면 null */
export function restReason(iso: string): RestReason | null {
  const name = holidayName(iso)
  if (name) return { holiday: name }
  const w = weekdayIndex(iso)
  if (w === 6) return { weekday: "sat" }
  if (w === 0) return { weekday: "sun" }
  return null
}

/** 입력 오류 (code 는 사전 ui 의 키) */
export class DeadlineError extends Error {
  constructor(public code: "badDate" | "badDays") {
    super(code)
  }
}

export type DeadlineResult = {
  base: string
  days: number
  includeFirst: boolean
  /** 첫날로 세는 날 */
  countFrom: string
  /** 휴일을 따지기 전 기간의 마지막 날 */
  raw: string
  /** 실제 마감일 */
  due: string
  /** 휴일이라 미뤄진 날들 */
  skipped: { date: string; reason: RestReason }[]
  /** 공휴일 표가 없는 해에 걸쳤는지 */
  outsideHolidayTable: boolean
}

export function calcDeadline(base: string, days: number, includeFirst = false): DeadlineResult {
  if (parseISODate(base) === null) throw new DeadlineError("badDate")
  if (!Number.isInteger(days) || days <= 0) throw new DeadlineError("badDays")
  const countFrom = includeFirst ? base : addDays(base, 1)
  const raw = addDays(countFrom, days - 1)
  const skipped: { date: string; reason: RestReason }[] = []
  let due = raw
  for (let reason = restReason(due); reason; reason = restReason(due)) {
    skipped.push({ date: due, reason })
    due = addDays(due, 1)
  }
  const outsideHolidayTable = !isHolidayTableCovered(raw) || !isHolidayTableCovered(due)
  return { base, days, includeFirst, countFrom, raw, due, skipped, outsideHolidayTable }
}
