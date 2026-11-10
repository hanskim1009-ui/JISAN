import Image from "next/image"
import Link from "next/link"
import type { Center } from "@/lib/centers"
import { centerBase } from "@/lib/centers"
import { getLawyer, lawyers } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { prosecutor } from "@/lib/prosecutor"

/**
 * 형사 계열 센터: 대표변호사가 검사로 무슨 일을 했고, 그 경험으로 지금 무엇을 하는지.
 * 내용은 lib/prosecutor.ts (본인 이력 자료). 경력 사실만 적고 '전관'·영향력·결과 예측 표현은 쓰지 않습니다.
 */
export function ProsecutorSection({ center, bg }: { center: Center; bg: string }) {
  const l = getLawyer(prosecutor.slug)!
  const base = centerBase(center)
  const th = "py-2.5 pr-4 text-left text-xs font-medium text-[#8A9099]"
  return (
    <section id="prosecutor" className={`scroll-mt-20 px-6 py-14 md:px-12 md:py-20 lg:px-20 ${bg}`}>
      <div data-reveal className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
          {/* 사진과 한마디 */}
          <div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#C9CCD1] lg:aspect-[4/5]">
              <Image src="/images/lawyers/kim-hansol-desk.jpg" alt={`${l.name} ${l.title}`} fill sizes="(min-width: 1024px) 20rem, 100vw" className="object-cover object-top" />
            </div>
            <p className="mt-4 text-lg font-bold text-jisan-ink">
              {l.name} <span className="text-sm font-medium text-jisan-ink/60">{l.title}</span>
            </p>
            <p className="mt-1 text-[0.875rem] leading-relaxed text-jisan-ink/70">
              검사 재직 {prosecutor.period}
              <br />
              수원지검 안산지청 · 인천지검 · 대전지검 홍성지청
            </p>
            <Link href={`${base}/lawyers/${l.slug}`} className="mt-3 inline-block text-sm font-semibold text-jisan-blue">
              프로필 보기&nbsp;→
            </Link>
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-jisan-ink md:text-[2rem]">
              수사와 재판을
              <br className="sm:hidden" /> 검사석에서 먼저 해 봤습니다
            </h2>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-[1.85] text-[#2D323A]">
              {l.name} 변호사는 {prosecutor.years}년 동안 검사로 일했습니다. {prosecutor.focus[center.slug]} 기록이 어떤 순서로 읽히고 처분이 어디에서 갈리는지를 그 자리에서
              보았고, 지금은 같은 과정을 의뢰인 쪽에서 준비합니다.
            </p>

            {/* 검사로 한 일 → 지금 변호인으로 하는 일 */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-t-2 border-jisan-ink text-[0.9375rem]">
                <thead>
                  <tr className="border-b border-[#E4E6E9]">
                    <th className={`${th} w-24`}>단계</th>
                    <th className={th}>검사로 한 일</th>
                    <th className={th}>지금 변호인으로 하는 일</th>
                  </tr>
                </thead>
                <tbody>
                  {prosecutor.bridge.map((b) => (
                    <tr key={b.stage} className="border-b border-[#E4E6E9] align-top">
                      <td className="py-3.5 pr-4 font-bold text-jisan-ink">{b.stage}</td>
                      <td className="py-3.5 pr-4 leading-relaxed text-[#4A505A]">{b.then}</td>
                      <td className="py-3.5 leading-relaxed text-jisan-ink">{b.now}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 근무지와 맡은 일, 수상: 눌러서 펼침 */}
            <details className="group mt-6 border-b border-[#E4E6E9]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-[0.9375rem] font-bold text-jisan-ink [&::-webkit-details-marker]:hidden">
                근무지 {prosecutor.posts.length}곳과 재직 중 받은 평가 {prosecutor.awards.length}건
                <span aria-hidden className="text-jisan-ink/50 transition-transform group-open:rotate-45">＋</span>
              </summary>
            <div className="grid grid-cols-1 gap-10 pb-6 pt-2 xl:grid-cols-[1.25fr_1fr]">
              <div>
                <h3 className="text-[0.9375rem] font-bold text-jisan-ink">근무지와 맡은 일</h3>
                <ul className="mt-3 border-t border-jisan-ink text-[0.875rem]">
                  {prosecutor.posts.map((p) => (
                    <li key={p.period} className="grid grid-cols-[8.5rem_1fr] gap-x-3 border-b border-[#E4E6E9] py-2.5">
                      <span className="tabular-nums text-[#8A9099]">{p.period}</span>
                      <span className="text-jisan-ink">
                        {p.office} {p.dept}
                        {p.work && <span className="block text-[#4A505A]">{p.work}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[0.9375rem] font-bold text-jisan-ink">재직 중 받은 평가</h3>
                <ul className="mt-3 border-t border-jisan-ink text-[0.875rem]">
                  {prosecutor.awards.map((a) => (
                    <li key={a.date} className="grid grid-cols-[5rem_1fr] gap-x-3 border-b border-[#E4E6E9] py-2.5">
                      <span className="tabular-nums text-[#8A9099]">{a.date}</span>
                      <span className="leading-relaxed text-jisan-ink">{a.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </details>

            <p className="mt-8 max-w-2xl text-[0.9375rem] leading-relaxed text-[#4A505A]">
              결과를 약속하지는 않습니다. 대신 지금 단계에서 할 수 있는 일과 어려운 일을 먼저 말씀드리고, 상담한 변호사가 조사와 재판에 직접 들어갑니다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
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
