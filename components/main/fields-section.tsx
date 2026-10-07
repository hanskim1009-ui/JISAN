import Link from "next/link"
import { fields } from "@/lib/practice"
import { getLawyer } from "@/lib/lawyers"
import { centers } from "@/lib/centers"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { SectionHead } from "@/components/main/section-head"

/** 업무영역: 형사·가사·기업·의료·부동산·민사 같은 무게의 여섯 갈래. 세부 업무와 담당 변호사 */
export function FieldsSection() {
  return (
    <section id="practice" className="screen scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div data-reveal className="max-w-7xl mx-auto">
        <SectionHead title="업무영역" desc="어떤 문제가 있으신가요?" />
        <p aria-hidden className="-mt-4 mb-3 text-right text-xs text-[#8A9099] sm:hidden">
          옆으로 넘겨 보세요&nbsp;→
        </p>
        {/* 모바일은 옆으로 넘기는 카드, sm 2칸, lg 3칸, xl 한 줄 6칸 */}
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-0 sm:overflow-visible sm:border-t sm:border-jisan-ink sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-6">
          {fields.map((f) => (
            <div
              key={f.name}
              className="flex w-[85%] min-w-0 shrink-0 snap-start flex-col rounded-2xl border border-[#E4E6E9] p-5 sm:w-auto sm:rounded-none sm:border-0 sm:border-b sm:p-0 sm:py-7 sm:pr-6 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:not(:nth-child(3n+1))]:pl-6 xl:border-b-0 xl:pr-4 xl:[&:nth-child(3)]:border-r xl:[&:not(:first-child)]:pl-4"
            >
              <h3 className="text-[1.625rem] font-bold tracking-[-0.03em] text-jisan-ink xl:text-[1.5rem]">{f.name}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#4A505A]">{f.desc}</p>
              <ul className="mt-4 text-[0.9375rem] text-jisan-ink">
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
                    <Link key={slug} href={`/${slug}`} className="text-brand-accent underline decoration-1 underline-offset-[0.3125rem]">
                      {centers.find((c) => c.slug === slug)?.name}&nbsp;→
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
