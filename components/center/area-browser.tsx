"use client"

import { useState } from "react"
import Link from "next/link"
import type { AreaCard } from "@/lib/center-pages"

/**
 * 센터 업무분야 목록. 묶음이 둘 이상이면 위에 묶음 단추(전체/재산범죄/폭력…)를 두고,
 * '전체'에서는 묶음 제목 아래에 칸을 나눠 보여 줍니다.
 */
export function AreaBrowser({ groups, accent }: { groups: { group: string; items: AreaCard[] }[]; accent: string }) {
  const [active, setActive] = useState<string>("전체")
  const many = groups.length > 1
  const shown = active === "전체" ? groups : groups.filter((g) => g.group === active)
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div>
      {many && (
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="업무분야 묶음">
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
                className={`rounded-full border px-4 py-2 text-[0.875rem] font-semibold transition-colors ${
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
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {g.items.map((a) => (
                <li key={a.href} className="card-lift flex rounded-2xl border border-[#E2E6ED] bg-white">
                  <Link href={a.href} className="flex w-full flex-col p-5">
                    <span className="block text-[1.0625rem] font-bold text-jisan-ink">{a.name}</span>
                    {a.law && <span className={`mt-0.5 block text-xs font-semibold ${accent}`}>{a.law}</span>}
                    <span className="mt-2 line-clamp-3 block text-sm leading-relaxed text-jisan-ink/65">{a.desc}</span>
                    <span className={`mt-auto block pt-4 text-sm font-semibold ${accent}`}>자세히 보기 →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
