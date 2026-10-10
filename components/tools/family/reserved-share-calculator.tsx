"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/fmt"
import { reservedShares } from "@/lib/tools/family/reserved-share"
import { commonDenominator, fracText, isZero } from "@/lib/tools/family/fraction"
import { money, type CommonText } from "@/lib/tools/i18n-format"
import { rich } from "@/components/tools/rich"
import type koText from "@/content/tools/i18n/ko/reserved-share.json"
import { FractionText, MoneyField, Panel, Steps, Terms, moneyOpts } from "./fields"
import { HeirForm, initialHeirs, toHeirs, type InheritanceText } from "./heir-form"
import { calcErrorText, heirNote } from "./inheritance-calculator"

export type ReservedShareText = typeof koText

/** 형제자매 유류분이 없어졌다는 안내 (헌재 결정 + 민법 개정) */
function SiblingNotice({ t }: { t: ReservedShareText }) {
  return (
    <div className="rounded-xl border border-[#E7D9B5] bg-[#FBF7EC] px-5 py-4 text-sm leading-relaxed text-[#5A4A20]">
      <p className="font-semibold">{t.ui.siblingTitle}</p>
      <p className="mt-1">{t.ui.siblingBody}</p>
    </div>
  )
}

/** 유류분 계산기. 상속인 입력·순위 이름은 상속분 계산기 사전(it)을 함께 씀 */
export function ReservedShareCalculator({ lang, t, it, c }: { lang: Lang; t: ReservedShareText; it: InheritanceText; c: CommonText }) {
  const [heirs, setHeirs] = useState(initialHeirs)
  const [estate, setEstate] = useState(0)
  const [gifts, setGifts] = useState(0)
  const [debts, setDebts] = useState(0)
  const ui = t.ui
  const won = (n: number) => money(lang, c, n)

  const { res, err } = useMemo(() => {
    try {
      return { res: reservedShares({ heirs: toHeirs(heirs, it.names), estate, gifts, debts }), err: "" }
    } catch (e) {
      return { res: null, err: calcErrorText(e, it.errors, c) }
    }
  }, [heirs, estate, gifts, debts, it, c])

  const shareDen = res ? commonDenominator(res.heirs.map((h) => h.share)) : BigInt(1)
  const portionDen = res ? commonDenominator(res.heirs.map((h) => h.portion).filter((f) => !isZero(f))) : BigInt(1)
  const empty = estate + gifts === 0

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-6">
        <HeirForm idPrefix="res" value={heirs} onChange={setHeirs} t={it} c={c} />
        <Panel title={ui.assets} desc={ui.assetsDesc}>
          <div className="space-y-6">
            <MoneyField id="res-estate" label={ui.estate} help={ui.estateHelp} value={estate} onChange={setEstate} {...moneyOpts(lang, c)} />
            <MoneyField id="res-gifts" label={ui.gifts} help={<>{ui.giftsHelp}</>} value={gifts} onChange={setGifts} {...moneyOpts(lang, c)} />
            <MoneyField id="res-debts" label={ui.debts} help={ui.debtsHelp} value={debts} onChange={setDebts} {...moneyOpts(lang, c)} />
          </div>
        </Panel>
      </div>

      <div className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
        {!res ? (
          <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">{err}</div>
        ) : (
          <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-[#6B717B]">{ui.base}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums tracking-[-0.02em] text-jisan-ink">{won(Math.max(res.base, 0))}</p>
            <p className="mt-1 text-sm tabular-nums text-[#6B717B]">
              {won(res.estate)} + {won(res.gifts)} − {won(res.debts)}
            </p>
            {res.base <= 0 && !empty && <p className="mt-2 text-sm text-[#8A6A1F]">{ui.noBase}</p>}

            {res.noneReason ? (
              <div className="mt-5">
                {res.noneReason === "sibling" ? (
                  <SiblingNotice t={t} />
                ) : (
                  <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">{ui.collateralNone}</p>
                )}
              </div>
            ) : (
              <>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[20rem] text-left text-[0.9375rem]">
                    <thead>
                      <tr className="border-b border-jisan-ink text-xs text-[#6B717B]">
                        <th className="py-2 pr-2 font-semibold">{it.ui.colHeir}</th>
                        <th className="py-2 pr-2 text-right font-semibold">{it.ui.colShare}</th>
                        <th className="py-2 pr-2 text-right font-semibold">{ui.colRatio}</th>
                        <th className="py-2 pr-2 text-right font-semibold">{ui.colReserved}</th>
                        <th className="py-2 text-right font-semibold">{it.ui.colAmount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.heirs.map((h) => (
                        <tr key={h.id} className="border-b border-[#E9ECF0] align-top">
                          <td className="py-2.5 pr-2">
                            <span className="font-semibold text-jisan-ink">{h.name}</span>
                            {heirNote(h, it) && <span className="mt-0.5 block text-xs text-[#8A9099]">{heirNote(h, it)}</span>}
                          </td>
                          <td className="py-2.5 pr-2 text-right">
                            <FractionText f={h.share} denom={shareDen} />
                          </td>
                          <td className="py-2.5 pr-2 text-right tabular-nums text-[#4A505A]">{fracText(h.ratio)}</td>
                          <td className="py-2.5 pr-2 text-right">{isZero(h.portion) ? "0" : <FractionText f={h.portion} denom={portionDen} />}</td>
                          <td className="py-2.5 text-right font-semibold tabular-nums text-jisan-ink">{won(h.reserved)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="pt-2.5 text-sm text-[#6B717B]">
                          {ui.total}
                        </td>
                        <td className="pt-2.5 text-right font-bold tabular-nums text-jisan-ink">{won(res.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <h3 className="mt-6 text-sm font-bold text-jisan-ink">{c.words.howCalculated}</h3>
                <Steps
                  items={[
                    ui.step1,
                    <>
                      {rich(ui.step2, {
                        rank: it.ranks[res.rank],
                        link: (
                          <Link href={L(lang, "/tools/inheritance")} className="text-brand-accent underline underline-offset-2">
                            {c.tools.inheritance.title}
                          </Link>
                        ),
                      })}
                    </>,
                    ui.step3,
                    ui.step4,
                  ]}
                />
                <div className="mt-5 rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm leading-relaxed text-[#4A505A]">
                  <p className="font-semibold text-jisan-ink">{ui.shortfallTitle}</p>
                  <p className="mt-1">{ui.shortfallBody}</p>
                </div>
              </>
            )}
          </section>
        )}
      </div>

      <div className="min-w-0 lg:col-span-2">
        <div className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
          <p className="font-semibold text-jisan-ink">{ui.lawTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {t.lawChanges.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mt-2">{ui.limitation}</p>
        </div>
        <Terms items={t.terms as [string, string][]} />
      </div>
    </div>
  )
}
