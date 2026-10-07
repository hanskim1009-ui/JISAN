"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import type { FaqHit } from "@/lib/faq-index"

const PAGE = 10

/**
 * 센터별 자주 묻는 질문 검색. 목록(약 1MB)은 검색 칸을 처음 누를 때 받아 옵니다.
 * 띄어 쓴 말이 모두 들어 있는 질문을 찾고, 질문에 들어 있는 것을 답에만 있는 것보다 앞에 둡니다.
 */
export function FaqSearch() {
  const [data, setData] = useState<FaqHit[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [q, setQ] = useState("")
  const [shown, setShown] = useState(PAGE)
  const loading = useRef(false)

  const load = () => {
    if (data || loading.current) return
    loading.current = true
    fetch("/faq-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: FaqHit[]) => setData(d))
      .catch(() => setFailed(true))
      .finally(() => (loading.current = false))
  }

  const words = q.trim().split(/\s+/).filter(Boolean)
  const hits = useMemo(() => {
    if (!data || words.length === 0) return []
    const inQ: FaqHit[] = []
    const inA: FaqHit[] = []
    for (const f of data) {
      if (words.every((w) => f.q.includes(w))) inQ.push(f)
      else if (words.every((w) => f.q.includes(w) || f.a.includes(w))) inA.push(f)
    }
    return [...inQ, ...inA]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, q])

  return (
    <div className="mt-8">
      <p className="text-sm font-bold text-jisan-ink">찾는 질문이 없으신가요?</p>
      <label className="mt-3 flex items-center gap-2 rounded-xl border border-[#D5DAE1] bg-white px-4 py-3">
        <span className="sr-only">센터별 질문 검색</span>
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-jisan-ink/40" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" />
        </svg>
        <input
          value={q}
          onFocus={load}
          onChange={(e) => {
            load()
            setQ(e.target.value)
            setShown(PAGE)
          }}
          placeholder="예: 합의금, 양육비, 보증금"
          className="w-full bg-transparent text-[0.9375rem] text-jisan-ink outline-none placeholder:text-jisan-ink/40"
        />
      </label>

      {words.length > 0 && (
        <div className="mt-4" aria-live="polite">
          {failed ? (
            <p className="text-sm text-[#4A505A]">질문 목록을 불러오지 못했습니다. 잠시 뒤 다시 찾아 주세요.</p>
          ) : !data ? (
            <p className="text-sm text-[#8A9099]">질문을 불러오는 중입니다…</p>
          ) : hits.length === 0 ? (
            <p className="text-sm text-[#4A505A]">맞는 질문이 없습니다. 다른 말로 찾아보시거나 전화로 물어보셔도 됩니다.</p>
          ) : (
            <>
              <p className="text-[0.8125rem] text-[#8A9099]">센터 질문 {hits.length}개</p>
              <div className="mt-2 border-t border-[#E4E6E9]">
                {hits.slice(0, shown).map((f) => (
                  <details key={f.c + f.q} className="group border-b border-[#E4E6E9]">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                      <span>
                        <span className="mr-2 inline-block rounded-full bg-jisan-mist px-2 py-0.5 align-[0.1em] text-[0.6875rem] font-semibold text-jisan-ink/70">
                          {f.n}
                        </span>
                        <span className="text-[0.9375rem] font-bold text-jisan-ink">{f.q}</span>
                      </span>
                      <Plus className="mt-1 h-4 w-4 shrink-0 transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="text-[0.9375rem] leading-relaxed text-[#4A505A]">{f.a}</p>
                    <Link href={f.h} className="mb-4 mt-2 inline-block text-sm font-semibold text-brand-accent underline underline-offset-4">
                      {f.n}에서 자세히 보기&nbsp;→
                    </Link>
                  </details>
                ))}
              </div>
              {shown < hits.length && (
                <button
                  type="button"
                  onClick={() => setShown((n) => n + PAGE)}
                  className="mt-4 w-full rounded-xl border border-[#D5DAE1] bg-white py-3 text-sm font-semibold text-jisan-ink"
                >
                  더 보기 <span className="tabular-nums opacity-60">({shown}/{hits.length})</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
