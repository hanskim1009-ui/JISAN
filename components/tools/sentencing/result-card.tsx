import { ZONES, ZONE_LABEL, isMixedRange, rangeHint, rangeLabel, rangeText, type Evaluation, type ProbationResult, type SentType, type Zone } from "@/lib/tools/sentencing"

const SHORT: Record<Zone, string> = { mitigated: "감경", basic: "기본", aggravated: "가중" }

/** 감경·기본·가중 세 칸. 해당 영역(❸이면 두 칸)을 강조 */
function ZoneBar({ type, on }: { type: SentType; on: Zone[] }) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-1.5" role="list" aria-label="이 유형의 영역별 권고 형량범위">
      {ZONES.map((z) => {
        const hit = on.includes(z)
        return (
          <div
            key={z}
            role="listitem"
            className={`min-w-0 rounded-lg px-2 py-2 text-center ${hit ? "bg-brand-accent text-white" : "bg-[#F4F5F7] text-[#6B717B]"}`}
          >
            <p className={`text-[0.6875rem] font-semibold ${hit ? "text-white/85" : ""}`}>
              {SHORT[z]}
              {hit && <span className="sr-only"> (해당)</span>}
            </p>
            <p className={`mt-0.5 text-xs leading-tight [overflow-wrap:anywhere] ${hit ? "font-bold" : ""}`}>{rangeText(type[z])}</p>
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
}) {
  const { decision, outcomes, type } = result
  const many = outcomes.length > 1
  return (
    <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
      <p className="text-xs font-semibold text-[#6B717B]">
        {single ? type.name : `제${type.no}유형 · ${type.name}`}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-[-0.02em] text-jisan-ink">{decision.zone ? ZONE_LABEL[decision.zone] : "법관이 종합해 정함"}</p>
      {!decision.zone && <p className="mt-0.5 text-sm text-[#4A505A]">감경영역 또는 가중영역 (비슷하면 기본영역)</p>}

      <ZoneBar type={type} on={decision.candidates} />

      <dl className="mt-5 space-y-4 border-t border-[#E9ECF0] pt-5">
        {outcomes.map((o) => (
          <div key={o.zone}>
            <dt className="text-sm text-[#6B717B]">{many ? `${ZONE_LABEL[o.zone]}으로 보면` : "권고 형량범위"}</dt>
            <dd className="mt-0.5 text-xl font-bold text-jisan-ink [overflow-wrap:anywhere]">{rangeText(o.range)}</dd>
            {rangeHint(o.range) && <dd className="mt-0.5 text-xs text-[#8A9099] [overflow-wrap:anywhere]">{rangeHint(o.range)}</dd>}
            {o.adjust && (
              <dd className="mt-2.5 rounded-xl bg-brand-accent/10 px-4 py-3 text-sm">
                <p className="font-semibold text-brand-accent [overflow-wrap:anywhere]">
                  특별 조정
                  {o.adjust.changed ? ` → ${isMixedRange(o.range) ? "징역 " : ""}${o.adjust.rounded ? "약 " : ""}${rangeLabel(o.adjust.range)}` : ""}
                </p>
                <p className="mt-0.5 leading-relaxed text-[#4A505A]">{o.adjust.reason}</p>
                {o.adjust.formula && <p className="mt-1 text-xs text-[#6B717B] [overflow-wrap:anywhere]">{o.adjust.formula}</p>}
              </dd>
            )}
            {o.life && <dd className="mt-1.5 text-sm text-[#4A505A]">상한이 25년을 넘으면 무기징역을 선택할 수도 있습니다.</dd>}
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm">
        <p className="font-semibold text-jisan-ink">이렇게 판단했습니다</p>
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
        <p className="text-sm text-[#6B717B]">집행유예</p>
        {result.fineOnly ? (
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#4A505A]">벌금형 범위라 징역형의 집행유예 기준은 따지지 않습니다.</p>
        ) : !result.probationOpen ? (
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#4A505A]">
            권고 범위의 하한이 3년을 넘습니다. 집행유예는 3년 이하의 징역·금고를 선고할 때만 붙일 수 있어, 이 범위 안에서는 어렵습니다.
          </p>
        ) : probation && probationPicked ? (
          <>
            <p className="mt-0.5 text-xl font-bold text-jisan-ink">{probation.label}</p>
            <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-[#4A505A]">
              {probation.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-1.5 text-xs leading-relaxed text-[#8A9099]">집행유예 기준은 한 가지 범죄만 재판받는 경우에 쓰는 기준입니다.</p>
          </>
        ) : (
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#4A505A]">
            {probation ? "아래 '집행유예 참작사유'에서 해당하는 사정을 고르면 권고 기준을 보여 드립니다." : "이 범죄에는 정리된 집행유예 참작사유가 없습니다."}
          </p>
        )}
      </div>

      {notes && notes.length > 0 && (
        <div className="mt-5 border-t border-[#E9ECF0] pt-5">
          <p className="text-sm text-[#6B717B]">이 범죄에 따로 정한 기준</p>
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
          고른 일반양형인자(감경 {generalCount.mitigating}개, 가중 {generalCount.aggravating}개)는 위 범위 안에서 구체적인 형을 정할 때 고려됩니다.
        </p>
      )}

      <p className="mt-5 text-xs leading-relaxed text-[#8A9099]">
        2026년 양형기준(양형위원회)을 바탕으로 한 참고 계산입니다. 양형기준은 법관이 참고하는 권고 기준이며 실제 선고형은 다를 수 있습니다.
      </p>
    </section>
  )
}

/** 형량범위를 정하는 방법 (쉬운 말) */
export function RulesGuide() {
  const rules = [
    "특별양형인자 가운데 범행 자체에 관한 것을 '행위인자', 피고인의 사정 등에 관한 것을 '행위자/기타인자'라고 합니다. 숫자가 같으면 행위인자를 더 무겁게 봅니다. 다만 피해자의 처벌불원은 행위인자와 같은 무게로 볼 수 있습니다.",
    "같은 종류의 인자끼리는 같은 무게로 봅니다.",
    "위 두 원칙으로도 정해지지 않으면 법관이 인자들을 종합해 비교한 뒤 정합니다.",
    "가중요소가 크면 가중영역, 감경요소가 크면 감경영역, 그 밖에는 기본영역의 범위를 권고합니다.",
    "가중영역에서 특별가중인자만 2개 이상이거나 가중인자가 감경인자보다 2개 이상 많으면 범위의 상한을 1/2까지 늘리고, 감경영역에서 반대의 경우면 하한을 1/2까지 낮춥니다.",
  ]
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-jisan-ink">형량범위를 정하는 방법</p>
      <ol className="mt-3 space-y-2">
        {rules.map((r, i) => (
          <li key={r} className="flex gap-3 rounded-xl bg-[#F7F8FA] px-4 py-3 text-sm leading-relaxed text-[#4A505A]">
            <span className="shrink-0 font-bold text-jisan-ink">{i + 1}</span>
            <span className="min-w-0">{r}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
