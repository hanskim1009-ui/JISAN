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

type Opt = { value: string; label: string }

const TEST_OPTS: Opt[] = [
  { value: "measured", label: "측정함 (호흡·혈액)" },
  { value: "refused", label: "측정을 거부함" },
  { value: "obstructed", label: "측정을 방해함" },
]
const PRIOR_OPTS: Opt[] = [
  { value: "none", label: "없음" },
  { value: "recent", label: "있음 · 10년 안" },
  { value: "old", label: "있음 · 그 밖의 경우" },
]
const YESNO: Opt[] = [
  { value: "no", label: "아니요" },
  { value: "yes", label: "예" },
]
const ACCIDENT_OPTS: Opt[] = [
  { value: "none", label: "사고 없음" },
  { value: "property", label: "물건만 부숨" },
  { value: "injury", label: "사람이 다침" },
  { value: "death", label: "사람이 숨짐" },
]

/** 음주운전 처벌 기준 확인: 왼쪽 질문, 오른쪽 결과 (답을 바꾸면 바로 다시 계산) */
export function DrunkDrivingCalculator() {
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
        <Choice label="음주측정은 어떻게 됐나요?" opts={TEST_OPTS} value={test} onChange={(v) => setTest(v as TestKind)} />

        {test === "measured" ? (
          <div>
            <label htmlFor={bacId} className="block text-[0.9375rem] font-semibold text-jisan-ink">
              혈중알코올농도
            </label>
            <p className="mt-1 text-sm text-[#6B717B]">단속 때 받은 서류에 적힌 수치입니다. 혈액으로 다시 쟀다면 그 수치를 넣으세요.</p>
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
            {bacBad && <p className="mt-1.5 text-sm text-red-600">0.000 처럼 0 이상 1 미만의 숫자로 넣어 주세요.</p>}
          </div>
        ) : (
          <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm leading-relaxed text-[#4A505A]">
            {test === "refused"
              ? "측정 거부는 술에 취했다고 볼 상당한 이유가 있는데 경찰의 호흡 측정에 응하지 않은 경우입니다."
              : "측정 방해는 운전한 뒤 측정을 어렵게 하려고 술을 더 마시거나 혈중알코올농도에 영향을 주는 약품 등을 쓴 경우입니다(도로교통법 제44조 제5항)."}
          </p>
        )}

        <Choice
          label="예전에 음주운전·측정 거부·측정 방해로 걸린 적이 있나요?"
          help="'10년 안'은 그 사건에서 벌금 이상의 형이 확정된 날부터 10년 안에 이번에 운전한 경우입니다. 그사이 형이 실효됐어도 포함합니다. 10년이 지났거나 기소유예 등 벌금 미만으로 끝났다면 '그 밖의 경우'를 고르세요."
          opts={PRIOR_OPTS}
          value={prior}
          onChange={(v) => setPrior(v as Prior)}
        />
        {prior !== "none" && (
          <>
            <Choice
              label="예전에 위반한 날부터 5년 안에 이번에 운전했나요?"
              opts={YESNO}
              value={within5 ? "yes" : "no"}
              onChange={(v) => setWithin5(v === "yes")}
            />
            <Choice
              label="예전 음주운전 때도 교통사고를 냈나요?"
              opts={YESNO}
              value={priorAccident ? "yes" : "no"}
              onChange={(v) => setPriorAccident(v === "yes")}
            />
          </>
        )}

        <Choice label="이번에 사고가 났나요?" opts={ACCIDENT_OPTS} value={accident} onChange={(v) => setAccident(v as Accident)} />
        {accident !== "none" && (
          <Choice
            label="사고 뒤 피해자 구호나 연락처 제공 없이 현장을 떠났나요?"
            opts={YESNO}
            value={fled ? "yes" : "no"}
            onChange={(v) => setFled(v === "yes")}
          />
        )}

        <p className="text-sm leading-relaxed text-[#6B717B]">
          자동차·오토바이(원동기장치자전거)·건설기계를 운전한 경우 기준입니다. 전동킥보드 같은 개인형 이동장치나 자전거는 20만원 이하 벌금이나 구류 또는
          과료로 처벌 규정이 다르고(도로교통법 제156조 제11호), 면허 없이 운전했다면 결격기간 기준이 달라집니다.
        </p>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        {result ? (
          <section aria-live="polite" className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-[#6B717B]">적용 구간</p>
            <p className="mt-1 text-xl font-bold tracking-[-0.02em] text-jisan-ink [overflow-wrap:anywhere]">{result.tierLabel}</p>

            <h3 className="mt-6 text-sm font-bold text-jisan-ink">형사처벌 (법정형)</h3>
            {result.main ? (
              <PenaltyBlock p={result.main} strong />
            ) : (
              <p className="mt-2 text-[0.9375rem] font-semibold text-jisan-ink">음주운전으로 처벌되는 수치(0.03%)에 못 미칩니다.</p>
            )}

            {result.accident.length > 0 && (
              <>
                <h3 className="mt-6 text-sm font-bold text-jisan-ink">사고로 함께 문제 되는 죄</h3>
                <div className="mt-1 space-y-4">
                  {result.accident.map((p) => (
                    <PenaltyBlock key={p.label} p={p} />
                  ))}
                </div>
              </>
            )}

            <h3 className="mt-6 text-sm font-bold text-jisan-ink">운전면허 처분</h3>
            <div className="mt-2 rounded-xl bg-[#F4F5F7] px-4 py-3">
              <p className="text-lg font-bold text-jisan-ink">{result.license.title}</p>
              {result.license.disqualification && (
                <p className="mt-1 text-[0.9375rem] text-jisan-ink">
                  다시 면허를 받을 수 없는 기간(결격기간) <b className="tabular-nums">{result.license.disqualification.years}년</b>
                  <span className="block text-sm text-[#4A505A]">{result.license.disqualification.reason}</span>
                  <span className="block text-xs text-[#8A9099]">{result.license.disqualification.law}</span>
                </p>
              )}
              <p className="mt-1 text-xs text-[#8A9099]">{result.license.law}</p>
            </div>
            <Bullets lines={[...result.license.lines, ...(result.license.conditional ? [result.license.conditional] : []), ...(result.license.reduction ? [result.license.reduction] : [])]} />

            {result.notes.length > 0 && (
              <>
                <h3 className="mt-6 text-sm font-bold text-jisan-ink">함께 알아 둘 것</h3>
                <Bullets lines={result.notes} />
              </>
            )}

            <p className="mt-5 text-sm leading-relaxed text-[#4A505A]">{LICENSE_APPEAL}</p>

            <p className="mt-5 border-t border-[#E9ECF0] pt-4 text-xs leading-relaxed text-[#8A9099]">
              법정형은 법률이 정한 처벌의 범위이고, 실제로 받게 될 형은 이 범위 안에서 운전 경위, 피해 회복, 전력 등을 보고 정해집니다. 예상 처리 결과는{" "}
              <Link href="/tools/prosecution" className="underline underline-offset-2 hover:text-jisan-ink">
                구형 예상 계산기
              </Link>
              에서 따로 볼 수 있습니다.
            </p>
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">
            혈중알코올농도를 넣으면 법정형과 면허 처분이 바로 나옵니다.
          </div>
        )}
      </div>
    </div>
  )
}

function PenaltyBlock({ p, strong }: { p: Penalty; strong?: boolean }) {
  return (
    <div className="mt-2">
      <p className="text-sm text-[#6B717B]">{p.label}</p>
      <p className={`mt-0.5 font-bold text-jisan-ink [overflow-wrap:anywhere] ${strong ? "text-xl" : "text-base"}`}>{p.text}</p>
      <p className="mt-0.5 text-xs text-[#8A9099]">{p.law}</p>
      {p.note && <p className="mt-1 text-sm leading-relaxed text-[#4A505A]">{p.note}</p>}
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
