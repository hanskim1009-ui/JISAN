"use client"

import { useEffect, useState } from "react"
import { lawyers } from "@/lib/lawyers"

/**
 * 첫 화면 문구 아래 경력 한 줄. 구성원들의 이전 경력을 몇 초마다 무작위로 바꿔 보여 줍니다.
 * 경력은 lib/lawyers.ts 에 적힌 사실만 씁니다 (광고 규정상 '전관'·'출신' 같은 말은 붙이지 않음).
 */
const LINES = lawyers.flatMap((l) => {
  const past = l.career?.filter((c) => c.startsWith("전)")).map((c) => c.replace(/^전\)\s*/, "전 ")) ?? l.structuredResume?.career.map((c) => `전 ${c}`) ?? []
  return past.slice(0, 3).map((c) => ({ who: `${l.name} ${l.title.replace(/\s/g, "")}`, what: c }))
})

export function HeroCareer({ dark, className = "" }: { dark: boolean; className?: string }) {
  // 처음에는 늘 같은 줄(서버와 브라우저가 같게), 그 뒤로 무작위
  const [i, setI] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (LINES.length < 2) return
    const id = window.setInterval(() => {
      setShow(false)
      window.setTimeout(() => {
        setI((prev) => {
          let next = prev
          while (next === prev) next = Math.floor(Math.random() * LINES.length)
          return next
        })
        setShow(true)
      }, 350)
    }, 4200)
    return () => window.clearInterval(id)
  }, [])

  const line = LINES[i]
  if (!line) return null
  return (
    <p aria-live="off" className={`h-5 text-[0.8125rem] md:text-[0.875rem] ${dark ? "text-white/60" : "text-jisan-ink/60"} ${className}`}>
      <span className={`inline-block transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
        <b className={`font-semibold ${dark ? "text-white/85" : "text-jisan-ink/85"}`}>{line.who}</b>
        <span aria-hidden className="mx-2 opacity-50">
          |
        </span>
        {line.what}
      </span>
    </p>
  )
}
