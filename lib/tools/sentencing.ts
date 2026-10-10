/**
 * 양형기준 선고형 예상 계산 엔진 (순수 함수). 화면(클라이언트)과 시험 스크립트에서 같이 씁니다.
 * 데이터 읽기(fs)는 서버 전용인 lib/tools/sentencing-data.ts 에 있습니다.
 * 규칙은 양형기준 공통원칙: 형량범위의 결정방법(❶❷❸), 권고 형량범위의 특별 조정, 집행유예 기준.
 */
import type { Factor, FactorSet, ProbationFactors, Range, SentCrime, SentType, SentencingGroup } from "./sentencing-types"
import KO_UI from "@/content/tools/i18n/ko/sentencing-ui.json"
import { fmt } from "@/lib/i18n/fmt"
import { formatMonthsIntl, formatWonIntl, type NumFmt } from "./tool-num-fmt"

export type { Factor, FactorSet, ProbationFactors, Range, SentCrime, SentType, SentencingGroup } from "./sentencing-types"

/** 화면·설명 문구 사전 (원문: content/tools/i18n/ko/sentencing-ui.json, 외국어: content/tools/i18n/{lang}/sentencing-ui.json) */
export type SentencingUI = typeof KO_UI

/** 한국어 화면 문구 */
export const SENTENCING_UI_KO: SentencingUI = KO_UI

/** 계산 설명 문장 틀 (사전의 engine) */
type EngineText = SentencingUI["engine"]

const KO_E: EngineText = KO_UI.engine

/**
 * 외국어 표기: 설명 문장은 사전에서, 형량 범위는 언어별 금액·기간 표기로 새로 만듦.
 * 넘기지 않으면 한국어 (원래 표기 그대로)
 */
export type SentencingTx = { e: EngineText; num: NumFmt }

/** 외국어판 설정 (없으면 한국어 화면) */
export type SentencingIntl = {
  lang: string
  ui: SentencingUI
  num: NumFmt
  /** 범죄군 데이터 주소 앞부분 (예: "/en/tools/sentencing/data") */
  dataBase: string
  /** 문의 주소 (예: "/en/consult") */
  consultHref: string
}

/** 화면 설정에서 계산 표기만 */
export const txOf = (intl?: { ui: SentencingUI; num: NumFmt }): SentencingTx | undefined => (intl ? { e: intl.ui.engine, num: intl.num } : undefined)

/** 페이지에 처음 넘기는 가벼운 목록 (범죄군 id·이름·세부 범죄 이름) */
export type GroupSummary = { id: string; name: string; crimes: { id: string; name: string }[] }

export type Zone = "mitigated" | "basic" | "aggravated"

export const ZONES: Zone[] = ["mitigated", "basic", "aggravated"]

export const ZONE_LABEL: Record<Zone, string> = { mitigated: KO_E.zoneMitigated, basic: KO_E.zoneBasic, aggravated: KO_E.zoneAggravated }

/** 영역 이름 (tx 가 있으면 그 언어로) */
export const zoneLabel = (z: Zone, tx?: SentencingTx) =>
  tx ? (z === "mitigated" ? tx.e.zoneMitigated : z === "basic" ? tx.e.zoneBasic : tx.e.zoneAggravated) : ZONE_LABEL[z]

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

function amount(r: Range, n: number, tx?: SentencingTx) {
  if (tx) return r.unit === "fine" ? formatWonIntl(n, tx.num) : formatMonthsIntl(n, tx.num)
  return r.unit === "fine" ? formatWon(n) : formatMonths(n)
}

/** 범위 본문 ("1년 ~ 4년", "1년 이하", "11년 이상, 무기"). 벌금 표시는 붙이지 않음 */
function rangeBody(r: Range, tx?: SentencingTx): string {
  const e = tx?.e ?? KO_E
  let s: string
  if (r.min == null && r.max == null) s = r.life || r.death ? "" : r.text
  else if (r.min == null) s = fmt(e.atMost, { a: amount(r, r.max!, tx) })
  else if (r.max == null) s = fmt(e.atLeast, { a: amount(r, r.min, tx) })
  else s = r.min === r.max ? amount(r, r.min, tx) : fmt(e.between, { a: amount(r, r.min, tx), b: amount(r, r.max, tx) })
  const extra = [r.life ? e.life : "", r.death ? e.death : ""].filter(Boolean)
  return [s, ...extra].filter(Boolean).join(e.listSep)
}

/** 범위를 쉬운 표기로: "1년 ~ 4년", "1년 이하", "11년 이상, 무기" (벌금이면 앞에 "벌금"). tx 가 있으면 그 언어로 */
export function rangeLabel(r: Range, tx?: SentencingTx): string {
  const body = rangeBody(r, tx)
  return r.unit === "fine" ? fmt((tx?.e ?? KO_E).fine, { x: body }) : body
}

/** "1,000만 원", "1억 5,000만 원" → 원 */
function parseWon(s: string): number | null {
  const m = s.replace(/[\s,]/g, "").match(/^(?:(\d+)억)?(?:(\d+)만)?(\d+)?원?$/)
  if (!m || (!m[1] && !m[2] && !m[3])) return null
  return Number(m[1] ?? 0) * 100_000_000 + Number(m[2] ?? 0) * 10_000 + Number(m[3] ?? 0)
}

/** 징역·벌금이 같이 있는 칸의 벌금 부분 ("- 8월 / 100만 원 - 700만 원" → 100만~700만). 못 읽으면 null */
export function mixedFine(r: Range): Range | null {
  const part = r.text.split(/\s*\/\s*|,\s+/).find((x) => /원/.test(x))
  if (!part) return null
  // "100만 원 - 700만 원", "- 700만 원" (하한 없음). "-" 가 없으면 한 값
  const m = part.match(/^(.*?)\s*-\s*(.*)$/)
  const [lo, hi] = m ? [m[1], m[2]] : [part, part]
  const min = lo.trim() ? parseWon(lo) : null
  const max = hi.trim() ? parseWon(hi) : null
  if ((lo.trim() && min === null) || (hi.trim() && max === null) || (min === null && max === null)) return null
  return { text: part, min, max, unit: "fine" }
}

/**
 * 화면에 보여 줄 범위.
 * 한국어는 원문 표기 그대로(rangeText), 외국어는 언어별 표기로 새로 만듦 (징역·벌금이 같이 있으면 둘 다)
 */
export function rangeShow(r: Range, tx?: SentencingTx): string {
  if (!tx) return rangeText(r)
  if (isMixedRange(r)) {
    const f = mixedFine(r)
    if (f) return fmt(tx.e.mixed, { prison: rangeBody(r, tx), fine: rangeBody(f, tx) })
  }
  return rangeLabel(r, tx)
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
  if (isMixedRange(r)) return fmt(KO_E.prisonPart, { label })
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

const kinds = (act: number, actor: number, e: EngineText) =>
  [act ? fmt(e.kindAct, { n: act }) : "", actor ? fmt(e.kindActor, { n: actor }) : ""].filter(Boolean).join(e.kindSep)

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
export function decideZone(agg: Tally, mit: Tally, tx?: SentencingTx): ZoneDecision {
  const e = tx?.e ?? KO_E
  const k = (act: number, actor: number) => kinds(act, actor, e)
  const base = { aggravating: agg, mitigating: mit }
  const weightNote = agg.actWeight + mit.actWeight > 0 ? [e.weightNote] : []

  if (agg.total === 0 && mit.total === 0) return { ...base, zone: "basic", candidates: ["basic"], reasons: [e.none] }
  if (mit.total === 0)
    return {
      ...base,
      zone: "aggravated",
      candidates: ["aggravated"],
      reasons: [fmt(e.onlyAggravating, { kinds: k(agg.act, agg.actor) }), ...weightNote],
    }
  if (agg.total === 0)
    return {
      ...base,
      zone: "mitigated",
      candidates: ["mitigated"],
      reasons: [fmt(e.onlyMitigating, { kinds: k(mit.act, mit.actor) }), ...weightNote],
    }

  // ❷ 같은 종류끼리 서로 지우고 남은 것으로 비교
  const dAct = agg.act - mit.act
  const dActor = agg.actor - mit.actor
  const reasons = [fmt(e.both, { agg: k(agg.act, agg.actor), mit: k(mit.act, mit.actor) }), ...weightNote]
  const cancelled = Math.min(agg.act, mit.act) + Math.min(agg.actor, mit.actor) > 0
  if (cancelled) reasons.push(e.cancel)
  const left = {
    agg: { act: Math.max(dAct, 0), actor: Math.max(dActor, 0) },
    mit: { act: Math.max(-dAct, 0), actor: Math.max(-dActor, 0) },
  }
  const aggLeft = left.agg.act + left.agg.actor
  const mitLeft = left.mit.act + left.mit.actor

  if (aggLeft === 0 && mitLeft === 0) return { ...base, zone: "basic", candidates: ["basic"], reasons: [...reasons, e.even] }
  if (mitLeft === 0)
    return { ...base, zone: "aggravated", candidates: ["aggravated"], reasons: [...reasons, fmt(e.aggravatingLeft, { kinds: k(left.agg.act, left.agg.actor) })] }
  if (aggLeft === 0)
    return { ...base, zone: "mitigated", candidates: ["mitigated"], reasons: [...reasons, fmt(e.mitigatingLeft, { kinds: k(left.mit.act, left.mit.actor) })] }

  // 한쪽엔 행위인자, 다른 쪽엔 행위자/기타인자가 남은 경우
  const actSide: "agg" | "mit" = left.agg.act > 0 ? "agg" : "mit"
  const actorSide = actSide === "agg" ? "mit" : "agg"
  const a = left[actSide].act
  const r = left[actorSide].actor
  const sideName = (s: "agg" | "mit") => (s === "agg" ? e.sideAggravating : e.sideMitigating)
  const sideZone = (s: "agg" | "mit"): Zone => (s === "agg" ? "aggravated" : "mitigated")
  const remain = fmt(cancelled ? e.remainLeft : e.remainHave, { actSide: sideName(actSide), actorSide: sideName(actorSide), a, r })
  if (a >= r) {
    const zone = sideZone(actSide)
    return {
      ...base,
      zone,
      candidates: [zone],
      reasons: [...reasons, remain, fmt(a === r ? e.sameNumber : e.moreAct, { side: sideName(actSide) })],
    }
  }
  return {
    ...base,
    zone: null,
    candidates: ["mitigated", "aggravated"],
    reasons: [...reasons, remain, e.undecided, e.undecidedZone],
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
export function specialAdjust(zone: Zone, range: Range, aggCount: number, mitCount: number, tx?: SentencingTx): Adjustment | null {
  // 특별 조정은 징역(개월) 칸에만
  if (range.unit === "fine") return null
  const e = tx?.e ?? KO_E
  const f = (n: number) => amount(range, n, tx)
  if (zone === "aggravated" && aggCount - mitCount >= 2) {
    const reason = mitCount === 0 ? fmt(e.upperOnly, { n: aggCount }) : fmt(e.upperMore, { n: aggCount - mitCount })
    if (range.max == null) return { zone, kind: "upper", range, changed: false, rounded: false, reason: fmt(e.upperNone, { reason }) }
    const exact = range.max * 1.5
    const max = Math.ceil(exact - 1e-9)
    const to: Range = { ...range, max }
    const formula = fmt(e.upperFormula, { from: f(range.max), exact: f(exact) })
    return {
      zone,
      kind: "upper",
      range: { ...to, text: rangeLabel(to, tx) },
      changed: true,
      rounded: max !== exact,
      formula: max !== exact ? fmt(e.upperRounded, { formula, to: f(max) }) : formula,
      reason,
    }
  }
  if (zone === "mitigated" && mitCount - aggCount >= 2) {
    const reason = aggCount === 0 ? fmt(e.lowerOnly, { n: mitCount }) : fmt(e.lowerMore, { n: mitCount - aggCount })
    if (range.min == null) return { zone, kind: "lower", range, changed: false, rounded: false, reason: fmt(e.lowerNone, { reason }) }
    const exact = range.min / 2
    const min = Math.floor(exact + 1e-9)
    const to: Range = { ...range, min }
    const formula = fmt(e.lowerFormula, { from: f(range.min), exact: f(exact) })
    return {
      zone,
      kind: "lower",
      range: { ...to, text: rangeLabel(to, tx) },
      changed: true,
      rounded: min !== exact,
      formula: min !== exact ? fmt(e.lowerRounded, { formula, to: f(min) }) : formula,
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
  suspend: KO_E.probationSuspend,
  prison: KO_E.probationPrison,
  judge: KO_E.probationJudge,
}

export type ProbationResult = { verdict: ProbationVerdict; label: string; rule: 1 | 2 | 3; reasons: string[] }

/**
 * 집행유예 기준
 * ❶ 주요긍정만 2개 이상이거나 주요긍정이 주요부정보다 2개 이상 많으면 집행유예 권고
 * ❷ 반대면 실형 권고
 * ❸ ❶❷에 해당해도 반대쪽 일반사유 차이가 주요사유 차이보다 크거나, ❶❷에 해당하지 않으면 종합 판단
 */
export function decideProbation(c: ProbationCounts, tx?: SentencingTx): ProbationResult {
  const e = tx?.e ?? KO_E
  const pm = c.positiveMajor
  const nm = c.negativeMajor
  const pg = c.positiveGeneral
  const ng = c.negativeGeneral
  const counts = fmt(e.probationCounts, { pm, nm, pg, ng })
  const label = (v: ProbationVerdict) => (v === "suspend" ? e.probationSuspend : v === "prison" ? e.probationPrison : e.probationJudge)
  const res = (verdict: ProbationVerdict, rule: 1 | 2 | 3, reasons: string[]): ProbationResult => ({ verdict, label: label(verdict), rule, reasons: [counts, ...reasons] })

  const major = pm - nm
  if (major >= 2) {
    const opp = ng - pg
    if (opp > major) return res("judge", 3, [fmt(e.suspendOverruled, { major, opp })])
    return res("suspend", 1, [nm === 0 ? fmt(e.suspendOnly, { n: pm }) : fmt(e.suspendMore, { n: major })])
  }
  if (major <= -2) {
    const opp = pg - ng
    if (opp > -major) return res("judge", 3, [fmt(e.prisonOverruled, { major: -major, opp })])
    return res("prison", 2, [pm === 0 ? fmt(e.prisonOnly, { n: nm }) : fmt(e.prisonMore, { n: -major })])
  }
  return res("judge", 3, [e.judgeMajor])
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

export function evaluate(crime: SentCrime, typeNo: string, picks: Picks, tx?: SentencingTx): Evaluation | null {
  const type = findType(crime, typeNo)
  if (!type) return null
  const e = tx?.e ?? KO_E
  const agg = tally(crime.special.aggravating, picks.aggravating, typeNo)
  const mit = tally(crime.special.mitigating, picks.mitigating, typeNo)
  const decision = decideZone(agg, mit, tx)
  // 처벌불원 등을 행위인자로 보는 것은 "할 수 있다"(선택)라, 행위자/기타인자로 볼 때 결과가 다르면 알려 줌
  if (agg.actWeight + mit.actWeight > 0) {
    const asActor = (t: Tally): Tally => ({ ...t, act: t.act - t.actWeight, actor: t.actor + t.actWeight, actWeight: 0 })
    const alt = decideZone(asActor(agg), asActor(mit), tx)
    if (alt.zone !== decision.zone) decision.reasons.push(fmt(e.altZone, { zone: alt.zone ? zoneLabel(alt.zone, tx) : e.altJudge }))
  }
  const outcomes = decision.candidates.map((zone): Outcome => {
    const range = type[zone]
    // 영역이 종합 판단으로 남은 경우에는 특별 조정이 자동으로 따라오지 않음
    const adjust = decision.zone ? specialAdjust(zone, range, agg.total, mit.total, tx) : null
    const final = adjust?.changed ? adjust.range : range
    return { zone, range, adjust, life: !final.life && lifeSelectable(final) }
  })
  const finals = outcomes.map((o) => (o.adjust?.changed ? o.adjust.range : o.range))
  return { type, decision, outcomes, probationOpen: probationOpen(finals), fineOnly: finals.every((r) => r.unit === "fine") }
}
