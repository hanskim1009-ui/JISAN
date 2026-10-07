"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { ColumnItem } from "@/lib/content"
import { ColumnRow } from "@/components/column-parts"

export type ColumnLite = Pick<ColumnItem, "id" | "title" | "summary" | "field" | "centers" | "author" | "date" | "sample">

const PAGE = 20

/**
 * 칼럼 모음: 센터 단추로 거르고, 제목·요약 검색, 20편씩 더 보기.
 * /column?center=crime 처럼 들어오면 그 센터 글부터 보여 줍니다.
 */
export function ColumnBrowser({ items, centers }: { items: ColumnLite[]; centers: { slug: string; name: string }[] }) {
  const params = useSearchParams()
  const initial = params.get("center") ?? "all"
  const [center, setCenter] = useState(centers.some((c) => c.slug === initial) ? initial : "all")
  const [q, setQ] = useState("")
  const [shown, setShown] = useState(PAGE)

  const counts = useMemo(() => {
    const m: Record<string, number> = {}
    for (const c of items) for (const s of c.centers ?? []) m[s] = (m[s] ?? 0) + 1
    return m
  }, [items])

  const list = useMemo(() => {
    const words = q.trim().split(/\s+/).filter(Boolean)
    return items.filter(
      (c) =>
        (center === "all" || c.centers?.includes(center)) &&
        words.every((w) => c.title.includes(w) || c.summary.includes(w)),
    )
  }, [items, center, q])

  const pick = (slug: string) => {
    setCenter(slug)
    setShown(PAGE)
    const url = new URL(window.location.href)
    if (slug === "all") url.searchParams.delete("center")
    else url.searchParams.set("center", slug)
    window.history.replaceState(null, "", url)
  }

  const chip = (on: boolean) =>
    `shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.875rem] font-semibold transition-colors ${
      on ? "border-jisan-ink bg-jisan-ink text-white" : "border-[#D5DAE1] bg-white text-jisan-ink/75 hover:border-jisan-ink/50"
    }`

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:overflow-visible md:px-0" role="tablist" aria-label="센터별 칼럼">
        <button type="button" role="tab" aria-selected={center === "all"} onClick={() => pick("all")} className={chip(center === "all")}>
          전체 <span className="ml-1 text-[0.75rem] tabular-nums opacity-60">{items.length}</span>
        </button>
        {centers
          .filter((c) => counts[c.slug])
          .map((c) => (
            <button key={c.slug} type="button" role="tab" aria-selected={center === c.slug} onClick={() => pick(c.slug)} className={chip(center === c.slug)}>
              {c.name} <span className="ml-1 text-[0.75rem] tabular-nums opacity-60">{counts[c.slug]}</span>
            </button>
          ))}
      </div>

      <label className="mt-5 flex items-center gap-2 rounded-xl border border-[#D5DAE1] bg-white px-4 py-3 md:max-w-md">
        <span className="sr-only">칼럼 검색</span>
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-jisan-ink/40" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" />
        </svg>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setShown(PAGE)
          }}
          placeholder="찾는 말을 넣어 보세요 (예: 합의, 보증금, 양육비)"
          className="w-full bg-transparent text-[0.9375rem] text-jisan-ink outline-none placeholder:text-jisan-ink/40"
        />
      </label>

      <p className="mt-6 text-[0.8125rem] text-[#8A9099]">
        {list.length}편{q && ` · '${q.trim()}' 검색 결과`}
      </p>
      {list.length > 0 ? (
        <div className="mt-2 border-t border-jisan-ink">
          {list.slice(0, shown).map((c) => (
            <ColumnRow key={c.id} c={c as ColumnItem} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-[0.9375rem] text-[#4A505A]">맞는 칼럼이 없습니다. 다른 말로 찾아보세요.</p>
      )}
      {shown < list.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="rounded-full border border-jisan-ink px-6 py-3 text-[0.9375rem] font-semibold text-jisan-ink hover:bg-jisan-ink hover:text-white"
          >
            더 보기 <span className="tabular-nums text-[0.8125rem] opacity-60">({shown}/{list.length})</span>
          </button>
        </div>
      )}
    </div>
  )
}
