import Link from "next/link"
import type { Crime } from "@/lib/tools/prosecution-types"
import { L, fmt } from "@/lib/i18n/fmt"
import { PROSECUTION_UI_KO, STEPS, isPenaltySentence, type Evaluation, type ProsecutionIntl, type ProsecutionUI } from "@/lib/tools/prosecution"

/** 구형·벌금이 없는 단계에서 대신 보여 줄 한 줄 */
const noPenalty = (u: ProsecutionUI, level: Evaluation["level"]) =>
  level === "suspension" ? u.result.noPenaltySuspension : level === "family-court" ? u.result.noPenaltyFamilyCourt : undefined

/** 법정형·근거 조문 상자 */
function Statutory({ crime, u }: { crime: Crime; u: ProsecutionUI }) {
  if (!crime.statutory && !crime.law) return null
  return (
    <div className="mt-5 rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm">
      <p className="font-semibold text-jisan-ink">{crime.statutory ? u.result.statutory : u.result.law}</p>
      {crime.statutory && <p className="mt-0.5 leading-relaxed text-[#4A505A]">{crime.statutory}</p>}
      {crime.law && <p className="mt-1 text-xs text-[#8A9099] [overflow-wrap:anywhere]">{crime.law}</p>}
    </div>
  )
}

/** 결과 카드: 처리 단계 막대 → 예상 구형·벌금 → 설명 → 법정형 → 참고 */
export function ResultCard({ crime, result, intl }: { crime: Crime; result: Evaluation; intl?: ProsecutionIntl }) {
  const u = intl?.ui ?? PROSECUTION_UI_KO
  const fineLabel = result.level === "summary" ? u.result.fineSummary : u.result.fineTrial
  const fallback = !result.sentence && !result.fineText ? noPenalty(u, result.level) : undefined
  const sentenceLabel = result.sentence && isPenaltySentence(result.tier) ? u.result.sentence : u.result.rule
  return (
    <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
      <p className="text-xs font-semibold text-[#6B717B]">{u.result.heading}</p>
      <p className="mt-1 text-2xl font-bold tracking-[-0.02em] text-jisan-ink">{result.levelLabel}</p>

      {/* 단계 막대: 왼쪽이 가벼움, 오른쪽이 무거움 */}
      <div className="mt-5" role="img" aria-label={fmt(u.result.barLabel, { n: result.step + 1, label: u.steps[STEPS[result.step].key].label })}>
        <div className="grid grid-cols-5 gap-1">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className={`h-2.5 rounded-full ${i === result.step ? "bg-brand-accent" : i < result.step ? "bg-brand-accent/25" : "bg-[#E3E6EB]"}`}
            />
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-5 gap-1 text-center text-[0.6875rem] leading-tight">
          {STEPS.map((s, i) => (
            <span key={s.key} className={i === result.step ? "font-bold text-brand-accent" : "text-[#8A9099]"}>
              {u.steps[s.key].short}
            </span>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[0.6875rem] text-[#A0A5AD]" aria-hidden>
          <span>{u.result.light}</span>
          <span>{u.result.heavy}</span>
        </div>
      </div>

      <dl className="mt-5 space-y-3 border-t border-[#E9ECF0] pt-5">
        {result.sentence && (
          <div>
            <dt className="text-sm text-[#6B717B]">{sentenceLabel}</dt>
            <dd className="mt-0.5 text-xl font-bold text-jisan-ink">{result.sentence}</dd>
          </div>
        )}
        {result.fineText && (
          <div>
            <dt className="text-sm text-[#6B717B]">{fineLabel}</dt>
            <dd className="mt-0.5 text-xl font-bold tabular-nums text-jisan-ink">{result.fineText}</dd>
          </div>
        )}
        {fallback && <p className="text-[0.9375rem] font-semibold text-jisan-ink">{fallback}</p>}
        {result.note && <p className="text-[0.9375rem] leading-relaxed text-[#4A505A]">{result.note}</p>}
      </dl>

      <Statutory crime={crime} u={u} />

      {crime.notes && crime.notes.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-[#4A505A]">
          {crime.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#8A9099]" />
              <span className="min-w-0">{n}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-xs leading-relaxed text-[#8A9099]">{u.result.disclaimer}</p>
    </section>
  )
}

/** 구형 기준이 따로 없는 죄명: 질문 없이 다른 계산기로 안내 */
export function RefCard({ crime, intl }: { crime: Crime; intl?: ProsecutionIntl }) {
  if (!crime.ref) return null
  const u = intl?.ui ?? PROSECUTION_UI_KO
  return (
    <section className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
      <p className="text-[0.9375rem] font-semibold leading-relaxed text-jisan-ink">{u.result.refLead}</p>
      <Link
        href={intl ? L(intl.lang, crime.ref.href) : crime.ref.href}
        className="mt-4 inline-flex max-w-full items-center justify-center rounded-full bg-jisan-ink px-5 py-2.5 text-sm font-semibold text-white [overflow-wrap:anywhere] hover:bg-jisan-ink/90"
      >
        {crime.ref.label}
      </Link>
      <Statutory crime={crime} u={u} />
      {crime.notes && crime.notes.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-[#4A505A]">
          {crime.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#8A9099]" />
              <span className="min-w-0">{n}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** 정해진 구형 기준이 없는 죄명: 법정형 + 변호사 문의 안내 */
export function ConsultOnlyCard({ crime, intl }: { crime: Crime; intl?: ProsecutionIntl }) {
  if (!crime.consultOnly) return null
  const u = intl?.ui ?? PROSECUTION_UI_KO
  return (
    <section className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
      <p className="text-[0.9375rem] font-semibold leading-relaxed text-jisan-ink">{u.result.consultOnlyLead}</p>
      <Statutory crime={crime} u={u} />
      {crime.notes && crime.notes.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-[#4A505A]">
          {crime.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#8A9099]" />
              <span className="min-w-0">{n}</span>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={intl?.consultHref ?? "/consult?type=%ED%98%95%EC%82%AC&from=/tools/prosecution"}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-jisan-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-jisan-ink/90"
      >
        {u.result.consultOnlyButton}
      </Link>
    </section>
  )
}

/** 다섯 단계의 뜻 (이름 옆에 쉬운 설명). 지금 결과 단계는 강조 */
export function StepGuide({ current, intl }: { current?: number; intl?: ProsecutionIntl }) {
  const u = intl?.ui ?? PROSECUTION_UI_KO
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-jisan-ink">{u.result.stepGuide}</p>
      <ol className="mt-3 space-y-2">
        {[...STEPS].reverse().map((s) => {
          const on = current !== undefined && STEPS[current].key === s.key
          return (
            <li key={s.key} className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${on ? "bg-brand-accent/10" : "bg-[#F7F8FA]"}`}>
              <span className={`font-bold ${on ? "text-brand-accent" : "text-jisan-ink"}`}>{u.steps[s.key].label}</span>
              <span className="text-[#4A505A]"> · {u.steps[s.key].desc}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
