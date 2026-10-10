"use client"

import { useEffect, useMemo, useState } from "react"
import type { Lang } from "@/lib/langs"
import { calcDeadline, DeadlineError, HOLIDAY_RANGE, PROCEDURE_GROUPS, PROCEDURES, type RestReason } from "@/lib/tools/civil/deadline"
import { diffDays } from "@/lib/tools/civil/format"
import { dateText, fmt } from "@/lib/tools/i18n-format"
import { rich } from "@/components/tools/rich"
import type koText from "@/content/tools/i18n/ko/deadline.json"
import { Check, DataTable, DateInput, ErrorNote, Field, FormBox, NumberInput, ResultBox, Select, useToday } from "./fields"

export type DeadlineText = typeof koText

type ProcText = { label: string; period: string; from: string; basis: string; note?: string }

const CUSTOM = "custom"

/** 법정 기한 계산기. 문구는 사전(t), 날짜 표기는 언어별 */
export function DeadlineCalculator({ lang, t }: { lang: Lang; t: DeadlineText }) {
  const today = useToday()
  const [procId, setProcId] = useState<string>(PROCEDURES[0].id)
  const [base, setBase] = useState("")
  const [customDays, setCustomDays] = useState(14)
  const [zeroHour, setZeroHour] = useState(false)

  useEffect(() => {
    if (today) setBase((v) => v || today)
  }, [today])

  const ui = t.ui
  const procText = (id: string) => (t.procedures as Record<string, ProcText>)[id]
  const d = (iso: string, withWeekday = true) => dateText(lang, iso, withWeekday)
  const reasonText = (r: RestReason) => ("holiday" in r ? ((t.holidays as Record<string, string>)[r.holiday] ?? r.holiday) : t.weekdays[r.weekday])

  const proc = PROCEDURES.find((p) => p.id === procId) ?? null
  const pt = proc ? procText(proc.id) : null
  const days = proc ? proc.days : customDays
  const includeFirst = Boolean(proc?.zeroHour && zeroHour)

  const out = useMemo(() => {
    if (!base) return null
    try {
      return { ok: calcDeadline(base, days, includeFirst) }
    } catch (e) {
      return { error: e instanceof DeadlineError ? ui[e.code] : ui.error }
    }
  }, [base, days, includeFirst, ui])

  const left = out?.ok && today ? diffDays(today, out.ok.due) : null

  return (
    <div>
      <FormBox>
        <div className="sm:col-span-2">
          <Field label={ui.procedure} htmlFor="dl-proc">
            <Select id="dl-proc" value={procId} onChange={setProcId}>
              {PROCEDURE_GROUPS.map((g) => (
                <optgroup key={g.group} label={(t.groups as Record<string, string>)[g.group] ?? g.group}>
                  {g.items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {fmt(ui.option, { label: procText(p.id).label, period: procText(p.id).period })}
                    </option>
                  ))}
                </optgroup>
              ))}
              <optgroup label={ui.otherGroup}>
                <option value={CUSTOM}>{ui.custom}</option>
              </optgroup>
            </Select>
          </Field>
        </div>
        <Field label={pt ? pt.from : ui.baseCustom} htmlFor="dl-base" hint={pt ? undefined : ui.baseHint}>
          <DateInput id="dl-base" value={base} onChange={setBase} />
        </Field>
        {proc && pt ? (
          <div className="min-w-0 space-y-1 text-sm leading-relaxed text-[#4A505A] sm:pt-7">
            <p>
              {rich(ui.period, { period: <strong className="text-jisan-ink">{pt.period}</strong> })}
              {proc.fixed ? ` · ${ui.fixed}` : ""}
            </p>
            <p className="text-xs text-[#6B717B]">{pt.basis}</p>
          </div>
        ) : (
          <Field label={ui.daysLabel} htmlFor="dl-days">
            <NumberInput id="dl-days" value={customDays} onChange={setCustomDays} min={1} max={3650} suffix={ui.daysUnit} />
          </Field>
        )}
        {proc?.zeroHour && (
          <div className="sm:col-span-2">
            <Check checked={zeroHour} onChange={setZeroHour}>
              {ui.zeroHour}
            </Check>
          </div>
        )}
      </FormBox>

      {out?.error && <ErrorNote message={out.error} />}
      {out?.ok && (
        <ResultBox
          label={pt ? fmt(ui.dueOf, { label: pt.label }) : ui.due}
          value={d(out.ok.due)}
          sub={
            <>
              {left !== null && `${left > 0 ? fmt(ui.left, { n: left }) : left === 0 ? ui.today : fmt(ui.passed, { n: -left })} `}
              {ui.arrive}
            </>
          }
        >
          <DataTable
            head={[ui.colKind, ui.colDate]}
            rows={[
              [pt ? pt.from : ui.baseDay, d(out.ok.base)],
              [out.ok.includeFirst ? ui.firstZero : ui.firstNext, d(out.ok.countFrom)],
              [fmt(ui.nthDay, { n: days }), d(out.ok.raw)],
              ...out.ok.skipped.map((s) => [fmt(ui.skip, { reason: reasonText(s.reason) }), d(s.date)]),
            ]}
            foot={[ui.due, d(out.ok.due)]}
          />
          {proc?.fixed && <p className="mt-3 text-xs leading-relaxed text-[#6B717B]">{ui.fixedNote}</p>}
          {pt?.note && <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">{pt.note}</p>}
          {out.ok.outsideHolidayTable && (
            <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">
              {fmt(ui.outside, { from: d(HOLIDAY_RANGE.from, false), to: d(HOLIDAY_RANGE.to, false) })}
            </p>
          )}
        </ResultBox>
      )}

      <div className="mt-6 text-xs leading-relaxed text-[#6B717B]">
        <p>{ui.method}</p>
      </div>
    </div>
  )
}
