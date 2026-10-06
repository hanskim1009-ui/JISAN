"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { centers } from "@/lib/centers"
import { practiceAreas } from "@/lib/practice"
import { presetConsult } from "@/components/consult-form"

/** 센터(별도 사이트로 이동) + 센터가 없는 업무분야(상담 폼으로 연결) */
export function PracticeGrid() {
  const consult = (caseType: string) => {
    presetConsult(caseType)
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="practice" className="scroll-mt-20 px-6 py-20 md:px-12 lg:px-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto">
        <p className="text-[11px] tracking-[0.2em] text-muted-foreground font-medium mb-3 uppercase">Centers &amp; Practice</p>
        <h2 className="font-serif text-3xl md:text-[2.5rem] font-semibold tracking-tight text-jisan-ink leading-tight">
          센터와 업무분야
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {centers.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group flex flex-col rounded-xl bg-jisan-navy p-6 md:p-8 text-white min-h-[180px] hover:bg-[#1c2a4d] transition-colors"
            >
              <span className="text-[11px] tracking-[0.14em] text-white/60">센터</span>
              <span className="mt-1 text-2xl font-bold">{c.name}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-white/75">{c.summary}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                센터 바로가기 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {practiceAreas.map((p) => (
            <div key={p.name} className="flex flex-col rounded-xl border border-[#E2E6ED] bg-white p-5 min-h-[180px]">
              <span className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{p.tag}</span>
              <span className="mt-1 text-lg font-bold text-jisan-ink">{p.name}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-jisan-ink/65">{p.description}</span>
              <button
                type="button"
                onClick={() => consult(p.caseType)}
                className="mt-4 self-start inline-flex items-center gap-1 text-sm font-semibold text-jisan-blue hover:underline underline-offset-4"
              >
                {p.name} 상담 신청 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
