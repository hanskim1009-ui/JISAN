"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { Crime, Question } from "@/lib/tools/prosecution-types"
import { evaluate, isComplete, type Answers } from "@/lib/tools/prosecution"
import { crimeMatches } from "./search"
import { ResultCard, StepGuide } from "./result-card"

/** 묶음 보여 주는 순서 (없는 묶음은 뒤에 가나다순) */
const GROUP_ORDER = ["폭력", "성범죄", "재산", "교통", "마약", "사이버", "공무", "기타"]

function groupCrimes(list: Crime[]) {
  const m = new Map<string, Crime[]>()
  for (const c of list) m.set(c.group, [...(m.get(c.group) ?? []), c])
  const rank = (g: string) => (g === "기타" ? 999 : GROUP_ORDER.includes(g) ? GROUP_ORDER.indexOf(g) : 500)
  return [...m.entries()].sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b, "ko"))
}

/** 입력칸 값(문자열) → 계산에 쓰는 답. 숫자는 범위 안일 때만 */
function toAnswers(crime: Crime, raw: Record<string, string>): Answers {
  const a: Answers = {}
  for (const q of crime.questions) {
    const v = raw[q.id]
    if (v === undefined || v === "") continue
    if (q.type === "select") a[q.id] = v
    else {
      const n = Number(v)
      if (Number.isFinite(n) && (q.min === undefined || n >= q.min) && (q.max === undefined || n <= q.max)) a[q.id] = n
    }
  }
  return a
}

/** 구형 예상 계산기: 죄명 찾기 → 질문 → 결과 (답을 바꾸면 바로 다시 계산) */
export function ProsecutionCalculator({ crimes }: { crimes: Crime[] }) {
  const [query, setQuery] = useState("")
  const [id, setId] = useState<string | null>(null)
  const [raw, setRaw] = useState<Record<string, string>>({})
  const top = useRef<HTMLDivElement>(null)

  const crime = id ? crimes.find((c) => c.id === id) : undefined

  // 주소의 ?c=죄명id 로 바로 열기
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c")
    if (c && crimes.some((x) => x.id === c)) setId(c)
  }, [crimes])

  const pick = (next: string | null) => {
    setId(next)
    setRaw({})
    const url = new URL(window.location.href)
    if (next) url.searchParams.set("c", next)
    else url.searchParams.delete("c")
    window.history.replaceState(null, "", url)
    top.current?.scrollIntoView({ block: "start", behavior: "smooth" })
  }

  const groups = useMemo(() => groupCrimes(crimes.filter((c) => crimeMatches(c, query))), [crimes, query])

  const answers = crime ? toAnswers(crime, raw) : {}
  const done = crime ? isComplete(crime, answers) : false
  const result = crime && done ? evaluate(crime, answers) : null
  const answered = crime ? crime.questions.filter((q) => answers[q.id] !== undefined).length : 0

  if (crimes.length === 0) {
    return <p className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-[0.9375rem] text-[#4A505A]">죄명 목록을 준비하고 있습니다. 급한 일이면 상담 신청으로 먼저 물어보세요.</p>
  }

  return (
    <div ref={top} className="min-w-0 scroll-mt-24">
      {!crime ? (
        <div>
          <label className="flex items-center gap-2 rounded-xl border border-[#D5DAE1] bg-white px-4 py-3 focus-within:border-jisan-ink">
            <span className="sr-only">죄명 찾기</span>
            <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-jisan-ink/40" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 4 4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="죄명 찾기 (예: 상해, 음주운전, ㅅㄱ)"
              className="w-full min-w-0 bg-transparent text-[0.9375rem] text-jisan-ink outline-none placeholder:text-jisan-ink/40"
            />
          </label>

          {groups.length === 0 ? (
            <p className="mt-6 text-sm text-[#4A505A]">맞는 죄명이 없습니다. 다른 말로 찾아보시거나 상담 신청으로 물어보세요.</p>
          ) : (
            <div className="mt-6 space-y-6">
              {groups.map(([g, list]) => (
                <section key={g}>
                  <h2 className="text-sm font-bold text-jisan-ink">
                    {g} <span className="font-normal text-[#8A9099]">{list.length}</span>
                  </h2>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {list.map((c) => (
                      <li key={c.id} className="min-w-0 max-w-full">
                        <button
                          type="button"
                          onClick={() => pick(c.id)}
                          className="max-w-full rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-left text-sm text-jisan-ink transition-colors [overflow-wrap:anywhere] hover:border-jisan-ink"
                        >
                          {c.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E9ECF0] pb-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#6B717B]">{crime.group}</p>
              <h2 className="mt-0.5 text-xl font-bold text-jisan-ink [overflow-wrap:anywhere]">{crime.name}</h2>
              {crime.law && <p className="mt-0.5 text-xs text-[#8A9099]">{crime.law}</p>}
            </div>
            <button
              type="button"
              onClick={() => pick(null)}
              className="shrink-0 rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-[#4A505A] hover:border-jisan-ink hover:text-jisan-ink"
            >
              다른 죄명 고르기
            </button>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-6">
              {crime.questions.map((q) => (
                <QuestionField key={q.id} q={q} value={raw[q.id] ?? ""} onChange={(v) => setRaw((r) => ({ ...r, [q.id]: v }))} />
              ))}
            </div>

            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              {result ? (
                <ResultCard crime={crime} result={result} />
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">
                  {done
                    ? "이 조합에 맞는 예상 결과가 없습니다. 상담으로 물어보세요."
                    : `질문 ${crime.questions.length}개에 모두 답하면 예상 결과가 바로 나옵니다. (${answered}/${crime.questions.length})`}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10">
            <StepGuide current={result?.step} />
          </div>
        </div>
      )}
    </div>
  )
}

function QuestionField({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  const helpId = `q-${q.id}-help`
  if (q.type === "select") {
    // 보기가 많으면 펼침 목록, 적으면 누르는 버튼
    if (q.options.length > 6) {
      return (
        <div>
          <label htmlFor={`q-${q.id}`} className="block text-[0.9375rem] font-semibold text-jisan-ink">
            {q.label}
          </label>
          {q.help && <p id={helpId} className="mt-1 text-sm text-[#6B717B]">{q.help}</p>}
          <select
            id={`q-${q.id}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={q.help ? helpId : undefined}
            className="mt-2.5 w-full rounded-xl border border-[#D5DAE1] bg-white px-4 py-3 text-[0.9375rem] text-jisan-ink outline-none focus:border-jisan-ink"
          >
            <option value="">고르세요</option>
            {q.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )
    }
    return (
      <fieldset aria-describedby={q.help ? helpId : undefined}>
        <legend className="text-[0.9375rem] font-semibold text-jisan-ink">{q.label}</legend>
        {q.help && <p id={helpId} className="mt-1 text-sm text-[#6B717B]">{q.help}</p>}
        <div className="mt-2.5 flex flex-wrap gap-2">
          {q.options.map((o) => (
            <label key={o.value} className="max-w-full cursor-pointer">
              <input type="radio" name={`q-${q.id}`} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
              <span className="block rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-sm text-[#4A505A] transition-colors [overflow-wrap:anywhere] peer-checked:border-jisan-ink peer-checked:bg-jisan-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-accent/40 hover:border-jisan-ink">
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    )
  }

  const n = value === "" ? undefined : Number(value)
  const out = n !== undefined && (!Number.isFinite(n) || (q.min !== undefined && n < q.min) || (q.max !== undefined && n > q.max))
  const range = q.min !== undefined && q.max !== undefined ? `${q.min}~${q.max}${q.unit}` : undefined
  return (
    <div>
      <label htmlFor={`q-${q.id}`} className="block text-[0.9375rem] font-semibold text-jisan-ink">
        {q.label}
      </label>
      {q.help && <p id={helpId} className="mt-1 text-sm text-[#6B717B]">{q.help}</p>}
      <div className="mt-2.5 flex items-center gap-2">
        <input
          id={`q-${q.id}`}
          type="number"
          inputMode="decimal"
          value={value}
          min={q.min}
          max={q.max}
          step={q.step ?? "any"}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={q.help ? helpId : undefined}
          aria-invalid={out || undefined}
          className={`w-32 rounded-xl border bg-white px-4 py-3 text-[0.9375rem] tabular-nums text-jisan-ink outline-none focus:border-jisan-ink ${out ? "border-red-400" : "border-[#D5DAE1]"}`}
        />
        <span className="text-[0.9375rem] text-[#4A505A]">{q.unit}</span>
      </div>
      {out && <p className="mt-1.5 text-sm text-red-600">{range ? `${range} 사이로 넣어 주세요.` : "알맞은 숫자를 넣어 주세요."}</p>}
    </div>
  )
}
