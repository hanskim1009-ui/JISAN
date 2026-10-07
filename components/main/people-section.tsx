import Link from "next/link"
import { lawyers, type Lawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { SectionHead } from "@/components/main/section-head"
import { KeywordMarquee } from "@/components/main/keyword-marquee"

/** 지금 사무실 직함을 뺀 경력 한 줄 */
function careerLines(l: Lawyer) {
  const all = l.career ?? l.structuredResume?.career ?? []
  return all.filter((c) => !c.includes(siteConfig.name)).slice(0, 1)
}

/** 구성원: 모두 같은 크기·같은 형식. 이름 위에 분야, 아래에 한 줄 소개와 경력 한 줄 */
export function PeopleSection() {
  return (
    <section id="team" className="screen scroll-mt-20 bg-brand-paper px-5 md:px-12 lg:px-14 pt-14 md:pt-20">
      <div data-reveal className="max-w-7xl mx-auto my-auto pb-14 md:pb-20">
        <SectionHead title="구성원 소개" desc="분야마다 그 일을 해 온 변호사가 사건을 직접 수행합니다." href="/lawyers" linkLabel="프로필 보기" />
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-x-5 gap-y-8">
          {lawyers.map((l) => (
            <li key={l.slug} className="min-w-0">
              <Link href={`/lawyers#${l.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#C9CCD1] transition-transform duration-500 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.04]">
                  <LawyerPhoto
                    src={l.image}
                    name={l.name}
                    imageClassName={l.photoImageClassName}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <p className="mt-2.5 text-xs font-bold text-brand-accent">{l.field || "\u00a0"}</p>
                <p className="text-base font-bold text-jisan-ink group-hover:underline underline-offset-4">{l.name}</p>
                <p className="text-[0.8125rem] text-[#8A9099]">{l.title}</p>
                {l.tagline && <p className="mt-2 text-[0.8125rem] leading-snug text-jisan-ink">{l.tagline}</p>}
                {careerLines(l).length > 0 && (
                  <ul className="mt-2 space-y-0.5 border-t border-[#D9D4CA] pt-2 text-[0.8125rem] leading-snug text-[#4A505A]">
                    {careerLines(l).map((c) => (
                      <li key={c}>{c}</li>
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
        <KeywordMarquee />
      </div>
    </section>
  )
}
