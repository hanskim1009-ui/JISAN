import Image from "next/image"
import { Phone } from "lucide-react"
import type { Center } from "@/lib/centers"
import { siteConfig } from "@/lib/site-config"
import { chatOnly } from "@/lib/chat"
import { looksToRender, type Look } from "@/lib/look"
import { centerTones } from "@/components/center/tone"
import { RidgeCanvas } from "@/components/look/ridge-canvas"
import { stageGuideHref } from "@/lib/center-pages"
import { centerText } from "@/lib/center-i18n"

/**
 * 센터 첫 화면. 시안 두 가지(lib/look.ts)
 * photo(추천안): 메인과 같은 능선 사진을 센터 분위기대로 칠함 (dark는 흑백 + 남색, warm은 밝게)
 * ridge(B안):   센터 바탕색 위에 같은 색 계열의 능선 그래픽이 흐름
 */
export function CenterHero({ center }: { center: Center }) {
  return (
    <>
      {looksToRender.map((look) => (
        <Hero key={look} look={look} center={center} />
      ))}
    </>
  )
}

function Hero({ look, center }: { look: Look; center: Center }) {
  const t = centerTones[center.tone]
  const L = centerText(center.lang)
  const dark = center.tone === "dark"
  const ridge = look === "ridge"
  const rise = (d: number) => (ridge ? { style: { animationDelay: `${d}s` } } : {})
  const anim = ridge ? "anim-rise" : ""

  return (
    <section className={`screen look-${look} relative overflow-hidden ${t.hero}`}>
      {look === "photo" ? (
        <>
          <div aria-hidden className="anim-kenburns absolute -inset-[4%]">
            <Image
              src="/images/hero/ridge.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className={`object-cover object-[center_68%] ${dark ? "grayscale contrast-[1.1]" : ""}`}
            />
          </div>
          <div
            aria-hidden
            className={`absolute inset-0 ${
              dark ? "bg-gradient-to-b from-jisan-navy/60 to-jisan-navy/90" : "bg-gradient-to-b from-[#F3EFE8]/40 via-[#F3EFE8]/75 to-[#F3EFE8]/95"
            }`}
          />
        </>
      ) : (
        <RidgeCanvas palette={dark ? "navy" : "warm"} className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] max-h-[27.5rem] w-full" />
      )}

      <div
        className={`relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 px-6 md:px-12 lg:px-20 pt-14 md:pt-20 ${
          ridge ? "pb-36 md:pb-48" : "pb-14 md:pb-20"
        }`}
      >
        <div className="min-w-0">
          <span {...rise(0.2)} className={`${anim} inline-block rounded-full px-3 py-1 text-xs font-bold ${t.badge}`}>
            {center.name}
          </span>
          <h1
            {...rise(0.32)}
            className={`${anim} mt-4 text-[2rem] leading-[1.25] md:text-5xl md:leading-[1.2] whitespace-pre-line text-balance ${t.heroTitle}`}
          >
            {center.hero.title}
          </h1>
          <p {...rise(0.44)} className={`${anim} mt-5 max-w-xl text-base md:text-[1.0625rem] leading-relaxed ${t.heroSub}`}>
            {center.hero.sub}
          </p>
          <div {...rise(0.56)} className={`${anim} mt-8 flex flex-wrap gap-2.5`}>
            <a href="#consult" className={`rounded-full px-6 py-3 text-[0.9375rem] font-semibold ${t.primaryBtn}`}>
              {L.consult}
            </a>
            {!chatOnly(center.lang) && (
              <a
                href={siteConfig.phoneHref}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-semibold tabular-nums ${t.ghostBtn}`}
              >
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
            )}
          </div>
        </div>
        <div
          {...rise(0.7)}
          className={`${anim} min-w-0 self-start rounded-2xl bg-white/95 p-5 md:p-6 text-jisan-ink shadow-[0_14px_40px_-16px_rgba(10,15,30,0.45)] backdrop-blur`}
        >
          <h2 className="text-base font-bold">{center.stageTitle}</h2>
          <ul className="mt-3 space-y-2">
            {center.stages.map((s) => {
              // 상황을 설명하는 안내 글이 있으면 그리로 (전화로 바로 넘기지 않고 할 일부터 보여 줌)
              const guide = stageGuideHref(center.slug, s.label)
              const hint = guide && s.href.startsWith("tel:") ? L.seeNow : s.hint
              return (
              <li key={s.label}>
                <a
                  href={guide ?? (chatOnly(center.lang) && s.href.startsWith("tel:") ? "#consult" : s.href)}
                  className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[0.9375rem] font-semibold transition-colors ${
                    s.urgent ? "border-[#E2620F] text-[#B4490A] hover:bg-[#E2620F]/5" : "border-[#E2E6ED] hover:border-jisan-blue"
                  }`}
                >
                  <span className="min-w-0 flex-1">{s.label}</span>
                  {/* 모바일은 화살표만, 넓은 화면은 짧은 설명 + 화살표 (설명이 길어도 제목을 밀어내지 않게) */}
                  <span
                    className={`max-w-[45%] text-right text-xs font-medium leading-snug transition-transform group-hover:translate-x-0.5 ${
                      s.urgent ? "text-[#B4490A]" : "text-muted-foreground"
                    }`}
                  >
                    <span className="hidden sm:inline">{hint?.replace(/\s*→\s*$/, "")} </span>→
                  </span>
                </a>
              </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
