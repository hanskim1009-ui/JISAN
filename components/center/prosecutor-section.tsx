import Image from "next/image"
import { Nanum_Pen_Script } from "next/font/google"
import Link from "next/link"
import type { Center } from "@/lib/centers"
import { centerBase } from "@/lib/centers"
import { getLawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import type { LeadLawyer } from "@/lib/lead-lawyers"
import { centerTones } from "@/components/center/tone"

/** 본인이 쓴 글은 손글씨로 (메인 인사말과 같은 글꼴) */
const pen = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], display: "swap", preload: false })

/**
 * 센터 앞 변호사 구역: 사진과 이름표, 본인 이름으로 나가는 글(손글씨), 평가·활동 목록, 상담 단추.
 * 내용은 lib/lead-lawyers.ts. 경력 사실만 적고 '전관'·영향력·결과 예측 표현은 쓰지 않습니다.
 */
export function LeadSection({ center, lead, bg }: { center: Center; lead: LeadLawyer; bg: string }) {
  const l = getLawyer(lead.slug)!
  const t = centerTones[center.tone]
  const base = centerBase(center)
  return (
    <section id="lead" className={`scroll-mt-20 px-6 py-14 md:px-12 md:py-20 lg:px-20 ${bg}`}>
      <div data-reveal className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
          {/* 사진과 한마디 */}
          <div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#C9CCD1] lg:aspect-[4/5]">
              <Image src={lead.photo} alt={`${l.name} ${l.title}`} fill sizes="(min-width: 1024px) 20rem, 100vw" className="object-cover object-top" />
            </div>
            <p className="mt-4 text-lg font-bold text-jisan-ink">{lead.caption.name}</p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-jisan-ink/75">
              {lead.caption.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <Link href={`${base}/lawyers/${l.slug}${lead.profileAnchor ? `#${lead.profileAnchor}` : ""}`} className="mt-2 inline-block text-sm font-semibold text-jisan-blue">
              {lead.profileLabel}&nbsp;→
            </Link>
          </div>

          <div className="min-w-0">
            {/* 보이는 제목은 두지 않음 (화면 읽기 프로그램용 제목만) */}
            <h2 className="sr-only">{lead.caption.name}</h2>
            <div className={`${pen.className} max-w-2xl space-y-5 whitespace-pre-line text-[1.625rem] leading-[1.6] text-jisan-ink md:text-[2rem] md:leading-[1.55]`}>
              {lead.letter.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            {/* 평가·활동 (근무한 곳 같은 자세한 이력은 상세 프로필에 있음) */}
            {lead.list && (
              <>
                <h3 className="mt-10 text-[0.9375rem] font-bold text-jisan-ink">{lead.list.title}</h3>
                <ul className="mt-3 max-w-2xl border-t border-jisan-ink text-[0.9375rem]">
                  {lead.list.items.map((item) => (
                    <li key={item} className="border-b border-[#E4E6E9] py-2.5 leading-relaxed text-jisan-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-8 flex flex-wrap gap-2.5">
              <a href="#consult" className={`rounded-full px-6 py-3 text-[0.9375rem] font-semibold hover:opacity-90 ${t.band}`}>
                {l.name} 변호사에게 상담
              </a>
              <a href={siteConfig.phoneHref} className="rounded-full border border-jisan-ink/30 px-6 py-3 text-[0.9375rem] font-semibold tabular-nums text-jisan-ink hover:border-jisan-ink">
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/** 변호사 구역 머리의 단체 사진: 사건은 여럿이 봅니다 */
export function TeamFigure({ text }: { text: string }) {
  if (!siteConfig.photos.team) return null
  return (
    <>
          <figure className="mb-12 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
            <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-[#DADBDD]">
              <Image src={siteConfig.photos.team} alt={`${siteConfig.name} 변호사들`} fill sizes="(min-width: 1024px) 44rem, 100vw" className="object-cover object-[center_22%]" />
            </div>
            <figcaption>
              <p className="text-xl font-bold leading-snug tracking-tight text-jisan-ink">사건은 혼자 보지 않습니다</p>
              <p className="mt-3 text-[0.9375rem] leading-[1.8] text-[#4A505A]">
                {text}
              </p>
            </figcaption>
          </figure>
    </>
  )
}
