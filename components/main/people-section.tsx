import Link from "next/link"
import { lawyers } from "@/lib/lawyers"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { SectionHead } from "@/components/main/section-head"

/** 구성원: 모두 같은 크기·같은 형식. 이름 위에 맡는 분야만 */
export function PeopleSection() {
  return (
    <section id="team" className="scroll-mt-20 bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="구성원" desc="이름을 누르면 경력을 볼 수 있습니다." />
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
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
