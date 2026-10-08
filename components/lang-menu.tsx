"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { HREFLANG, LANGS, LANG_NAME, LANG_SHORT, homePath, type Lang } from "@/lib/langs"

/**
 * 언어 고르기: 지구본 버튼 + 펼침 목록 (한국어·English·中文·Tiếng Việt·Русский·Монгол).
 * hrefs를 주면 그 주소로(외국인센터처럼 같은 페이지의 다른 언어판), 없으면 언어별 메인으로.
 */
export function LangMenu({
  current,
  hrefs,
  dark = true,
  align = "right",
  className = "",
}: {
  current: Lang
  hrefs?: Partial<Record<Lang, string>>
  dark?: boolean
  align?: "left" | "right"
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("mousedown", onClick)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("mousedown", onClick)
    }
  }, [open])

  const items = LANGS.filter((l) => !hrefs || hrefs[l]).map((l) => ({ l, href: hrefs?.[l] ?? homePath(l) }))

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Language"
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[0.8125rem] font-semibold transition-colors ${
          dark ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-jisan-ink/70 hover:bg-jisan-ink/5 hover:text-jisan-ink"
        }`}
      >
        <Globe className="h-4 w-4" aria-hidden />
        {LANG_SHORT[current]}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul
          className={`absolute top-full z-[60] mt-1.5 min-w-[10rem] overflow-hidden rounded-xl border border-[#E4E6E9] bg-white py-1 text-jisan-ink shadow-[0_12px_28px_rgba(20,25,31,0.14)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map(({ l, href }) => (
            <li key={l}>
              <a
                href={href}
                hrefLang={HREFLANG[l]}
                lang={HREFLANG[l]}
                aria-current={l === current ? "true" : undefined}
                className={`flex items-center justify-between gap-3 whitespace-nowrap px-4 py-2.5 text-sm hover:bg-[#F2F4F7] ${l === current ? "font-bold" : ""}`}
              >
                {LANG_NAME[l]}
                {l === current && <Check className="h-4 w-4 text-brand-accent" aria-hidden />}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
