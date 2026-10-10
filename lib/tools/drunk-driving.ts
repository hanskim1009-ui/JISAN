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
 */

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
  label: string
  /** 법정형 문장 */
  text: string
  /** 근거 조문 */
  law: string
  note?: string
}

export type LicenseResult = {
  action: "none" | "suspend" | "revoke"
  /** 한 줄 요약 (예: "면허 취소") */
  title: string
  /** 근거 */
  law: string
  /** 이유·설명 */
  lines: string[]
  /** 결격기간 (취소일 때) */
  disqualification?: { years: number; law: string; reason: string }
  /** 음주운전 방지장치 조건부 운전면허 안내 */
  conditional?: string
  /** 생계형 감경 이의신청 안내 (대상이 될 수 있을 때만) */
  reduction?: string
}

export type DdResult = {
  /** 적용 구간 요약 */
  tierLabel: string
  /** 음주운전·측정거부 자체에 대한 법정형. 0.03% 미만이면 null */
  main: Penalty | null
  /** 사고에 따라 함께 문제 되는 죄 */
  accident: Penalty[]
  license: LicenseResult
  /** 덧붙일 설명 */
  notes: string[]
}

/** 처벌 기준 (퍼센트) */
export const BAC_LIMIT = 0.03

/** "0.08", ".08", "0.08%" 같은 입력 → 숫자. 0 이상 1 미만만 */
export function parseBac(raw: string): number | null {
  const s = raw.trim().replace(/%$/, "").trim()
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

const BAND_LABEL: Record<BacBand, string> = {
  under: "0.03% 미만",
  low: "0.03% 이상 0.08% 미만",
  mid: "0.08% 이상 0.2% 미만",
  high: "0.2% 이상",
}

const TEST_LABEL: Record<Exclude<TestKind, "measured">, string> = {
  refused: "측정 거부",
  obstructed: "음주측정방해",
}

/** 음주운전·측정거부 자체의 법정형 (도로교통법 제148조의2) */
function mainPenalty(input: DdInput, band: BacBand | null): Penalty | null {
  const repeat = input.prior === "recent"
  if (input.test !== "measured") {
    const what = input.test === "refused" ? "음주측정 거부" : "음주측정방해(운전 뒤 측정을 어렵게 하려고 술을 더 마시는 등)"
    if (repeat)
      return {
        label: `${what} · 10년 안 재위반`,
        text: "1년 이상 6년 이하 징역이나 500만원 이상 3천만원 이하 벌금",
        law: "도로교통법 제148조의2 제1항 제1호",
      }
    return {
      label: what,
      text: "1년 이상 5년 이하 징역이나 500만원 이상 2천만원 이하 벌금",
      law: `도로교통법 제148조의2 제2항 제${input.test === "refused" ? 1 : 2}호`,
    }
  }
  if (!band || band === "under") return null
  if (repeat) {
    if (band === "high")
      return {
        label: "0.2% 이상 · 10년 안 재위반",
        text: "2년 이상 6년 이하 징역이나 1천만원 이상 3천만원 이하 벌금",
        law: "도로교통법 제148조의2 제1항 제2호",
      }
    return {
      label: "0.03% 이상 0.2% 미만 · 10년 안 재위반",
      text: "1년 이상 5년 이하 징역이나 500만원 이상 2천만원 이하 벌금",
      law: "도로교통법 제148조의2 제1항 제3호",
    }
  }
  if (band === "high")
    return { label: "0.2% 이상", text: "2년 이상 5년 이하 징역이나 1천만원 이상 2천만원 이하 벌금", law: "도로교통법 제148조의2 제3항 제1호" }
  if (band === "mid")
    return { label: "0.08% 이상 0.2% 미만", text: "1년 이상 2년 이하 징역이나 500만원 이상 1천만원 이하 벌금", law: "도로교통법 제148조의2 제3항 제2호" }
  return { label: "0.03% 이상 0.08% 미만", text: "1년 이하 징역이나 500만원 이하 벌금", law: "도로교통법 제148조의2 제3항 제3호" }
}

/** 사고에 따라 함께 문제 되는 죄의 법정형 */
function accidentPenalties(input: DdInput, drunk: boolean): Penalty[] {
  const out: Penalty[] = []
  const { accident, fled } = input
  if (accident === "none") return out

  if (accident === "property") {
    out.push({
      label: "물건만 부순 사고 (업무상과실 재물손괴)",
      text: "2년 이하 금고나 500만원 이하 벌금",
      law: "도로교통법 제151조",
      note: "물건 피해만 있으면 피해자가 처벌을 원하지 않거나 종합보험 등에 가입돼 있을 때 이 부분은 공소를 제기할 수 없습니다(교통사고처리 특례법 제3조 제2항 본문, 제4조). 음주운전 처벌은 이와 따로 갑니다.",
    })
  } else {
    const death = accident === "death"
    if (drunk) {
      out.push({
        label: death ? "위험운전치사" : "위험운전치상",
        text: death ? "무기 또는 3년 이상 징역" : "1년 이상 15년 이하 징역 또는 1천만원 이상 3천만원 이하 벌금",
        law: "특정범죄 가중처벌 등에 관한 법률 제5조의11 제1항",
        note: "술 때문에 정상적인 운전이 곤란한 상태였다고 인정될 때 적용됩니다. 그 정도에 이르지 않았다고 보면 아래 교통사고처리 특례법이 적용됩니다.",
      })
    }
    out.push({
      label: death ? "교통사고 업무상과실치사" : "교통사고 업무상과실치상",
      text: "5년 이하 금고 또는 2천만원 이하 벌금",
      law: "교통사고처리 특례법 제3조 제1항",
      note: death
        ? undefined
        : drunk || input.test !== "measured"
          ? "음주운전이나 측정 거부·방해가 함께 있는 사고는 종합보험에 가입돼 있거나 피해자와 합의해도 공소를 제기할 수 있습니다(같은 법 제3조 제2항 단서, 제4조 제1항)."
          : undefined,
    })
  }

  if (fled) {
    if (accident === "injury" || accident === "death") {
      out.push({
        label: accident === "death" ? "도주치사 (구호 조치 없이 떠남)" : "도주치상 (구호 조치 없이 떠남)",
        text: accident === "death" ? "무기 또는 5년 이상 징역" : "1년 이상 유기징역 또는 500만원 이상 3천만원 이하 벌금",
        law: "특정범죄 가중처벌 등에 관한 법률 제5조의3 제1항",
        note: "피해자를 사고 장소에서 옮겨 버려두고 달아났다면 더 무거운 제5조의3 제2항이 적용됩니다.",
      })
    } else {
      out.push({
        label: "사고 후 미조치 (물건 피해)",
        text: "5년 이하 징역이나 1천500만원 이하 벌금",
        law: "도로교통법 제148조, 제54조 제1항",
        note: "주차·정차된 차만 부순 것이 분명한데 연락처만 남기지 않은 경우는 20만원 이하 벌금이나 구류 또는 과료입니다(같은 법 제156조 제10호).",
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
      title: "음주운전으로 인한 면허 처분 없음",
      law: "도로교통법 제44조 제4항, 제93조 제1항",
      lines: [
        "혈중알코올농도 0.03% 미만은 술에 취한 상태의 기준에 못 미쳐 음주운전 면허 처분 대상이 아닙니다.",
        ...(anyAccident ? ["사고를 냈다면 사고 결과와 조치 여부에 따른 벌점·처분은 따로 나올 수 있습니다(시행규칙 별표 28 제3호 나목)."] : []),
      ],
    }
  }

  // 정지: 0.03 이상 0.08 미만, 전력 없음, 사람이 다치지 않음
  if (test === "measured" && band === "low" && !hasPrior && !injury) {
    return {
      action: "suspend",
      title: "면허 정지 (벌점 100점)",
      law: "도로교통법 제93조 제1항 제1호, 시행규칙 별표 28 제3호 가목",
      lines: [
        "혈중알코올농도 0.03% 이상 0.08% 미만은 벌점 100점입니다. 정지 기간은 원칙적으로 벌점 1점을 1일로 계산해 100일입니다(별표 28 제1호 다목).",
        "정해진 특별교통안전교육을 마치면 정지 기간이 20일 줄고, 현장참여교육까지 마치면 30일이 더 줄 수 있습니다(별표 28 제1호 라목).",
        ...(anyAccident
          ? ["사고 결과나 사고 뒤 조치를 하지 않은 데 따른 벌점이 더해질 수 있고, 1년 동안 쌓인 벌점이 121점 이상이면 면허가 취소됩니다(별표 28 제1호 다목)."]
          : []),
      ],
      reduction: reductionText(input, band, "suspend"),
    }
  }

  // 취소 사유
  const reasons: string[] = []
  let law = "도로교통법 제93조 제1항"
  if (test === "refused") {
    reasons.push("술에 취했다고 볼 상당한 이유가 있는데 측정에 응하지 않으면 면허를 반드시 취소합니다.")
    law = "도로교통법 제93조 제1항 제3호, 시행규칙 별표 28 제2호"
  } else if (test === "obstructed") {
    reasons.push("운전 뒤 음주측정방해행위를 하면 면허를 반드시 취소합니다.")
    law = "도로교통법 제93조 제1항 제3호의2, 시행규칙 별표 28 제2호"
  } else {
    if (hasPrior) reasons.push("예전에 음주운전·측정거부·측정방해를 한 사람이 다시 0.03% 이상으로 운전하면 기간과 관계없이 면허를 반드시 취소합니다.")
    if (band === "mid" || band === "high") reasons.push("혈중알코올농도 0.08% 이상이면 취소 기준입니다.")
    if (injury) reasons.push("0.03% 이상으로 운전하다 사람을 다치게 하거나 숨지게 하면 취소 기준입니다.")
    law = hasPrior ? "도로교통법 제93조 제1항 제2호, 시행규칙 별표 28 제2호" : "도로교통법 제93조 제1항 제1호, 시행규칙 별표 28 제2호"
  }

  return {
    action: "revoke",
    title: "면허 취소",
    law,
    lines: [
      ...reasons,
      "결격기간이 끝나도 특별교통안전 의무교육을 받아야 면허를 다시 받을 수 있습니다(도로교통법 제82조 제3항).",
    ],
    disqualification: disqualification(input),
    conditional:
      hasPrior && input.priorWithin5
        ? "이전 위반일부터 5년 안에 다시 위반해 면허가 취소됐다면, 다시 운전하려면 음주운전 방지장치를 단 조건부 운전면허를 받아야 합니다. 장치는 결격기간이 끝난 다음 날부터 결격기간과 같은 기간 동안 붙입니다(도로교통법 제80조의2)."
        : undefined,
    reduction: reductionText(input, band, "revoke"),
  }
}

/** 결격기간 (도로교통법 제82조 제2항). 면허가 있던 사람이 취소된 경우 기준 */
function disqualification(input: DdInput): { years: number; law: string; reason: string } {
  const { test, prior, accident, fled, priorAccident } = input
  const hasPrior = prior !== "none"
  const injury = accident === "injury" || accident === "death"
  const obstructed = test === "obstructed"

  if (injury && fled)
    return {
      years: 5,
      law: obstructed ? "도로교통법 제82조 제2항 제3호 다목" : "도로교통법 제82조 제2항 제3호 가목",
      reason: "술을 마시고 운전하다 사람을 다치게 하거나 숨지게 한 뒤 필요한 조치와 신고 없이 떠난 경우",
    }
  if (accident === "death")
    return {
      years: 5,
      law: obstructed ? "도로교통법 제82조 제2항 제3호 라목" : "도로교통법 제82조 제2항 제3호 나목",
      reason: "술을 마시고 운전하다 사람을 숨지게 한 경우",
    }
  if (accident !== "none" && hasPrior && priorAccident)
    return {
      years: 3,
      law: "도로교통법 제82조 제2항 제5호",
      reason: "음주운전(측정 거부·방해 포함) 중 교통사고를 2번 이상 낸 경우",
    }
  if (accident !== "none")
    return {
      years: 2,
      law: obstructed ? "도로교통법 제82조 제2항 제6호 다목" : "도로교통법 제82조 제2항 제6호 나목",
      reason: "음주운전(측정 거부·방해 포함) 중 교통사고를 낸 경우",
    }
  if (hasPrior)
    return {
      years: 2,
      law: "도로교통법 제82조 제2항 제6호 가목",
      reason: "음주운전·측정거부·측정방해를 2번 이상 한 경우",
    }
  return { years: 1, law: "도로교통법 제82조 제2항 제7호", reason: "그 밖의 사유로 면허가 취소된 경우" }
}

/**
 * 생계형 감경 이의신청 (별표 28 제1호 바목).
 * 0.1% 초과, 인적피해 사고, 측정 불응·도주, 음주운전 전력(2001. 6. 30. 이후)이 있으면 대상이 아님.
 * 음주측정방해는 감경 사유 문언("음주운전으로 ... 처분을 받은 경우")에 맞는지 분명하지 않아 안내하지 않음.
 */
function reductionText(input: DdInput, band: BacBand | null, action: "suspend" | "revoke"): string | undefined {
  if (input.test !== "measured" || input.bac === undefined) return undefined
  if (bp(input.bac) > 1000) return undefined
  if (input.accident === "injury" || input.accident === "death") return undefined
  if (input.fled) return undefined
  if (input.prior !== "none") return undefined
  if (band === "under") return undefined
  const effect = action === "revoke" ? "취소 대신 벌점 110점의 정지 처분" : "정지 기간의 2분의 1 감경"
  return `운전이 가족의 생계를 유지할 중요한 수단이라면 처분을 받은 날부터 60일 안에 주소지 시·도경찰청장에게 이의신청을 해 ${effect}을 구할 수 있습니다. 받아들일지는 운전면허행정처분 이의심의위원회가 정합니다(시행규칙 별표 28 제1호 바목).`
}

/** 계산 */
export function evaluateDrunkDriving(input: DdInput): DdResult {
  const band = input.test === "measured" && input.bac !== undefined ? bacBand(input.bac) : null
  const drunk = input.test === "measured" ? band !== null && band !== "under" : true
  const main = mainPenalty(input, band)
  const notes: string[] = []

  const tierLabel =
    input.test === "measured"
      ? band
        ? `${BAND_LABEL[band]}${band !== "under" && input.prior === "recent" ? " · 10년 안 재위반" : ""}`
        : "혈중알코올농도 미입력"
      : `${TEST_LABEL[input.test]}${input.prior === "recent" ? " · 10년 안 재위반" : ""}`

  if (input.test === "measured" && band === "under") {
    notes.push("혈중알코올농도 0.03% 미만은 술에 취한 상태의 기준에 못 미쳐 음주운전으로 처벌되지 않습니다(도로교통법 제44조 제4항). 다만 처벌 대상은 운전할 때의 수치여서, 측정 시각과 운전 시각 사이의 간격이 다투어질 수 있습니다.")
  }
  if (input.prior === "recent") {
    notes.push("10년은 이전 사건에서 벌금 이상의 형이 확정된 날부터 계산하고, 그사이 형이 실효됐어도 포함합니다(도로교통법 제148조의2 제1항).")
  } else if (input.prior === "old" && main) {
    notes.push("전력이 10년 기준에 해당하지 않으면 법정형은 처음과 같지만, 실제 처분과 형을 정할 때는 동종 전력으로 고려됩니다.")
  }
  if (input.accident !== "none" && main) {
    notes.push("음주운전과 사고 관련 죄는 함께 성립할 수 있고, 여러 죄를 함께 처벌하면 형의 범위가 넓어질 수 있습니다.")
  }
  if (input.test === "refused") {
    notes.push("호흡측정 결과에 동의하지 않을 때는 동의를 받아 혈액 채취 등으로 다시 측정할 수 있습니다(도로교통법 제44조 제3항). 호흡측정 자체를 거부하면 측정 거부가 될 수 있습니다.")
  }

  return {
    tierLabel,
    main,
    accident: accidentPenalties(input, drunk),
    license: licenseResult(input, band),
    notes,
  }
}

/** 면허 처분 불복 안내 (모든 결과 공통) */
export const LICENSE_APPEAL =
  "면허 정지·취소는 형사 절차와 따로 진행되는 행정처분입니다. 다투려면 처분이 있음을 안 날부터 90일 안에 행정심판을 청구해야 하고(행정심판법 제27조), 행정소송은 행정심판을 거친 뒤에 낼 수 있습니다(도로교통법 제142조). 형사 사건이 무죄로 확정되거나 혐의없음·죄가안됨으로 불송치·불기소되면 처분을 취소하고 벌점을 지웁니다(시행규칙 별표 28 제1호 마목). 벌금 미만의 형·선고유예·기소유예로 끝나면 결격기간 안이라도 면허를 다시 받을 수 있습니다(도로교통법 제82조 제2항 단서)."
