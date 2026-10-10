import {
  SENTENCING_UI_KO,
  ZONES,
  isMixedRange,
  rangeHint,
  rangeLabel,
  rangeShow,
  txOf,
  zoneLabel,
  type Evaluation,
  type ProbationResult,
  type SentType,
  type SentencingIntl,
  type SentencingTx,
  type SentencingUI,
  type Zone,
} from "@/lib/tools/sentencing"
import { fmt } from "@/lib/i18n/fmt"

const short = (u: SentencingUI, z: Zone) => (z === "mitigated" ? u.result.zoneShortMitigated : z === "basic" ? u.result.zoneShortBasic : u.result.zoneShortAggravated)

/** 감경·기본·가중 세 칸. 해당 영역(❸이면 두 칸)을 강조 */
function ZoneBar({ type, on, u, tx }: { type: SentType; on: Zone[]; u: SentencingUI; tx?: SentencingTx }) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-1.5" role="list" aria-label={u.result.zoneBarLabel}>
      {ZONES.map((z) => {
        const hit = on.includes(z)
        return (
          <div
            key={z}
            role="listitem"
            className={`min-w-0 rounded-lg px-2 py-2 text-center ${hit ? "bg-brand-accent text-white" : "bg-[#F4F5F7] text-[#6B717B]"}`}
          >
            <p className={`text-[0.6875rem] font-semibold ${hit ? "text-white/85" : ""}`}>
              {short(u, z)}
              {hit && <span className="sr-only">{u.result.zoneHit}</span>}
            </p>
            <p className={`mt-0.5 text-xs leading-tight [overflow-wrap:anywhere] ${hit ? "font-bold" : ""}`}>{rangeShow(type[z], tx)}</p>
          </div>
        )
      })}
    </div>
  )
}

/** 결과 카드: 영역 판단 → 권고 형량범위(특별 조정) → 이유 → 집행유예 */
export function ResultCard({
  result,
  probation,
  probationPicked,
  generalCount,
  single,
  notes,
  intl,
}: {
  result: Evaluation
  /** 집행유예 판단 (따져 볼 수 없으면 undefined) */
  probation?: ProbationResult
  /** 참작사유를 하나라도 골랐는지 */
  probationPicked: boolean
  /** 고른 일반양형인자 수 */
  generalCount: { aggravating: number; mitigating: number }
  /** 유형이 하나뿐인 표 (유형 번호를 보이지 않음) */
  single?: boolean
  /** 이 범죄·범죄군의 특칙 */
  notes?: string[]
  /** 외국어판 (없으면 한국어) */
  intl?: SentencingIntl
}) {
  const u = intl?.ui ?? SENTENCING_UI_KO
  const tx = txOf(intl)
  const { decision, outcomes, type } = result
  const many = outcomes.length > 1
  return (
    <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
      <p className="text-xs font-semibold text-[#6B717B]">{single ? type.name : fmt(u.result.typeHead, { no: type.no, name: type.name })}</p>
      <p className="mt-1 text-2xl font-bold tracking-[-0.02em] text-jisan-ink">{decision.zone ? zoneLabel(decision.zone, tx) : u.result.judge}</p>
      {!decision.zone && <p className="mt-0.5 text-sm text-[#4A505A]">{u.result.judgeSub}</p>}

      <ZoneBar type={type} on={decision.candidates} u={u} tx={tx} />

      <dl className="mt-5 space-y-4 border-t border-[#E9ECF0] pt-5">
        {outcomes.map((o) => (
          <div key={o.zone}>
            <dt className="text-sm text-[#6B717B]">{many ? fmt(u.result.outcomeIf, { zone: zoneLabel(o.zone, tx) }) : u.result.outcome}</dt>
            <dd className="mt-0.5 text-xl font-bold text-jisan-ink [overflow-wrap:anywhere]">{rangeShow(o.range, tx)}</dd>
            {!tx && rangeHint(o.range) && <dd className="mt-0.5 text-xs text-[#8A9099] [overflow-wrap:anywhere]">{rangeHint(o.range)}</dd>}
            {o.adjust && (
              <dd className="mt-2.5 rounded-xl bg-brand-accent/10 px-4 py-3 text-sm">
                <p className="font-semibold text-brand-accent [overflow-wrap:anywhere]">{adjustTitle(u, o, tx)}</p>
                <p className="mt-0.5 leading-relaxed text-[#4A505A]">{o.adjust.reason}</p>
                {o.adjust.formula && <p className="mt-1 text-xs text-[#6B717B] [overflow-wrap:anywhere]">{o.adjust.formula}</p>}
              </dd>
            )}
            {o.life && <dd className="mt-1.5 text-sm text-[#4A505A]">{u.result.life}</dd>}
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm">
        <p className="font-semibold text-jisan-ink">{u.result.reasons}</p>
        <ul className="mt-1.5 space-y-1 leading-relaxed text-[#4A505A]">
          {decision.reasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[#8A9099]" />
              <span className="min-w-0">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-[#E9ECF0] pt-5">
        <p className="text-sm text-[#6B717B]">{u.result.probation}</p>
        {result.fineOnly ? (
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#4A505A]">{u.result.fineOnly}</p>
        ) : !result.probationOpen ? (
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#4A505A]">{u.result.overThree}</p>
        ) : probation && probationPicked ? (
          <>
            <p className="mt-0.5 text-xl font-bold text-jisan-ink">{probation.label}</p>
            <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-[#4A505A]">
              {probation.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8A9099]">{u.result.probationSingle}</p>
          </>
        ) : (
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#4A505A]">{probation ? u.result.probationPick : u.result.probationNone}</p>
        )}
      </div>

      {notes && notes.length > 0 && (
        <div className="mt-5 border-t border-[#E9ECF0] pt-5">
          <p className="text-sm text-[#6B717B]">{u.result.notes}</p>
          <ul className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-[#4A505A]">
            {notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[#8A9099]" />
                <span className="min-w-0">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {generalCount.aggravating + generalCount.mitigating > 0 && (
        <p className="mt-4 text-sm leading-relaxed text-[#4A505A]">
          {fmt(u.result.generalPicked, { mit: generalCount.mitigating, agg: generalCount.aggravating })}
        </p>
      )}

      <p className="mt-5 text-xs leading-relaxed text-[#8A9099]">{u.result.disclaimer}</p>
    </section>
  )
}

/** 특별 조정 제목: "특별 조정 → 징역 약 1년 ~ 6년" */
function adjustTitle(u: SentencingUI, o: Evaluation["outcomes"][number], tx?: SentencingTx) {
  if (!o.adjust?.changed) return u.result.adjustTitle
  let r = rangeLabel(o.adjust.range, tx)
  if (o.adjust.rounded) r = fmt(u.result.adjustApprox, { range: r })
  if (isMixedRange(o.range)) r = fmt(u.result.adjustPrison, { range: r })
  return fmt(u.result.adjustTo, { range: r })
}

/** 형량범위를 정하는 방법 (쉬운 말) */
export function RulesGuide({ intl }: { intl?: SentencingIntl }) {
  const u = intl?.ui ?? SENTENCING_UI_KO
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-jisan-ink">{u.rules.title}</p>
      <ol className="mt-3 space-y-2">
        {u.rules.items.map((r, i) => (
          <li key={r} className="flex gap-3 rounded-xl bg-[#F7F8FA] px-4 py-3 text-sm leading-relaxed text-[#4A505A]">
            <span className="shrink-0 font-bold text-jisan-ink">{i + 1}</span>
            <span className="min-w-0">{r}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
