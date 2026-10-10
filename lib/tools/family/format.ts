/** 금액 표기: 1234000 → "1,234,000원" */
export function formatWon(n: number): string {
  return `${Math.round(n).toLocaleString("ko-KR")}원`
}

/** 큰 금액을 읽기 쉽게: 425000000 → "4억 2,500만 원" (입력칸 아래 도움말용) */
export function wonInKorean(n: number): string {
  const v = Math.floor(Math.abs(n))
  if (v === 0) return "0원"
  const jo = Math.floor(v / 1e12)
  const eok = Math.floor((v % 1e12) / 1e8)
  const man = Math.floor((v % 1e8) / 1e4)
  const rest = v % 1e4
  const parts: string[] = []
  if (jo) parts.push(`${jo.toLocaleString("ko-KR")}조`)
  if (eok) parts.push(`${eok.toLocaleString("ko-KR")}억`)
  if (man) parts.push(`${man.toLocaleString("ko-KR")}만`)
  if (rest) parts.push(rest.toLocaleString("ko-KR"))
  return `${n < 0 ? "-" : ""}${parts.join(" ")} 원`
}

/** 입력칸 문자열 → 0 이상의 정수 (쉼표·공백 무시, 비었거나 이상하면 0) */
export function parseWon(s: string): number {
  const digits = s.replace(/[^0-9]/g, "")
  if (!digits) return 0
  const n = Number(digits)
  return Number.isSafeInteger(n) ? n : 0
}
