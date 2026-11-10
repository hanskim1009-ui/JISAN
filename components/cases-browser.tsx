"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

export type CaseRow = {
  id: string
  group: string
  resultGroup: string
  caseType: string
  stage: string
  result: string
  title: string
  summary: string
}

const PAGE = 30
const ALL = "전체"

function Chips({ label, options, counts, value, onChange }: { label: string; options: string[]; counts: Record<string, number>; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2" role="group" aria-label={label}>
      <span className="mr-1.5 w-9 shrink-0 text-[0.8125rem] font-semibold text-[#8A9099]">{label}</span>
      {[ALL, ...options].map((o) => {
        const n = counts[o] ?? 0
        const on = value === o
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            disabled={n === 0 && !on}
            onClick={() => onChange(o)}
            className={`rounded-full border px-3 py-1 text-[0.875rem] transition-colors disabled:opacity-35 ${
              on ? "border-jisan-ink bg-jisan-ink font-semibold text-white" : "border-[#D5D8DD] text-[#2D323A] hover:border-jisan-ink"
            }`}
          >
            {o} <span className={`tabular-nums ${on ? "text-white/70" : "text-[#8A9099]"}`}>{n}</span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * 업무사례 전체 목록: 갈래(성범죄·음주·마약…)와 결과(무혐의·집행유예…)로 거르고 낱말로 찾습니다.
 * 모든 사례가 처음부터 HTML 에 들어 있고(검색엔진이 전부 읽음), 화면에는 30건씩 보여 줍니다.
 * /cases?group=성범죄 처럼 주소로 갈래를 정해 들어올 수 있습니다 (센터 페이지의 '전체 보기').
 */
export function CasesBrowser({ items, groups, results }: { items: CaseRow[]; groups: string[]; results: string[] }) {
  const [group, setGroup] = useState(ALL)
  const [result, setResult] = useState(ALL)
  const [q, setQ] = useState("")
  const [limit, setLimit] = useState(PAGE)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const g = p.get("group")
    const r = p.get("result")
    if (g && groups.includes(g)) setGroup(g)
    if (r && results.includes(r)) setResult(r)
  }, [groups, results])

  const pick = (g: string, r: string) => {
    setGroup(g)
    setResult(r)
    setLimit(PAGE)
    const p = new URLSearchParams()
    if (g !== ALL) p.set("group", g)
    if (r !== ALL) p.set("result", r)
    const qs = p.toString()
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
  }

  const word = q.trim()
  const byWord = useMemo(
    () => (word ? items.filter((c) => `${c.caseType} ${c.title} ${c.summary} ${c.result} ${c.stage}`.includes(word)) : items),
    [items, word],
  )
  const count = (list: CaseRow[], key: "group" | "resultGroup") => {
    const m: Record<string, number> = { [ALL]: list.length }
    for (const c of list) m[c[key]] = (m[c[key]] ?? 0) + 1
    return m
  }
  // 갈래 숫자는 고른 결과 안에서, 결과 숫자는 고른 갈래 안에서 셉니다
  const groupCounts = count(result === ALL ? byWord : byWord.filter((c) => c.resultGroup === result), "group")
  const resultCounts = count(group === ALL ? byWord : byWord.filter((c) => c.group === group), "resultGroup")
  const shown = byWord.filter((c) => (group === ALL || c.group === group) && (result === ALL || c.resultGroup === result))

  return (
    <div className="min-w-0">
      <div className="space-y-3">
        <Chips label="사건" options={groups} counts={groupCounts} value={group} onChange={(g) => pick(g, result)} />
        <Chips label="결과" options={results} counts={resultCounts} value={result} onChange={(r) => pick(group, r)} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-jisan-ink pb-3">
        <p className="text-sm text-[#4A505A]">
          <b className="font-semibold tabular-nums text-jisan-ink">{shown.length}</b>건
        </p>
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">업무사례 찾기</span>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9099]" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setLimit(PAGE)
            }}
            placeholder="죄명이나 상황으로 찾기 (예: 준강간, 대리운전)"
            className="w-full rounded-full border border-[#D5D8DD] bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-jisan-ink"
          />
        </label>
      </div>

      <ul>
        {shown.map((c, i) => (
          <li key={c.id} hidden={i >= limit} className="border-b border-[#E4E6E9]">
            <Link href={`/cases/${c.id}`} className="group grid grid-cols-1 gap-x-8 gap-y-1.5 py-5 md:grid-cols-[1fr_12rem]">
              <div className="min-w-0">
                <p className="text-[0.8125rem] text-[#4A505A]">
                  <span className="font-semibold text-jisan-ink">{c.caseType}</span>
                  <span className="mx-1.5 text-[#C2C6CC]">|</span>
                  {c.stage}
                </p>
                <h2 className="mt-1 text-[1.0625rem] font-bold leading-snug tracking-[-0.01em] text-jisan-ink underline-offset-4 group-hover:underline">{c.title}</h2>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[#4A505A]">{c.summary}</p>
              </div>
              <p className="font-bold text-brand-accent md:pt-6 md:text-right">{c.result}</p>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="py-10 text-[0.9375rem] text-[#4A505A]">맞는 사례가 없습니다. 다른 낱말로 찾아보시거나 분류를 바꿔 보세요.</p>}
      {shown.length > limit && (
        <button
          type="button"
          onClick={() => setLimit(limit + PAGE)}
          className="mt-6 w-full rounded-xl border border-[#D5D8DD] py-3 text-sm font-semibold text-jisan-ink hover:border-jisan-ink"
        >
          더 보기 <span className="font-normal text-[#8A9099]">({shown.length - limit}건 남음)</span>
        </button>
      )}
    </div>
  )
}
