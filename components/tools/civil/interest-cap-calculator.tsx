"use client"

import { useEffect, useMemo, useState } from "react"
import type { Lang } from "@/lib/langs"
import { calcInterestCap, CAP_TABLE_FLOOR, ILLEGAL_LENDER_NO_INTEREST_FROM, InterestCapError, LENDER_KINDS, MIN_PRINCIPAL, type LenderKind } from "@/lib/tools/civil/interest-cap"
import { addDays, formatNumber } from "@/lib/tools/civil/format"
import { dateText, fmt, money, num, percent, TOOL_LOCALE, type CommonText } from "@/lib/tools/i18n-format"
import { rich } from "@/components/tools/rich"
import type koText from "@/content/tools/i18n/ko/interest-cap.json"
import { Choice, DataTable, DateInput, ErrorNote, Field, FormBox, MoneyInput, ResultBox, useToday } from "./fields"

export type InterestCapText = typeof koText

/** 최고이자율 확인. 문구는 사전(t·c), 금액·날짜·백분율 표기는 언어별 */
export function InterestCapCalculator({ lang, t, c }: { lang: Lang; t: InterestCapText; c: CommonText }) {
  const today = useToday()
  const [principal, setPrincipal] = useState<number | null>(10_000_000)
  const [interest, setInterest] = useState<number | null>(3_000_000)
  const [prepaid, setPrepaid] = useState<number | null>(null)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [contract, setContract] = useState("")
  const [lender, setLender] = useState<LenderKind>("personal")

  useEffect(() => {
    if (!today) return
    setStart((v) => v || today)
    setEnd((v) => v || addDays(today, 365))
  }, [today])

  const ui = t.ui
  const won = (n: number) => money(lang, c, n)
  /** 연 환산 이율: 한국어는 지금 표기("1,234.56%") 그대로 */
  const pct = (n: number) => (lang === "ko" ? `${n.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%` : percent(lang, c, n))
  const d = (iso: string, withWeekday = true) => dateText(lang, iso, withWeekday)
  const strong = (s: string) => <strong className="text-jisan-ink">{s}</strong>
  const moneyInput = { unit: c.units.wonUnit, locale: lang === "ko" ? undefined : TOOL_LOCALE[lang] }
  /** 이자제한법이 적용되지 않는 원금: 한국어는 "10만원", 그 밖은 원 단위 금액 */
  const minPrincipal = lang === "ko" ? `${formatNumber(MIN_PRINCIPAL / 10_000)}만원` : won(MIN_PRINCIPAL)

  const out = useMemo(() => {
    if (!principal || interest === null || !start || !end) return null
    try {
      return { ok: calcInterestCap({ principal, interest, prepaid: prepaid ?? 0, start, end, contractDate: contract || undefined, lender }) }
    } catch (e) {
      if (!(e instanceof InterestCapError)) return { error: ui.error }
      return { error: e.code === "tooOld" ? fmt(ui.errors.tooOld, { date: dateText(lang, CAP_TABLE_FLOOR, false) }) : ui.errors[e.code] }
    }
  }, [principal, interest, prepaid, start, end, contract, lender, ui, lang])

  return (
    <div>
      <FormBox>
        <Field label={ui.principal} htmlFor="cap-principal">
          <MoneyInput id="cap-principal" value={principal} onChange={setPrincipal} placeholder={num(lang, 10_000_000)} {...moneyInput} />
        </Field>
        <Field label={ui.interest} htmlFor="cap-interest" hint={ui.interestHint}>
          <MoneyInput id="cap-interest" value={interest} onChange={setInterest} placeholder={num(lang, 3_000_000)} {...moneyInput} />
        </Field>
        <Field label={ui.start} htmlFor="cap-start">
          <DateInput id="cap-start" value={start} onChange={setStart} />
        </Field>
        <Field label={ui.end} htmlFor="cap-end">
          <DateInput id="cap-end" value={end} onChange={setEnd} />
        </Field>
        <Field label={ui.prepaid} htmlFor="cap-prepaid" hint={ui.prepaidHint}>
          <MoneyInput id="cap-prepaid" value={prepaid} onChange={setPrepaid} placeholder={num(lang, 0)} {...moneyInput} />
        </Field>
        <Field label={ui.contract} htmlFor="cap-contract" hint={ui.contractHint}>
          <DateInput id="cap-contract" value={contract} onChange={setContract} />
        </Field>
        <div className="sm:col-span-2">
          <Choice name="cap-lender" label={ui.lender} value={lender} onChange={setLender} options={LENDER_KINDS.map((k) => ({ value: k.value, label: t.lenders[k.value] }))} />
        </div>
      </FormBox>

      {out?.error && <ErrorNote message={out.error} />}
      {out?.ok && (
        <ResultBox
          label={ui.annual}
          value={pct(out.ok.annualPercent)}
          sub={
            out.ok.capPercent === 0 ? (
              <>{rich(ui.noInterest, { date: d(ILLEGAL_LENDER_NO_INTEREST_FROM, false), amount: strong(won(out.ok.excess)) })}</>
            ) : out.ok.over ? (
              <>
                {rich(ui.over, {
                  cap: percent(lang, c, out.ok.capPercent),
                  amount: strong(won(out.ok.excess)),
                  law: lender === "registered" ? ui.overLawLender : ui.overLawPersonal,
                })}
              </>
            ) : (
              <>{fmt(ui.notOver, { cap: percent(lang, c, out.ok.capPercent) })}</>
            )
          }
        >
          <DataTable
            head={[ui.colItem, ui.colValue]}
            rows={[
              [ui.rowPrincipal, won(out.ok.principal)],
              [ui.rowInterest, won(out.ok.interest)],
              [ui.rowPeriod, fmt(ui.periodValue, { from: d(start), to: d(end), days: fmt(ui.days, { n: num(lang, out.ok.days) }) })],
              [ui.rowCap, fmt(ui.capValue, { cap: percent(lang, c, out.ok.capPercent), date: d(out.ok.contractDate, false), law: t.laws[out.ok.capLaw] })],
              [ui.rowMax, won(out.ok.maxInterest)],
            ]}
            foot={[ui.rowExcess, won(out.ok.excess)]}
          />
          <p className="mt-3 text-xs leading-relaxed text-[#6B717B]">{ui.method}</p>
          {out.ok.smallLoan && <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">{fmt(ui.smallLoan, { amount: minPrincipal })}</p>}
          {out.ok.over && <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">{fmt(ui.penalty, { law: t.laws[out.ok.penaltyLaw] })}</p>}
        </ResultBox>
      )}
    </div>
  )
}
