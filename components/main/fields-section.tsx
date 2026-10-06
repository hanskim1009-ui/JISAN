import Link from "next/link"
import { fields } from "@/lib/practice"
import { lawyers } from "@/lib/lawyers"
import { centers } from "@/lib/centers"
import { SectionHead } from "@/components/main/section-head"

const name = (slug: string) => lawyers.find((l) => l.slug === slug)?.name ?? ""

/** 맡는 일: 형사·가사·기업·민사 같은 무게의 네 갈래 */
export function FieldsSection() {
  return (
    <section id="practice" className="scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="맡는 일" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {fields.map((f) => (
            <div key={f.name} className="min-w-0">
              <h3 className="text-[1.375rem] font-bold tracking-tight text-jisan-ink">{f.name}</h3>
              <ul className="mt-2 text-[15px] text-[#4A505A]">
                {f.items.map((it) => (
                  <li key={it} className="border-b border-[#E4E6E9] py-1.5">
                    {it}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] text-[#8A9099]">
                맡는 변호사 <span className="font-semibold text-jisan-ink">{f.lawyers.map(name).join(" · ")}</span>
              </p>
              {f.centers.length > 0 && (
                <p className="mt-2 flex flex-wrap gap-x-4 text-sm font-semibold">
                  {f.centers.map((slug) => (
                    <Link key={slug} href={`/${slug}`} className="text-jisan-logo underline decoration-1 underline-offset-[5px]">
                      {centers.find((c) => c.slug === slug)?.name}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
