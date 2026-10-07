import { Plus } from "lucide-react"
import type { Faq } from "@/lib/center-pages"

/** 눌러서 펼치는 질문 목록 */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="min-w-0 divide-y divide-[#E2E6ED] border-y border-[#E2E6ED]">
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.9375rem] font-semibold text-jisan-ink [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" />
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-jisan-ink/70">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
