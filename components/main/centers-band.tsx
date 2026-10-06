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
        <SectionHead title="분야별 센터" desc="형사·성범죄 사건은 센터에서 단계별 대응 방법까지 자세히 안내합니다." />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {centers.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group relative flex min-h-[20rem] flex-col overflow-hidden bg-brand p-7 text-white md:p-9"
            >
              <LogoSvg variant="tone" className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-auto text-brand-tone" />
              <span className="relative text-sm font-bold text-white/70">{c.name}</span>
              <h3 className="relative mt-3 whitespace-pre-line text-[1.625rem] font-bold leading-[1.35] tracking-[-0.03em] md:text-[2rem]">
                {c.hero.title}
              </h3>
              <p className="relative mt-4 max-w-md text-[15px] leading-relaxed text-white/75">{c.summary}</p>
              <span className="relative mt-auto pt-8 text-[15px] font-semibold">
                <span className="border-b border-white/60 pb-0.5 group-hover:border-white">{c.name} 바로가기 →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
