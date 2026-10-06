import Link from "next/link"
import { Building2, HandCoins, HeartCrack, House, Pill, Scale, School, ShieldAlert, Sprout, type LucideIcon } from "lucide-react"
import { centers } from "@/lib/centers"
import { ridgePath } from "@/lib/ridge"
import { SectionHead } from "@/components/main/section-head"

/** 센터마다 다른 표시 그림 */
const icons: Record<string, LucideIcon> = {
  crime: Scale,
  "sex-crime": ShieldAlert,
  drug: Pill,
  divorce: House,
  adultery: HeartCrack,
  corporate: Building2,
  civil: HandCoins,
  insolvency: Sprout,
  "school-violence": School,
}

/** 카드 바탕: 센터 사이트의 분위기를 따라감 (dark 남색 / warm 짙은 녹회색) */
const cardBg = { dark: "bg-brand", warm: "bg-[#3F4E46]" } as const

const W = 480
const H = 150

/** 카드마다 모양이 다른 능선 세 겹 (센터 순서로 모양값을 바꿈) */
function cardRidges(i: number) {
  return [
    { amp: 0.26, base: 0.42, seed: 1.1 + i * 1.73, sp: 0 },
    { amp: 0.22, base: 0.62, seed: 4.3 + i * 2.31, sp: 0 },
    { amp: 0.16, base: 0.82, seed: 7.9 + i * 0.97, sp: 0 },
  ].map((l) => ridgePath(l, W, H, 2.2))
}

/** 분야별 센터: 센터 사이트로 가는 큰 카드 (센터가 늘면 카드도 늘어납니다) */
export function CentersBand() {
  if (centers.length === 0) return null
  return (
    <section className="bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div data-reveal className="max-w-7xl mx-auto">
        <SectionHead title="분야별 센터" desc="분야마다 센터를 따로 두고, 단계별 대응 방법까지 자세히 안내합니다." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {centers.map((c, i) => {
            const Icon = icons[c.slug] ?? Scale
            const [back, mid, front] = cardRidges(i)
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className={`card-lift group relative flex min-h-[16.5rem] flex-col overflow-hidden rounded-2xl p-6 text-white md:p-7 ${cardBg[c.tone]}`}
              >
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="none"
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] w-[112%] transition-transform duration-[1400ms] ease-out group-hover:-translate-x-[6%]"
                >
                  <path d={back} fill="#fff" fillOpacity={0.07} />
                  <path d={mid} fill="#fff" fillOpacity={0.11} />
                  <path d={front} fill="#000" fillOpacity={0.14} />
                </svg>
                <div className="relative flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-white/70">{c.name}</span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
                <h3 className="relative mt-2 whitespace-pre-line text-[1.25rem] font-bold leading-[1.4] tracking-[-0.03em] md:text-[1.375rem]">
                  {c.hero.title}
                </h3>
                <p className="relative mt-3 max-w-md text-sm leading-relaxed text-white/70">{c.summary}</p>
                <span className="relative mt-auto pt-8 text-sm font-semibold">
                  <span className="border-b border-white/60 pb-0.5 group-hover:border-white">{c.name} 바로가기 →</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
