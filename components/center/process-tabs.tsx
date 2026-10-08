"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import type { Process } from "@/lib/center-pages"
import { centerText, type Lang } from "@/lib/center-i18n"

/** 진행 절차: 절차가 여러 개면 위에서 골라 보고, 단계마다 기간·놓치기 쉬운 점을 함께 보여 줌 */
export function ProcessTabs({ processes, accent, lang }: { processes: Process[]; accent: string; lang?: Lang }) {
  const [i, setI] = useState(0)
  // 모바일: 단계 제목만 보이고 눌러서 설명을 펼침 (첫 단계는 펼친 채로)
  const [open, setOpen] = useState<Set<number>>(new Set([0]))
  const p = processes[i] ?? processes[0]
  const toggle = (k: number) =>
    setOpen((o) => {
      const n = new Set(o)
      if (n.has(k)) n.delete(k)
      else n.add(k)
      return n
    })
  return (
    <div>
      {processes.length > 1 && (
        <div role="tablist" aria-label={centerText(lang).pickProcess} className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {processes.map((x, k) => (
            <button
              key={x.title}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => {
                setI(k)
                setOpen(new Set([0]))
              }}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                k === i ? "border-jisan-ink bg-jisan-ink text-white" : "border-[#D5DAE2] bg-white text-jisan-ink/75 hover:border-jisan-ink/50"
              }`}
            >
              {x.title}
            </button>
          ))}
        </div>
      )}
      <div role="tabpanel" className="mt-8">
        {p.summary && <p className="mb-6 max-w-3xl text-[0.9375rem] leading-relaxed text-jisan-ink/70">{p.summary}</p>}
        <ol className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
          {p.steps.map((s, k) => (
            <li key={s.title} className="relative border-t border-[#E2E6ED] py-4 md:py-5">
              <button
                type="button"
                onClick={() => toggle(k)}
                aria-expanded={open.has(k)}
                className="flex w-full items-start gap-4 text-left md:pointer-events-none"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jisan-ink text-sm font-bold tabular-nums text-white">
                  {k + 1}
                </span>
                <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1 pt-1">
                  <span className="text-[1rem] font-bold text-jisan-ink">{s.title}</span>
                  {s.period && <span className={`hidden rounded-full bg-jisan-mist px-2.5 py-0.5 text-xs font-semibold md:inline ${accent}`}>{s.period}</span>}
                </span>
                <Plus className={`mt-2 h-4 w-4 shrink-0 text-jisan-ink/50 transition-transform md:hidden ${open.has(k) ? "rotate-45" : ""}`} />
              </button>
              <div className={`pl-12 ${open.has(k) ? "block" : "hidden"} md:block`}>
                {s.period && <p className={`mt-2 inline-block rounded-full bg-jisan-mist px-2.5 py-0.5 text-xs font-semibold md:hidden ${accent}`}>{s.period}</p>}
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-jisan-ink/75">{s.desc}</p>
                {s.tip && <p className="mt-2 text-sm leading-relaxed text-jisan-ink/60">· {s.tip}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
