/**
 * 음주운전 처벌 기준 확인 (/tools/drunk-driving).
 * 법정형과 면허 행정처분만 계산합니다. 실제 구형·선고 예상은 다루지 않습니다.
 *
 * 근거 (국가법령정보센터 현행 원문, 2026. 10. 10. 확인)
 * - 도로교통법 [시행 2026. 7. 1.] 제44조, 제80조의2, 제82조 제2항·제3항, 제93조 제1항, 제142조, 제148조, 제148조의2, 제151조, 제156조
 *   (2026. 12. 3.·2027. 6. 3. 시행 예정 개정은 이 계산에 쓰는 조문의 내용을 바꾸지 않음)
 * - 도로교통법 시행규칙 [시행 2026. 8. 24.] 별표 28 (운전면허 취소·정지처분 기준, 2026. 8. 24. 개정)
 * - 특정범죄 가중처벌 등에 관한 법률 [시행 2025. 7. 2.] 제5조의3, 제5조의11
 * - 교통사고처리 특례법 [시행 2025. 6. 4.] 제3조, 제4조
 * - 행정심판법 제27조
 *
 * 결과 문장은 직접 만들지 않고 사전 키(Msg)로 돌려줍니다. 문장은 content/tools/i18n/{언어}/drunk-driving.json 의 msg.
 */
import { msg, type Msg } from "@/lib/tools/i18n-format"

/** 측정 결과 */
export type TestKind = "measured" | "refused" | "obstructed"
/** 이전 음주운전·측정거부·측정방해 전력 */
export type Prior = "none" | "recent" | "old"
/** 사고 */
export type Accident = "none" | "property" | "injury" | "death"

export type DdInput = {
  test: TestKind
  /** 혈중알코올농도 (퍼센트). test 가 measured 일 때만 */
  bac?: number
  prior: Prior
  /** 이전 위반한 날부터 5년 안에 이번에 위반했는지 (조건부 운전면허) */
  priorWithin5?: boolean
  /** 이전 음주운전 때도 교통사고를 냈는지 (결격기간 3년) */
  priorAccident?: boolean
  accident: Accident
  /** 사고 뒤 구호·인적사항 제공 등 조치 없이 떠났는지 */
  fled?: boolean
}

export type Penalty = {
  /** 무엇에 대한 법정형인지 */
  label: Msg
  /** 법정형 문장 */
  text: Msg
  /** 근거 조문 */
  law: Msg
  note?: Msg
}

export type LicenseResult = {
  action: "none" | "suspend" | "revoke"
  /** 한 줄 요약 (예: "면허 취소") */
  title: Msg
  /** 근거 */
  law: Msg
  /** 이유·설명 */
  lines: Msg[]
  /** 결격기간 (취소일 때) */
  disqualification?: { years: number; law: Msg; reason: Msg }
  /** 음주운전 방지장치 조건부 운전면허 안내 */
  conditional?: Msg
  /** 생계형 감경 이의신청 안내 (대상이 될 수 있을 때만) */
  reduction?: Msg
}

export type DdResult = {
  /** 적용 구간 요약 */
  tierLabel: Msg
  /** 음주운전·측정거부 자체에 대한 법정형. 0.03% 미만이면 null */
  main: Penalty | null
  /** 사고에 따라 함께 문제 되는 죄 */
  accident: Penalty[]
  license: LicenseResult
  /** 덧붙일 설명 */
  notes: Msg[]
}

/** 처벌 기준 (퍼센트) */
export const BAC_LIMIT = 0.03

/** "0.08", ".08", "0.08%", "0,08"(쉼표 소수점 언어) 같은 입력 → 숫자. 0 이상 1 미만만 */
export function parseBac(raw: string): number | null {
  const s = raw.trim().replace(/%$/, "").trim().replace(",", ".")
  if (s === "" || !/^\d*\.?\d+$/.test(s)) return null
  const n = Number(s)
  if (!Number.isFinite(n) || n < 0 || n >= 1) return null
  return n
}

/** 소수 비교 오차를 없애려고 1만분의 1 단위 정수로 바꿔 비교 */
const bp = (x: number) => Math.round(x * 10000)

export type BacBand = "under" | "low" | "mid" | "high"

/** 0.03 미만 / 0.03 이상 0.08 미만 / 0.08 이상 0.2 미만 / 0.2 이상 */
export function bacBand(bac: number): BacBand {
  const v = bp(bac)
  if (v < 300) return "under"
  if (v < 800) return "low"
  if (v < 2000) return "mid"
  return "high"
}

/** 문장 키 (content/tools/i18n/{언어}/drunk-driving.json 의 msg 아래) */
const m = (k: string, v?: Msg["v"]) => msg(`msg.${k}`, v)
const repeatOf = (base: Msg) => m("repeat", { base })

/** 음주운전·측정거부 자체의 법정형 (도로교통법 제148조의2) */
function mainPenalty(input: DdInput, band: BacBand | null): Penalty | null {
  const repeat = input.prior === "recent"
  if (input.test !== "measured") {
    const what = m(input.test === "refused" ? "test.refusedLabel" : "test.obstructedLabel")
    if (repeat)
      return {
        label: repeatOf(what),
        text: m("penalty.y1to6f500to3000"),
        law: m("law.rta148_2_1_1"),
      }
    return {
      label: what,
      text: m("penalty.y1to5f500to2000"),
      law: m(input.test === "refused" ? "law.rta148_2_2_1" : "law.rta148_2_2_2"),
    }
  }
  if (!band || band === "under") return null
  if (repeat) {
    if (band === "high")
      return {
        label: repeatOf(m("band.high")),
        text: m("penalty.y2to6f1000to3000"),
        law: m("law.rta148_2_1_2"),
      }
    return {
      label: repeatOf(m("band.lowMid")),
      text: m("penalty.y1to5f500to2000"),
      law: m("law.rta148_2_1_3"),
    }
  }
  if (band === "high") return { label: m("band.high"), text: m("penalty.y2to5f1000to2000"), law: m("law.rta148_2_3_1") }
  if (band === "mid") return { label: m("band.mid"), text: m("penalty.y1to2f500to1000"), law: m("law.rta148_2_3_2") }
  return { label: m("band.low"), text: m("penalty.y1f500"), law: m("law.rta148_2_3_3") }
}

/** 사고에 따라 함께 문제 되는 죄의 법정형 */
function accidentPenalties(input: DdInput, drunk: boolean): Penalty[] {
  const out: Penalty[] = []
  const { accident, fled } = input
  if (accident === "none") return out

  if (accident === "property") {
    out.push({
      label: m("label.propertyDamage"),
      text: m("penalty.propertyDamage"),
      law: m("law.rta151"),
      note: m("note.propertyDamage"),
    })
  } else {
    const death = accident === "death"
    if (drunk) {
      out.push({
        label: m(death ? "label.dangerDeath" : "label.dangerInjury"),
        text: m(death ? "penalty.dangerDeath" : "penalty.dangerInjury"),
        law: m("law.spca5_11"),
        note: m("note.danger"),
      })
    }
    out.push({
      label: m(death ? "label.negligenceDeath" : "label.negligenceInjury"),
      text: m("penalty.negligence"),
      law: m("law.tsa3_1"),
      note: death ? undefined : drunk || input.test !== "measured" ? m("note.negligenceDrunk") : undefined,
    })
  }

  if (fled) {
    if (accident === "injury" || accident === "death") {
      out.push({
        label: m(accident === "death" ? "label.fledDeath" : "label.fledInjury"),
        text: m(accident === "death" ? "penalty.fledDeath" : "penalty.fledInjury"),
        law: m("law.spca5_3"),
        note: m("note.fled"),
      })
    } else {
      out.push({
        label: m("label.fledProperty"),
        text: m("penalty.fledProperty"),
        law: m("law.rta148_54"),
        note: m("note.fledProperty"),
      })
    }
  }
  return out
}

/** 면허 처분 (도로교통법 제93조, 시행규칙 별표 28) 과 결격기간 (제82조 제2항) */
function licenseResult(input: DdInput, band: BacBand | null): LicenseResult {
  const { test, prior, accident } = input
  const hasPrior = prior !== "none"
  const injury = accident === "injury" || accident === "death"
  const anyAccident = accident !== "none"
  const measuredUnder = test === "measured" && band === "under"

  if (measuredUnder) {
    return {
      action: "none",
      title: m("lic.noneTitle"),
      law: m("law.licNone"),
      lines: [m("lic.noneUnder"), ...(anyAccident ? [m("lic.noneAccident")] : [])],
    }
  }

  // 정지: 0.03 이상 0.08 미만, 전력 없음, 사람이 다치지 않음
  if (test === "measured" && band === "low" && !hasPrior && !injury) {
    return {
      action: "suspend",
      title: m("lic.suspendTitle"),
      law: m("law.licSuspend"),
      lines: [m("lic.suspend100"), m("lic.suspendEdu"), ...(anyAccident ? [m("lic.suspendAccident")] : [])],
      reduction: reductionText(input, band, "suspend"),
    }
  }

  // 취소 사유
  const reasons: Msg[] = []
  let law = m("law.licBase")
  if (test === "refused") {
    reasons.push(m("lic.revokeRefused"))
    law = m("law.licRefused")
  } else if (test === "obstructed") {
    reasons.push(m("lic.revokeObstructed"))
    law = m("law.licObstructed")
  } else {
    if (hasPrior) reasons.push(m("lic.revokePrior"))
    if (band === "mid" || band === "high") reasons.push(m("lic.revokeHigh"))
    if (injury) reasons.push(m("lic.revokeInjury"))
    law = m(hasPrior ? "law.licPrior" : "law.licFirst")
  }

  return {
    action: "revoke",
    title: m("lic.revokeTitle"),
    law,
    lines: [...reasons, m("lic.revokeEdu")],
    disqualification: disqualification(input),
    conditional: hasPrior && input.priorWithin5 ? m("lic.conditional") : undefined,
    reduction: reductionText(input, band, "revoke"),
  }
}

/** 결격기간 (도로교통법 제82조 제2항). 면허가 있던 사람이 취소된 경우 기준 */
function disqualification(input: DdInput): { years: number; law: Msg; reason: Msg } {
  const { test, prior, accident, fled, priorAccident } = input
  const hasPrior = prior !== "none"
  const injury = accident === "injury" || accident === "death"
  const obstructed = test === "obstructed"

  if (injury && fled) return { years: 5, law: m(obstructed ? "law.dq3c" : "law.dq3a"), reason: m("dq.fled") }
  if (accident === "death") return { years: 5, law: m(obstructed ? "law.dq3d" : "law.dq3b"), reason: m("dq.death") }
  if (accident !== "none" && hasPrior && priorAccident) return { years: 3, law: m("law.dq5"), reason: m("dq.twoAccidents") }
  if (accident !== "none") return { years: 2, law: m(obstructed ? "law.dq6c" : "law.dq6b"), reason: m("dq.accident") }
  if (hasPrior) return { years: 2, law: m("law.dq6a"), reason: m("dq.repeat") }
  return { years: 1, law: m("law.dq7"), reason: m("dq.other") }
}

/**
 * 생계형 감경 이의신청 (별표 28 제1호 바목).
 * 0.1% 초과, 인적피해 사고, 측정 불응·도주, 음주운전 전력(2001. 6. 30. 이후)이 있으면 대상이 아님.
 * 음주측정방해는 감경 사유 문언("음주운전으로 ... 처분을 받은 경우")에 맞는지 분명하지 않아 안내하지 않음.
 */
function reductionText(input: DdInput, band: BacBand | null, action: "suspend" | "revoke"): Msg | undefined {
  if (input.test !== "measured" || input.bac === undefined) return undefined
  if (bp(input.bac) > 1000) return undefined
  if (input.accident === "injury" || input.accident === "death") return undefined
  if (input.fled) return undefined
  if (input.prior !== "none") return undefined
  if (band === "under") return undefined
  return m("lic.reduction", { effect: m(action === "revoke" ? "lic.reductionRevoke" : "lic.reductionSuspend") })
}

/** 계산 */
export function evaluateDrunkDriving(input: DdInput): DdResult {
  const band = input.test === "measured" && input.bac !== undefined ? bacBand(input.bac) : null
  const drunk = input.test === "measured" ? band !== null && band !== "under" : true
  const main = mainPenalty(input, band)
  const notes: Msg[] = []

  const tierLabel =
    input.test === "measured"
      ? band
        ? band !== "under" && input.prior === "recent"
          ? repeatOf(m(`band.${band}`))
          : m(`band.${band}`)
        : m("noBac")
      : input.prior === "recent"
        ? repeatOf(m(`test.${input.test}`))
        : m(`test.${input.test}`)

  if (input.test === "measured" && band === "under") notes.push(m("notes.under"))
  if (input.prior === "recent") notes.push(m("notes.recent"))
  else if (input.prior === "old" && main) notes.push(m("notes.old"))
  if (input.accident !== "none" && main) notes.push(m("notes.concurrent"))
  if (input.test === "refused") notes.push(m("notes.refused"))

  return {
    tierLabel,
    main,
    accident: accidentPenalties(input, drunk),
    license: licenseResult(input, band),
    notes,
  }
}

/** 면허 처분 불복 안내 (모든 결과 공통) */
export const LICENSE_APPEAL: Msg = m("appeal")
