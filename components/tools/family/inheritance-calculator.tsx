"use client"

import { useMemo, useState } from "react"
import { inheritanceShares, RANK_LABEL, type InheritanceResult, type ShareRow } from "@/lib/tools/family/inheritance"
import { formatWon } from "@/lib/tools/family/format"
import { FractionText, MoneyField, Panel, Steps, Terms } from "./fields"
import { HeirForm, initialHeirs, toHeirs } from "./heir-form"

/** 상속인 이름 옆 작은 설명: 누구를 대신하는지 */
export function heirNote(r: ShareRow): string | undefined {
  if (!r.via) return undefined
  return `먼저 사망한 ${r.via.name}의 몫을 대신 받음 (대습상속)`
}

/** 상속분 계산 설명 줄 */
export function shareSteps(res: InheritanceResult): React.ReactNode[] {
  const hasSpouse = res.heirs.some((h) => h.role === "spouse")
  const others = res.heirs.some((h) => h.role !== "spouse")
  const items: React.ReactNode[] = [<>상속 순위: <b className="text-jisan-ink">{RANK_LABEL[res.rank]}</b>. 앞 순위가 있으면 뒤 순위는 받지 않습니다.</>]
  if (hasSpouse && others) items.push("배우자는 같이 상속받는 자녀(또는 부모) 한 사람 몫의 1.5배를 받습니다. 그래서 배우자 3, 나머지 각 2의 비율로 나눕니다.")
  else if (others) items.push("같은 순위의 상속인끼리는 똑같이 나눕니다.")
  if (res.heirs.some((h) => h.via))
    items.push("먼저 사망한 사람의 몫은 그 사람의 자녀·배우자가 대신 받고(대습상속), 그 몫 안에서 다시 배우자 1.5 : 자녀 1로 나눕니다.")
  items.push(`모든 몫을 같은 분모(${res.denominator.toString()})로 맞추어 표시했습니다. 괄호 안은 약분한 값입니다.`)
  return items
}

export function InheritanceCalculator() {
  const [heirs, setHeirs] = useState(initialHeirs)
  const [estate, setEstate] = useState(0)

  const { res, err } = useMemo(() => {
    try {
      return { res: inheritanceShares(toHeirs(heirs), estate), err: "" }
    } catch (e) {
      return { res: null, err: e instanceof Error ? e.message : "계산할 수 없습니다." }
    }
  }, [heirs, estate])

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-6">
        <HeirForm idPrefix="inh" value={heirs} onChange={setHeirs} />
        <Panel title="상속재산 (선택)">
          <MoneyField
            id="inh-estate"
            label="나눌 재산 금액"
            help="넣으면 사람별 금액도 보여 드립니다. 빚이 있으면 빚을 뺀 금액을 넣으세요."
            value={estate}
            onChange={setEstate}
          />
        </Panel>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        {!res ? (
          <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">{err}</div>
        ) : (
          <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-[#6B717B]">법정상속분</p>
            <p className="mt-1 text-lg font-bold text-jisan-ink">{RANK_LABEL[res.rank]}</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[18rem] text-left text-[0.9375rem]">
                <thead>
                  <tr className="border-b border-jisan-ink text-xs text-[#6B717B]">
                    <th className="py-2 pr-2 font-semibold">상속인</th>
                    <th className="py-2 pr-2 text-right font-semibold">상속분</th>
                    <th className="py-2 pr-2 text-right font-semibold">비율</th>
                    {res.estate !== undefined && <th className="py-2 text-right font-semibold">금액</th>}
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
                        <FractionText f={h.share} denom={res.denominator} />
                      </td>
                      <td className="py-2.5 pr-2 text-right tabular-nums text-[#4A505A]">{h.percent}%</td>
                      {res.estate !== undefined && <td className="py-2.5 text-right font-semibold tabular-nums text-jisan-ink">{formatWon(h.amount ?? 0)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {res.estate !== undefined && <p className="mt-2 text-xs text-[#8A9099]">금액은 원 단위에서 반올림해 합계가 몇 원 다를 수 있습니다.</p>}
            <h3 className="mt-6 text-sm font-bold text-jisan-ink">이렇게 계산했습니다</h3>
            <Steps items={shareSteps(res)} />
          </section>
        )}
      </div>

      <div className="min-w-0 lg:col-span-2">
        <div className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
          <p className="font-semibold text-jisan-ink">이 계산에 들어가지 않은 것</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>유언이 있으면 유언이 먼저입니다. 다만 법이 보장하는 최소한의 몫(유류분)이 모자라면 따로 청구할 수 있습니다.</li>
            <li>상속을 포기한 사람은 처음부터 상속인이 아니었던 것으로 봅니다. 그 사람을 빼고 다시 계산하세요.</li>
            <li>미리 받은 재산(특별수익)이나 오래 모시고 돌본 몫(기여분)은 실제로 나눌 때 따로 따집니다.</li>
            <li>손자녀까지 먼저 사망한 경우(재대습)나 태아는 이 계산기에 넣을 수 없습니다.</li>
          </ul>
        </div>
        <Terms
          items={[
            ["상속분", "법이 정한, 상속인마다 나눠 갖는 비율입니다."],
            ["피상속인", "돌아가셔서 재산을 남긴 분입니다."],
            ["직계비속 · 직계존속", "자녀·손자녀처럼 아래로 이어지는 혈족, 부모·조부모처럼 위로 이어지는 혈족입니다."],
            ["대습상속", "상속인이 될 자녀나 형제자매가 먼저 사망했을 때, 그 사람의 자녀·배우자가 대신 상속받는 것입니다."],
          ]}
        />
      </div>
    </div>
  )
}
