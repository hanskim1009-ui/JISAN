import { Plus } from "lucide-react"
import { homeFaqs } from "@/lib/home-faq"
import { SectionHead } from "@/components/main/section-head"

/** 자주 묻는 질문 (눌러서 펼침) */
export function HomeFaq() {
  return (
    <section className="px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_2fr]">
        <SectionHead title="자주 묻는 질문" />
        <div className="border-t border-jisan-ink">
          {homeFaqs.map((f) => (
            <details key={f.q} className="group border-b border-[#E4E6E9]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-bold text-jisan-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-5 text-[15px] leading-relaxed text-[#4A505A]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
