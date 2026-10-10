/**
 * 양형기준 선고형 예상 계산 엔진 (순수 함수). 화면(클라이언트)과 시험 스크립트에서 같이 씁니다.
 * 데이터 읽기(fs)는 서버 전용인 lib/tools/sentencing-data.ts 에 있습니다.
 * 규칙은 양형기준 공통원칙: 형량범위의 결정방법(❶❷❸), 권고 형량범위의 특별 조정, 집행유예 기준.
 */
import type { Factor, FactorSet, ProbationFactors, Range, SentCrime, SentType, SentencingGroup } from "./sentencing-types"

export type { Factor, FactorSet, ProbationFactors, Range, SentCrime, SentType, SentencingGroup } from "./sentencing-types"

/** 페이지에 처음 넘기는 가벼운 목록 (범죄군 id·이름·세부 범죄 이름) */
export type GroupSummary = { id: string; name: string; crimes: { id: string; name: string }[] }

export type Zone = "mitigated" | "basic" | "aggravated"

export const ZONES: Zone[] = ["mitigated", "basic", "aggravated"]

export const ZONE_LABEL: Record<Zone, string> = { mitigated: "감경영역", basic: "기본영역", aggravated: "가중영역" }

/* ---------- 표기 ---------- */

/** 개월 → "1년 6월". 반 달 같은 끝수는 일(30일 기준)로 */
export function formatMonths(m: number): string {
  const whole = Math.floor(m + 1e-9)
  const days = Math.round((m - whole) * 30)
  const y = Math.floor(whole / 12)
  const mo = whole % 12
  const parts = [y > 0 ? `${y}년` : "", mo > 0 ? `${mo}월` : "", days > 0 ? `${days}일` : ""].filter(Boolean)
  return parts.length ? parts.join(" ") : "0월"
}

/** 원 → "1억 5,000만 원" */
export function formatWon(n: number): string {
  const v = Math.round(n)
  const eok = Math.floor(v / 100_000_000)
  const man = Math.floor((v % 100_000_000) / 10_000)
  const won = v % 10_000
  const parts = [eok ? `${eok.toLocaleString("ko-KR")}억` : "", man ? `${man.toLocaleString("ko-KR")}만` : "", won ? won.toLocaleString("ko-KR") : ""].filter(Boolean)
  return `${parts.length ? parts.join(" ") : "0"} 원`
}

function amount(r: Range, n: number) {
  return r.unit === "fine" ? formatWon(n) : formatMonths(n)
}

/** 범위를 쉬운 표기로: "1년 ~ 4년", "1년 이하", "11년 이상, 무기" (벌금이면 앞에 "벌금") */
export function rangeLabel(r: Range): string {
  let s: string
  if (r.min == null && r.max == null) s = r.life || r.death ? "" : r.text
  else if (r.min == null) s = `${amount(r, r.max!)} 이하`
  else if (r.max == null) s = `${amount(r, r.min)} 이상`
  else s = r.min === r.max ? amount(r, r.min) : `${amount(r, r.min)} ~ ${amount(r, r.max)}`
  const extra = [r.life ? "무기" : "", r.death ? "사형" : ""].filter(Boolean)
  const body = [s, ...extra].filter(Boolean).join(", ")
  return r.unit === "fine" ? `벌금 ${body}` : body
}

/** 한 칸에 징역과 벌금이 같이 있는 범위인지 (예: "- 8월, 100만 원 - 700만 원"). 이때 min/max 는 징역만 */
export function isMixedRange(r: Range): boolean {
  return r.unit !== "fine" && /원/.test(r.text)
}

/** 화면에 보여 줄 원문 표기. 벌금 칸에 "벌금"이 없으면 앞에 붙임 */
export function rangeText(r: Range): string {
  return r.unit === "fine" && !r.text.includes("벌금") ? `벌금 ${r.text}` : r.text
}

/** 원문 표기 옆에 보조로 붙일 풀어 쓴 표기. 원문과 사실상 같으면 undefined */
export function rangeHint(r: Range): string | undefined {
  if (r.min == null && r.max == null) return undefined
  if (r.unit === "fine") return undefined
  const label = rangeLabel(r)
  const plain = (x: string) => x.replace(/[\s~\-]/g, "")
  if (isMixedRange(r)) return `징역 부분: ${label}`
  return plain(label) === plain(r.text) ? undefined : label
}

/* ---------- 양형인자 ---------- */

/** 이 유형에 쓰는 인자인지 (onlyTypes 가 없으면 모든 유형) */
export function factorApplies(f: Factor, typeNo: string | undefined): boolean {
  return !f.onlyTypes || f.onlyTypes.length === 0 || (typeNo !== undefined && f.onlyTypes.includes(typeNo))
}

export function filterSet(set: FactorSet, typeNo: string | undefined): FactorSet {
  return { act: set.act.filter((f) => factorApplies(f, typeNo)), actor: set.actor.filter((f) => factorApplies(f, typeNo)) }
}

/** 한쪽(가중 또는 감경) 특별양형인자 세기 */
export type Tally = {
  /** 행위인자 (actWeight 인 행위자/기타인자 포함) */
  act: number
  /** 행위자/기타인자 (actWeight 제외) */
  actor: number
  /** 그중 actWeight 로 행위인자처럼 센 수 */
  actWeight: number
  total: number
  /** 고른 인자 이름 */
  labels: string[]
}

export function tally(set: FactorSet, picked: readonly string[], typeNo: string | undefined): Tally {
  const on = new Set(picked)
  const t: Tally = { act: 0, actor: 0, actWeight: 0, total: 0, labels: [] }
  for (const f of set.act) {
    if (!on.has(f.id) || !factorApplies(f, typeNo)) continue
    t.act++
    t.labels.push(f.label)
  }
  for (const f of set.actor) {
    if (!on.has(f.id) || !factorApplies(f, typeNo)) continue
    if (f.actWeight) {
      t.act++
      t.actWeight++
    } else t.actor++
    t.labels.push(f.label)
  }
  t.total = t.act + t.actor
  return t
}

const kinds = (act: number, actor: number) =>
  [act ? `행위인자 ${act}개` : "", actor ? `행위자/기타인자 ${actor}개` : ""].filter(Boolean).join(", ")

export type ZoneDecision = {
  /** 정해진 영역. null 이면 ❶❷로 정해지지 않아 법관이 종합해 정함(❸) */
  zone: Zone | null
  /** 가능한 영역 (정해지면 하나, ❸이면 두 개: 감경·가중) */
  candidates: Zone[]
  /** 판단 근거 (쉬운 말) */
  reasons: string[]
  aggravating: Tally
  mitigating: Tally
}

/**
 * 형량범위의 결정방법
 * ❶ 같은 숫자면 행위인자가 행위자/기타인자보다 무겁다 (처벌불원 등 actWeight 는 행위인자와 같게)
 * ❷ 같은 종류끼리는 같은 무게
 * ❸ 그래도 안 정해지면 법관이 종합 판단
 * 가중요소가 크면 가중, 감경요소가 크면 감경, 그 밖에는 기본.
 */
export function decideZone(agg: Tally, mit: Tally): ZoneDecision {
  const base = { aggravating: agg, mitigating: mit }
  const weightNote =
    agg.actWeight + mit.actWeight > 0 ? ["처벌불원(또는 실질적 피해 회복)처럼 행위인자와 같은 무게로 볼 수 있는 인자는 행위인자로 셌습니다."] : []

  if (agg.total === 0 && mit.total === 0)
    return { ...base, zone: "basic", candidates: ["basic"], reasons: ["고른 특별양형인자가 없어 기본영역입니다."] }
  if (mit.total === 0)
    return {
      ...base,
      zone: "aggravated",
      candidates: ["aggravated"],
      reasons: [`특별가중인자만 있어(${kinds(agg.act, agg.actor)}) 가중요소가 큽니다.`, ...weightNote],
    }
  if (agg.total === 0)
    return {
      ...base,
      zone: "mitigated",
      candidates: ["mitigated"],
      reasons: [`특별감경인자만 있어(${kinds(mit.act, mit.actor)}) 감경요소가 큽니다.`, ...weightNote],
    }

  // ❷ 같은 종류끼리 서로 지우고 남은 것으로 비교
  const dAct = agg.act - mit.act
  const dActor = agg.actor - mit.actor
  const reasons = [
    `가중요소(${kinds(agg.act, agg.actor)})와 감경요소(${kinds(mit.act, mit.actor)})가 함께 있습니다.`,
    ...weightNote,
  ]
  const cancelled = Math.min(agg.act, mit.act) + Math.min(agg.actor, mit.actor) > 0
  if (cancelled) reasons.push("같은 종류의 인자끼리는 같은 무게로 보아 같은 수만큼 서로 지웁니다.")
  const leftWord = cancelled ? "남습니다" : "있습니다"
  const left = {
    agg: { act: Math.max(dAct, 0), actor: Math.max(dActor, 0) },
    mit: { act: Math.max(-dAct, 0), actor: Math.max(-dActor, 0) },
  }
  const aggLeft = left.agg.act + left.agg.actor
  const mitLeft = left.mit.act + left.mit.actor

  if (aggLeft === 0 && mitLeft === 0)
    return { ...base, zone: "basic", candidates: ["basic"], reasons: [...reasons, "지우고 나면 남는 것이 없어 양쪽 무게가 같으므로 기본영역입니다."] }
  if (mitLeft === 0)
    return { ...base, zone: "aggravated", candidates: ["aggravated"], reasons: [...reasons, `가중요소만 남아(${kinds(left.agg.act, left.agg.actor)}) 가중요소가 큽니다.`] }
  if (aggLeft === 0)
    return { ...base, zone: "mitigated", candidates: ["mitigated"], reasons: [...reasons, `감경요소만 남아(${kinds(left.mit.act, left.mit.actor)}) 감경요소가 큽니다.`] }

  // 한쪽엔 행위인자, 다른 쪽엔 행위자/기타인자가 남은 경우
  const actSide: "agg" | "mit" = left.agg.act > 0 ? "agg" : "mit"
  const actorSide = actSide === "agg" ? "mit" : "agg"
  const a = left[actSide].act
  const r = left[actorSide].actor
  const sideName = (s: "agg" | "mit") => (s === "agg" ? "가중요소" : "감경요소")
  const sideZone = (s: "agg" | "mit"): Zone => (s === "agg" ? "aggravated" : "mitigated")
  const remain = `${sideName(actSide)}에는 행위인자 ${a}개, ${sideName(actorSide)}에는 행위자/기타인자 ${r}개가 ${leftWord}.`
  if (a >= r) {
    const zone = sideZone(actSide)
    return {
      ...base,
      zone,
      candidates: [zone],
      reasons: [
        ...reasons,
        remain,
        a === r
          ? `같은 숫자라면 행위인자가 행위자/기타인자보다 무거우므로 ${sideName(actSide)}가 큽니다.`
          : `행위인자 쪽이 숫자도 많고 더 무거우므로 ${sideName(actSide)}가 큽니다.`,
      ],
    }
  }
  return {
    ...base,
    zone: null,
    candidates: ["mitigated", "aggravated"],
    reasons: [
      ...reasons,
      remain,
      "행위인자는 더 무겁지만 숫자는 행위자/기타인자 쪽이 많아, 이 원칙만으로는 어느 쪽이 큰지 정해지지 않습니다. 이때는 법관이 인자들을 종합해 비교한 뒤 정합니다.",
      "어느 쪽이 크다고 보느냐에 따라 감경영역 또는 가중영역이 되고, 비슷하다고 보면 기본영역이 됩니다. 이때는 인자 수 차이가 2개 이상이어도 특별 조정이 자동으로 따라오지 않습니다.",
    ],
  }
}

/* ---------- 특별 조정 ---------- */

const LIFE_OVER = 25 * 12

export type Adjustment = {
  zone: Zone
  /** upper: 상한을 1/2까지 가중, lower: 하한을 1/2까지 감경 */
  kind: "upper" | "lower"
  /** 조정된 범위 */
  range: Range
  /** 범위가 실제로 달라졌는지 (상한·하한이 원래 없으면 그대로) */
  changed: boolean
  /** 개월 미만 끝수를 버리거나 올려 맞췄는지 (화면에 "약" 표시) */
  rounded: boolean
  /** 원문 산식 (예: "상한 6년 × 1.5 = 9년") */
  formula?: string
  reason: string
}

/**
 * 권고 형량범위의 특별 조정
 * 가중영역: 특별가중인자만 2개 이상이거나 가중이 감경보다 2개 이상 많으면 상한 × 1.5 (25년 넘으면 무기 선택 가능)
 * 감경영역: 반대면 하한 × 1/2
 * 원문에 개월 미만 처리 규칙이 없어, 징역은 범위를 넓히는 쪽으로 개월 단위에 맞춤 (하한 내림, 상한 올림)
 */
export function specialAdjust(zone: Zone, range: Range, aggCount: number, mitCount: number): Adjustment | null {
  // 특별 조정은 징역(개월) 칸에만
  if (range.unit === "fine") return null
  const fine = false
  const fmt = (n: number) => amount(range, n)
  if (zone === "aggravated" && aggCount - mitCount >= 2) {
    const reason =
      mitCount === 0
        ? `가중영역에서 특별가중인자만 ${aggCount}개 있어 상한을 1/2까지 늘릴 수 있습니다.`
        : `가중영역에서 특별가중인자가 특별감경인자보다 ${aggCount - mitCount}개 많아 상한을 1/2까지 늘릴 수 있습니다.`
    if (range.max == null)
      return { zone, kind: "upper", range, changed: false, rounded: false, reason: `${reason} 다만 이 범위는 상한이 정해져 있지 않아 달라지지 않습니다.` }
    const exact = range.max * 1.5
    const max = fine ? exact : Math.ceil(exact - 1e-9)
    const to: Range = { ...range, max }
    return {
      zone,
      kind: "upper",
      range: { ...to, text: rangeLabel(to) },
      changed: true,
      rounded: max !== exact,
      formula: `상한 ${fmt(range.max)} × 1.5 = ${fmt(exact)}${max !== exact ? ` → ${fmt(max)}(개월 단위로 올림)` : ""}`,
      reason,
    }
  }
  if (zone === "mitigated" && mitCount - aggCount >= 2) {
    const reason =
      aggCount === 0
        ? `감경영역에서 특별감경인자만 ${mitCount}개 있어 하한을 1/2까지 낮출 수 있습니다.`
        : `감경영역에서 특별감경인자가 특별가중인자보다 ${mitCount - aggCount}개 많아 하한을 1/2까지 낮출 수 있습니다.`
    if (range.min == null)
      return { zone, kind: "lower", range, changed: false, rounded: false, reason: `${reason} 다만 이 범위는 하한이 정해져 있지 않아 달라지지 않습니다.` }
    const exact = range.min / 2
    const min = fine ? exact : Math.floor(exact + 1e-9)
    const to: Range = { ...range, min }
    return {
      zone,
      kind: "lower",
      range: { ...to, text: rangeLabel(to) },
      changed: true,
      rounded: min !== exact,
      formula: `하한 ${fmt(range.min)} × 1/2 = ${fmt(exact)}${min !== exact ? ` → ${fmt(min)}(개월 단위로 내림)` : ""}`,
      reason,
    }
  }
  return null
}

/** 상한이 25년을 넘으면 무기징역도 고를 수 있음 (선고형의 결정방법·특별 조정) */
export function lifeSelectable(r: Range): boolean {
  return r.unit !== "fine" && !!r.max && r.max > LIFE_OVER
}

/* ---------- 집행유예 ---------- */

/** 권고 범위 하한이 3년 이하일 때만 집행유예를 따져 봄 (징역·금고) */
export function probationOpen(ranges: Range[]): boolean {
  // 하한이 없더라도 상한도 없으면 무기·사형만 있는 칸이라 제외
  return ranges.some((r) => r.unit !== "fine" && (r.min == null ? r.max != null : r.min <= 36))
}

export type ProbationCounts = { positiveMajor: number; negativeMajor: number; positiveGeneral: number; negativeGeneral: number }

export type ProbationVerdict = "suspend" | "prison" | "judge"

export const PROBATION_LABEL: Record<ProbationVerdict, string> = {
  suspend: "집행유예 권고",
  prison: "실형 권고",
  judge: "법관이 종합해 정함",
}

export type ProbationResult = { verdict: ProbationVerdict; label: string; rule: 1 | 2 | 3; reasons: string[] }

/**
 * 집행유예 기준
 * ❶ 주요긍정만 2개 이상이거나 주요긍정이 주요부정보다 2개 이상 많으면 집행유예 권고
 * ❷ 반대면 실형 권고
 * ❸ ❶❷에 해당해도 반대쪽 일반사유 차이가 주요사유 차이보다 크거나, ❶❷에 해당하지 않으면 종합 판단
 */
export function decideProbation(c: ProbationCounts): ProbationResult {
  const pm = c.positiveMajor
  const nm = c.negativeMajor
  const pg = c.positiveGeneral
  const ng = c.negativeGeneral
  const counts = `주요사유 긍정 ${pm}개·부정 ${nm}개, 일반사유 긍정 ${pg}개·부정 ${ng}개`
  const res = (verdict: ProbationVerdict, rule: 1 | 2 | 3, reasons: string[]): ProbationResult => ({ verdict, label: PROBATION_LABEL[verdict], rule, reasons: [counts, ...reasons] })

  const major = pm - nm
  if (major >= 2) {
    const opp = ng - pg
    if (opp > major)
      return res("judge", 3, [
        `주요긍정사유가 ${major}개 더 많지만, 일반부정사유가 일반긍정사유보다 ${opp}개 더 많아 그 차이가 더 큽니다. 이때는 법관이 사유 전체를 비교해 정합니다.`,
      ])
    return res("suspend", 1, [nm === 0 ? `주요긍정사유만 ${pm}개 있어 집행유예를 권고합니다.` : `주요긍정사유가 주요부정사유보다 ${major}개 많아 집행유예를 권고합니다.`])
  }
  if (major <= -2) {
    const opp = pg - ng
    if (opp > -major)
      return res("judge", 3, [
        `주요부정사유가 ${-major}개 더 많지만, 일반긍정사유가 일반부정사유보다 ${opp}개 더 많아 그 차이가 더 큽니다. 이때는 법관이 사유 전체를 비교해 정합니다.`,
      ])
    return res("prison", 2, [pm === 0 ? `주요부정사유만 ${nm}개 있어 실형을 권고합니다.` : `주요부정사유가 주요긍정사유보다 ${-major}개 많아 실형을 권고합니다.`])
  }
  return res("judge", 3, ["주요사유의 차이가 2개에 이르지 않아, 법관이 참작사유 전체를 비교해 정합니다. 이때도 주요사유를 일반사유보다 무겁게 봅니다."])
}

const squash = (x: string) => x.replace(/\s/g, "")

/**
 * "(일반사기 유형)"처럼 특정 세부 범죄에만 붙는 참작사유인지 보고, 지금 범죄에 맞는지.
 * 꼬리표가 범죄군 안 어느 범죄 이름과도 맞지 않으면 그냥 보여 줌
 */
export function probationFits(label: string, crimeName: string, groupCrimeNames: string[]): boolean {
  const m = label.match(/\(([^()]+?) 유형\)/)
  if (!m) return true
  const parts = [m[1], ...m[1].split(/,\s*/)].map(squash)
  const hit = (name: string) => parts.some((p) => squash(name) === p || squash(name).startsWith(p))
  return !groupCrimeNames.some(hit) || hit(crimeName)
}

/** 이 범죄에 쓰는 집행유예 참작사유 (범죄에 따로 없으면 범죄군 공통) */
export function probationFactors(group: SentencingGroup, crime: SentCrime): ProbationFactors | undefined {
  return crime.probation ?? group.probation
}

/* ---------- 한 번에 계산 ---------- */

/** 고른 특별양형인자 id (가중·감경 각각) */
export type Picks = { aggravating: readonly string[]; mitigating: readonly string[] }

export type Outcome = {
  zone: Zone
  /** 권고 형량범위 (원문) */
  range: Range
  /** 특별 조정 (해당하면) */
  adjust: Adjustment | null
  /** 상한이 25년을 넘어 무기징역도 고를 수 있음 (조정 후 기준, 범위에 이미 무기가 있으면 false) */
  life: boolean
}

export type Evaluation = {
  type: SentType
  decision: ZoneDecision
  /** decision.candidates 순서대로 */
  outcomes: Outcome[]
  /** 집행유예를 따져 볼 수 있는지 (하한 3년 이하) */
  probationOpen: boolean
  /** 가능한 범위가 모두 벌금형 칸 */
  fineOnly: boolean
}

export function findType(crime: SentCrime, typeNo: string | undefined): SentType | undefined {
  return typeNo === undefined ? undefined : crime.types.find((t) => t.no === typeNo)
}

export function evaluate(crime: SentCrime, typeNo: string, picks: Picks): Evaluation | null {
  const type = findType(crime, typeNo)
  if (!type) return null
  const agg = tally(crime.special.aggravating, picks.aggravating, typeNo)
  const mit = tally(crime.special.mitigating, picks.mitigating, typeNo)
  const decision = decideZone(agg, mit)
  // 처벌불원 등을 행위인자로 보는 것은 "할 수 있다"(선택)라, 행위자/기타인자로 볼 때 결과가 다르면 알려 줌
  if (agg.actWeight + mit.actWeight > 0) {
    const asActor = (t: Tally): Tally => ({ ...t, act: t.act - t.actWeight, actor: t.actor + t.actWeight, actWeight: 0 })
    const alt = decideZone(asActor(agg), asActor(mit))
    if (alt.zone !== decision.zone)
      decision.reasons.push(
        `처벌불원 등을 행위인자와 같게 보는 것은 법관의 선택입니다. 행위자/기타인자로 보면 ${alt.zone ? ZONE_LABEL[alt.zone] : "법관의 종합 판단"}이 됩니다.`,
      )
  }
  const outcomes = decision.candidates.map((zone): Outcome => {
    const range = type[zone]
    // 영역이 종합 판단으로 남은 경우에는 특별 조정이 자동으로 따라오지 않음
    const adjust = decision.zone ? specialAdjust(zone, range, agg.total, mit.total) : null
    const final = adjust?.changed ? adjust.range : range
    return { zone, range, adjust, life: !final.life && lifeSelectable(final) }
  })
  const finals = outcomes.map((o) => (o.adjust?.changed ? o.adjust.range : o.range))
  return { type, decision, outcomes, probationOpen: probationOpen(finals), fineOnly: finals.every((r) => r.unit === "fine") }
}
