import Link from "next/link"
import { fields } from "@/lib/practice"
import { getLawyer } from "@/lib/lawyers"
import { centerBase, centers, getCenter } from "@/lib/centers"

/** 한국어 센터 → 외국어판 센터 종류 */
const INTL_OF: Record<string, string> = { crime: "crime", divorce: "family", adultery: "family", inheritance: "family" }
import { LawyerPhoto } from "@/components/lawyer-photo"
import { SectionHead } from "@/components/main/section-head"
import type { Lang } from "@/lib/langs"
import { L, T } from "@/lib/i18n/t"
import { lawyerName } from "@/lib/lawyer-name"

/**
 * 업무영역: 형사·가사·기업·의료·부동산·민사 같은 무게의 여섯 갈래.
 * 넓은 화면에서는 칸마다 [분야 · 설명 · 세부 업무 · 담당 변호사 · 센터] 다섯 줄이 같은 높이에서 시작하도록
 * subgrid로 줄을 맞춥니다. 담당 변호사는 한 줄에 한 명, 센터는 아래쪽 버튼으로.
 */
export function FieldsSection({ lang = "ko" }: { lang?: Lang }) {
  const t = T(lang)
  const ko = lang === "ko"
  return (
    <section id="practice" className="screen scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div data-reveal className="max-w-7xl mx-auto">
        <SectionHead title={t("업무영역")} desc={t("어떤 문제가 있으신가요?")} />
        <p aria-hidden className="-mt-4 mb-3 text-right text-xs text-[#8A9099] sm:hidden">
          {t("옆으로 넘겨 보세요")}&nbsp;→
        </p>
        {/* 모바일은 옆으로 넘기는 카드, sm 2칸, lg 3칸, xl 한 줄 6칸 */}
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-0 sm:gap-y-0 sm:overflow-visible sm:border-t sm:border-jisan-ink sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-6">
          {fields.map((f) => {
            // 외국어 사이트는 그 언어로 옮긴 형사·가사센터만 버튼으로 (이혼·상간·상속은 가사센터 하나)
            const fieldCenters = ko
              ? f.centers.map((slug) => centers.find((c) => c.slug === slug)).filter((c) => !!c)
              : [...new Set(f.centers.map((slug) => INTL_OF[slug]).filter(Boolean))].map((k) => getCenter(`${k}-${lang}`)).filter((c) => !!c)
            return (
              <div
                key={f.name}
                className="flex w-[85%] min-w-0 shrink-0 snap-start flex-col gap-4 rounded-2xl border border-[#E4E6E9] p-5 sm:row-span-5 sm:grid sm:w-auto sm:grid-rows-subgrid sm:gap-0 sm:rounded-none sm:border-0 sm:border-b sm:p-0 sm:py-7 sm:pr-6 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:not(:nth-child(3n+1))]:pl-6 xl:border-b-0 xl:pr-4 xl:[&:nth-child(3)]:border-r xl:[&:not(:first-child)]:pl-4"
              >
                {/* 1. 분야 */}
                <h3 className="text-[1.625rem] font-bold tracking-[-0.03em] text-jisan-ink xl:text-[1.5rem]">{t(f.name)}</h3>

                {/* 2. 설명 */}
                <p className="text-[0.9375rem] leading-relaxed text-[#4A505A] sm:mt-2">{t(f.desc)}</p>

                {/* 3. 세부 업무 */}
                <ul className="text-[0.9375rem] text-jisan-ink sm:mt-4 sm:self-start">
                  {f.items.map((it) => (
                    <li key={it} className="border-b border-[#E4E6E9] py-2">
                      {t(it)}
                    </li>
                  ))}
                </ul>

                {/* 4. 담당 변호사: 한 줄에 한 명 */}
                <div className="sm:mt-6 sm:self-start">
                  <p className="text-xs font-bold text-[#8A9099]">{t("담당 변호사")}</p>
                  <ul className="mt-2.5 space-y-2">
                    {f.lawyers.map((slug) => {
                      const l = getLawyer(slug)
                      if (!l) return null
                      return (
                        <li key={slug}>
                          <Link href={`${L(lang, "/lawyers")}#${slug}`} className="group flex items-center gap-2.5 text-sm font-semibold text-jisan-ink">
                            <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#C9CCD1]">
                              <LawyerPhoto src={l.image} name={lawyerName(l, lang)} imageClassName="object-cover object-top origin-top scale-[2]" sizes="128px" initialClassName="text-xs" />
                            </span>
                            <span className="group-hover:underline underline-offset-4">{lawyerName(l, lang)}</span>
                            <span className="text-xs font-medium text-[#8A9099]">{t(l.title)}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* 5. 센터 바로가기 */}
                {fieldCenters.length > 0 && (
                  <div className="mt-auto space-y-1.5 sm:mt-6 sm:self-start">
                    {fieldCenters.map((c) => (
                      <Link
                        key={c.slug}
                        href={centerBase(c)}
                        className="group flex items-center justify-between gap-2 rounded-lg bg-[#F2F4F7] px-3 py-2 text-[0.8125rem] font-semibold text-jisan-ink transition-colors hover:bg-jisan-ink hover:text-white"
                      >
                        {c.name}
                        <span aria-hidden className="text-jisan-ink/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
