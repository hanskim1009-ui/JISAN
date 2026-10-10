"use client"

import { useMemo, useState } from "react"
import type { Lang } from "@/lib/langs"
import { calcCourtFees, CASE_KINDS, CourtFeeError, DELIVERY_UNIT, SMALL_CLAIM_LIMIT, type CaseKind, type CaseName, type FeeExpr, type Instance } from "@/lib/tools/civil/court-fees"
import { formatNumber } from "@/lib/tools/civil/format"
import { fmt, money, num, TOOL_LOCALE, type CommonText } from "@/lib/tools/i18n-format"
import { rich } from "@/components/tools/rich"
import type koText from "@/content/tools/i18n/ko/court-fees.json"
import { Choice, DataTable, ErrorNote, Field, FormBox, MoneyInput, NumberInput, ResultBox, Select } from "./fields"

export type CourtFeesText = typeof koText

const INSTANCES = ["1", "2", "3"] as const

/** 인지·송달료 계산기. 문구는 사전(t·c), 금액·식의 숫자 표기는 언어별 */
export function CourtFeeCalculator({ lang, t, c }: { lang: Lang; t: CourtFeesText; c: CommonText }) {
  const [kind, setKind] = useState<CaseKind>("civil")
  const [soga, setSoga] = useState<number | null>(30_000_000)
  const [instance, setInstance] = useState<string>("1")
  const [electronic, setElectronic] = useState<"e" | "p">("e")
  const [opponents, setOpponents] = useState(1)
  const [applicants, setApplicants] = useState(1)

  const ui = t.ui
  const won = (n: number) => money(lang, c, n)
  /** 식 안의 숫자 (소수 배율 0.9·1.5 포함): 언어별 자릿수·소수점 표기 */
  const n = (x: number) => x.toLocaleString(TOOL_LOCALE[lang], { maximumFractionDigits: 4 })
  const exprText = (e: FeeExpr) => (e === "fixed" ? ui.fixedExpr : fmt(e.t, Object.fromEntries(Object.entries(e.v).map(([k, v]) => [k, n(v)]))))
  const caseText = (cn: CaseName) => {
    if (cn.key === "civilSmall" || cn.key === "civilFirst" || cn.key === "civilAppeal" || cn.key === "civilFinal") return t.cases[cn.key]
    if (!cn.instance) return t.kinds[cn.key]
    const names = cn.key === "family-division" ? t.divisionInstances : t.instances
    return fmt(ui.caseInstance, { kind: t.kinds[cn.key], instance: names[String(cn.instance) as "1" | "2" | "3"] })
  }
  /** 소액사건 상한: 한국어는 "3,000만원", 그 밖은 원 단위 금액 */
  const smallLimit = lang === "ko" ? `${formatNumber(SMALL_CLAIM_LIMIT / 10_000)}만원` : won(SMALL_CLAIM_LIMIT)

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
      return { error: e instanceof CourtFeeError ? ui.errors[e.code] : ui.error }
    }
  }, [kind, soga, instance, electronic, opponents, applicants, meta, ui])

  const opponentLabel =
    kind === "payment-order" ? ui.debtors : kind === "mediation" ? ui.opponents : instance === "1" || !meta.hasInstance ? ui.defendants : ui.appellees
  const instanceNames = kind === "family-division" ? t.divisionInstances : t.instances

  return (
    <div>
      <FormBox>
        <Field label={ui.kind} htmlFor="fee-kind" hint={fmt(t.hints[kind], { limit: smallLimit })}>
          <Select id="fee-kind" value={kind} onChange={setKind}>
            {CASE_KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {t.kinds[k.value]}
              </option>
            ))}
          </Select>
        </Field>
        {meta.needsSoga ? (
          <Field label={ui.soga} htmlFor="fee-soga" hint={ui.sogaHint}>
            <MoneyInput
              id="fee-soga"
              value={soga}
              onChange={setSoga}
              placeholder={num(lang, 30_000_000)}
              unit={c.units.wonUnit}
              locale={lang === "ko" ? undefined : TOOL_LOCALE[lang]}
            />
          </Field>
        ) : (
          <div className="hidden sm:block" />
        )}
        {meta.hasInstance && (
          <div className="sm:col-span-2">
            <Choice name="fee-instance" label={ui.instance} value={instance} onChange={setInstance} options={INSTANCES.map((v) => ({ value: v, label: instanceNames[v] }))} />
          </div>
        )}
        <div className="sm:col-span-2">
          <Choice
            name="fee-elec"
            label={ui.filing}
            value={electronic}
            onChange={setElectronic}
            options={[
              { value: "e", label: ui.electronic },
              { value: "p", label: ui.paper },
            ]}
          />
        </div>
        {meta.parties === "both" && (
          <Field label={kind === "payment-order" ? ui.creditors : ui.applicants} htmlFor="fee-app">
            <NumberInput id="fee-app" value={applicants} onChange={setApplicants} suffix={ui.personUnit} />
          </Field>
        )}
        <Field label={opponentLabel} htmlFor="fee-opp">
          <NumberInput id="fee-opp" value={opponents} onChange={setOpponents} suffix={ui.personUnit} />
        </Field>
      </FormBox>

      {out?.error && <ErrorNote message={out.error} />}
      {out?.ok && (
        <ResultBox
          label={fmt(ui.result, { case: caseText(out.ok.caseName) })}
          value={won(out.ok.total)}
          sub={rich(ui.summary, {
            stamp: <strong className="text-jisan-ink">{won(out.ok.stamp.amount)}</strong>,
            delivery: <strong className="text-jisan-ink">{won(out.ok.delivery.amount)}</strong>,
          })}
        >
          <DataTable
            head={[ui.colStep, ui.colExpr, ui.colAmount]}
            rows={[
              ...out.ok.stamp.steps.map((s) => [
                t.steps[s.label],
                <span key="e" className="whitespace-nowrap">
                  {exprText(s.expr)}
                  {s.floored ? ` (${ui.floorNote})` : ""}
                </span>,
                won(s.value),
              ]),
              [
                ui.deliveryRow,
                <span key="d" className="whitespace-nowrap">
                  {fmt(ui.deliveryExpr, { unit: won(DELIVERY_UNIT), who: t.who[out.ok.delivery.who], n: num(lang, out.ok.delivery.persons), rounds: num(lang, out.ok.delivery.rounds) })}
                </span>,
                won(out.ok.delivery.amount),
              ],
            ]}
            foot={[ui.sum, "", won(out.ok.total)]}
          />
          <p className="mt-3 text-xs leading-relaxed text-[#6B717B]">{fmt(ui.note, { unit: won(DELIVERY_UNIT) })}</p>
        </ResultBox>
      )}
    </div>
  )
}
