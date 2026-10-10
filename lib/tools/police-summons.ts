/**
 * 경찰 출석요구 체크리스트 (/tools/police-summons).
 * 상황(1단계)에 따라 2~4단계 항목이 달라집니다.
 * 화면 문구(질문·항목 제목·설명·근거)는 content/tools/i18n/{언어}/police-summons.json 에 있고,
 * 여기에는 어떤 항목을 언제 보여 줄지만 둡니다.
 *
 * 근거 (국가법령정보센터 현행 원문, 2026. 10. 10. 확인)
 * - 형사소송법 [시행 2026. 10. 2.] 제30조, 제200조, 제200조의2, 제200조의5, 제218조, 제218조의2, 제221조, 제221조의2,
 *   제238조, 제243조의2, 제244조, 제244조의3, 제244조의4, 제244조의5, 제244조의6, 제245조의5~제245조의7, 제245조의12
 * - 검사와 사법경찰관의 상호협력과 일반적 수사준칙에 관한 규정(수사준칙) [시행 2026. 10. 2.]
 *   제13조, 제14조, 제19조, 제21조~제25조, 제42조, 제53조, 제69조
 * - 경찰수사규칙 [시행 2026. 10. 2.] 제11조, 제12조, 제34조, 제87조, 제97조
 * 중대범죄수사청 등 다른 수사기관의 조사에는 별도 규정이 적용될 수 있습니다.
 */
import type koText from "@/content/tools/i18n/ko/police-summons.json"
import { fmt } from "@/lib/i18n/fmt"

export type PoliceSummonsText = typeof koText

export type Role = "unknown" | "suspect" | "witness" | "victim"
export type DaysLeft = "soon" | "week" | "later" | "unset"
export type Via = "call" | "letter"

export type Situation = {
  role: Role
  days: DaysLeft
  via: Via
  /** 체포될까 걱정됨 (피의자·모름일 때만 물음) */
  arrest: boolean
  /** 변호인과 함께 갈 계획 */
  counsel: boolean
  /** 휴대전화를 가져오거나 내라는 말을 들음 */
  phone: boolean
}

export const DEFAULT_SITUATION: Situation = {
  role: "unknown",
  days: "week",
  via: "call",
  arrest: false,
  counsel: false,
  phone: false,
}

export type Item = {
  id: string
  step: 2 | 3 | 4
  /** 상황에 따라 문장이 바뀌는 항목: 사전의 어느 문장(변형 키)을 쓸지 */
  variant?: { title?: (s: Situation) => string; desc?: (s: Situation) => string }
  /** 이 상황에서 보일지. 없으면 항상 */
  when?: (s: Situation) => boolean
  /** 이 상황에서 먼저 챙길 항목으로 표시 */
  urgent?: (s: Situation) => boolean
}

export const STEP_NUMS = [1, 2, 3, 4] as const

/** 1단계 질문의 선택지 값 (보이는 순서). 문구는 사전 questions.{질문}.options */
export const QUESTION_OPTIONS = {
  role: ["unknown", "suspect", "witness", "victim"],
  days: ["soon", "week", "later", "unset"],
  via: ["call", "letter"],
  arrest: ["no", "yes"],
  counsel: ["no", "yes"],
  phone: ["no", "yes"],
} as const

export type QuestionKey = keyof typeof QUESTION_OPTIONS

const isSuspectSide = (s: Situation) => s.role === "suspect" || s.role === "unknown"
const isNonSuspect = (s: Situation) => s.role === "witness" || s.role === "victim"

export const ITEMS: Item[] = [
  // ── 2. 출석 전 확인할 것 ──
  { id: "verify-caller", step: 2, when: (s) => s.via === "call", urgent: (s) => s.via === "call" },
  { id: "case-info", step: 2 },
  { id: "ask-role", step: 2, when: (s) => s.role === "unknown", urgent: () => true },
  { id: "ask-charge", step: 2, variant: { desc: (s) => (s.via === "call" ? "call" : "letter") }, when: isSuspectSide },
  { id: "ask-topic", step: 2, variant: { desc: (s) => (s.role === "victim" ? "victim" : "witness") }, when: isNonSuspect },
  { id: "complaint-copy", step: 2, when: (s) => s.role === "suspect" },
  { id: "phone-brief", step: 2, when: isSuspectSide },
  { id: "reschedule-now", step: 2, when: (s) => s.days === "soon", urgent: () => true },
  { id: "reschedule", step: 2, when: (s) => s.days === "week" || s.days === "later" },
  { id: "schedule-agree", step: 2, variant: { desc: (s) => (s.counsel ? "counsel" : "default") }, when: (s) => s.days === "unset" || s.counsel },
  { id: "alt-method", step: 2 },
  { id: "no-show", step: 2, when: isSuspectSide, urgent: (s) => s.arrest },
  { id: "witness-voluntary", step: 2, when: (s) => s.role === "witness" },
  { id: "arrest-family", step: 2, when: (s) => isSuspectSide(s) && s.arrest, urgent: () => true },
  { id: "counsel-right", step: 2, when: (s) => isSuspectSide(s) && !s.counsel },
  { id: "counsel-right-nonsuspect", step: 2, when: (s) => isNonSuspect(s) && !s.counsel },
  { id: "counsel-papers", step: 2, when: (s) => s.counsel && s.role !== "witness" && s.role !== "victim" },
  { id: "silence-right", step: 2, when: isSuspectSide },
  { id: "timeline", step: 2 },
  { id: "evidence", step: 2 },
  { id: "no-contact", step: 2, when: isSuspectSide },
  {
    id: "phone-submit",
    step: 2,
    variant: { title: (s) => (s.phone ? "phone" : "default") },
    when: (s) => s.phone || isSuspectSide(s),
    urgent: (s) => s.phone,
  },
  { id: "phone-forensic", step: 2, when: (s) => s.phone },
  { id: "victim-trusted", step: 2, when: (s) => s.role === "victim" },

  // ── 3. 조사 당일 ──
  { id: "bring", step: 3 },
  { id: "arrival-time", step: 3 },
  { id: "rights-notice", step: 3, when: isSuspectSide },
  { id: "role-change", step: 3, when: (s) => s.role === "witness" || s.role === "unknown" },
  { id: "counsel-seat", step: 3, when: (s) => s.counsel },
  { id: "recording", step: 3, when: isSuspectSide },
  { id: "trusted-suspect", step: 3, when: isSuspectSide },
  { id: "time-limits", step: 3 },
  { id: "dont-guess", step: 3 },
  { id: "submit-materials", step: 3 },
  { id: "read-record", step: 3 },
  { id: "read-time", step: 3 },

  // ── 4. 조사 후 ──
  { id: "memo-after", step: 4 },
  { id: "copy-record", step: 4 },
  { id: "opinion", step: 4, when: isSuspectSide },
  { id: "result-notice", step: 4, when: (s) => s.role !== "witness" },
  { id: "after-referral", step: 4, when: (s) => s.role === "suspect" },
  { id: "keep-after-nonreferral", step: 4, when: (s) => s.role === "suspect" },
  { id: "victim-progress", step: 4, when: (s) => s.role === "victim" },
  { id: "victim-objection", step: 4, when: (s) => s.role === "victim" },
  { id: "phone-return", step: 4, when: (s) => s.phone },
]

type ItemText = { title: string | Record<string, string>; desc: string | Record<string, string>; basis?: string }

/** 사전에서 항목 문구 꺼내기 (상황에 따라 변형 문장 고름) */
export function itemText(t: PoliceSummonsText, item: Item, s: Situation): { title: string; desc: string; basis?: string } {
  const x = (t.items as Record<string, ItemText>)[item.id]
  const pick = (v: string | Record<string, string>, f?: (s: Situation) => string) => (typeof v === "string" ? v : v[f ? f(s) : "default"] ?? "")
  return { title: pick(x.title, item.variant?.title), desc: pick(x.desc, item.variant?.desc), basis: x.basis }
}

/** 이 상황에서 보이는 항목 (단계 순서 유지) */
export function itemsFor(s: Situation): Item[] {
  return ITEMS.filter((i) => !i.when || i.when(s))
}

/** 화면·인쇄에 쓰는 상황 요약 */
export function situationSummary(t: PoliceSummonsText, s: Situation): string {
  const opt = (k: QuestionKey, v: string) => (t.questions[k].options as Record<string, string>)[v] ?? ""
  const m = t.summary
  const parts = [
    fmt(m.role, { v: opt("role", s.role) }),
    fmt(m.days, { v: opt("days", s.days) }),
    fmt(m.via, { v: opt("via", s.via) }),
    ...(isSuspectSide(s) ? [fmt(m.arrest, { v: s.arrest ? m.arrestYes : m.arrestNo })] : []),
    fmt(m.counsel, { v: s.counsel ? m.counselYes : m.counselNo }),
    fmt(m.phone, { v: s.phone ? m.phoneYes : m.phoneNo }),
  ]
  return parts.join(" · ")
}

/** 저장값 → 상황 (모르는 값은 기본값) */
export function parseSituation(v: unknown): Situation {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>
  const oneOf = <T extends string>(x: unknown, list: readonly T[], d: T): T => (list.includes(x as T) ? (x as T) : d)
  return {
    role: oneOf(o.role, QUESTION_OPTIONS.role, DEFAULT_SITUATION.role),
    days: oneOf(o.days, QUESTION_OPTIONS.days, DEFAULT_SITUATION.days),
    via: oneOf(o.via, QUESTION_OPTIONS.via, DEFAULT_SITUATION.via),
    arrest: o.arrest === true,
    counsel: o.counsel === true,
    phone: o.phone === true,
  }
}
