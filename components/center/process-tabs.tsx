"use client"

import { useState } from "react"
import type { Process } from "@/lib/center-pages"

/** 진행 절차: 절차가 여러 개면 위에서 골라 보고, 단계마다 기간·놓치기 쉬운 점을 함께 보여 줌 */
export function ProcessTabs({ processes, accent }: { processes: Process[]; accent: string }) {
  const [i, setI] = useState(0)
  const p = processes[i] ?? processes[0]
  return (
    <div>
      {processes.length > 1 && (
        <div role="tablist" aria-label="절차 고르기" className="flex flex-wrap gap-2">
          {processes.map((x, k) => (
            <button
              key={x.title}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                k === i ? "border-jisan-ink bg-jisan-ink text-white" : "border-[#D5DAE2] bg-white text-jisan-ink/75 hover:border-jisan-ink/50"
              }`}
            >
              {x.title}
            </button>
          ))}
        </div>
      )}
      <div role="tabpanel" className="mt-8">
        {p.summary && <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-jisan-ink/70">{p.summary}</p>}
        <ol className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
          {p.steps.map((s, k) => (
            <li key={s.title} className="relative flex gap-4 border-t border-[#E2E6ED] py-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jisan-ink text-sm font-bold tabular-nums text-white">
                {k + 1}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[16px] font-bold text-jisan-ink">{s.title}</span>
                  {s.period && <span className={`rounded-full bg-jisan-mist px-2.5 py-0.5 text-xs font-semibold ${accent}`}>{s.period}</span>}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-jisan-ink/75">{s.desc}</p>
                {s.tip && <p className="mt-2 text-sm leading-relaxed text-jisan-ink/60">· {s.tip}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
