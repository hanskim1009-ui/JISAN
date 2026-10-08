"use client"

import { useState } from "react"

/**
 * 센터 소개 문단. 글이 길면(외국인센터처럼) 모바일에서는 앞의 두 문단만 보이고 '전체 보기'로 펼칩니다.
 * 넓은 화면은 처음부터 전부.
 */
export function IntroParas({ paras, moreLabel }: { paras: string[]; moreLabel: string }) {
  const [open, setOpen] = useState(false)
  const fold = paras.length > 2 && paras.join("").length > 600
  return (
    <div className="space-y-4 text-[1rem] leading-[1.85] text-jisan-ink/80">
      {paras.map((p, i) => (
        <p key={p} className={fold && !open && i >= 2 ? "hidden md:block" : undefined}>
          {p}
        </p>
      ))}
      {fold && !open && (
        <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-jisan-ink/60 underline underline-offset-4 md:hidden">
          {moreLabel}
        </button>
      )}
    </div>
  )
}
