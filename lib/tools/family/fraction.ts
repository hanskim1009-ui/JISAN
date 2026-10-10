/** 상속분·유류분 계산용 분수 (소수 오차 없이 정확히) */
export type Fraction = { n: bigint; d: bigint }

const abs = (x: bigint) => (x < BigInt(0) ? -x : x)

function gcd(a: bigint, b: bigint): bigint {
  a = abs(a)
  b = abs(b)
  while (b !== BigInt(0)) [a, b] = [b, a % b]
  return a
}

export function lcm(a: bigint, b: bigint): bigint {
  return (abs(a) / gcd(a, b)) * abs(b)
}

export function frac(n: number | bigint, d: number | bigint = 1): Fraction {
  let nn = BigInt(n)
  let dd = BigInt(d)
  if (dd === BigInt(0)) throw new Error("분모가 0입니다.")
  if (dd < BigInt(0)) {
    nn = -nn
    dd = -dd
  }
  const g = gcd(nn, dd) || BigInt(1)
  return { n: nn / g, d: dd / g }
}

export const add = (a: Fraction, b: Fraction) => frac(a.n * b.d + b.n * a.d, a.d * b.d)
export const mul = (a: Fraction, b: Fraction) => frac(a.n * b.n, a.d * b.d)
export const div = (a: Fraction, b: Fraction) => frac(a.n * b.d, a.d * b.n)
export const isZero = (a: Fraction) => a.n === BigInt(0)

/** 약분한 꼴 "1/3" (정수면 "1") */
export function fracText(a: Fraction): string {
  return a.d === BigInt(1) ? String(a.n) : `${a.n}/${a.d}`
}

/** 분모를 맞춘 꼴 "3/9" (판결문처럼 여러 사람 몫을 같은 분모로 보여 줄 때) */
export function fracOver(a: Fraction, denom: bigint): string {
  if (isZero(a)) return "0"
  return `${(a.n * denom) / a.d}/${denom}`
}

/** 여러 분수의 공통 분모 */
export function commonDenominator(list: Fraction[]): bigint {
  return list.reduce((acc, f) => lcm(acc, f.d), BigInt(1))
}

/** 정수 금액 × 분수를 원 단위로 반올림 (0.5 는 올림, SCS 의 ROUND_HALF_UP 과 같음) */
export function wonOf(amount: number, f: Fraction): number {
  const x = BigInt(Math.trunc(amount)) * f.n
  const neg = x < BigInt(0)
  const q = (abs(x) * BigInt(2) + f.d) / (f.d * BigInt(2))
  return Number(neg ? -q : q)
}

/** 백분율, 소수 둘째 자리 반올림 (예: 42.86) */
export function percentOf(f: Fraction): number {
  const x = f.n * BigInt(10000)
  const q = (abs(x) * BigInt(2) + f.d) / (f.d * BigInt(2))
  return Number(x < BigInt(0) ? -q : q) / 100
}
