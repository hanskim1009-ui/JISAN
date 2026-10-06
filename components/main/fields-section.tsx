import Link from "next/link"
import { fields } from "@/lib/practice"
import { getLawyer } from "@/lib/lawyers"
import { centers } from "@/lib/centers"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { SectionHead } from "@/components/main/section-head"

/** 업무영역: 형사·가사·기업·민사 같은 무게의 네 갈래. 세부 업무와 담당 변호사 */
export function FieldsSection() {
  return (
    <section id="practice" className="scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="업무영역" desc="형사·가사·기업·민사, 분야마다 담당 변호사가 정해져 있습니다." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-jisan-ink">
          {fields.map((f) => (
            <div key={f.name} className="flex min-w-0 flex-col border-b border-[#E4E6E9] py-7 sm:pr-6 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:not(:first-child)]:pl-6">
              <h3 className="text-[1.75rem] font-bold tracking-[-0.03em] text-jisan-ink">{f.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#4A505A]">{f.desc}</p>
              <ul className="mt-4 text-[15px] text-jisan-ink">
                {f.items.map((it) => (
                  <li key={it} className="border-b border-[#E4E6E9] py-2">
                    {it}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs font-bold text-[#8A9099]">담당 변호사</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {f.lawyers.map((slug) => {
                  const l = getLawyer(slug)
                  if (!l) return null
                  return (
                    <li key={slug}>
                      <Link href={`/lawyers#${slug}`} className="group flex items-center gap-2 text-sm font-semibold text-jisan-ink">
                        <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#C9CCD1]">
                          <LawyerPhoto src={l.image} name={l.name} imageClassName="object-cover object-top origin-top scale-[2]" sizes="144px" initialClassName="text-sm" />
                        </span>
                        <span className="group-hover:underline underline-offset-4">{l.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {f.centers.some((slug) => centers.some((c) => c.slug === slug)) && (
                <p className="mt-auto flex flex-wrap gap-x-4 pt-5 text-sm font-semibold">
                  {f.centers.filter((slug) => centers.some((c) => c.slug === slug)).map((slug) => (
                    <Link key={slug} href={`/${slug}`} className="text-brand-accent underline decoration-1 underline-offset-[5px]">
                      {centers.find((c) => c.slug === slug)?.name} →
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
