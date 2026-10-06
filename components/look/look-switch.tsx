"use client"

import { useEffect, useState } from "react"
import type { Look } from "@/lib/look"

const options: { value: Look; label: string; detail: string }[] = [
  { value: "photo", label: "추천안", detail: " · 능선 사진" },
  { value: "ridge", label: "B안", detail: " · 능선 그래픽" },
]

/** 개발 미리보기 전용: 첫 화면 시안 전환 버튼 (정식 사이트에는 나오지 않습니다) */
export function LookSwitch() {
  const [look, setLook] = useState<Look | null>(null)

  useEffect(() => {
    setLook((document.documentElement.getAttribute("data-look") as Look) ?? "photo")
  }, [])

  const choose = (v: Look) => {
    document.documentElement.setAttribute("data-look", v)
    try {
      localStorage.setItem("jisan-look", v)
    } catch {}
    setLook(v)
  }

  return (
    <div
      role="group"
      aria-label="첫 화면 시안 전환 (미리보기 전용)"
      className="fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-5 z-[60] flex items-center gap-1 rounded-full bg-[#1C1C1C]/90 p-1 text-[12.5px] font-semibold text-white shadow-lg backdrop-blur"
    >
      <span className="hidden px-2.5 text-white/60 md:inline">시안</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => choose(o.value)}
          aria-pressed={look === o.value}
          className={`rounded-full px-3 py-1.5 transition-colors ${look === o.value ? "bg-white text-[#1C1C1C]" : "hover:bg-white/10"}`}
        >
          {o.label}
          <span className="hidden md:inline">{o.detail}</span>
        </button>
      ))}
    </div>
  )
}
