"use client"

import { useEffect, useMemo, useState } from "react"
import { calcInterestCap, LENDER_KINDS, type LenderKind } from "@/lib/tools/civil/interest-cap"
import { addDays, formatDateKo, formatWon } from "@/lib/tools/civil/format"
import { Choice, DataTable, DateInput, ErrorNote, Field, FormBox, MoneyInput, ResultBox, useToday } from "./fields"

function pct(n: number): string {
  return `${n.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%`
}

export function InterestCapCalculator() {
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

  const out = useMemo(() => {
    if (!principal || interest === null || !start || !end) return null
    try {
      return { ok: calcInterestCap({ principal, interest, prepaid: prepaid ?? 0, start, end, contractDate: contract || undefined, lender }) }
    } catch (e) {
      return { error: e instanceof Error ? e.message : "입력값을 확인해 주세요." }
    }
  }, [principal, interest, prepaid, start, end, contract, lender])

  return (
    <div>
      <FormBox>
        <Field label="빌려준(빌린) 돈" htmlFor="cap-principal">
          <MoneyInput id="cap-principal" value={principal} onChange={setPrincipal} placeholder="10,000,000" />
        </Field>
        <Field label="받기로 한 이자 합계" htmlFor="cap-interest" hint="수수료·사례금·할인금처럼 이름이 달라도 빌려준 대가로 받는 돈은 모두 이자로 봅니다(이자제한법 제4조).">
          <MoneyInput id="cap-interest" value={interest} onChange={setInterest} placeholder="3,000,000" />
        </Field>
        <Field label="빌려준 날" htmlFor="cap-start">
          <DateInput id="cap-start" value={start} onChange={setStart} />
        </Field>
        <Field label="갚기로 한 날(갚은 날)" htmlFor="cap-end">
          <DateInput id="cap-end" value={end} onChange={setEnd} />
        </Field>
        <Field label="선이자 (처음에 미리 떼고 준 이자)" htmlFor="cap-prepaid" hint="없으면 비워 두세요. 미리 뗀 이자가 있으면 실제로 받은 돈을 원금으로 봅니다(이자제한법 제3조).">
          <MoneyInput id="cap-prepaid" value={prepaid} onChange={setPrepaid} placeholder="0" />
        </Field>
        <Field label="계약한 날 (빌려준 날과 다를 때만)" htmlFor="cap-contract" hint="최고이율은 이자를 약정한 때를 기준으로 정합니다.">
          <DateInput id="cap-contract" value={contract} onChange={setContract} />
        </Field>
        <div className="sm:col-span-2">
          <Choice name="cap-lender" label="빌려준 사람" value={lender} onChange={setLender} options={LENDER_KINDS.map((k) => ({ value: k.value, label: k.label }))} />
        </div>
      </FormBox>

      {out?.error && <ErrorNote message={out.error} />}
      {out?.ok && (
        <ResultBox
          label="연 이율로 바꾸면"
          value={pct(out.ok.annualPercent)}
          sub={
            out.ok.capPercent === 0 ? (
              <>
                2025. 7. 22. 이후 등록하지 않은 대부업자(불법사금융업자)와 맺은 대부계약은 이자 약정 전부가 효력이 없습니다(대부업법 제11조 제1항). 이자{" "}
                <strong className="text-jisan-ink">{formatWon(out.ok.excess)}</strong>를 낼 의무가 없습니다.
              </>
            ) : out.ok.over ? (
              <>
                최고이율 연 {out.ok.capPercent}%를 넘습니다. 넘는 이자 <strong className="text-jisan-ink">{formatWon(out.ok.excess)}</strong>는 효력이 없고, 이미 냈다면 원금을 갚은 것으로
                치거나 돌려달라고 할 수 있습니다({lender === "registered" ? "대부업법 제8조 제4항·제5항" : "이자제한법 제2조 제3항·제4항"}).
              </>
            ) : (
              <>최고이율 연 {out.ok.capPercent}%를 넘지 않습니다.</>
            )
          }
        >
          <DataTable
            head={["항목", "내용"]}
            rows={[
              ["원금으로 보는 돈", formatWon(out.ok.principal)],
              ["이자로 보는 돈", formatWon(out.ok.interest)],
              ["기간", `${formatDateKo(start)} ~ ${formatDateKo(end)} (${out.ok.days.toLocaleString("ko-KR")}일)`],
              ["적용 최고이율", `연 ${out.ok.capPercent}% (${formatDateKo(out.ok.contractDate, false)} 계약 · ${out.ok.capLaw})`],
              ["이 기간 이자 한도", formatWon(out.ok.maxInterest)],
            ]}
            foot={["한도를 넘는 이자", formatWon(out.ok.excess)]}
          />
          <p className="mt-3 text-xs leading-relaxed text-[#6B717B]">
            연 이율 = 이자 ÷ 원금 ÷ 일수 × 365. 일수는 빌려준 다음 날부터 셉니다. 이자 한도는 원 미만을 버렸습니다.
          </p>
          {out.ok.smallLoan && (
            <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">빌린 돈이 10만원 미만이면 이자제한법의 최고이율이 적용되지 않습니다(이자제한법 제2조 제5항).</p>
          )}
          {out.ok.over && (
            <p className="mt-2 text-xs leading-relaxed text-[#6B717B]">최고이율을 넘는 이자를 받으면 형사처벌 대상이 될 수 있습니다({out.ok.penaltyLaw}).</p>
          )}
        </ResultBox>
      )}
    </div>
  )
}
