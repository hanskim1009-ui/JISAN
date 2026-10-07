"use client"

import { useState } from "react"

/** 모바일에서는 두 줄만 보이고 '전체 보기'로 펼칩니다. 넓은 화면은 처음부터 전부 */
export function ClampText({ text, className = "" }: { text: string; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <p className={`${className} ${open ? "" : "line-clamp-2 md:line-clamp-none"}`}>{text}</p>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} className="mt-1 text-xs font-semibold text-jisan-ink/55 underline underline-offset-4 md:hidden">
          전체 보기
        </button>
      )}
    </>
  )
}
