import Link from "next/link"
import type { Crime } from "@/lib/tools/prosecution-types"
import { STEPS, type Evaluation } from "@/lib/tools/prosecution"

/** 구형·벌금이 없는 단계에서 대신 보여 줄 한 줄 */
const NO_PENALTY: Partial<Record<Evaluation["level"], string>> = {
  suspension: "재판에 넘기지 않고 끝날 가능성이 있습니다.",
  "family-court": "형사재판 대신 가정법원 절차로 넘어갈 가능성이 있습니다.",
}

/** 형량이 들어 있는 문장인지 ("징역 1년", "벌금 300만원"). 아니면 "구속 원칙" 같은 처리 기준으로 봄 */
const HAS_PENALTY = /징역|금고|벌금|구류|과료|사형|무기|자격|\d\s*(년|월|만원|원)/

/** 법정형·근거 조문 상자 */
function Statutory({ crime }: { crime: Crime }) {
  if (!crime.statutory && !crime.law) return null
  return (
    <div className="mt-5 rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm">
      <p className="font-semibold text-jisan-ink">{crime.statutory ? "법정형" : "근거 조문"}</p>
      {crime.statutory && <p className="mt-0.5 leading-relaxed text-[#4A505A]">{crime.statutory}</p>}
      {crime.law && <p className="mt-1 text-xs text-[#8A9099] [overflow-wrap:anywhere]">{crime.law}</p>}
    </div>
  )
}

/** 결과 카드: 처리 단계 막대 → 예상 구형·벌금 → 설명 → 법정형 → 참고 */
export function ResultCard({ crime, result }: { crime: Crime; result: Evaluation }) {
  const fineLabel = result.level === "summary" ? "예상 벌금" : "예상 구형 (벌금)"
  const fallback = !result.sentence && !result.fineText ? NO_PENALTY[result.level] : undefined
  const sentenceLabel = result.sentence && HAS_PENALTY.test(result.sentence) ? "예상 구형" : "처리 기준"
  return (
    <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
      <p className="text-xs font-semibold text-[#6B717B]">예상 처리</p>
      <p className="mt-1 text-2xl font-bold tracking-[-0.02em] text-jisan-ink">{result.levelLabel}</p>

      {/* 단계 막대: 왼쪽이 가벼움, 오른쪽이 무거움 */}
      <div className="mt-5" role="img" aria-label={`처리 단계 다섯 가운데 ${result.step + 1}번째: ${STEPS[result.step].label}`}>
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
              {s.short}
            </span>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[0.6875rem] text-[#A0A5AD]" aria-hidden>
          <span>가벼움</span>
          <span>무거움</span>
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

      <Statutory crime={crime} />

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

      <p className="mt-5 text-xs leading-relaxed text-[#8A9099]">
        수사기관의 일반적인 처리 경향을 바탕으로 한 예상일 뿐이며, 실제 처분과 구형은 사건 사정과 담당 검사의 판단에 따라 다릅니다. 최종 형은 법원이 정합니다.
      </p>
    </section>
  )
}

/** 구형 기준이 따로 없는 죄명: 질문 없이 다른 계산기로 안내 */
export function RefCard({ crime }: { crime: Crime }) {
  if (!crime.ref) return null
  return (
    <section className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
      <p className="text-[0.9375rem] font-semibold leading-relaxed text-jisan-ink">
        이 죄명은 구형 예상 기준이 따로 없습니다. 선고형 예상 계산기에서 확인해 보세요.
      </p>
      <Link
        href={crime.ref.href}
        className="mt-4 inline-flex max-w-full items-center justify-center rounded-full bg-jisan-ink px-5 py-2.5 text-sm font-semibold text-white [overflow-wrap:anywhere] hover:bg-jisan-ink/90"
      >
        {crime.ref.label}
      </Link>
      <Statutory crime={crime} />
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

/** 다섯 단계의 뜻 (이름 옆에 쉬운 설명). 지금 결과 단계는 강조 */
export function StepGuide({ current }: { current?: number }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-jisan-ink">처리 단계가 뜻하는 것</p>
      <ol className="mt-3 space-y-2">
        {[...STEPS].reverse().map((s) => {
          const on = current !== undefined && STEPS[current].key === s.key
          return (
            <li key={s.key} className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${on ? "bg-brand-accent/10" : "bg-[#F7F8FA]"}`}>
              <span className={`font-bold ${on ? "text-brand-accent" : "text-jisan-ink"}`}>{s.label}</span>
              <span className="text-[#4A505A]"> · {s.desc}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
