"use client"

import { useState } from "react"
import { childSupport, MAX_CHILD_AGE, SUPPORT_TABLE } from "@/lib/tools/family/child-support"
import { formatWon } from "@/lib/tools/family/format"
import { Choice, MoneyField, Panel, Steps, Terms, inputCls } from "./fields"

type Kid = { key: number; age: string }
type Sign = "plus" | "minus"

/** 가산·감산 한 줄: 더할지 뺄지 + 금액 */
function AdjustField({
  id,
  label,
  help,
  sign,
  amount,
  onSign,
  onAmount,
}: {
  id: string
  label: string
  help: React.ReactNode
  sign: Sign
  amount: number
  onSign: (s: Sign) => void
  onAmount: (n: number) => void
}) {
  return (
    <div className="space-y-2.5">
      <MoneyField id={id} label={label} help={help} value={amount} onChange={onAmount} />
      <Choice
        name={`${id}-sign`}
        label={`${label} 더하기 또는 빼기`}
        value={sign}
        onChange={onSign}
        options={[
          { value: "plus", label: "더하기 (가산)" },
          { value: "minus", label: "빼기 (감산)" },
        ]}
      />
    </div>
  )
}

export function ChildSupportCalculator() {
  const [kids, setKids] = useState<Kid[]>([{ key: 1, age: "" }])
  const [carer, setCarer] = useState(0)
  const [other, setOther] = useState(0)
  const [adjKids, setAdjKids] = useState({ sign: "plus" as Sign, amount: 0 })
  const [adjOther, setAdjOther] = useState({ sign: "plus" as Sign, amount: 0 })

  const ages = kids.map((k) => (k.age.trim() === "" ? NaN : Number(k.age)))
  const agesOk = ages.every((a) => Number.isInteger(a) && a >= 0 && a <= MAX_CHILD_AGE)
  const anyBadAge = ages.some((a, i) => kids[i].age.trim() !== "" && !(Number.isInteger(a) && a >= 0 && a <= MAX_CHILD_AGE))
  const adjustment = (adjKids.sign === "minus" ? -1 : 1) * adjKids.amount + (adjOther.sign === "minus" ? -1 : 1) * adjOther.amount

  // 두 사람 소득이 모두 0이면 나눌 비율이 없어 계산하지 않음
  const res = agesOk && carer + other > 0 ? childSupport({ children: ages.map((age) => ({ age, adjustment })), carerIncome: carer, otherIncome: other }) : null

  const n = kids.length
  const kidsHint =
    n === 1
      ? "자녀가 1명이면 표 금액보다 조금 올려(가산) 정하는 경우가 많습니다."
      : n >= 3
        ? "자녀가 3명 이상이면 표 금액보다 조금 내려(감산) 정하는 경우가 많습니다."
        : "표가 자녀 2명 기준이라 2명이면 보통 가감하지 않습니다."
  const pct = res?.otherRatio != null ? Math.round(res.otherRatio * 1000) / 10 : null
  const adjusted = adjustment !== 0

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-6">
        <Panel title="자녀" desc={`양육비를 받을 자녀의 만 나이를 넣으세요. 0세부터 ${MAX_CHILD_AGE}세까지(성년인 19세 전까지) 계산합니다.`}>
          <ul className="space-y-2.5">
            {kids.map((k, i) => (
              <li key={k.key} className="flex items-center gap-3">
                <label htmlFor={`cs-age-${k.key}`} className="w-16 shrink-0 text-[0.9375rem] font-semibold text-jisan-ink">
                  자녀 {i + 1}
                </label>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <input
                    id={`cs-age-${k.key}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={MAX_CHILD_AGE}
                    value={k.age}
                    onChange={(e) => setKids(kids.map((x) => (x.key === k.key ? { ...x, age: e.target.value } : x)))}
                    placeholder="나이"
                    className={`${inputCls} text-right tabular-nums`}
                  />
                  <span className="shrink-0 text-[0.9375rem] text-[#4A505A]">세</span>
                </div>
                {kids.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setKids(kids.filter((x) => x.key !== k.key))}
                    className="shrink-0 text-sm text-[#6B717B] underline underline-offset-2 hover:text-jisan-ink"
                  >
                    빼기
                  </button>
                )}
              </li>
            ))}
          </ul>
          {anyBadAge && <p className="mt-2 text-sm text-[#B42318]">나이는 0부터 {MAX_CHILD_AGE}까지의 정수로 넣어 주세요.</p>}
          <button
            type="button"
            onClick={() => setKids([...kids, { key: kids.reduce((m, x) => Math.max(m, x.key), 0) + 1, age: "" }])}
            disabled={kids.length >= 8}
            className="mt-3 rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-jisan-ink hover:border-jisan-ink disabled:opacity-40"
          >
            + 자녀 추가
          </button>
        </Panel>

        <Panel title="부모의 월 소득 (세전)" desc="월급·사업소득·임대소득·이자·연금 등을 모두 더한, 세금 떼기 전 한 달 금액입니다. 정부 지원금도 넣습니다.">
          <div className="space-y-6">
            <MoneyField id="cs-carer" label="양육자 (아이와 함께 사는 부모)" value={carer} onChange={setCarer} />
            <MoneyField id="cs-other" label="비양육자 (아이와 따로 사는 부모)" value={other} onChange={setOther} />
          </div>
        </Panel>

        <details className="group rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
          <summary className="cursor-pointer list-none text-lg font-bold text-jisan-ink">
            가산·감산 (선택)
            <span className="ml-2 text-sm font-normal text-[#6B717B] group-open:hidden">펼치기</span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-[#6B717B]">
            표준양육비는 부모 둘과 자녀 둘인 집을 기준으로 한 자녀 1명당 금액입니다. 집안 사정에 따라 법원이 금액을 올리거나(가산) 내리는(감산) 경우가 있습니다. 알고 있는 금액이
            있으면 자녀 1명당 한 달 금액으로 넣으세요.
          </p>
          <div className="mt-5 space-y-6">
            <AdjustField
              id="cs-adj-kids"
              label="자녀 수에 따른 가산·감산"
              help={kidsHint}
              sign={adjKids.sign}
              amount={adjKids.amount}
              onSign={(sign) => setAdjKids({ ...adjKids, sign })}
              onAmount={(amount) => setAdjKids({ ...adjKids, amount })}
            />
            <AdjustField
              id="cs-adj-other"
              label="그 밖의 가산·감산"
              help="사는 곳(도시·농어촌), 부모의 재산, 개인회생 중인지 같은 사정입니다."
              sign={adjOther.sign}
              amount={adjOther.amount}
              onSign={(sign) => setAdjOther({ ...adjOther, sign })}
              onAmount={(amount) => setAdjOther({ ...adjOther, amount })}
            />
          </div>
        </details>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        {!res ? (
          <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">
            {!agesOk ? "자녀 나이를 넣으면 바로 계산합니다." : "부모 소득을 넣으면 바로 계산합니다."}
          </div>
        ) : (
          <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-[#6B717B]">비양육자가 매달 줄 양육비{n > 1 ? ` (자녀 ${n}명 합계)` : ""}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-[-0.02em] text-jisan-ink">{formatWon(res.totalOtherShare ?? 0)}</p>
            <dl className="mt-4 space-y-1.5 border-t border-[#E9ECF0] pt-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B717B]">부모 합산 소득</dt>
                <dd className="text-right tabular-nums text-jisan-ink">
                  {formatWon(res.income)} <span className="text-[#8A9099]">({res.children[0].incomeBand} 구간)</span>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B717B]">비양육자 소득 비율</dt>
                <dd className="tabular-nums text-jisan-ink">{pct}%</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B717B]">양육비 전체{adjusted ? " (가감 반영)" : ""}</dt>
                <dd className="tabular-nums text-jisan-ink">{formatWon(res.totalAdjusted)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B717B]">양육자 부담</dt>
                <dd className="tabular-nums text-jisan-ink">{formatWon(res.totalCarerShare ?? 0)}</dd>
              </div>
            </dl>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[20rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-jisan-ink text-xs text-[#6B717B]">
                    <th className="py-2 pr-2 font-semibold">자녀</th>
                    <th className="py-2 pr-2 text-right font-semibold">표준양육비</th>
                    {adjusted && <th className="py-2 pr-2 text-right font-semibold">가감 후</th>}
                    <th className="py-2 text-right font-semibold">비양육자 몫</th>
                  </tr>
                </thead>
                <tbody>
                  {res.children.map((c, i) => (
                    <tr key={kids[i].key} className="border-b border-[#E9ECF0] align-top">
                      <td className="py-2.5 pr-2">
                        <span className="font-semibold text-jisan-ink">자녀 {i + 1}</span>
                        <span className="block text-xs text-[#8A9099]">
                          {c.age}세 · {c.ageBand} 칸
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 text-right tabular-nums text-[#4A505A]">
                        {formatWon(c.standard)}
                        <span className="block text-xs text-[#8A9099]">
                          범위 {formatWon(c.rangeLo)}
                          {c.rangeHi !== null ? ` ~ ${formatWon(c.rangeHi)}` : " 이상"}
                        </span>
                      </td>
                      {adjusted && <td className="py-2.5 pr-2 text-right tabular-nums text-[#4A505A]">{formatWon(c.adjusted)}</td>}
                      <td className="py-2.5 text-right font-semibold tabular-nums text-jisan-ink">{formatWon(c.otherShare ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-6 text-sm font-bold text-jisan-ink">이렇게 계산했습니다</h3>
            <Steps
              items={[
                `두 사람 소득을 더한 ${formatWon(res.income)}이 기준표의 ${res.children[0].incomeBand} 칸에 들어갑니다.`,
                "자녀마다 나이에 맞는 칸에서 표준양육비(자녀 1명당 한 달 평균 양육비)를 찾아 더합니다." + (adjusted ? " 가산·감산 금액을 자녀마다 더하거나 뺍니다." : ""),
                `양육비 전체를 두 사람 소득 비율로 나눕니다. 비양육자 몫 = 양육비 × 비양육자 소득 ÷ 합산 소득 (${pct}%).`,
              ]}
            />
            {res.income >= 12_000_000 && (
              <p className="mt-4 rounded-xl bg-[#FBF7EC] px-4 py-3 text-sm text-[#5A4A20]">
                합산 소득 월 1,200만 원 이상 칸은 위쪽 한도가 없어, 법원이 소득·재산·생활 수준을 더 따져 표 금액보다 많게 정할 수 있습니다.
              </p>
            )}
          </section>
        )}
      </div>

      <div className="min-w-0 lg:col-span-2">
        <div className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
          <p className="font-semibold text-jisan-ink">이 계산기가 쓰는 표</p>
          <p className="mt-1">
            {SUPPORT_TABLE.title}. 부모 둘과 자녀 둘인 가구를 기준으로 한 자녀 1명당 한 달 평균 양육비입니다. 법원은 이 표를 출발점으로 삼고, 아이의 생활 수준, 부모의 재산과
            빚, 사는 곳, 양육 형태 같은 사정을 함께 보고 금액을 정합니다.
          </p>
        </div>
        <Terms
          items={[
            ["양육자 · 비양육자", "이혼 뒤 아이와 함께 살며 키우는 부모가 양육자, 따로 사는 부모가 비양육자입니다. 보통 비양육자가 양육비를 보냅니다."],
            ["표준양육비", "법원이 만든 양육비 산정기준표에서 부모 소득과 아이 나이에 맞춰 정한 평균 금액입니다."],
            ["가산 · 감산", "표준양육비에 사정에 따라 금액을 더하거나 빼는 것입니다."],
            ["세전 소득", "세금과 4대 보험료를 떼기 전의 소득입니다."],
          ]}
        />
      </div>
    </div>
  )
}
