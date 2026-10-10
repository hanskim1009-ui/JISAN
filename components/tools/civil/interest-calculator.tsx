"use client"

import { useEffect, useMemo, useState } from "react"
import { calcInterest, CIVIL_RATE, COMMERCIAL_RATE, SOCHOK_RATES, SOCHOK_TABLE_FLOOR, type RateKind } from "@/lib/tools/civil/interest"
import { addDays, formatDateKo, formatPercentMicro, formatWon } from "@/lib/tools/civil/format"
import { Check, Choice, DataTable, DateInput, ErrorNote, Field, FormBox, MoneyInput, ResultBox, useToday } from "./fields"

const KINDS: { value: RateKind; label: string }[] = [
  { value: "civil", label: `민사 법정이율 연 ${CIVIL_RATE}%` },
  { value: "commercial", label: `상사 법정이율 연 ${COMMERCIAL_RATE}%` },
  { value: "sochok", label: "소송촉진법 이율" },
  { value: "custom", label: "약정 이율 직접 입력" },
]

const KIND_HINT: Record<RateKind, string> = {
  civil: "따로 정한 이율이 없는 일반 빚에 붙는 이율입니다(민법 제379조).",
  commercial: "장사·영업으로 생긴 빚에 붙는 이율입니다(상법 제54조).",
  sochok: "소송촉진 등에 관한 특례법의 이율입니다. 보통 소장 부본을 받은 다음 날부터 판결 주문에 적힙니다. 이율이 바뀐 날을 걸치면 나눠 계산합니다.",
  custom: "계약서에 적은 이율(연)을 넣으세요. 최고이율을 넘는지는 최고이자율 확인에서 볼 수 있습니다.",
}

function rateRangeLabel(from: string | null, to: string | null): string {
  if (!from && to) return `${formatDateKo(to, false)}까지`
  if (from && !to) return `${formatDateKo(from, false)}부터`
  return `${formatDateKo(from ?? "", false)} ~ ${formatDateKo(to ?? "", false)}`
}

export function InterestCalculator() {
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

  const out = useMemo(() => {
    if (!principal || !start || !end) return null
    try {
      return { ok: calcInterest({ principal, start, end, kind, customPercent: custom, includeFirst }) }
    } catch (e) {
      return { error: e instanceof Error ? e.message : "입력값을 확인해 주세요." }
    }
  }, [principal, start, end, kind, custom, includeFirst])

  return (
    <div>
      <FormBox>
        <Field label="원금" htmlFor="int-principal">
          <MoneyInput id="int-principal" value={principal} onChange={setPrincipal} placeholder="10,000,000" />
        </Field>
        <div className="hidden sm:block" />
        <Field label="이자가 붙기 시작하는 날" htmlFor="int-start">
          <DateInput id="int-start" value={start} onChange={setStart} />
        </Field>
        <Field label="계산할 마지막 날" htmlFor="int-end" hint="다 갚은 날 또는 오늘처럼 계산하고 싶은 날">
          <DateInput id="int-end" value={end} onChange={setEnd} />
        </Field>
        <div className="sm:col-span-2">
          <Choice name="int-kind" label="이율" value={kind} onChange={setKind} options={KINDS} />
          <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">{KIND_HINT[kind]}</p>
        </div>
        {kind === "custom" && (
          <Field label="약정 이율 (연)" htmlFor="int-custom">
            <div className="relative">
              <input
                id="int-custom"
                inputMode="decimal"
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="예: 12"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-right text-base tabular-nums ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-[#6B717B]">%</span>
            </div>
          </Field>
        )}
        <div className="sm:col-span-2">
          <Check checked={includeFirst} onChange={setIncludeFirst}>
            시작일도 하루로 셉니다 (판결 주문의 &ldquo;○○부터 다 갚는 날까지&rdquo;처럼 계산할 때)
          </Check>
        </div>
      </FormBox>

      {out?.error && <ErrorNote message={out.error} />}
      {out?.ok && (
        <ResultBox
          label="원금과 이자 합계"
          value={formatWon(out.ok.total)}
          sub={
            <>
              이자 <strong className="text-jisan-ink">{formatWon(out.ok.interest)}</strong> · 총 {out.ok.days.toLocaleString("ko-KR")}일
            </>
          }
        >
          <DataTable
            head={["기간", "일수", "연 이율", "이자"]}
            rows={out.ok.segments.map((s) => [
              <span key="p" className="whitespace-nowrap">
                {formatDateKo(s.from)} ~ {formatDateKo(s.to)}
              </span>,
              `${s.days.toLocaleString("ko-KR")}일`,
              formatPercentMicro(s.rateMicro),
              formatWon(s.interest),
            ])}
            foot={["합계", `${out.ok.days.toLocaleString("ko-KR")}일`, "", formatWon(out.ok.interest)]}
          />
          <p className="mt-3 text-xs leading-relaxed text-[#6B717B]">
            원금 × 연 이율 × 일수 ÷ 365로 계산하고 원 미만은 반올림했습니다.
            {out.ok.segments.length > 1 && " 합계는 구간별 금액을 반올림하기 전에 더해 구간별 이자를 더한 값과 1원 정도 다를 수 있습니다."}
          </p>
          {kind === "sochok" && start < SOCHOK_TABLE_FLOOR && (
            <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">2003. 5. 31. 이전 기간은 이율이 달랐으므로(연 25%) 이 표의 금액과 다를 수 있습니다.</p>
          )}
        </ResultBox>
      )}

      {kind === "sochok" && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-jisan-ink">소송촉진법 이율이 바뀐 기록</p>
          <DataTable
            head={["적용 기간", "연 이율"]}
            rows={[...SOCHOK_RATES].reverse().map((r) => [rateRangeLabel(r.from, r.to), `${r.rate}%`])}
          />
          <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">
            이율이 바뀔 때 이미 1심 변론이 끝난 사건은 바뀌기 전 이율이 그대로 적용됩니다(각 개정 규정 부칙).
          </p>
        </div>
      )}
    </div>
  )
}
