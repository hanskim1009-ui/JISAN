import Link from "next/link"
import { lawyers, type Lawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { SectionHead } from "@/components/main/section-head"
import { KeywordMarquee } from "@/components/main/keyword-marquee"
import type { Lang } from "@/lib/langs"
import { L, T } from "@/lib/i18n/t"
import { lawyerName } from "@/lib/lawyer-name"

/** 지금 사무실 직함을 뺀 경력 한 줄 */
function careerLines(l: Lawyer) {
  const all = l.career ?? l.structuredResume?.career ?? []
  return all.filter((c) => !c.includes(siteConfig.name)).slice(0, 1)
}

/** 구성원: 모두 같은 크기·같은 형식. 이름 위에 분야, 아래에 한 줄 소개와 경력 한 줄 */
export function PeopleSection({ lang = "ko" }: { lang?: Lang }) {
  const t = T(lang)
  return (
    <section id="team" className="screen scroll-mt-20 bg-brand-paper px-5 md:px-12 lg:px-14 pt-14 md:pt-20">
      <div data-reveal className="max-w-7xl mx-auto my-auto pb-14 md:pb-20">
        <SectionHead title={t("구성원 소개")} desc={t("내 사건을 누가 맡는지 궁금해 하지 않아도 됩니다. 상담한 변호사가 끝까지 함께합니다.")} href={L(lang, "/lawyers")} linkLabel={t("프로필 보기")} />
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-7">
          {lawyers.map((l) => (
            <li key={l.slug} className="w-[62%] shrink-0 snap-start sm:w-auto sm:min-w-0">
              <Link href={`${L(lang, "/lawyers")}#${l.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#C9CCD1] sm:aspect-[3/4] transition-transform duration-500 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.04]">
                  <LawyerPhoto
                    src={l.image}
                    name={lawyerName(l, lang)}
                    imageClassName={l.photoImageClassName}
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <p className="mt-2.5 text-xs font-bold text-brand-accent">{l.field ? t(l.field) : "\u00a0"}</p>
                <p className="text-lg font-bold text-jisan-ink group-hover:underline underline-offset-4 sm:text-base">{lawyerName(l, lang)}</p>
                <p className="text-[0.8125rem] text-[#8A9099]">{t(l.title)}</p>
                {l.tagline && <p className="mt-2 text-[0.8125rem] leading-snug text-jisan-ink">{t(l.tagline)}</p>}
                {careerLines(l).length > 0 && (
                  <ul className="mt-2 space-y-0.5 border-t border-[#D9D4CA] pt-2 text-[0.8125rem] leading-snug text-[#4A505A]">
                    {careerLines(l).map((c) => (
                      <li key={c}>{t(c)}</li>
                    ))}
                  </ul>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* 맡는 일이 흐르는 띠: 구성원 화면 맨 아래에 붙임 */}
      <div className="bleed -mx-5 md:-mx-12 lg:-mx-14">
        <KeywordMarquee lang={lang} />
      </div>
    </section>
  )
}
