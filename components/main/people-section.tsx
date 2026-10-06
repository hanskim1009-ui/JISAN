import Link from "next/link"
import { lawyers, type Lawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { SectionHead } from "@/components/main/section-head"

/** 지금 사무실 직함을 뺀 경력 두 줄 */
function careerLines(l: Lawyer) {
  const all = l.career ?? l.structuredResume?.career ?? []
  return all.filter((c) => !c.includes(siteConfig.name)).slice(0, 2)
}

/** 구성원: 모두 같은 크기·같은 형식. 이름 위에 분야, 아래에 경력 두 줄 */
export function PeopleSection() {
  return (
    <section id="team" className="scroll-mt-20 bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="구성원" href="/lawyers" linkLabel="구성원 소개" />
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-8">
          {lawyers.map((l) => (
            <li key={l.slug} className="min-w-0">
              <Link href={`/lawyers#${l.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#C9CCD1]">
                  <LawyerPhoto
                    src={l.image}
                    name={l.name}
                    imageClassName={l.photoImageClassName}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <p className="mt-2.5 text-xs font-bold text-brand-accent">{l.field}</p>
                <p className="text-base font-bold text-jisan-ink group-hover:underline underline-offset-4">{l.name}</p>
                <p className="text-[13px] text-[#8A9099]">{l.title}</p>
                {careerLines(l).length > 0 && (
                  <ul className="mt-2 space-y-0.5 border-t border-[#D9D4CA] pt-2 text-[13px] leading-snug text-[#4A505A]">
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
    </section>
  )
}
