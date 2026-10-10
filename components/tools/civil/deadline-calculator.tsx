"use client"

import { useEffect, useMemo, useState } from "react"
import { calcDeadline, HOLIDAY_RANGE, PROCEDURE_GROUPS, PROCEDURES } from "@/lib/tools/civil/deadline"
import { diffDays, formatDateKo } from "@/lib/tools/civil/format"
import { Check, DataTable, DateInput, ErrorNote, Field, FormBox, NumberInput, ResultBox, Select, useToday } from "./fields"

const CUSTOM = "custom"

export function DeadlineCalculator() {
  const today = useToday()
  const [procId, setProcId] = useState<string>(PROCEDURES[0].id)
  const [base, setBase] = useState("")
  const [customDays, setCustomDays] = useState(14)
  const [zeroHour, setZeroHour] = useState(false)

  useEffect(() => {
    if (today) setBase((v) => v || today)
  }, [today])

  const proc = PROCEDURES.find((p) => p.id === procId) ?? null
  const days = proc ? proc.days : customDays
  const includeFirst = Boolean(proc?.zeroHour && zeroHour)

  const out = useMemo(() => {
    if (!base) return null
    try {
      return { ok: calcDeadline(base, days, includeFirst) }
    } catch (e) {
      return { error: e instanceof Error ? e.message : "입력값을 확인해 주세요." }
    }
  }, [base, days, includeFirst])

  const left = out?.ok && today ? diffDays(today, out.ok.due) : null

  return (
    <div>
      <FormBox>
        <div className="sm:col-span-2">
          <Field label="절차" htmlFor="dl-proc">
            <Select id="dl-proc" value={procId} onChange={setProcId}>
              {PROCEDURE_GROUPS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.period})
                    </option>
                  ))}
                </optgroup>
              ))}
              <optgroup label="그 밖에">
                <option value={CUSTOM}>기간을 직접 입력</option>
              </optgroup>
            </Select>
          </Field>
        </div>
        <Field label={proc ? proc.from : "기간이 시작되는 날"} htmlFor="dl-base" hint={proc ? undefined : "판결·결정을 송달받거나 고지받은 날"}>
          <DateInput id="dl-base" value={base} onChange={setBase} />
        </Field>
        {proc ? (
          <div className="min-w-0 space-y-1 text-sm leading-relaxed text-[#4A505A] sm:pt-7">
            <p>
              기간 <strong className="text-jisan-ink">{proc.period}</strong>
              {proc.fixed ? " · 불변기간" : ""}
            </p>
            <p className="text-xs text-[#6B717B]">{proc.basis}</p>
          </div>
        ) : (
          <Field label="기간 (일)" htmlFor="dl-days">
            <NumberInput id="dl-days" value={customDays} onChange={setCustomDays} min={1} max={3650} suffix="일" />
          </Field>
        )}
        {proc?.zeroHour && (
          <div className="sm:col-span-2">
            <Check checked={zeroHour} onChange={setZeroHour}>
              송달 효력이 그날 0시에 생긴 경우 (전자소송 문서를 1주 동안 확인하지 않아 송달된 것으로 보는 경우 등) — 첫날도 셉니다
            </Check>
          </div>
        )}
      </FormBox>

      {out?.error && <ErrorNote message={out.error} />}
      {out?.ok && (
        <ResultBox
          label={proc ? `${proc.label} 마감일` : "마감일"}
          value={formatDateKo(out.ok.due)}
          sub={
            <>
              {left !== null && (left > 0 ? `오늘부터 ${left}일 남았습니다. ` : left === 0 ? "오늘이 마감일입니다. " : `마감일이 ${-left}일 지났습니다. `)}
              서류는 마감일까지 법원에 도착해야 합니다(우편은 보낸 날이 아니라 도착한 날 기준).
            </>
          }
        >
          <DataTable
            head={["구분", "날짜"]}
            rows={[
              [proc ? proc.from : "기준일", formatDateKo(out.ok.base)],
              [out.ok.includeFirst ? "첫날(0시 송달이라 그날부터 셈)" : "첫날(다음 날부터 셈)", formatDateKo(out.ok.countFrom)],
              [`${days}일째 되는 날`, formatDateKo(out.ok.raw)],
              ...out.ok.skipped.map((s) => [`${s.reason}이라 하루 미룸`, formatDateKo(s.date)]),
            ]}
            foot={["마감일", formatDateKo(out.ok.due)]}
          />
          {proc?.fixed && (
            <p className="mt-3 text-xs leading-relaxed text-[#6B717B]">
              불변기간은 법원도 늘려 줄 수 없는 기간입니다. 하루라도 넘기면 다툴 기회를 잃는 것이 원칙이므로 여유 있게 내세요.
            </p>
          )}
          {proc?.note && <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">{proc.note}</p>}
          {out.ok.outsideHolidayTable && (
            <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">
              공휴일은 {formatDateKo(HOLIDAY_RANGE.from, false)} ~ {formatDateKo(HOLIDAY_RANGE.to, false)}만 반영되어 있습니다. 이 기간 밖의 날은 토·일요일만 따졌으니 달력에서 공휴일을 한 번 더 확인하세요.
            </p>
          )}
        </ResultBox>
      )}

      <div className="mt-6 text-xs leading-relaxed text-[#6B717B]">
        <p>
          계산 방법: 기간의 첫날은 세지 않고 다음 날부터 셉니다(민법 제157조, 형사소송법 제66조 제1항). 마지막 날이 토요일·일요일·공휴일이면 그다음 날까지로 늘어납니다(민법 제161조,
          형사소송법 제66조 제3항). 공휴일은 「관공서의 공휴일에 관한 규정」의 공휴일과 대체공휴일입니다.
        </p>
      </div>
    </div>
  )
}
