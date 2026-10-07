"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import type { AreaCard } from "@/lib/center-pages"

/**
 * 센터 업무분야 목록. 묶음이 둘 이상이면 위에 묶음 단추(전체/재산범죄/폭력…)를 두고,
 * '전체'에서는 묶음 제목 아래에 칸을 나눠 보여 줍니다.
 * 모바일 '전체'에서는 묶음마다 앞의 4개만 보이고, 나머지는 'N개 더 보기'로 그 묶음 단추를 누른 것처럼 엽니다.
 */
const PREVIEW = 4

export function AreaBrowser({ groups, accent }: { groups: { group: string; items: AreaCard[] }[]; accent: string }) {
  const [active, setActive] = useState<string>("전체")
  const many = groups.length > 1
  const shown = active === "전체" ? groups : groups.filter((g) => g.group === active)
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const clip = many && active === "전체"
  const top = useRef<HTMLDivElement>(null)
  const pick = (name: string) => {
    setActive(name)
    top.current?.scrollIntoView({ block: "start", behavior: "smooth" })
  }

  return (
    <div ref={top} className="scroll-mt-24">
      {many && (
        <div className="no-scrollbar -mx-6 mt-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0" role="tablist" aria-label="업무분야 묶음">
          {["전체", ...groups.map((g) => g.group)].map((name) => {
            const on = active === name
            const count = name === "전체" ? total : groups.find((g) => g.group === name)?.items.length
            return (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(name)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.875rem] font-semibold transition-colors ${
                  on ? "border-jisan-ink bg-jisan-ink text-white" : "border-[#D5DAE1] bg-white text-jisan-ink/75 hover:border-jisan-ink/50"
                }`}
              >
                {name}
                <span className={`ml-1.5 text-[0.75rem] tabular-nums ${on ? "text-white/60" : "text-jisan-ink/40"}`}>{count}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-8 space-y-10">
        {shown.map((g) => (
          <div key={g.group}>
            {many && <h3 className="mb-4 text-[1.0625rem] font-bold text-jisan-ink">{g.group}</h3>}
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {g.items.map((a, i) => (
                <li
                  key={a.href}
                  className={`card-lift rounded-2xl border border-[#E2E6ED] bg-white ${clip && i >= PREVIEW ? "hidden md:flex" : "flex"}`}
                >
                  <Link href={a.href} className="flex w-full flex-col p-4 md:p-5">
                    <span className="block text-[1.0625rem] font-bold text-jisan-ink">{a.name}</span>
                    {a.law && <span className={`mt-0.5 block text-xs font-semibold ${accent}`}>{a.law}</span>}
                    <span className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-jisan-ink/65 md:mt-2 md:line-clamp-3">{a.desc}</span>
                    <span className={`mt-auto hidden pt-4 text-sm font-semibold md:block ${accent}`}>자세히 보기&nbsp;→</span>
                  </Link>
                </li>
              ))}
            </ul>
            {clip && g.items.length > PREVIEW && (
              <button
                type="button"
                onClick={() => pick(g.group)}
                className={`mt-3 w-full rounded-xl border border-[#D5DAE1] bg-white py-3 text-sm font-semibold md:hidden ${accent}`}
              >
                {g.group} {g.items.length - PREVIEW}개 더 보기
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
