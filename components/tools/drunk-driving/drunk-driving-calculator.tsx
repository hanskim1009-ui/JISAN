"use client"

import { useId, useState } from "react"
import Link from "next/link"
import {
  LICENSE_APPEAL,
  evaluateDrunkDriving,
  parseBac,
  type Accident,
  type DdInput,
  type Penalty,
  type Prior,
  type TestKind,
} from "@/lib/tools/drunk-driving"
import { fmt, say, type CommonText, type Msg } from "@/lib/tools/i18n-format"
import { rich } from "@/components/tools/rich"
import type koText from "@/content/tools/i18n/ko/drunk-driving.json"

export type DrunkDrivingText = typeof koText

type Opt = { value: string; label: string }

const opts = (values: readonly string[], labels: Record<string, string>): Opt[] => values.map((value) => ({ value, label: labels[value] ?? value }))

/** 음주운전 처벌 기준 확인: 왼쪽 질문, 오른쪽 결과 (답을 바꾸면 바로 다시 계산). 문구는 사전(t), 구형 계산기 링크는 그 언어판이 있을 때만 */
export function DrunkDrivingCalculator({
  t,
  c,
  prosecutionHref,
}: {
  t: DrunkDrivingText
  c: CommonText
  /** 구형 예상 계산기 주소 (그 언어판이 없으면 undefined) */
  prosecutionHref?: string
}) {
  const TEST_OPTS = opts(["measured", "refused", "obstructed"], t.ui.testOpts)
  const PRIOR_OPTS = opts(["none", "recent", "old"], t.ui.priorOpts)
  const YESNO: Opt[] = [
    { value: "no", label: c.words.no },
    { value: "yes", label: c.words.yes },
  ]
  const ACCIDENT_OPTS = opts(["none", "property", "injury", "death"], t.ui.accidentOpts)
  const tx = (m: Msg) => say(t, m)
  const [test, setTest] = useState<TestKind>("measured")
  const [bacRaw, setBacRaw] = useState("")
  const [prior, setPrior] = useState<Prior>("none")
  const [within5, setWithin5] = useState(false)
  const [priorAccident, setPriorAccident] = useState(false)
  const [accident, setAccident] = useState<Accident>("none")
  const [fled, setFled] = useState(false)
  const bacId = useId()

  const bac = parseBac(bacRaw)
  const bacBad = bacRaw.trim() !== "" && bac === null
  const ready = test !== "measured" || bac !== null

  const input: DdInput = {
    test,
    bac: test === "measured" && bac !== null ? bac : undefined,
    prior,
    priorWithin5: prior !== "none" && within5,
    priorAccident: prior !== "none" && priorAccident,
    accident,
    fled: accident !== "none" && fled,
  }
  const result = ready ? evaluateDrunkDriving(input) : null

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-7">
        <Choice label={t.ui.testQ} opts={TEST_OPTS} value={test} onChange={(v) => setTest(v as TestKind)} />

        {test === "measured" ? (
          <div>
            <label htmlFor={bacId} className="block text-[0.9375rem] font-semibold text-jisan-ink">
              {t.ui.bacLabel}
            </label>
            <p className="mt-1 text-sm text-[#6B717B]">{t.ui.bacHelp}</p>
            <div className="mt-2.5 flex items-center gap-2">
              <input
                id={bacId}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.000"
                value={bacRaw}
                onChange={(e) => setBacRaw(e.target.value)}
                aria-invalid={bacBad || undefined}
                className={`w-32 rounded-xl border bg-white px-4 py-3 text-[0.9375rem] tabular-nums text-jisan-ink outline-none focus:border-jisan-ink ${bacBad ? "border-red-400" : "border-[#D5DAE1]"}`}
              />
              <span className="text-[0.9375rem] text-[#4A505A]">%</span>
            </div>
            {bacBad && <p className="mt-1.5 text-sm text-red-600">{t.ui.bacBad}</p>}
          </div>
        ) : (
          <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm leading-relaxed text-[#4A505A]">
            {test === "refused" ? t.ui.refusedExplain : t.ui.obstructedExplain}
          </p>
        )}

        <Choice
          label={t.ui.priorQ}
          help={t.ui.priorHelp}
          opts={PRIOR_OPTS}
          value={prior}
          onChange={(v) => setPrior(v as Prior)}
        />
        {prior !== "none" && (
          <>
            <Choice
              label={t.ui.within5Q}
              opts={YESNO}
              value={within5 ? "yes" : "no"}
              onChange={(v) => setWithin5(v === "yes")}
            />
            <Choice
              label={t.ui.priorAccidentQ}
              opts={YESNO}
              value={priorAccident ? "yes" : "no"}
              onChange={(v) => setPriorAccident(v === "yes")}
            />
          </>
        )}

        <Choice label={t.ui.accidentQ} opts={ACCIDENT_OPTS} value={accident} onChange={(v) => setAccident(v as Accident)} />
        {accident !== "none" && (
          <Choice
            label={t.ui.fledQ}
            opts={YESNO}
            value={fled ? "yes" : "no"}
            onChange={(v) => setFled(v === "yes")}
          />
        )}

        <p className="text-sm leading-relaxed text-[#6B717B]">{t.ui.vehicleNote}</p>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        {result ? (
          <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-[#6B717B]">{t.ui.tier}</p>
            <p className="mt-1 text-xl font-bold tracking-[-0.02em] text-jisan-ink [overflow-wrap:anywhere]">{tx(result.tierLabel)}</p>

            <h3 className="mt-6 text-sm font-bold text-jisan-ink">{t.ui.criminal}</h3>
            {result.main ? (
              <PenaltyBlock p={result.main} tx={tx} strong />
            ) : (
              <p className="mt-2 text-[0.9375rem] font-semibold text-jisan-ink">{t.ui.underLimit}</p>
            )}

            {result.accident.length > 0 && (
              <>
                <h3 className="mt-6 text-sm font-bold text-jisan-ink">{t.ui.accidentCrimes}</h3>
                <div className="mt-1 space-y-4">
                  {result.accident.map((p) => (
                    <PenaltyBlock key={p.label.k} p={p} tx={tx} />
                  ))}
                </div>
              </>
            )}

            <h3 className="mt-6 text-sm font-bold text-jisan-ink">{t.ui.license}</h3>
            <div className="mt-2 rounded-xl bg-[#F4F5F7] px-4 py-3">
              <p className="text-lg font-bold text-jisan-ink">{tx(result.license.title)}</p>
              {result.license.disqualification && (
                <p className="mt-1 text-[0.9375rem] text-jisan-ink">
                  {rich(t.ui.disqualification, {
                    years: <b className="tabular-nums">{fmt(t.ui.years, { n: result.license.disqualification.years })}</b>,
                  })}
                  <span className="block text-sm text-[#4A505A]">{tx(result.license.disqualification.reason)}</span>
                  <span className="block text-xs text-[#8A9099]">{tx(result.license.disqualification.law)}</span>
                </p>
              )}
              <p className="mt-1 text-xs text-[#8A9099]">{tx(result.license.law)}</p>
            </div>
            <Bullets lines={[...result.license.lines, ...(result.license.conditional ? [result.license.conditional] : []), ...(result.license.reduction ? [result.license.reduction] : [])].map(tx)} />

            {result.notes.length > 0 && (
              <>
                <h3 className="mt-6 text-sm font-bold text-jisan-ink">{t.ui.notes}</h3>
                <Bullets lines={result.notes.map(tx)} />
              </>
            )}

            <p className="mt-5 text-sm leading-relaxed text-[#4A505A]">{tx(LICENSE_APPEAL)}</p>

            <p className="mt-5 border-t border-[#E9ECF0] pt-4 text-xs leading-relaxed text-[#8A9099]">
              {t.ui.lawFoot}
              {prosecutionHref && (
                <>
                  {" "}
                  {rich(t.ui.lawFootLink, {
                    link: (
                      <Link href={prosecutionHref} className="underline underline-offset-2 hover:text-jisan-ink">
                        {c.tools.prosecution.title}
                      </Link>
                    ),
                  })}
                </>
              )}
            </p>
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">
            {t.ui.empty}
          </div>
        )}
      </div>
    </div>
  )
}

function PenaltyBlock({ p, tx, strong }: { p: Penalty; tx: (m: Msg) => string; strong?: boolean }) {
  return (
    <div className="mt-2">
      <p className="text-sm text-[#6B717B]">{tx(p.label)}</p>
      <p className={`mt-0.5 font-bold text-jisan-ink [overflow-wrap:anywhere] ${strong ? "text-xl" : "text-base"}`}>{tx(p.text)}</p>
      <p className="mt-0.5 text-xs text-[#8A9099]">{tx(p.law)}</p>
      {p.note && <p className="mt-1 text-sm leading-relaxed text-[#4A505A]">{tx(p.note)}</p>}
    </div>
  )
}

function Bullets({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null
  return (
    <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#4A505A]">
      {lines.map((n) => (
        <li key={n} className="flex gap-2">
          <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#8A9099]" />
          <span className="min-w-0">{n}</span>
        </li>
      ))}
    </ul>
  )
}

function Choice({ label, help, opts, value, onChange }: { label: string; help?: string; opts: Opt[]; value: string; onChange: (v: string) => void }) {
  const name = useId()
  return (
    <fieldset className="min-w-0">
      <legend className="text-[0.9375rem] font-semibold text-jisan-ink">{label}</legend>
      {help && <p className="mt-1 text-sm text-[#6B717B]">{help}</p>}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {opts.map((o) => (
          <label key={o.value} className="max-w-full cursor-pointer">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="block rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-sm text-[#4A505A] transition-colors [overflow-wrap:anywhere] peer-checked:border-jisan-ink peer-checked:bg-jisan-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-accent/40 hover:border-jisan-ink">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
