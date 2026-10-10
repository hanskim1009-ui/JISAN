"use client"

import { useState } from "react"
import type { Lang } from "@/lib/langs"
import { childSupport, MAX_CHILD_AGE, type StandardLookup } from "@/lib/tools/family/child-support"
import { fmt, money, num, percent, type CommonText } from "@/lib/tools/i18n-format"
import type koText from "@/content/tools/i18n/ko/child-support.json"
import { Choice, MoneyField, Panel, Steps, Terms, inputCls, moneyOpts } from "./fields"

export type ChildSupportText = typeof koText

type Kid = { key: number; age: string }
type Sign = "plus" | "minus"

/** 소득 칸 금액: 한국어는 "400만", 그 밖은 원 단위 숫자 그대로 */
const bandAmount = (lang: Lang, won: number) => (lang === "ko" ? `${Math.round(won / 10000).toLocaleString("ko-KR")}만` : num(lang, won))

/** 기준표 소득 칸 표기 ("400만~499만 원") */
function incomeBand(lang: Lang, t: ChildSupportText, r: Pick<StandardLookup, "inc0" | "inc1">): string {
  if (r.inc1 === null) return fmt(t.ui.bandFrom, { lo: bandAmount(lang, r.inc0) })
  if (r.inc0 === 0) return fmt(t.ui.bandTo, { hi: bandAmount(lang, r.inc1) })
  return fmt(t.ui.bandRange, { lo: bandAmount(lang, r.inc0), hi: bandAmount(lang, r.inc1) })
}

/** 가산·감산 한 줄: 더할지 뺄지 + 금액 */
function AdjustField({
  id,
  label,
  help,
  sign,
  amount,
  onSign,
  onAmount,
  lang,
  t,
  c,
}: {
  id: string
  label: string
  help: React.ReactNode
  sign: Sign
  amount: number
  onSign: (s: Sign) => void
  onAmount: (n: number) => void
  lang: Lang
  t: ChildSupportText
  c: CommonText
}) {
  return (
    <div className="space-y-2.5">
      <MoneyField id={id} label={label} help={help} value={amount} onChange={onAmount} {...moneyOpts(lang, c)} />
      <Choice
        name={`${id}-sign`}
        label={fmt(t.ui.signLabel, { label })}
        value={sign}
        onChange={onSign}
        options={[
          { value: "plus", label: t.ui.plus },
          { value: "minus", label: t.ui.minus },
        ]}
      />
    </div>
  )
}

export function ChildSupportCalculator({ lang, t, c }: { lang: Lang; t: ChildSupportText; c: CommonText }) {
  const [kids, setKids] = useState<Kid[]>([{ key: 1, age: "" }])
  const [carer, setCarer] = useState(0)
  const [other, setOther] = useState(0)
  const [adjKids, setAdjKids] = useState({ sign: "plus" as Sign, amount: 0 })
  const [adjOther, setAdjOther] = useState({ sign: "plus" as Sign, amount: 0 })
  const ui = t.ui
  const won = (n: number) => money(lang, c, n)

  const ages = kids.map((k) => (k.age.trim() === "" ? NaN : Number(k.age)))
  const agesOk = ages.every((a) => Number.isInteger(a) && a >= 0 && a <= MAX_CHILD_AGE)
  const anyBadAge = ages.some((a, i) => kids[i].age.trim() !== "" && !(Number.isInteger(a) && a >= 0 && a <= MAX_CHILD_AGE))
  const adjustment = (adjKids.sign === "minus" ? -1 : 1) * adjKids.amount + (adjOther.sign === "minus" ? -1 : 1) * adjOther.amount

  // 두 사람 소득이 모두 0이면 나눌 비율이 없어 계산하지 않음
  const res = agesOk && carer + other > 0 ? childSupport({ children: ages.map((age) => ({ age, adjustment })), carerIncome: carer, otherIncome: other }) : null

  const n = kids.length
  const kidsHint = n === 1 ? ui.kidsHintOne : n >= 3 ? ui.kidsHintMany : ui.kidsHintTwo
  const pct = res?.otherRatio != null ? Math.round(res.otherRatio * 1000) / 10 : null
  const adjusted = adjustment !== 0
  const band = res ? incomeBand(lang, t, res.children[0]) : ""

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-6">
        <Panel title={ui.kidsTitle} desc={fmt(ui.kidsDesc, { max: MAX_CHILD_AGE })}>
          <ul className="space-y-2.5">
            {kids.map((k, i) => (
              <li key={k.key} className="flex items-center gap-3">
                <label htmlFor={`cs-age-${k.key}`} className="w-16 shrink-0 text-[0.9375rem] font-semibold text-jisan-ink">
                  {fmt(ui.kid, { n: i + 1 })}
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
                    placeholder={ui.agePlaceholder}
                    className={`${inputCls} text-right tabular-nums`}
                  />
                  <span className="shrink-0 text-[0.9375rem] text-[#4A505A]">{ui.ageUnit}</span>
                </div>
                {kids.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setKids(kids.filter((x) => x.key !== k.key))}
                    className="shrink-0 text-sm text-[#6B717B] underline underline-offset-2 hover:text-jisan-ink"
                  >
                    {c.words.remove}
                  </button>
                )}
              </li>
            ))}
          </ul>
          {anyBadAge && <p className="mt-2 text-sm text-[#B42318]">{fmt(ui.badAge, { max: MAX_CHILD_AGE })}</p>}
          <button
            type="button"
            onClick={() => setKids([...kids, { key: kids.reduce((m, x) => Math.max(m, x.key), 0) + 1, age: "" }])}
            disabled={kids.length >= 8}
            className="mt-3 rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-jisan-ink hover:border-jisan-ink disabled:opacity-40"
          >
            {ui.addKid}
          </button>
        </Panel>

        <Panel title={ui.incomeTitle} desc={ui.incomeDesc}>
          <div className="space-y-6">
            <MoneyField id="cs-carer" label={ui.carer} value={carer} onChange={setCarer} {...moneyOpts(lang, c)} />
            <MoneyField id="cs-other" label={ui.other} value={other} onChange={setOther} {...moneyOpts(lang, c)} />
          </div>
        </Panel>

        <details className="group rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
          <summary className="cursor-pointer list-none text-lg font-bold text-jisan-ink">
            {ui.adjTitle}
            <span className="ml-2 text-sm font-normal text-[#6B717B] group-open:hidden">{ui.expand}</span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-[#6B717B]">{ui.adjDesc}</p>
          <div className="mt-5 space-y-6">
            <AdjustField
              id="cs-adj-kids"
              label={ui.adjKids}
              help={kidsHint}
              sign={adjKids.sign}
              amount={adjKids.amount}
              onSign={(sign) => setAdjKids({ ...adjKids, sign })}
              onAmount={(amount) => setAdjKids({ ...adjKids, amount })}
              lang={lang}
              t={t}
              c={c}
            />
            <AdjustField
              id="cs-adj-other"
              label={ui.adjOther}
              help={ui.adjOtherHelp}
              sign={adjOther.sign}
              amount={adjOther.amount}
              onSign={(sign) => setAdjOther({ ...adjOther, sign })}
              onAmount={(amount) => setAdjOther({ ...adjOther, amount })}
              lang={lang}
              t={t}
              c={c}
            />
          </div>
        </details>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        {!res ? (
          <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">
            {!agesOk ? ui.emptyAge : ui.emptyIncome}
          </div>
        ) : (
          <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-[#6B717B]">{n > 1 ? fmt(ui.resultTitleMany, { n }) : ui.resultTitle}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-[-0.02em] text-jisan-ink">{won(res.totalOtherShare ?? 0)}</p>
            <dl className="mt-4 space-y-1.5 border-t border-[#E9ECF0] pt-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B717B]">{ui.income}</dt>
                <dd className="text-right tabular-nums text-jisan-ink">
                  {won(res.income)} <span className="text-[#8A9099]">{fmt(ui.bandNote, { band })}</span>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B717B]">{ui.ratio}</dt>
                <dd className="tabular-nums text-jisan-ink">{percent(lang, c, pct ?? 0)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B717B]">{adjusted ? ui.totalAdj : ui.total}</dt>
                <dd className="tabular-nums text-jisan-ink">{won(res.totalAdjusted)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#6B717B]">{ui.carerShare}</dt>
                <dd className="tabular-nums text-jisan-ink">{won(res.totalCarerShare ?? 0)}</dd>
              </div>
            </dl>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[20rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-jisan-ink text-xs text-[#6B717B]">
                    <th className="py-2 pr-2 font-semibold">{ui.colKid}</th>
                    <th className="py-2 pr-2 text-right font-semibold">{ui.colStandard}</th>
                    {adjusted && <th className="py-2 pr-2 text-right font-semibold">{ui.colAdjusted}</th>}
                    <th className="py-2 text-right font-semibold">{ui.colOther}</th>
                  </tr>
                </thead>
                <tbody>
                  {res.children.map((ch, i) => (
                    <tr key={kids[i].key} className="border-b border-[#E9ECF0] align-top">
                      <td className="py-2.5 pr-2">
                        <span className="font-semibold text-jisan-ink">{fmt(ui.kid, { n: i + 1 })}</span>
                        <span className="block text-xs text-[#8A9099]">
                          {fmt(ui.ageRow, { age: ch.age, band: fmt(ui.ageBand, { a: ch.age0, b: ch.age1 }) })}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 text-right tabular-nums text-[#4A505A]">
                        {won(ch.standard)}
                        <span className="block text-xs text-[#8A9099]">
                          {ch.rangeHi !== null ? fmt(ui.range, { lo: won(ch.rangeLo), hi: won(ch.rangeHi) }) : fmt(ui.rangeOpen, { lo: won(ch.rangeLo) })}
                        </span>
                      </td>
                      {adjusted && <td className="py-2.5 pr-2 text-right tabular-nums text-[#4A505A]">{won(ch.adjusted)}</td>}
                      <td className="py-2.5 text-right font-semibold tabular-nums text-jisan-ink">{won(ch.otherShare ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-6 text-sm font-bold text-jisan-ink">{c.words.howCalculated}</h3>
            <Steps
              items={[
                fmt(ui.step1, { income: won(res.income), band }),
                adjusted ? ui.step2Adj : ui.step2,
                fmt(ui.step3, { pct: percent(lang, c, pct ?? 0) }),
              ]}
            />
            {res.income >= 12_000_000 && <p className="mt-4 rounded-xl bg-[#FBF7EC] px-4 py-3 text-sm text-[#5A4A20]">{ui.highIncome}</p>}
          </section>
        )}
      </div>

      <div className="min-w-0 lg:col-span-2">
        <div className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
          <p className="font-semibold text-jisan-ink">{ui.tableHead}</p>
          <p className="mt-1">{fmt(ui.tableBody, { table: ui.tableName })}</p>
        </div>
        <Terms items={t.terms as [string, string][]} />
      </div>
    </div>
  )
}
