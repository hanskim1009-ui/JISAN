"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { searchAreas, type AreaHit } from "@/lib/area-index"
import { trackEvent } from "@/components/analytics"

/**
 * 메인 첫 화면 검색: 겪고 있는 일을 치면 맞는 센터의 업무분야 안내로 보냅니다.
 * 업무분야 목록(/area-index.json)은 검색창을 처음 누를 때 한 번 받아 옵니다.
 * 맞는 분야가 없으면 업무사례 찾기와 전화를 안내합니다.
 */
export function HeroSearch() {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [index, setIndex] = useState<AreaHit[] | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const loading = useRef(false)
  const box = useRef<HTMLDivElement>(null)

  const load = () => {
    if (index || loading.current) return
    loading.current = true
    fetch("/area-index.json")
      .then((r) => r.json())
      .then((d: AreaHit[]) => setIndex(d))
      .catch(() => (loading.current = false))
  }

  // 바깥을 누르면 목록 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  const word = q.trim()
  const hits = index && word.length >= 2 ? searchAreas(index, word) : []
  const show = open && word.length >= 2

  const go = (h: AreaHit) => {
    trackEvent("hero_search", { q: word, to: h.h })
    router.push(h.h)
  }

  return (
    <div ref={box} className="relative w-full max-w-2xl text-left">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          if (hits[active]) go(hits[active])
          else if (word) router.push(`/cases?q=${encodeURIComponent(word)}`)
        }}
      >
        <label htmlFor="hero-search" className="sr-only">
          겪고 있는 일로 찾기
        </label>
        <Search aria-hidden className="pointer-events-none absolute left-5 top-[1.6rem] h-5 w-5 -translate-y-1/2 text-[#8A9099] md:left-6 md:top-[1.75rem]" />
        <input
          id="hero-search"
          type="search"
          value={q}
          autoComplete="off"
          onFocus={() => {
            load()
            setOpen(true)
          }}
          onChange={(e) => {
            setQ(e.target.value)
            setActive(0)
            setOpen(true)
            load()
          }}
          onKeyDown={(e) => {
            if (!show || hits.length === 0) return
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setActive((a) => (a + 1) % hits.length)
            } else if (e.key === "ArrowUp") {
              e.preventDefault()
              setActive((a) => (a + hits.length - 1) % hits.length)
            } else if (e.key === "Escape") setOpen(false)
          }}
          placeholder="무슨 일이 있으신가요? 예: 음주운전, 보증금, 이혼"
          aria-expanded={show}
          aria-controls="hero-search-list"
          className="h-[3.2rem] w-full rounded-full bg-white pl-12 pr-24 text-[1rem] text-jisan-ink shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)] outline-none placeholder:text-[#8A9099] focus:ring-2 focus:ring-white/60 md:h-[3.5rem] md:pl-14 md:pr-28 md:text-[1.0625rem] [&::-webkit-search-cancel-button]:hidden"
        />
        <button type="submit" className="absolute right-1.5 top-1.5 h-[2.45rem] rounded-full bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-tone md:right-2 md:top-2 md:h-[2.5rem] md:px-5">
          찾기
        </button>
      </form>

      {show && (
        <div id="hero-search-list" className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl bg-white text-jisan-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.65)]">
          {!index ? (
            <p className="px-5 py-4 text-sm text-[#4A505A]">찾는 중입니다…</p>
          ) : hits.length > 0 ? (
            <ul role="listbox">
              {hits.map((h, i) => (
                <li key={h.h} role="option" aria-selected={i === active}>
                  <Link
                    href={h.h}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => trackEvent("hero_search", { q: word, to: h.h })}
                    className={`grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-[#EEF0F2] px-5 py-3 last:border-b-0 ${i === active ? "bg-[#F3F5F8]" : ""}`}
                  >
                    <span className="font-semibold">{h.n}</span>
                    <span className="text-[0.8125rem] text-[#8A9099]">{siteConfig.shortName} {h.c}</span>
                    <span className="col-span-2 mt-0.5 line-clamp-1 text-[0.8125rem] text-[#4A505A]">{h.s}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
              <p>맞는 업무분야를 찾지 못했습니다. 다른 말로 찾아보시거나 전화로 물어보셔도 됩니다.</p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold text-jisan-ink">
                <Link href={`/cases?q=${encodeURIComponent(word)}`} className="underline underline-offset-4">
                  업무사례에서 찾기
                </Link>
                <a href={siteConfig.phoneHref} className="tabular-nums underline underline-offset-4">
                  {siteConfig.phone}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
