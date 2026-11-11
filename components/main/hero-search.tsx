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
 * scope: 센터에서 쓸 때 그 센터(와 묶어 보여 주는 센터) 주소들. 그 안에서 먼저 찾고, 없으면 사이트 전체에서 찾습니다.
 * light: 흰 바탕 위에 놓을 때 (테두리를 둠)
 * field: 센터의 상황 버튼과 같은 모양(모서리·테두리·높이)으로, 폭 가득·찾기 단추는 글자만
 */
export function HeroSearch({ scope, placeholder = "무슨 일이 있으신가요? 예: 음주운전, 보증금, 이혼", light = false, field = false, source = "hero_search" }: { scope?: string[]; placeholder?: string; light?: boolean; field?: boolean; source?: string } = {}) {
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
  const inScope = (h: AreaHit) => !scope || scope.some((s) => h.h === s || h.h.startsWith(`${s}/`))
  const scoped = index && word.length >= 2 && scope ? searchAreas(index.filter(inScope), word) : []
  // 센터 안에서 못 찾으면 사이트 전체에서
  const hits = scoped.length > 0 ? scoped : index && word.length >= 2 ? searchAreas(index, word) : []
  const outside = Boolean(scope) && scoped.length === 0 && hits.length > 0
  const show = open && word.length >= 2

  const go = (h: AreaHit) => {
    trackEvent(source, { q: word, to: h.h })
    router.push(h.h)
  }

  return (
    <div ref={box} className={`relative w-full text-left ${field ? "" : "max-w-2xl"}`}>
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
        <Search aria-hidden className={`pointer-events-none absolute -translate-y-1/2 text-[#8A9099] ${field ? "left-4 top-[1.625rem] h-[1.125rem] w-[1.125rem]" : "left-5 top-[1.6rem] h-5 w-5 md:left-6 md:top-[1.75rem]"}`} />
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
          placeholder={placeholder}
          aria-expanded={show}
          aria-controls="hero-search-list"
          className={`w-full bg-white text-jisan-ink outline-none placeholder:text-[#8A9099] [&::-webkit-search-cancel-button]:hidden ${field ? `h-[3.25rem] rounded-xl pl-11 pr-20 text-[0.9375rem] font-medium ${light ? "border border-[#E2E6ED] transition-colors hover:border-[#C9CED6] focus:border-jisan-ink" : "focus:ring-2 focus:ring-white/50"}` : `h-[3.2rem] rounded-full pl-12 pr-24 text-[1rem] md:h-[3.5rem] md:pl-14 md:pr-28 md:text-[1.0625rem] ${light ? "border border-[#C9CED6] focus:border-jisan-ink" : "shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)] focus:ring-2 focus:ring-white/60"}`}`}
        />
        <button
          type="submit"
          className={
            field
              ? "absolute right-1.5 top-1.5 h-[2.5rem] rounded-lg px-4 text-[0.9375rem] font-semibold text-jisan-blue hover:bg-[#F3F5F8]"
              : "absolute right-1.5 top-1.5 h-[2.45rem] rounded-full bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-tone md:right-2 md:top-2 md:h-[2.5rem] md:px-5"
          }
        >
          찾기
        </button>
      </form>

      {show && (
        <div id="hero-search-list" className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl bg-white text-jisan-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.65)]">
          {!index ? (
            <p className="px-5 py-4 text-sm text-[#4A505A]">찾는 중입니다…</p>
          ) : hits.length > 0 ? (
            <>
            {outside && <p className="border-b border-[#EEF0F2] px-5 py-2.5 text-xs text-[#8A9099]">이 센터에서는 찾지 못해 다른 센터의 분야를 보여 드립니다.</p>}
            <ul role="listbox">
              {hits.map((h, i) => (
                <li key={h.h} role="option" aria-selected={i === active}>
                  <Link
                    href={h.h}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => trackEvent(source, { q: word, to: h.h })}
                    className={`grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-[#EEF0F2] px-5 py-3 last:border-b-0 ${i === active ? "bg-[#F3F5F8]" : ""}`}
                  >
                    <span className="font-semibold">{h.n}</span>
                    <span className="text-[0.8125rem] text-[#8A9099]">{siteConfig.shortName} {h.c}</span>
                    <span className="col-span-2 mt-0.5 line-clamp-1 text-[0.8125rem] text-[#4A505A]">{h.s}</span>
                  </Link>
                </li>
              ))}
            </ul>
            </>
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
