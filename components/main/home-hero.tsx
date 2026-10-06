import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { fields } from "@/lib/practice"
import { lawyers } from "@/lib/lawyers"
import { LogoSvg } from "@/components/brand-logo"

const itemClass = "block border-b border-white/20 py-2 text-[15px] text-white/90 hover:text-white"

/**
 * 첫 화면: 남색 바탕 전체 + 오른쪽에 크게 키운 로고 + 명조 제목 + 분야별 상황(같은 무게의 네 열)
 * 단체 사진(siteConfig.photos.team)이 생기면 큰 로고 대신 오른쪽에 사진을 놓습니다.
 */
export function HomeHero() {
  const photo = siteConfig.photos.team

  return (
    <section className="relative overflow-hidden bg-brand text-white px-5 md:px-12 lg:px-14">
      {!photo && (
        <LogoSvg
          variant="tone"
          className="pointer-events-none absolute -right-24 top-10 h-[28rem] w-auto text-brand-tone sm:-right-16 md:h-[40rem] lg:right-[-2rem] lg:top-6 lg:h-[46rem]"
        />
      )}
      <div className={`relative max-w-7xl mx-auto grid gap-10 ${photo ? "lg:grid-cols-[7fr_4fr]" : ""}`}>
        <div className="min-w-0 pt-12 pb-12 md:pt-20 md:pb-16">
          <p className="text-sm text-white/65">서울 서초동 · 형사 · 가사 · 기업 · 민사</p>
          <h1 className="mt-4 font-display text-[2.25rem] leading-[1.3] md:text-[3.25rem] md:leading-[1.28] font-light tracking-[-0.03em]">
            형사부터 기업 자문까지,
            <br />
            서초동 {siteConfig.name}
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-[17px] leading-[1.8] text-white/75">
            검사, 벤처캐피탈 준법감시인, 로펌 파트너, 의료기관 자문 변호사를 지낸 변호사 {lawyers.length}명이 형사·가사·기업·민사
            사건을 맡습니다. 상담 전화는 24시간, 주말·공휴일에도 받습니다.
          </p>

          <h2 className="mt-12 mb-3 text-[15px] font-bold">어떤 일로 찾아오셨나요?</h2>
          <div className="grid max-w-5xl grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7">
            {fields.map((f) => (
              <div key={f.name} className="min-w-0">
                <p className="mb-1 text-[13px] font-bold text-white">{f.name}</p>
                {f.situations.map((s) => (
                  <Link
                    key={s.label}
                    href={s.center ? `/${s.center}` : `/consult?type=${encodeURIComponent(s.caseType ?? f.caseType)}`}
                    className={itemClass}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        {photo && (
          <div className="relative min-h-[320px] lg:min-h-0 lg:my-14">
            <Image src={photo} alt={`${siteConfig.name} 구성원`} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 36vw" />
          </div>
        )}
      </div>
    </section>
  )
}
