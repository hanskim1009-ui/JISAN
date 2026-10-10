"use client"

import { useMemo, useState } from "react"
import { calcCourtFees, CASE_KINDS, DELIVERY_UNIT, SMALL_CLAIM_LIMIT, type CaseKind, type Instance } from "@/lib/tools/civil/court-fees"
import { formatNumber, formatWon } from "@/lib/tools/civil/format"
import { Choice, DataTable, ErrorNote, Field, FormBox, MoneyInput, NumberInput, ResultBox, Select } from "./fields"

const KIND_HINT: Record<CaseKind, string> = {
  civil: `소가가 ${formatNumber(SMALL_CLAIM_LIMIT / 10_000)}만원 이하인 1심은 소액사건으로 보고 송달료를 계산합니다.`,
  "payment-order": "법원이 상대방에게 돈을 갚으라고 명령하는 간단한 절차입니다. 상대방이 이의하면 소송으로 넘어갑니다.",
  mediation: "판사나 조정위원 앞에서 합의를 이끌어 내는 절차입니다.",
  "family-fixed": "재판상 이혼, 혼인 무효처럼 돈 액수가 기준이 되지 않는 가사소송입니다. 인지액이 정해져 있습니다.",
  "family-damages": "이혼 위자료처럼 돈을 청구하는 가사소송입니다. 민사 요율의 절반입니다.",
  "family-division": "재산분할을 따로 청구하는 경우입니다. 소가는 청구하는 금액입니다.",
}

function instanceOptions(kind: CaseKind): { value: string; label: string }[] {
  if (kind === "family-division") {
    return [
      { value: "1", label: "1심" },
      { value: "2", label: "항고" },
      { value: "3", label: "재항고" },
    ]
  }
  return [
    { value: "1", label: "1심" },
    { value: "2", label: "항소" },
    { value: "3", label: "상고" },
  ]
}

export function CourtFeeCalculator() {
  const [kind, setKind] = useState<CaseKind>("civil")
  const [soga, setSoga] = useState<number | null>(30_000_000)
  const [instance, setInstance] = useState<string>("1")
  const [electronic, setElectronic] = useState<"e" | "p">("e")
  const [opponents, setOpponents] = useState(1)
  const [applicants, setApplicants] = useState(1)

  const meta = CASE_KINDS.find((k) => k.value === kind) ?? CASE_KINDS[0]

  const out = useMemo(() => {
    if (meta.needsSoga && !soga) return null
    try {
      return {
        ok: calcCourtFees({
          kind,
          soga: soga ?? 0,
          instance: (meta.hasInstance ? Number(instance) : 1) as Instance,
          electronic: electronic === "e",
          opponents,
          applicants,
        }),
      }
    } catch (e) {
      return { error: e instanceof Error ? e.message : "입력값을 확인해 주세요." }
    }
  }, [kind, soga, instance, electronic, opponents, applicants, meta])

  const opponentLabel =
    kind === "payment-order" ? "채무자 수" : kind === "mediation" ? "상대방 수" : instance === "1" || !meta.hasInstance ? "피고(상대방) 수" : "상대방(피항소인·피상고인) 수"

  return (
    <div>
      <FormBox>
        <Field label="사건 종류" htmlFor="fee-kind" hint={KIND_HINT[kind]}>
          <Select id="fee-kind" value={kind} onChange={setKind}>
            {CASE_KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </Select>
        </Field>
        {meta.needsSoga ? (
          <Field label="소가 (소송목적의 값)" htmlFor="fee-soga" hint="돈을 청구하면 보통 청구하는 원금이 소가입니다. 이자·지연손해금은 넣지 않습니다.">
            <MoneyInput id="fee-soga" value={soga} onChange={setSoga} placeholder="30,000,000" />
          </Field>
        ) : (
          <div className="hidden sm:block" />
        )}
        {meta.hasInstance && (
          <div className="sm:col-span-2">
            <Choice name="fee-instance" label="심급" value={instance} onChange={setInstance} options={instanceOptions(kind)} />
          </div>
        )}
        <div className="sm:col-span-2">
          <Choice
            name="fee-elec"
            label="접수 방법"
            value={electronic}
            onChange={setElectronic}
            options={[
              { value: "e", label: "전자소송 (인지액 10% 할인)" },
              { value: "p", label: "종이 서류로 접수" },
            ]}
          />
        </div>
        {meta.parties === "both" && (
          <Field label={kind === "payment-order" ? "채권자 수" : "신청인 수"} htmlFor="fee-app">
            <NumberInput id="fee-app" value={applicants} onChange={setApplicants} suffix="명" />
          </Field>
        )}
        <Field label={opponentLabel} htmlFor="fee-opp">
          <NumberInput id="fee-opp" value={opponents} onChange={setOpponents} suffix="명" />
        </Field>
      </FormBox>

      {out?.error && <ErrorNote message={out.error} />}
      {out?.ok && (
        <ResultBox
          label={`${out.ok.caseLabel} · 처음 낼 비용`}
          value={formatWon(out.ok.total)}
          sub={
            <>
              인지액 <strong className="text-jisan-ink">{formatWon(out.ok.stamp.amount)}</strong> + 송달료 예납액{" "}
              <strong className="text-jisan-ink">{formatWon(out.ok.delivery.amount)}</strong>
            </>
          }
        >
          <DataTable
            head={["계산 단계", "식", "금액"]}
            rows={[
              ...out.ok.stamp.steps.map((s) => [s.label, <span key="e" className="whitespace-nowrap">{s.expr}{s.note ? ` (${s.note})` : ""}</span>, formatWon(s.value)]),
              ["송달료 예납", <span key="d" className="whitespace-nowrap">{out.ok.delivery.expr}</span>, formatWon(out.ok.delivery.amount)],
            ]}
            foot={["합계", "", formatWon(out.ok.total)]}
          />
          <p className="mt-3 text-xs leading-relaxed text-[#6B717B]">
            인지액은 소장·신청서에 붙이는 수수료이고, 송달료는 법원이 서류를 보내는 데 쓸 우편료를 미리 내는 돈입니다(1회 {formatWon(DELIVERY_UNIT)}). 남은 송달료는 사건이 끝나면
            돌려받습니다. 여러 청구를 함께 내거나 상대방이 많으면 금액이 달라질 수 있고, 실제 금액은 접수하는 법원에서 정합니다.
          </p>
        </ResultBox>
      )}
    </div>
  )
}
