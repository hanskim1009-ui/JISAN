"use client"

import { useEffect, useMemo, useState } from "react"
import type { Lang } from "@/lib/langs"
import { calcInterest, CIVIL_RATE, COMMERCIAL_RATE, InterestError, SOCHOK_RATES, SOCHOK_TABLE_FLOOR, type RateKind } from "@/lib/tools/civil/interest"
import { addDays, formatPercentMicro } from "@/lib/tools/civil/format"
import { dateText, fmt, money, num, percent, TOOL_LOCALE, type CommonText } from "@/lib/tools/i18n-format"
import { rich } from "@/components/tools/rich"
import type koText from "@/content/tools/i18n/ko/interest.json"
import { Check, Choice, DataTable, DateInput, ErrorNote, Field, FormBox, MoneyInput, ResultBox, useToday } from "./fields"

export type InterestText = typeof koText

const KIND_ORDER: RateKind[] = ["civil", "commercial", "sochok", "custom"]

/** 이 날 전 구간은 소송촉진법 이율이 연 25%였음 (안내 문구용) */
const SOCHOK_OLD_RATE = 25

/** 지연이자 계산기. 문구는 사전(t·c), 금액·날짜·백분율 표기는 언어별 */
export function InterestCalculator({ lang, t, c }: { lang: Lang; t: InterestText; c: CommonText }) {
  const today = useToday()
  const [principal, setPrincipal] = useState<number | null>(10_000_000)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [kind, setKind] = useState<RateKind>("civil")
  const [custom, setCustom] = useState("")
  const [includeFirst, setIncludeFirst] = useState(true)

  // 처음 열면 1년 전 ~ 오늘로 채움
  useEffect(() => {
    if (!today) return
    setEnd((v) => v || today)
    setStart((v) => v || addDays(today, -365))
  }, [today])

  const ui = t.ui
  const won = (n: number) => money(lang, c, n)
  const pct = (n: number) => percent(lang, c, n)
  /** 백만분율 이율: 한국어는 지금 표기 그대로, 외국어는 소수 넷째 자리까지 */
  const pctMicro = (micro: number) => (lang === "ko" ? formatPercentMicro(micro) : percent(lang, c, micro / 10_000, 4))
  const d = (iso: string, withWeekday = true) => dateText(lang, iso, withWeekday)
  const days = (n: number) => fmt(ui.days, { n: num(lang, n) })
  const kinds = KIND_ORDER.map((value) => ({
    value,
    label: fmt(ui.kinds[value], { rate: pct(value === "commercial" ? COMMERCIAL_RATE : CIVIL_RATE) }),
  }))

  function rateRangeLabel(from: string | null, to: string | null): string {
    if (!from && to) return fmt(ui.until, { date: d(to, false) })
    if (from && !to) return fmt(ui.since, { date: d(from, false) })
    return fmt(ui.range, { from: d(from ?? "", false), to: d(to ?? "", false) })
  }

  const out = useMemo(() => {
    if (!principal || !start || !end) return null
    try {
      return { ok: calcInterest({ principal, start, end, kind, customPercent: custom, includeFirst }) }
    } catch (e) {
      return { error: e instanceof InterestError ? ui.errors[e.code] : ui.error }
    }
  }, [principal, start, end, kind, custom, includeFirst, ui])

  return (
    <div>
      <FormBox>
        <Field label={ui.principal} htmlFor="int-principal">
          <MoneyInput
            id="int-principal"
            value={principal}
            onChange={setPrincipal}
            placeholder={num(lang, 10_000_000)}
            unit={c.units.wonUnit}
            locale={lang === "ko" ? undefined : TOOL_LOCALE[lang]}
          />
        </Field>
        <div className="hidden sm:block" />
        <Field label={ui.start} htmlFor="int-start">
          <DateInput id="int-start" value={start} onChange={setStart} />
        </Field>
        <Field label={ui.end} htmlFor="int-end" hint={ui.endHint}>
          <DateInput id="int-end" value={end} onChange={setEnd} />
        </Field>
        <div className="sm:col-span-2">
          <Choice name="int-kind" label={ui.rate} value={kind} onChange={setKind} options={kinds} />
          <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">{ui.hints[kind]}</p>
        </div>
        {kind === "custom" && (
          <Field label={ui.custom} htmlFor="int-custom">
            <div className="relative">
              <input
                id="int-custom"
                inputMode="decimal"
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder={ui.customPlaceholder}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-right text-base tabular-nums ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-[#6B717B]">%</span>
            </div>
          </Field>
        )}
        <div className="sm:col-span-2">
          <Check checked={includeFirst} onChange={setIncludeFirst}>
            {ui.includeFirst}
          </Check>
        </div>
      </FormBox>

      {out?.error && <ErrorNote message={out.error} />}
      {out?.ok && (
        <ResultBox
          label={ui.total}
          value={won(out.ok.total)}
          sub={rich(ui.summary, { interest: <strong className="text-jisan-ink">{won(out.ok.interest)}</strong>, days: days(out.ok.days) })}
        >
          <DataTable
            head={[ui.colPeriod, ui.colDays, ui.colRate, ui.colInterest]}
            rows={out.ok.segments.map((s) => [
              <span key="p" className="whitespace-nowrap">
                {fmt(ui.range, { from: d(s.from), to: d(s.to) })}
              </span>,
              days(s.days),
              pctMicro(s.rateMicro),
              won(s.interest),
            ])}
            foot={[ui.sum, days(out.ok.days), "", won(out.ok.interest)]}
          />
          <p className="mt-3 text-xs leading-relaxed text-[#6B717B]">{out.ok.segments.length > 1 ? ui.methodSplit : ui.method}</p>
          {kind === "sochok" && start < SOCHOK_TABLE_FLOOR && (
            <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">
              {fmt(ui.oldRate, { date: d(addDays(SOCHOK_TABLE_FLOOR, -1), false), rate: pct(SOCHOK_OLD_RATE) })}
            </p>
          )}
        </ResultBox>
      )}

      {kind === "sochok" && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-jisan-ink">{ui.historyTitle}</p>
          <DataTable head={[ui.colApplied, ui.colAnnual]} rows={[...SOCHOK_RATES].reverse().map((r) => [rateRangeLabel(r.from, r.to), pct(r.rate)])} />
          <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">{ui.historyNote}</p>
        </div>
      )}
    </div>
  )
}
