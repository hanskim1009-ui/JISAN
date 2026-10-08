import Link from "next/link"
import { Building2, Globe2, HandCoins, HardHat, HeartCrack, House, Pill, Scale, School, ScrollText, ShieldAlert, Sprout, Stethoscope, type LucideIcon } from "lucide-react"
import { centers } from "@/lib/centers"
import { fields } from "@/lib/practice"
import { ridgePath } from "@/lib/ridge"
import { SectionHead } from "@/components/main/section-head"

/** 센터마다 다른 선 그림 */
const icons: Record<string, LucideIcon> = {
  crime: Scale,
  "sex-crime": ShieldAlert,
  drug: Pill,
  divorce: House,
  adultery: HeartCrack,
  inheritance: ScrollText,
  corporate: Building2,
  medical: Stethoscope,
  construction: HardHat,
  civil: HandCoins,
  insolvency: Sprout,
  "school-violence": School,
  foreigner: Globe2,
}

const fieldOf = (slug: string) => fields.find((f) => f.centers.includes(slug))?.name

const W = 480
const H = 150

/** 카드마다 모양이 다른 능선 세 줄 (센터 순서로 모양값을 바꿈) */
function cardRidges(i: number) {
  return [
    { amp: 0.26, base: 0.42, seed: 1.1 + i * 1.73, sp: 0 },
    { amp: 0.22, base: 0.62, seed: 4.3 + i * 2.31, sp: 0 },
    { amp: 0.16, base: 0.82, seed: 7.9 + i * 0.97, sp: 0 },
  ].map((l) => ridgePath(l, W, H, 2.2))
}

/**
 * 분야별 센터: 흰 카드 + 남색 글씨 한 가지 색. 센터마다 선 그림과 능선 모양으로 구분하고,
 * 마우스를 올리면 카드가 남색으로 바뀌며 능선이 흐릅니다.
 */
export function CentersBand() {
  if (centers.length === 0) return null
  return (
    <section className="screen bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div data-reveal className="max-w-7xl mx-auto">
        <SectionHead title="분야별 센터" desc="사건 종류에 따라 방향이 다릅니다." />
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {centers.map((c, i) => {
            const Icon = icons[c.slug] ?? Scale
            const field = fieldOf(c.slug)
            const ridges = cardRidges(i)
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className={`${c.slug === "foreigner" ? "sm:col-span-2 lg:col-span-3 " : ""}card-lift group relative flex min-h-[17rem] w-[82%] shrink-0 snap-start flex-col sm:w-auto overflow-hidden rounded-2xl border border-brand/10 bg-white p-6 text-brand transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white md:p-7`}
              >
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="none"
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] w-[112%] opacity-60 transition-[transform,opacity] duration-[1400ms] ease-out group-hover:-translate-x-[6%] group-hover:opacity-100"
                >
                  {ridges.map((d, k) => (
                    <path
                      key={k}
                      d={d}
                      fill="currentColor"
                      fillOpacity={0.03 + k * 0.02}
                      stroke="currentColor"
                      strokeOpacity={0.14 + k * 0.05}
                      strokeWidth={1.2}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
                <div className="relative flex items-start justify-between gap-3">
                  <Icon className="h-9 w-9" strokeWidth={1.4} aria-hidden />
                  {(field || c.slug === "foreigner") && (
                    <span className="rounded-full border border-brand/25 group-hover:border-white/40 px-2.5 py-0.5 text-xs font-semibold opacity-60">{field ?? "English · 中文"}</span>
                  )}
                </div>
                <span className="relative mt-6 text-sm font-bold opacity-60">{c.name}</span>
                <h3 className="relative mt-1.5 whitespace-pre-line text-[1.25rem] font-bold leading-[1.4] tracking-[-0.03em] md:text-[1.375rem]">
                  {c.hero.title}
                </h3>
                <p className="relative mt-3 max-w-md text-sm leading-relaxed opacity-70">{c.summary}</p>
                <span className="relative mt-auto pt-8 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    {c.name} 바로가기 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
