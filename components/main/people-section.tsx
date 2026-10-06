import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { lawyers } from "@/lib/lawyers"
import { LawyerPhoto } from "@/components/lawyer-photo"

/** 구성원 요약 (자세한 이력은 /lawyers) + 체계 숫자 띠 */
export function PeopleSection() {
  const stats = [
    { value: `${lawyers.length}인`, label: "사건을 직접 맡는 변호사" },
    { value: "형사·기업·가사", label: "주요 업무분야" },
    { value: "365일", label: "주말·공휴일 포함 전화 상담" },
  ]

  return (
    <section id="team" className="scroll-mt-20 bg-jisan-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-muted-foreground font-medium mb-3 uppercase">Lawyers</p>
            <h2 className="font-serif text-3xl md:text-[2.5rem] font-semibold tracking-tight text-jisan-ink leading-tight">
              사건을 직접 맡는 변호사들
            </h2>
          </div>
          <Link href="/lawyers" className="inline-flex items-center gap-1 text-sm font-semibold text-jisan-blue hover:underline underline-offset-4">
            구성원 자세히 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
          {lawyers.map((l) => (
            <li key={l.slug}>
              <Link href={`/lawyers#${l.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded bg-[#2a3348]">
                  <LawyerPhoto
                    src={l.image}
                    name={l.name}
                    imageClassName={l.photoImageClassName}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <p className="mt-3 text-base font-semibold text-jisan-ink group-hover:text-jisan-blue">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.title}</p>
                {l.fact && <p className="mt-1 text-xs leading-snug text-jisan-ink/65">{l.fact}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <dl className="bg-jisan-navy text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 lg:px-20 py-14">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-white/20 pt-4">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-serif text-4xl md:text-5xl font-medium leading-tight">{s.value}</span>
                <span className="text-sm text-white/70">{s.label}</span>
              </dd>
            </div>
          ))}
        </div>
      </dl>
    </section>
  )
}
