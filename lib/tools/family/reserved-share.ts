/**
 * 유류분 (SCS damages_calc `reserved_portions`·`_op_reserved_share` 를 옮김).
 * 민법 제1112조(유류분 비율)·제1113조(기초재산 = 상속재산 + 증여 − 채무).
 *
 * 형제자매: 2024. 4. 25. 헌법재판소 2020헌가4 등 결정으로 제1112조 제4호가 위헌,
 * 2024. 9. 20. 민법 개정으로 삭제 → 유류분 없음.
 */
import { frac, isZero, mul, wonOf, type Fraction } from "./fraction"
import { inheritanceShares, type HeirInput, type HeirRole, type InheritanceResult, type ShareRow } from "./inheritance"

/** 법정상속분에 곱하는 유류분 비율 */
export function reservedRatio(role: HeirRole): Fraction {
  if (role === "spouse" || role === "descendant") return frac(1, 2)
  if (role === "ascendant") return frac(1, 3)
  // 형제자매(삭제)·4촌 이내 방계혈족(원래 없음)
  return frac(0)
}

export type ReservedRow = ShareRow & {
  /** 유류분 비율 (1/2, 1/3, 0) */
  ratio: Fraction
  /** 유류분 = 법정상속분 × 비율 (기초재산에 대한 몫) */
  portion: Fraction
  /** 유류분 금액 */
  reserved: number
}

export type ReservedResult = {
  rank: InheritanceResult["rank"]
  estate: number
  gifts: number
  debts: number
  /** 유류분 기초재산 = 상속재산 + 증여 − 채무 */
  base: number
  heirs: ReservedRow[]
  total: number
  /** 상속인 전원에게 유류분이 없는 경우 그 까닭 (형제자매·방계혈족 순위) */
  noneReason: "sibling" | "collateral" | null
}

export function reservedShares(input: { heirs: HeirInput[]; estate: number; gifts: number; debts: number }): ReservedResult {
  const estate = Math.max(0, Math.floor(input.estate))
  const gifts = Math.max(0, Math.floor(input.gifts))
  const debts = Math.max(0, Math.floor(input.debts))
  const base = estate + gifts - debts
  const inh = inheritanceShares(input.heirs)
  const rows: ReservedRow[] = inh.heirs.map((h) => {
    // 대습상속인은 대신하는 사람의 비율을 이어받음 (제1118조 → 제1001조·제1010조 준용)
    const ratio = reservedRatio(h.via ? h.via.role : h.role)
    const portion = mul(h.share, ratio)
    const reserved = base > 0 && !isZero(portion) ? wonOf(base, portion) : 0
    return { ...h, ratio, portion, reserved }
  })
  return {
    rank: inh.rank,
    estate,
    gifts,
    debts,
    base,
    heirs: rows,
    total: rows.reduce((s, r) => s + r.reserved, 0),
    noneReason: inh.rank === "sibling" || inh.rank === "collateral" ? inh.rank : null,
  }
}
