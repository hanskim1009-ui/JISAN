import Link from "next/link"
import { centers } from "@/lib/centers"
import { LogoSvg } from "@/components/brand-logo"
import { SectionHead } from "@/components/main/section-head"

/** 분야별 센터: 센터 사이트로 가는 큰 카드 (센터가 늘면 카드도 늘어납니다) */
export function CentersBand() {
  if (centers.length === 0) return null
  return (
    <section className="bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="분야별 센터" desc="분야마다 센터를 따로 두고, 단계별 대응 방법까지 자세히 안내합니다." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {centers.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group relative flex min-h-[15rem] flex-col overflow-hidden bg-brand p-6 text-white md:p-7"
            >
              <LogoSvg variant="tone" className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-auto text-brand-tone" />
              <span className="relative text-sm font-bold text-white/70">{c.name}</span>
              <h3 className="relative mt-2.5 whitespace-pre-line text-[1.25rem] font-bold leading-[1.4] tracking-[-0.03em] md:text-[1.375rem]">
                {c.hero.title}
              </h3>
              <p className="relative mt-3 max-w-md text-sm leading-relaxed text-white/70">{c.summary}</p>
              <span className="relative mt-auto pt-6 text-sm font-semibold">
                <span className="border-b border-white/60 pb-0.5 group-hover:border-white">{c.name} 바로가기 →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
