import Image from "next/image"
import { MessageCircle, Phone } from "lucide-react"
import type { Center } from "@/lib/centers"
import { siteConfig } from "@/lib/site-config"
import { getLawyer } from "@/lib/lawyers"
import { heroLines, prosecutor } from "@/lib/prosecutor"
import { centerText } from "@/lib/center-i18n"
import { HeroPick } from "@/components/center/hero-pick"

/**
 * 형사 계열 센터 첫 화면: 누가 맡는지를 첫 화면에서 보여 줍니다.
 * 지금은 단체 사진(b)만 씁니다. 대표변호사 안(a)은 단체 사진이 없을 때만 (html[data-hero-pick], globals.css .hero-pick-*).
 *  a 대표변호사 한 명(배경 지운 사진) + 왼쪽에 글
 *  b 구성원 단체 사진을 화면 가득, 글은 사진 아래쪽에 꼭 필요한 것만
 * 산 그림은 쓰지 않습니다.
 */
const PERSON = "/images/team/hero-kim-hansol.webp"

function Buttons({ L }: { L: ReturnType<typeof centerText> }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <a href="#consult" className="rounded-full bg-white px-6 py-3 text-[0.9375rem] font-semibold text-jisan-navy hover:bg-white/90">
        {L.consult}
      </a>
      <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[0.9375rem] font-semibold tabular-nums hover:bg-white/10">
        <Phone className="h-4 w-4" /> {siteConfig.phone}
      </a>
      <a
        href={siteConfig.kakaoTalkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-3 text-[0.9375rem] font-semibold text-[#191919]"
      >
        <MessageCircle className="h-4 w-4" /> 카카오톡
      </a>
    </div>
  )
}

/**
 * 제목: 여러 문구 가운데 하나만 보임 (html[data-hero-line], globals.css .hero-line).
 * 기본 문구만 h1 이고 나머지는 같은 모양의 문단입니다.
 */
function Headline({ lines, className }: { lines: string[]; className: string }) {
  return (
    <>
      {lines.map((text, i) =>
        i === 0 ? (
          <h1 key={i} data-i={i} className={`hero-line ${className}`}>
            {text}
          </h1>
        ) : (
          <p key={i} data-i={i} role="heading" aria-level={1} className={`hero-line ${className}`}>
            {text}
          </p>
        ),
      )}
    </>
  )
}

/** 상담 전화는 24시간 받으므로 늘 켜 둠 */
function OpenNow({ short = false }: { short?: boolean }) {
  return (
    <p className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-white/75">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34D399]" />
      </span>
      {short ? "지금 전화 상담 가능" : "지금 전화 상담 가능 · 밤과 주말에도 받습니다"}
    </p>
  )
}

export function LeadHero({ center }: { center: Center }) {
  const L = centerText(center.lang)
  const lead = getLawyer(prosecutor.slug)!
  const group = siteConfig.photos.team
  const who = `${lead.name} ${lead.title.replace(/\s/g, "")}`
  // 제목 문구 후보 (없으면 센터 제목 한 가지)
  const lines = (heroLines[center.slug] ?? [center.hero.title.replace(/\n/g, " ")]).slice(0, 8)
  return (
    <section className="relative overflow-hidden bg-jisan-navy text-white">
      {/* 첫 그림이 그려지기 전에 둘 중 하나를 고름 (깜빡임 방지). 페이지 안 이동 때는 HeroPick 이 정함 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `var HERO_PICK='${siteConfig.photos.team ? "b" : "a"}';try{var d=document.documentElement;d.setAttribute('data-hero-pick',HERO_PICK);d.setAttribute('data-hero-line',Math.floor(Math.random()*${lines.length}))}catch(e){}`,
        }}
      />
      <HeroPick lines={lines.length} />

      {/* ── a: 대표변호사 한 명 ── */}
      <div className={group ? "hero-pick-a" : undefined}>
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute right-0 top-0 h-full w-[55%] bg-[radial-gradient(60%_70%_at_62%_45%,rgb(255_255_255/0.10),transparent_70%)]" />
          <div className="relative mx-auto h-full max-w-7xl">
            <Image src={PERSON} alt="" width={900} height={1167} priority sizes="34rem" className="hero-person anim-person-in absolute bottom-0 right-[5%] h-[96%] w-auto" />
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-12 md:px-12 md:pb-20 md:pt-20 lg:min-h-[36rem] lg:px-20">
          <div className="anim-rise max-w-[35rem]" style={{ animationDelay: "0.15s" }}>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{center.name}</span>
            <p className="mt-5 border-l-2 border-white/60 pl-3 text-[0.875rem] leading-snug text-white/85 md:text-[0.9375rem]">
              <b className="font-bold text-white">{who}</b>
              <br />
              {prosecutor.tag}
            </p>
            <Headline lines={lines} className="mt-5 text-balance text-[2rem] font-extrabold leading-[1.25] tracking-tight md:text-[2.875rem] md:leading-[1.2]" />
            <p className="mt-5 text-base leading-relaxed text-white/75 md:text-[1.0625rem]">{center.hero.sub}</p>
            <div className="mt-8">
              <Buttons L={L} />
            </div>
            <div className="mt-4">
              <OpenNow />
            </div>
          </div>
        </div>
        {/* 좁은 화면: 글 아래에 사진 */}
        <div aria-hidden className="relative -mt-2 flex justify-center lg:hidden">
          <Image src={PERSON} alt="" width={900} height={1167} sizes="70vw" className="hero-person h-[19rem] w-auto" />
        </div>
      </div>

      {/* ── b: 단체 사진을 화면 가득. 글은 아래쪽에 이름·제목 한 줄·버튼만 ── */}
      {group && (
        <div className="hero-pick-b relative">
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:h-[40rem]">
            {/* 화면이 사진보다 넓으면 양옆은 촬영 배경과 같은 회색으로 채우고(사진 가장자리는 흐려서 잇기), 사람은 잘리지 않게 전부 보여 줌 */}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#c6c7cc_0%,#d3d4d9_30%,#dcdbe0_70%,#dddce1_100%)]" />
            <div className="team-edge-fade absolute inset-0 overflow-hidden lg:inset-x-auto lg:left-1/2 lg:aspect-[16/9] lg:h-full lg:-translate-x-1/2">
              {/* 사진이 아주 천천히 다가옴 ('동작 줄이기' 설정이면 멈춤) */}
              <div className="anim-team-zoom absolute inset-0">
                <Image src={group} alt={`${siteConfig.name} 변호사들`} fill sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover object-top" />
              </div>
            </div>
            <div aria-hidden className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-jisan-navy/60 to-transparent" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-jisan-navy from-15% via-jisan-navy/75 via-50% to-transparent" />
          </div>
          <div className="relative -mt-14 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 pb-10 md:px-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-20 lg:pb-12">
              <div className="anim-rise min-w-0" style={{ animationDelay: "0.35s" }}>
                <p className="text-[0.8125rem] font-semibold text-white/80 md:text-[0.875rem]">
                  {siteConfig.shortName} {center.name} <span aria-hidden className="mx-1.5 opacity-50">|</span> {who} {prosecutor.tag}
                </p>
                <Headline lines={lines} className="mt-2 text-balance text-[1.75rem] font-extrabold leading-[1.25] tracking-tight md:text-[2.5rem]" />
              </div>
              <div className="anim-rise flex shrink-0 flex-col gap-3 lg:items-end" style={{ animationDelay: "0.6s" }}>
                <Buttons L={L} />
                <OpenNow short />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
