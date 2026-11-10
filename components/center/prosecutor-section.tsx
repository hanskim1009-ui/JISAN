import Image from "next/image"
import { Nanum_Pen_Script } from "next/font/google"
import Link from "next/link"
import type { Center } from "@/lib/centers"
import { centerBase } from "@/lib/centers"
import { getLawyer, lawyers } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { prosecutor } from "@/lib/prosecutor"

/** 본인이 쓴 글은 손글씨로 (메인 인사말과 같은 글꼴) */
const pen = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], display: "swap", preload: false })

/**
 * 형사 계열 센터: 대표변호사가 본인 이름으로 쓰는 검사 경력 소개 + 근무한 곳.
 * 글과 표는 lib/prosecutor.ts (본인 이력 자료). 경력 사실만 적고 '전관'·영향력·결과 예측 표현은 쓰지 않습니다.
 */
export function ProsecutorSection({ center, bg }: { center: Center; bg: string }) {
  const l = getLawyer(prosecutor.slug)!
  const base = centerBase(center)
  return (
    <section id="prosecutor" className={`scroll-mt-20 px-6 py-14 md:px-12 md:py-20 lg:px-20 ${bg}`}>
      <div data-reveal className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
          {/* 사진과 한마디 */}
          <div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#C9CCD1] lg:aspect-[4/5]">
              <Image src="/images/lawyers/kim-hansol-desk.jpg" alt={`${l.name} ${l.title}`} fill sizes="(min-width: 1024px) 20rem, 100vw" className="object-cover object-top" />
            </div>
            <p className="mt-4 text-lg font-bold text-jisan-ink">{prosecutor.caption.name}</p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-jisan-ink/75">
              {prosecutor.caption.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <Link href={`${base}/lawyers/${l.slug}#prosecutor`} className="mt-2 inline-block text-sm font-semibold text-jisan-blue">
              근무한 곳과 프로필 보기&nbsp;→
            </Link>
          </div>

          <div className="min-w-0">
            {/* 보이는 제목은 두지 않음 (화면 읽기 프로그램용 제목만) */}
            <h2 className="sr-only">{prosecutor.caption.name}</h2>
            <div className={`${pen.className} max-w-2xl space-y-5 whitespace-pre-line text-[1.625rem] leading-[1.6] text-jisan-ink md:text-[2rem] md:leading-[1.55]`}>
              {prosecutor.letter.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            {/* 재직 중 받은 평가 (근무한 곳 목록은 상세 프로필에 있음) */}
            <h3 className="mt-10 text-[0.9375rem] font-bold text-jisan-ink">검사 재직 중 받은 평가</h3>
            <ul className="mt-3 max-w-2xl border-t border-jisan-ink text-[0.9375rem]">
              {prosecutor.awards.map((a) => (
                <li key={a.text} className="border-b border-[#E4E6E9] py-2.5 leading-relaxed text-jisan-ink">
                  {a.text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <a href="#consult" className="rounded-full bg-jisan-navy px-6 py-3 text-[0.9375rem] font-semibold text-white hover:bg-jisan-navy/90">
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
export function TeamFigure() {
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
                형사 사건에 돈 문제, 회사 문제, 가족 문제가 함께 걸려 있으면 그 분야를 맡아 온 변호사가 같이 봅니다. 금융회사와 기업 자문, 의료, 부동산, 가사를 맡는 변호사
                {lawyers.length}명이 한 사무실에서 일합니다.
              </p>
            </figcaption>
          </figure>
    </>
  )
}
