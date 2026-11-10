import Image from "next/image"
import { MessageCircle, Phone } from "lucide-react"
import type { Center } from "@/lib/centers"
import { siteConfig } from "@/lib/site-config"
import { getLawyer } from "@/lib/lawyers"
import { prosecutor } from "@/lib/prosecutor"
import { centerText } from "@/lib/center-i18n"
import { HeroPick } from "@/components/center/hero-pick"

/**
 * 형사 계열 센터 첫 화면: 누가 맡는지를 첫 화면에서 보여 줍니다.
 * 두 가지가 들어올 때마다 무작위로 번갈아 나옵니다 (html[data-hero-pick], globals.css .hero-pick-*).
 *  a 대표변호사 한 명(배경 지운 사진)  b 구성원 단체 사진
 * 산 그림은 쓰지 않습니다.
 */
const PERSON = "/images/team/hero-kim-hansol.webp"

export function LeadHero({ center }: { center: Center }) {
  const L = centerText(center.lang)
  const lead = getLawyer(prosecutor.slug)!
  const group = siteConfig.photos.team
  return (
    <section className="relative overflow-hidden bg-jisan-navy text-white">
      {/* 첫 그림이 그려지기 전에 둘 중 하나를 고름 (깜빡임 방지). 페이지 안 이동 때는 HeroPick 이 정함 */}
      <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.setAttribute('data-hero-pick',Math.random()<0.5?'a':'b')}catch(e){}` }} />
      <HeroPick />

      {/* b: 단체 사진 (넓은 화면은 오른쪽, 왼쪽으로 갈수록 남색에 스며듦) */}
      {group && (
        <div aria-hidden className="hero-pick-b absolute inset-y-0 right-0 hidden w-[60%] lg:block">
          <Image src={group} alt="" fill priority sizes="60vw" className="object-cover object-[center_20%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-jisan-navy via-jisan-navy/55 via-30% to-transparent to-60%" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-jisan-navy/80 to-transparent" />
        </div>
      )}
      {/* a: 대표변호사 한 명 */}
      <div aria-hidden className="hero-pick-a pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute right-0 top-0 h-full w-[55%] bg-[radial-gradient(60%_70%_at_62%_45%,rgb(255_255_255/0.10),transparent_70%)]" />
        <div className="relative mx-auto h-full max-w-7xl">
          <Image src={PERSON} alt="" width={900} height={1167} priority sizes="34rem" className="hero-person absolute bottom-0 right-[5%] h-[96%] w-auto" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-12 md:px-12 md:pb-20 md:pt-20 lg:min-h-[36rem] lg:px-20">
        <div className="max-w-[35rem]">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{center.name}</span>
          <p className="mt-5 border-l-2 border-white/60 pl-3 text-[0.875rem] leading-snug text-white/85 md:text-[0.9375rem]">
            <b className="font-bold text-white">
              {lead.name} {lead.title.replace(/\s/g, "")}
            </b>
            <br />
            {prosecutor.tag}
          </p>
          <h1 className="mt-5 whitespace-pre-line text-balance text-[2rem] font-extrabold leading-[1.25] tracking-tight md:text-[2.875rem] md:leading-[1.2]">{center.hero.title}</h1>
          <p className="mt-5 text-base leading-relaxed text-white/75 md:text-[1.0625rem]">{center.hero.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
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
          {/* 상담 전화는 24시간 받으므로 늘 켜 둠 */}
          <p className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-white/75">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34D399]" />
            </span>
            지금 전화 상담 가능 · 밤과 주말에도 받습니다
          </p>
        </div>
      </div>

      {/* 좁은 화면: 글 아래에 사진 */}
      <div aria-hidden className="hero-pick-a relative -mt-2 flex justify-center lg:hidden">
        <Image src={PERSON} alt="" width={900} height={1167} sizes="70vw" className="hero-person h-[19rem] w-auto" />
      </div>
      {group && (
        <div aria-hidden className="hero-pick-b relative aspect-[16/9] lg:hidden">
          <Image src={group} alt="" fill sizes="100vw" className="object-cover object-[center_20%]" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-jisan-navy to-transparent" />
        </div>
      )}
    </section>
  )
}
