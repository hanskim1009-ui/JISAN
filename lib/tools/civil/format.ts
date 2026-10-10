/**
 * 민사 계산기 공통: 날짜(YYYY-MM-DD 문자열)와 금액 표기.
 * 날짜는 시간대 영향을 받지 않도록 UTC 자정 기준으로만 다룹니다.
 */

const DAY_MS = 86_400_000
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]

/** "2026-10-10" → UTC 자정 시각(ms). 잘못된 날짜면 null */
export function parseISODate(value: string | null | undefined): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((value ?? "").trim())
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  const t = Date.UTC(y, mo - 1, d)
  const back = new Date(t)
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null
  return t
}

export function toISODate(t: number): string {
  const d = new Date(t)
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(d.getUTCDate()).padStart(2, "0")
  return `${d.getUTCFullYear()}-${mm}-${dd}`
}

/** iso 에 n일을 더한 날짜 */
export function addDays(iso: string, n: number): string {
  const t = parseISODate(iso)
  if (t === null) throw new Error(`날짜 형식 오류: ${iso}`)
  return toISODate(t + n * DAY_MS)
}

/** b − a 일수 (같은 날이면 0) */
export function diffDays(a: string, b: string): number {
  const ta = parseISODate(a)
  const tb = parseISODate(b)
  if (ta === null || tb === null) throw new Error("날짜 형식 오류")
  return Math.round((tb - ta) / DAY_MS)
}

/** 0=일 … 6=토 */
export function weekdayIndex(iso: string): number {
  const t = parseISODate(iso)
  if (t === null) throw new Error(`날짜 형식 오류: ${iso}`)
  return new Date(t).getUTCDay()
}

/** "2026. 10. 10.(토)" */
export function formatDateKo(iso: string, withWeekday = true): string {
  const t = parseISODate(iso)
  if (t === null) return iso
  const d = new Date(t)
  const base = `${d.getUTCFullYear()}. ${d.getUTCMonth() + 1}. ${d.getUTCDate()}.`
  return withWeekday ? `${base}(${WEEKDAYS[d.getUTCDay()]})` : base
}

/** 천 단위 쉼표 (음수 포함) */
export function formatNumber(n: number | bigint): string {
  const s = typeof n === "bigint" ? n.toString() : String(Math.trunc(n))
  const neg = s.startsWith("-")
  const digits = neg ? s.slice(1) : s
  return (neg ? "-" : "") + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/** "1,234,000원" */
export function formatWon(n: number | bigint): string {
  return `${formatNumber(n)}원`
}

/** 입력칸의 "1,234,000" → 1234000. 숫자가 없으면 null */
export function parseAmount(value: string): number | null {
  const digits = value.replace(/[^\d]/g, "")
  if (!digits) return null
  const n = Number(digits)
  return Number.isSafeInteger(n) ? n : null
}

/** 연이율 퍼센트 문자열("7.5") → 백만분율 정수(75,000). 소수 넷째 자리까지 */
export function percentToMicro(value: string | number): number | null {
  const s = String(value).trim()
  const m = /^(\d{1,3})(?:\.(\d{1,4}))?$/.exec(s)
  if (!m) return null
  const whole = Number(m[1])
  const frac = Number((m[2] ?? "").padEnd(4, "0"))
  return whole * 10_000 + frac
}

/** 백만분율 → "12%" / "7.5%" */
export function formatPercentMicro(micro: number): string {
  const whole = Math.floor(micro / 10_000)
  const frac = String(micro % 10_000).padStart(4, "0").replace(/0+$/, "")
  return frac ? `${whole}.${frac}%` : `${whole}%`
}

/** 양의 유리수 num/den 을 원 단위로 반올림(사사오입) */
export function roundHalfUp(num: bigint, den: bigint): bigint {
  const two = BigInt(2)
  return (num * two + den) / (two * den)
}
