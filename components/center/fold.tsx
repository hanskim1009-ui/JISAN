"use client"

import { useState, type ReactNode } from "react"

/**
 * 긴 구역을 앞부분만 보여 주고 단추로 펼칩니다 (업무분야 83개, 처벌 기준표 등).
 * 내용은 처음부터 HTML 에 다 들어 있어 검색엔진은 전부 읽습니다.
 */
export function Fold({ children, height = "30rem", label, closeLabel = "접기" }: { children: ReactNode; height?: string; label: string; closeLabel?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="relative overflow-hidden" style={open ? undefined : { maxHeight: height }}>
        {children}
        {!open && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--fold-bg,#fff)] to-transparent" />}
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mt-5 w-full rounded-xl border border-[#D5DAE1] bg-white py-3 text-sm font-semibold text-jisan-ink hover:border-jisan-ink"
      >
        {open ? closeLabel : label}
      </button>
    </div>
  )
}
