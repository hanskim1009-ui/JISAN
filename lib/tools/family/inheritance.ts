/**
 * 법정상속분 (SCS damages_calc `inheritance_shares`·`_op_inheritance` 를 옮김. 금액 나누기는 `estate_division` 과 같은 방식).
 * 민법 제1000조(순위)·제1001조(대습상속)·제1003조(배우자)·제1009조(배우자 5할 가산)·제1010조(대습상속분).
 */
import { add, commonDenominator, frac, isZero, mul, percentOf, wonOf, type Fraction } from "./fraction"

/** spouse 배우자 · descendant 자녀 등 직계비속 · ascendant 부모 등 직계존속 · sibling 형제자매 · collateral 4촌 이내 방계혈족 · substituted 대습상속인(먼저 사망한 사람의 자녀) · substitutedSpouse 먼저 사망한 사람의 배우자 */
export type HeirRole = "spouse" | "descendant" | "ascendant" | "sibling" | "collateral" | "substituted" | "substitutedSpouse"

export type HeirInput = {
  id: string
  name: string
  role: HeirRole
  /** 상속이 시작되기(피상속인 사망) 전에 먼저 사망했는지 (자녀·형제자매만 대습) */
  deceased?: boolean
  /** 대습상속인일 때 누구를 대신하는지 (그 사람의 id) */
  group?: string
}

export type Rank = "descendant" | "ascendant" | "spouseOnly" | "sibling" | "collateral"

export const RANK_LABEL: Record<Rank, string> = {
  descendant: "1순위: 자녀 등 직계비속 (배우자와 함께)",
  ascendant: "2순위: 부모 등 직계존속 (배우자와 함께)",
  spouseOnly: "배우자 단독",
  sibling: "3순위: 형제자매",
  collateral: "4순위: 4촌 이내 방계혈족",
}

export const ROLE_LABEL: Record<HeirRole, string> = {
  spouse: "배우자",
  descendant: "자녀",
  ascendant: "직계존속",
  sibling: "형제자매",
  collateral: "방계혈족",
  substituted: "대습상속인",
  substitutedSpouse: "대습상속인(배우자)",
}

export type ShareRow = {
  id: string
  name: string
  role: HeirRole
  /** 대습상속인이면 대신하는 사람 */
  via?: { id: string; name: string; role: HeirRole }
  /** 가중치: 배우자 3, 그 밖 2 (= 1.5 : 1) */
  share: Fraction
  percent: number
  amount?: number
}

export type InheritanceResult = {
  rank: Rank
  heirs: ShareRow[]
  /** 모든 상속분의 공통 분모 (예: 배우자+자녀 3명 → 9) */
  denominator: bigint
  estate?: number
}

/** 배우자 1.5, 나머지 1 → 정수로 3 : 2 */
const weight = (r: HeirRole) => (r === "spouse" || r === "substitutedSpouse" ? 3 : 2)

/** 대습상속이 되는 사람: 자녀(직계비속)·형제자매만 (민법 제1001조) */
const CAN_BE_SUBSTITUTED: HeirRole[] = ["descendant", "sibling"]

export function inheritanceShares(heirs: HeirInput[], estate?: number): InheritanceResult {
  const spouses = heirs.filter((h) => h.role === "spouse")
  if (spouses.length > 1) throw new Error("배우자는 한 명만 입력할 수 있습니다.")

  const subsOf = (p: HeirInput) =>
    CAN_BE_SUBSTITUTED.includes(p.role) ? heirs.filter((s) => (s.role === "substituted" || s.role === "substitutedSpouse") && s.group === p.id) : []
  // 먼저 사망했고 대신 받을 사람도 없으면 상속인이 아님 → 다른 사람 몫이 커짐
  const counts = (p: HeirInput) => !p.deceased || subsOf(p).length > 0
  const of = (role: HeirRole) => heirs.filter((h) => h.role === role && counts(h))

  const descendants = of("descendant")
  const ascendants = of("ascendant")
  const siblings = of("sibling")
  const collaterals = of("collateral")

  // 제1000조 순위. 배우자는 1·2순위와만 같이 받고, 없으면 혼자 받음(제1003조)
  let rank: Rank
  let primary: HeirInput[]
  if (descendants.length) {
    rank = "descendant"
    primary = [...spouses, ...descendants]
  } else if (ascendants.length) {
    rank = "ascendant"
    primary = [...spouses, ...ascendants]
  } else if (spouses.length) {
    rank = "spouseOnly"
    primary = spouses
  } else if (siblings.length) {
    rank = "sibling"
    primary = siblings
  } else if (collaterals.length) {
    rank = "collateral"
    primary = collaterals
  } else {
    throw new Error("상속인을 한 명 이상 입력해 주세요.")
  }

  const total = primary.reduce((s, p) => s + weight(p.role), 0)
  const rows: ShareRow[] = []
  for (const p of primary) {
    const share = frac(weight(p.role), total)
    const subs = subsOf(p)
    if (p.deceased && subs.length) {
      // 제1010조: 대신 받는 사람끼리 다시 제1009조로 나눔 (배우자 1.5 : 자녀 1)
      const subTotal = subs.reduce((s, x) => s + weight(x.role), 0)
      for (const s of subs) {
        const each = mul(share, frac(weight(s.role), subTotal))
        rows.push({ id: s.id, name: s.name, role: s.role, via: { id: p.id, name: p.name, role: p.role }, share: each, percent: percentOf(each) })
      }
    } else if (!p.deceased) {
      rows.push({ id: p.id, name: p.name, role: p.role, share, percent: percentOf(share) })
    }
  }
  if (!rows.length) throw new Error("상속인을 한 명 이상 입력해 주세요.")

  // 합이 1인지 확인 (계산 실수 방지)
  const sum = rows.reduce((s, r) => add(s, r.share), frac(0))
  if (sum.n !== sum.d) throw new Error("상속분 합계가 1이 아닙니다.")

  const est = estate && estate > 0 ? Math.floor(estate) : undefined
  if (est !== undefined) for (const r of rows) r.amount = wonOf(est, r.share)

  return { rank, heirs: rows, denominator: commonDenominator(rows.map((r) => r.share).filter((f) => !isZero(f))), estate: est }
}
