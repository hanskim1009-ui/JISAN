"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import type { Crime, Question } from "@/lib/tools/prosecution-types"
import { evaluate, groupRank, isComplete, type Answers, type CrimeSummary } from "@/lib/tools/prosecution"
import { searchCrimes } from "./search"
import { RefCard, ResultCard, StepGuide } from "./result-card"

/** 자주 찾는 죄명 (목록에 없는 id 는 건너뜀) */
const POPULAR = [
  "injury",
  "assault",
  "fraud",
  "drunk-driving",
  "theft",
  "indecent-assault",
  "spycam",
  "defamation",
  "insult",
  "embezzlement",
  "methamphetamine",
  "unlicensed-driving",
]

/** 검색 결과 한 번에 보여 주는 개수 */
const PAGE = 40

/** 죄명 데이터 조각은 고를 때 정적 주소에서 한 번만 받아 둠 */
const chunkCache = new Map<string, Promise<Crime[]>>()

function fetchChunk(id: string): Promise<Crime[]> {
  let p = chunkCache.get(id)
  if (!p) {
    p = fetch(`/tools/prosecution/data/${encodeURIComponent(id)}`).then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json() as Promise<Crime[]>
    })
    p.catch(() => chunkCache.delete(id))
    chunkCache.set(id, p)
  }
  return p
}

/** key 별로 묶기 (처음 나온 순서 유지) */
function bucket(list: CrimeSummary[], key: (c: CrimeSummary) => string) {
  const m = new Map<string, CrimeSummary[]>()
  for (const c of list) {
    const k = key(c)
    const arr = m.get(k)
    if (arr) arr.push(c)
    else m.set(k, [c])
  }
  return [...m.entries()]
}

/** 묶음별: 정해 둔 순서 → 가나다 */
const byGroup = (list: CrimeSummary[]) => bucket(list, (c) => c.group).sort(([a], [b]) => groupRank(a) - groupRank(b) || a.localeCompare(b, "ko"))

/** 법률별: 형법 먼저, 그다음 죄명 많은 법률 → 가나다 */
const byLaw = (list: CrimeSummary[]) =>
  bucket(list, (c) => c.lawName || "기타").sort(
    ([a, x], [b, y]) => Number(b === "형법") - Number(a === "형법") || y.length - x.length || a.localeCompare(b, "ko", { numeric: true }),
  )

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
export function ProsecutionCalculator({ crimes }: { crimes: CrimeSummary[] }) {
  const [id, setId] = useState<string | null>(null)
  const [raw, setRaw] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState<Crime | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [retry, setRetry] = useState(0)
  const top = useRef<HTMLDivElement>(null)

  const byId = useMemo(() => new Map(crimes.map((c) => [c.id, c])), [crimes])
  const summary = id ? byId.get(id) : undefined

  // 주소의 ?c=죄명id 로 바로 열기
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c")
    if (c && byId.has(c)) setId(c)
  }, [byId])

  // 고른 죄명이 든 조각 받기
  useEffect(() => {
    if (!summary) return
    let live = true
    setStatus("loading")
    fetchChunk(summary.chunk)
      .then((list) => {
        if (!live) return
        const c = list.find((x) => x.id === summary.id)
        if (!c) throw new Error("missing")
        setLoaded(c)
        setStatus("idle")
      })
      .catch(() => live && setStatus("error"))
    return () => {
      live = false
    }
  }, [summary, retry])

  const pick = (next: string | null) => {
    setId(next)
    setRaw({})
    const url = new URL(window.location.href)
    if (next) url.searchParams.set("c", next)
    else url.searchParams.delete("c")
    window.history.replaceState(null, "", url)
    top.current?.scrollIntoView({ block: "start", behavior: "smooth" })
  }

  const crime = loaded && loaded.id === id ? loaded : undefined

  if (crimes.length === 0) {
    return <p className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-[0.9375rem] text-[#4A505A]">죄명 목록을 준비하고 있습니다. 급한 일이면 상담 신청으로 먼저 물어보세요.</p>
  }

  return (
    <div ref={top} className="min-w-0 scroll-mt-24">
      {/* 고르는 화면은 숨기기만 해서 돌아왔을 때 검색어·펼친 칸이 그대로 */}
      <div hidden={!!summary}>
        <CrimeBrowser crimes={crimes} byId={byId} onPick={pick} />
      </div>
      {summary && (
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E9ECF0] pb-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#6B717B] [overflow-wrap:anywhere]">
                {summary.group}
                {summary.lawName && summary.lawName !== "형법" ? ` · ${summary.lawName}` : ""}
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-jisan-ink [overflow-wrap:anywhere]">{summary.name}</h2>
              {summary.law && <p className="mt-0.5 text-xs text-[#8A9099] [overflow-wrap:anywhere]">{summary.law}</p>}
            </div>
            <button
              type="button"
              onClick={() => pick(null)}
              className="shrink-0 rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-[#4A505A] hover:border-jisan-ink hover:text-jisan-ink"
            >
              다른 죄명 고르기
            </button>
          </div>

          {!crime ? (
            <div aria-busy={status === "loading"} className="mt-6 rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">
              {status === "error" ? (
                <>
                  <p>죄명 정보를 불러오지 못했습니다. 다시 시도하거나 페이지를 새로고침해 주세요.</p>
                  <button
                    type="button"
                    onClick={() => setRetry((n) => n + 1)}
                    className="mt-4 rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-sm text-jisan-ink hover:border-jisan-ink"
                  >
                    다시 시도
                  </button>
                </>
              ) : (
                <p>질문을 불러오는 중입니다…</p>
              )}
            </div>
          ) : crime.ref ? (
            <div className="mt-6 max-w-2xl">
              <RefCard crime={crime} />
            </div>
          ) : (
            <CrimeForm crime={crime} raw={raw} setRaw={setRaw} />
          )}
        </div>
      )}
    </div>
  )
}

/** 질문 → 결과. 질문이 없는 죄명은 결과만 바로 */
function CrimeForm({ crime, raw, setRaw }: { crime: Crime; raw: Record<string, string>; setRaw: React.Dispatch<React.SetStateAction<Record<string, string>>> }) {
  const answers = toAnswers(crime, raw)
  const done = isComplete(crime, answers)
  const result = done ? evaluate(crime, answers) : null
  const answered = crime.questions.filter((q) => answers[q.id] !== undefined).length
  const empty = (
    <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">
      {done
        ? "이 조합에 맞는 예상 결과가 없습니다. 상담으로 물어보세요."
        : `질문 ${crime.questions.length}개에 모두 답하면 예상 결과가 바로 나옵니다. (${answered}/${crime.questions.length})`}
    </div>
  )

  return (
    <>
      {crime.questions.length === 0 ? (
        <div className="mt-6 max-w-2xl">{result ? <ResultCard crime={crime} result={result} /> : empty}</div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6">
            {crime.questions.map((q) => (
              <QuestionField key={q.id} q={q} value={raw[q.id] ?? ""} onChange={(v) => setRaw((r) => ({ ...r, [q.id]: v }))} />
            ))}
          </div>
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">{result ? <ResultCard crime={crime} result={result} /> : empty}</div>
        </div>
      )}
      <div className="mt-10">
        <StepGuide current={result?.step} />
      </div>
    </>
  )
}

const chip =
  "max-w-full rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-left text-sm text-jisan-ink transition-colors [overflow-wrap:anywhere] hover:border-jisan-ink"

/** 죄명 고르기: 검색 → (검색어 없으면) 자주 찾는 죄명 + 묶음별·법률별 접힌 목록 */
function CrimeBrowser({ crimes, byId, onPick }: { crimes: CrimeSummary[]; byId: Map<string, CrimeSummary>; onPick: (id: string) => void }) {
  const [query, setQuery] = useState("")
  const q = useDeferredValue(query.trim())
  const [view, setView] = useState<"group" | "law">("group")
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set())
  const [limit, setLimit] = useState(PAGE)

  const hits = useMemo(() => (q ? searchCrimes(crimes, q) : []), [crimes, q])
  const sections = useMemo(() => (view === "group" ? byGroup(crimes) : byLaw(crimes)), [crimes, view])
  const popular = useMemo(() => POPULAR.map((id) => byId.get(id)).filter((c): c is CrimeSummary => !!c), [byId])

  const toggle = (key: string) =>
    setOpen((s) => {
      const next = new Set(s)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return (
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
          onChange={(e) => {
            setQuery(e.target.value)
            setLimit(PAGE)
          }}
          placeholder="죄명·법률·조문 찾기 (예: 사기)"
          className="w-full min-w-0 bg-transparent text-[0.9375rem] text-jisan-ink outline-none placeholder:text-jisan-ink/40"
        />
      </label>

      {q ? (
        <div className="mt-6">
          <p className="text-sm text-[#6B717B]" aria-live="polite">
            {hits.length > 0 ? `${hits.length.toLocaleString("ko-KR")}개 찾음` : "맞는 죄명이 없습니다. 다른 말로 찾아보시거나 상담 신청으로 물어보세요."}
          </p>
          {hits.length > 0 && (
            <ul className="mt-3 divide-y divide-[#E9ECF0] border-y border-[#E9ECF0]">
              {hits.slice(0, limit).map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => onPick(c.id)} className="block w-full px-1 py-3 text-left hover:bg-[#F7F8FA]">
                    <span className="block text-[0.9375rem] font-semibold text-jisan-ink [overflow-wrap:anywhere]">{c.name}</span>
                    <span className="mt-0.5 block text-xs text-[#8A9099] [overflow-wrap:anywhere]">
                      {c.group} · {c.law || c.lawName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {hits.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE)}
              className="mt-4 w-full rounded-xl border border-[#D5DAE1] bg-white px-4 py-3 text-sm text-[#4A505A] hover:border-jisan-ink hover:text-jisan-ink"
            >
              더 보기 ({(hits.length - limit).toLocaleString("ko-KR")}개 남음)
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6">
          {popular.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-jisan-ink">자주 찾는 죄명</h2>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {popular.map((c) => (
                  <li key={c.id} className="min-w-0 max-w-full">
                    <button type="button" onClick={() => onPick(c.id)} className={chip}>
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-jisan-ink">
                전체 죄명 <span className="font-normal text-[#8A9099]">{crimes.length.toLocaleString("ko-KR")}</span>
              </h2>
              <div role="group" aria-label="목록 나누는 방법" className="inline-flex rounded-full border border-[#D5DAE1] bg-white p-0.5 text-sm">
                {(
                  [
                    ["group", "묶음별"],
                    ["law", "법률별"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={view === key}
                    onClick={() => setView(key)}
                    className={`rounded-full px-3.5 py-1.5 transition-colors ${view === key ? "bg-jisan-ink text-white" : "text-[#4A505A] hover:text-jisan-ink"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <ul className="mt-3 divide-y divide-[#E9ECF0] border-y border-[#E9ECF0]">
              {sections.map(([name, list], i) => {
                const key = `${view}:${name}`
                const on = open.has(key)
                const panel = `pc-${view}-${i}`
                return (
                  <li key={key}>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={panel}
                      onClick={() => toggle(key)}
                      className="flex w-full items-center justify-between gap-3 px-1 py-3.5 text-left"
                    >
                      <span className="min-w-0 text-[0.9375rem] font-semibold text-jisan-ink [overflow-wrap:anywhere]">
                        {name} <span className="font-normal text-[#8A9099]">{list.length}</span>
                      </span>
                      <svg aria-hidden viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 text-[#8A9099] transition-transform ${on ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m5 8 5 5 5-5" />
                      </svg>
                    </button>
                    {on && (
                      <ul id={panel} className="flex flex-wrap gap-2 px-1 pb-4">
                        {list.map((c) => (
                          <li key={c.id} className="min-w-0 max-w-full">
                            <button type="button" onClick={() => onPick(c.id)} className={chip}>
                              {c.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
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
