import Link from "next/link"
import { Building2, Globe2, HandCoins, HardHat, HeartCrack, House, Pill, Scale, School, ScrollText, ShieldAlert, Sprout, Stethoscope, type LucideIcon } from "lucide-react"
import { centerBase, centers, getCenter, type Center } from "@/lib/centers"
import type { Lang } from "@/lib/langs"
import { T } from "@/lib/i18n/t"
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
  family: House,
}

type Card = { slug: string; key: string; href: string; name: string; title: string; summary: string; badge?: string }

const LANG_BADGE = "EN · 中文 · VI · RU · MN"
/** 외국어판 형사·가사센터 카드 위 분야 표시 */
const FOREIGN_FIELD: Record<string, string> = { crime: "형사", family: "가사" }

/** 한국어 메인에 보이는 외국인 형사·가사센터 카드 (외국어판으로 연결) */
const KO_INTL: Omit<Card, "href">[] = [
  {
    slug: "crime-intl",
    key: "crime",
    name: "외국인 형사센터",
    title: "한국에서 수사·재판을 받는\n외국인을 위한 형사센터",
    summary: "경찰 조사, 체포·구속, 벌금과 형사재판까지 형사센터 안내를 다섯 개 외국어로 옮겼습니다.",
    badge: LANG_BADGE,
  },
  {
    slug: "family-intl",
    key: "family",
    name: "외국인 가사센터",
    title: "이혼·상간·상속,\n외국인 가족을 위한 가사센터",
    summary: "국제이혼과 재산분할·양육권, 상간 소송, 상속포기·상속재산분할 안내를 다섯 개 외국어로 옮겼습니다.",
    badge: LANG_BADGE,
  },
]

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
export function CentersBand({ lang = "ko" }: { lang?: Lang }) {
  const t = T(lang)
  const keyOf = (slug: string) => slug.replace(/-(en|zh|vi|ru|mn)$/, "")
  const toCard = (c: Center): Card => ({
    slug: c.slug,
    key: keyOf(c.slug),
    href: centerBase(c),
    name: c.name,
    title: c.hero.title,
    summary: c.summary,
    badge: fieldOf(c.slug) ?? (c.slug === "foreigner" ? LANG_BADGE : FOREIGN_FIELD[keyOf(c.slug)] && t(FOREIGN_FIELD[keyOf(c.slug)])),
  })
  // 한국어: 분야별 센터 + 외국인 형사·가사센터(영어판으로) / 외국어 사이트: 그 언어로 옮긴 외국인·형사·가사센터
  const intl = (k: string, l: string) => getCenter(`${k}-${l}`)
  const list: Card[] =
    lang === "ko"
      ? [
          ...centers.map(toCard),
          ...KO_INTL.flatMap((c) => {
            const en = intl(c.key, "en")
            return en ? [{ ...c, href: centerBase(en) }] : []
          }),
        ]
      : ["foreigner", "crime", "family"].flatMap((k) => {
          const c = intl(k, lang)
          return c ? [toCard(c)] : []
        })
  if (list.length === 0) return null
  return (
    <section className={`${lang === "ko" ? "screen " : ""}bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20`}>
      <div data-reveal className="max-w-7xl mx-auto">
        <SectionHead title={t("분야별 센터")} desc={t("사건 종류에 따라 방향이 다릅니다.")} />
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {list.map((c, i) => {
            const Icon = icons[c.key] ?? Scale
            const ridges = cardRidges(i)
            return (
              <Link
                key={c.slug}
                href={c.href}
                className={`card-lift group relative flex min-h-[17rem] w-[82%] shrink-0 snap-start flex-col sm:w-auto overflow-hidden rounded-2xl border border-brand/10 bg-white p-6 text-brand transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white md:p-7`}
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
                  {c.badge && (
                    <span className="rounded-full border border-brand/25 group-hover:border-white/40 px-2.5 py-0.5 text-xs font-semibold opacity-60">{c.badge}</span>
                  )}
                </div>
                <span className="relative mt-6 text-sm font-bold opacity-60">{c.name}</span>
                <h3 className="relative mt-1.5 whitespace-pre-line text-[1.25rem] font-bold leading-[1.4] tracking-[-0.03em] md:text-[1.375rem]">
                  {c.title}
                </h3>
                <p className="relative mt-3 max-w-md text-sm leading-relaxed opacity-70">{c.summary}</p>
                <span className="relative mt-auto pt-8 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    {t("{name} 바로가기", { name: c.name })} <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
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
