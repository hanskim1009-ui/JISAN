"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { RANK_LABEL } from "@/lib/tools/family/inheritance"
import { reservedShares } from "@/lib/tools/family/reserved-share"
import { commonDenominator, fracText, isZero } from "@/lib/tools/family/fraction"
import { formatWon } from "@/lib/tools/family/format"
import { FractionText, MoneyField, Panel, Steps, Terms } from "./fields"
import { HeirForm, initialHeirs, toHeirs } from "./heir-form"
import { heirNote } from "./inheritance-calculator"

/** 형제자매 유류분이 없어졌다는 안내 (헌재 결정 + 민법 개정) */
function SiblingNotice() {
  return (
    <div className="rounded-xl border border-[#E7D9B5] bg-[#FBF7EC] px-5 py-4 text-sm leading-relaxed text-[#5A4A20]">
      <p className="font-semibold">형제자매에게는 유류분이 없습니다</p>
      <p className="mt-1">
        헌법재판소가 2024. 4. 25. 형제자매의 유류분을 정한 민법 제1112조 제4호를 위헌으로 결정해 그날부터 효력을 잃었고, 2024. 9. 20. 민법 개정으로 이 조항이
        삭제되었습니다. 그래서 형제자매(먼저 사망한 형제자매를 대신하는 조카 포함)는 유류분을 청구할 수 없습니다.
      </p>
    </div>
  )
}

export function ReservedShareCalculator() {
  const [heirs, setHeirs] = useState(initialHeirs)
  const [estate, setEstate] = useState(0)
  const [gifts, setGifts] = useState(0)
  const [debts, setDebts] = useState(0)

  const { res, err } = useMemo(() => {
    try {
      return { res: reservedShares({ heirs: toHeirs(heirs), estate, gifts, debts }), err: "" }
    } catch (e) {
      return { res: null, err: e instanceof Error ? e.message : "계산할 수 없습니다." }
    }
  }, [heirs, estate, gifts, debts])

  const shareDen = res ? commonDenominator(res.heirs.map((h) => h.share)) : BigInt(1)
  const portionDen = res ? commonDenominator(res.heirs.map((h) => h.portion).filter((f) => !isZero(f))) : BigInt(1)
  const empty = estate + gifts === 0

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-6">
        <HeirForm idPrefix="res" value={heirs} onChange={setHeirs} />
        <Panel title="재산" desc="돌아가신 날을 기준으로 한 금액을 넣으세요. 부동산은 그날의 시가로 봅니다.">
          <div className="space-y-6">
            <MoneyField id="res-estate" label="남긴 재산 (상속재산)" help="돌아가실 때 가지고 있던 재산입니다. 유언으로 넘긴 재산(유증)도 여기에 넣습니다." value={estate} onChange={setEstate} />
            <MoneyField
              id="res-gifts"
              label="생전에 준 재산 (증여)"
              help={
                <>
                  상속인이 받은 증여는 오래전 것도 넣습니다. 상속인이 아닌 사람이 받은 증여는 돌아가시기 전 1년 안의 것만 넣고, 다른 상속인에게 손해가 될 줄 알고 한 증여는
                  1년보다 전 것도 넣습니다. 오래 함께 살며 돌보는 등 특별히 부양하거나 재산을 늘린 데 대한 보상으로 준 부분은 빠질 수 있습니다(2026. 3. 17. 개정 민법 제1008조 단서).
                </>
              }
              value={gifts}
              onChange={setGifts}
            />
            <MoneyField id="res-debts" label="빚 (상속채무)" help="돌아가실 때 남은 빚 전부입니다." value={debts} onChange={setDebts} />
          </div>
        </Panel>
      </div>

      <div className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
        {!res ? (
          <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">{err}</div>
        ) : (
          <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-[#6B717B]">유류분 기초재산</p>
            <p className="mt-1 text-2xl font-bold tabular-nums tracking-[-0.02em] text-jisan-ink">{formatWon(Math.max(res.base, 0))}</p>
            <p className="mt-1 text-sm tabular-nums text-[#6B717B]">
              {formatWon(res.estate)} + {formatWon(res.gifts)} − {formatWon(res.debts)}
            </p>
            {res.base <= 0 && !empty && <p className="mt-2 text-sm text-[#8A6A1F]">빚이 재산보다 많아 유류분으로 받을 금액이 없습니다.</p>}

            {res.noneReason ? (
              <div className="mt-5">
                {res.noneReason === "sibling" ? (
                  <SiblingNotice />
                ) : (
                  <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">4촌 이내 방계혈족은 처음부터 유류분이 없습니다.</p>
                )}
              </div>
            ) : (
              <>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[20rem] text-left text-[0.9375rem]">
                    <thead>
                      <tr className="border-b border-jisan-ink text-xs text-[#6B717B]">
                        <th className="py-2 pr-2 font-semibold">상속인</th>
                        <th className="py-2 pr-2 text-right font-semibold">상속분</th>
                        <th className="py-2 pr-2 text-right font-semibold">유류분 비율</th>
                        <th className="py-2 pr-2 text-right font-semibold">유류분</th>
                        <th className="py-2 text-right font-semibold">금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.heirs.map((h) => (
                        <tr key={h.id} className="border-b border-[#E9ECF0] align-top">
                          <td className="py-2.5 pr-2">
                            <span className="font-semibold text-jisan-ink">{h.name}</span>
                            {heirNote(h) && <span className="mt-0.5 block text-xs text-[#8A9099]">{heirNote(h)}</span>}
                          </td>
                          <td className="py-2.5 pr-2 text-right">
                            <FractionText f={h.share} denom={shareDen} />
                          </td>
                          <td className="py-2.5 pr-2 text-right tabular-nums text-[#4A505A]">{fracText(h.ratio)}</td>
                          <td className="py-2.5 pr-2 text-right">{isZero(h.portion) ? "0" : <FractionText f={h.portion} denom={portionDen} />}</td>
                          <td className="py-2.5 text-right font-semibold tabular-nums text-jisan-ink">{formatWon(h.reserved)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="pt-2.5 text-sm text-[#6B717B]">
                          유류분 합계
                        </td>
                        <td className="pt-2.5 text-right font-bold tabular-nums text-jisan-ink">{formatWon(res.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <h3 className="mt-6 text-sm font-bold text-jisan-ink">이렇게 계산했습니다</h3>
                <Steps
                  items={[
                    "유류분 기초재산 = 남긴 재산 + 생전에 준 재산 − 빚",
                    <>
                      상속 순위({RANK_LABEL[res.rank]})에 따라 법정상속분을 구합니다. 자세한 나누기는{" "}
                      <Link href="/tools/inheritance" className="text-brand-accent underline underline-offset-2">
                        상속분 계산기
                      </Link>
                      에서 볼 수 있습니다.
                    </>,
                    "법정상속분에 유류분 비율을 곱합니다. 자녀(손자녀)·배우자는 2분의 1, 부모 등 직계존속은 3분의 1입니다(민법 제1112조).",
                    "유류분 = 기초재산 × 법정상속분 × 유류분 비율",
                  ]}
                />
                <div className="mt-5 rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm leading-relaxed text-[#4A505A]">
                  <p className="font-semibold text-jisan-ink">실제로 돌려받을 수 있는 돈 (부족액)</p>
                  <p className="mt-1">
                    위 금액은 법이 보장하는 몫입니다. 실제로 청구할 수 있는 돈은 여기에서 그 사람이 이미 받은 증여·유증과 상속으로 받는 몫(빚을 나눠 진 만큼은 뺌)을 뺀
                    부족한 부분입니다. 이 계산은 사람마다 받은 재산을 하나하나 따져야 해서 이 계산기에는 넣지 않았습니다.
                  </p>
                </div>
              </>
            )}
          </section>
        )}
      </div>

      <div className="min-w-0 lg:col-span-2">
        <div className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
          <p className="font-semibold text-jisan-ink">2024년 헌법재판소 결정과 그 뒤 바뀐 법</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>형제자매의 유류분은 없어졌습니다(2024. 4. 25. 위헌 결정, 2024. 9. 20. 민법 개정).</li>
            <li>
              돌아가신 분에 대한 부양의무를 크게 어기거나 중대한 범죄·심히 부당한 대우를 한 상속인은 가정법원의 상속권 상실 선고로 상속권을 잃을 수 있고, 그러면 유류분도
              받지 못합니다(민법 제1004조의2).
            </li>
            <li>특별히 부양하거나 재산을 늘린 데 대한 보상으로 받은 증여·유증은 그 기여만큼 미리 받은 몫으로 보지 않습니다(2024. 4. 25. 이후 시작된 상속부터).</li>
            <li>2026. 3. 17. 이후 시작된 상속은 부족한 유류분을 재산 자체가 아니라 돈으로 돌려받는 것이 원칙입니다(민법 제1115조).</li>
          </ul>
          <p className="mt-2">
            유류분 청구는 상속이 시작된 것과 돌려받을 증여·유증이 있었다는 것을 안 날부터 1년, 상속이 시작된 날부터 10년이 지나면 할 수 없습니다(민법 제1117조).
          </p>
        </div>
        <Terms
          items={[
            ["유류분", "유언이나 증여가 있어도 법이 상속인에게 최소한 보장하는 몫입니다."],
            ["유류분 기초재산", "유류분을 계산하는 바탕이 되는 금액입니다. 남긴 재산에 생전 증여를 더하고 빚을 뺍니다."],
            ["유증", "유언으로 재산을 넘겨주는 것입니다."],
            ["법정상속분", "유언이 없을 때 법이 정한, 상속인마다 나눠 갖는 비율입니다."],
          ]}
        />
      </div>
    </div>
  )
}
