"use client"

import { useMemo, useState } from "react"
import type { Lang } from "@/lib/langs"
import { inheritanceShares, type InheritanceResult, type ShareRow } from "@/lib/tools/family/inheritance"
import { CalcError } from "@/lib/tools/family/error"
import { fmt, money, percent, type CommonText } from "@/lib/tools/i18n-format"
import { rich } from "@/components/tools/rich"
import { FractionText, MoneyField, Panel, Steps, Terms, moneyOpts } from "./fields"
import { HeirForm, initialHeirs, toHeirs, type InheritanceText } from "./heir-form"

/** 계산 오류 문구 (사전 errors, 모르는 오류는 공통 문구) */
export function calcErrorText(e: unknown, errors: Record<string, string>, c: CommonText): string {
  return e instanceof CalcError ? (errors[e.code] ?? c.words.calcFailed) : c.words.calcFailed
}

/** 상속인 이름 옆 작은 설명: 누구를 대신하는지 */
export function heirNote(r: ShareRow, t: InheritanceText): string | undefined {
  if (!r.via) return undefined
  return fmt(t.ui.via, { name: r.via.name })
}

/** 상속분 계산 설명 줄 */
export function shareSteps(res: InheritanceResult, t: InheritanceText): React.ReactNode[] {
  const hasSpouse = res.heirs.some((h) => h.role === "spouse")
  const others = res.heirs.some((h) => h.role !== "spouse")
  const items: React.ReactNode[] = [<>{rich(t.ui.stepRank, { rank: <b className="text-jisan-ink">{t.ranks[res.rank]}</b> })}</>]
  if (hasSpouse && others) items.push(t.ui.stepSpouse)
  else if (others) items.push(t.ui.stepEqual)
  if (res.heirs.some((h) => h.via)) items.push(t.ui.stepSubst)
  items.push(fmt(t.ui.stepDen, { den: res.denominator.toString() }))
  return items
}

export function InheritanceCalculator({ lang, t, c }: { lang: Lang; t: InheritanceText; c: CommonText }) {
  const [heirs, setHeirs] = useState(initialHeirs)
  const [estate, setEstate] = useState(0)
  const ui = t.ui

  const { res, err } = useMemo(() => {
    try {
      return { res: inheritanceShares(toHeirs(heirs, t.names), estate), err: "" }
    } catch (e) {
      return { res: null, err: calcErrorText(e, t.errors, c) }
    }
  }, [heirs, estate, t, c])

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-6">
        <HeirForm idPrefix="inh" value={heirs} onChange={setHeirs} t={t} c={c} />
        <Panel title={ui.estateTitle}>
          <MoneyField id="inh-estate" label={ui.estateLabel} help={ui.estateHelp} value={estate} onChange={setEstate} {...moneyOpts(lang, c)} />
        </Panel>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        {!res ? (
          <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">{err}</div>
        ) : (
          <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-[#6B717B]">{ui.result}</p>
            <p className="mt-1 text-lg font-bold text-jisan-ink">{t.ranks[res.rank]}</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[18rem] text-left text-[0.9375rem]">
                <thead>
                  <tr className="border-b border-jisan-ink text-xs text-[#6B717B]">
                    <th className="py-2 pr-2 font-semibold">{ui.colHeir}</th>
                    <th className="py-2 pr-2 text-right font-semibold">{ui.colShare}</th>
                    <th className="py-2 pr-2 text-right font-semibold">{ui.colRatio}</th>
                    {res.estate !== undefined && <th className="py-2 text-right font-semibold">{ui.colAmount}</th>}
                  </tr>
                </thead>
                <tbody>
                  {res.heirs.map((h) => (
                    <tr key={h.id} className="border-b border-[#E9ECF0] align-top">
                      <td className="py-2.5 pr-2">
                        <span className="font-semibold text-jisan-ink">{h.name}</span>
                        {heirNote(h, t) && <span className="mt-0.5 block text-xs text-[#8A9099]">{heirNote(h, t)}</span>}
                      </td>
                      <td className="py-2.5 pr-2 text-right">
                        <FractionText f={h.share} denom={res.denominator} />
                      </td>
                      <td className="py-2.5 pr-2 text-right tabular-nums text-[#4A505A]">{percent(lang, c, h.percent)}</td>
                      {res.estate !== undefined && <td className="py-2.5 text-right font-semibold tabular-nums text-jisan-ink">{money(lang, c, h.amount ?? 0)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {res.estate !== undefined && <p className="mt-2 text-xs text-[#8A9099]">{ui.rounding}</p>}
            <h3 className="mt-6 text-sm font-bold text-jisan-ink">{c.words.howCalculated}</h3>
            <Steps items={shareSteps(res, t)} />
          </section>
        )}
      </div>

      <div className="min-w-0 lg:col-span-2">
        <div className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
          <p className="font-semibold text-jisan-ink">{ui.notIncluded}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {t.notIncluded.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <Terms items={t.terms as [string, string][]} />
      </div>
    </div>
  )
}
