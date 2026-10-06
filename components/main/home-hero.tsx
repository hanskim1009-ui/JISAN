"use client"

import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { fields } from "@/lib/practice"
import { presetConsult } from "@/components/consult-form"

const itemClass =
  "block w-full border-b border-[#E4E6E9] py-2 text-left text-[15px] text-jisan-ink hover:text-jisan-logo"

/**
 * 첫 화면: 법인 전체를 말하는 한 문장 + 분야별 상황 고르기(같은 무게의 네 열)
 * 단체 사진(siteConfig.photos.team)이 있으면 오른쪽에 놓고, 없으면 글만으로 넓게 배치합니다.
 */
export function HomeHero() {
  const photo = siteConfig.photos.team
  const preset = (caseType: string) => {
    presetConsult(caseType)
    document.getElementById("consult")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <section className="border-b border-[#E4E6E9] px-5 md:px-12 lg:px-14">
      <div className={`max-w-7xl mx-auto grid gap-10 ${photo ? "lg:grid-cols-[7fr_4fr]" : ""}`}>
        <div className="min-w-0 pt-12 pb-10 md:pt-16 md:pb-14">
          <h1 className="text-[2rem] leading-[1.3] md:text-[2.75rem] md:leading-[1.28] font-bold tracking-[-0.035em] text-jisan-ink text-balance">
            사건마다,
            <br />그 일을 해 본 변호사가 맡습니다.
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-[17px] leading-[1.8] text-[#4A505A]">
            검찰청, 금융회사·벤처캐피탈, 로펌, 의료기관 자문에서 일한 변호사들이 서초동 한 사무실에 있습니다.
            상담 전화는 밤과 주말에도 변호사가 받습니다.
          </p>

          <h2 className="mt-10 mb-3 text-[15px] font-bold text-jisan-ink">어떤 일로 찾아오셨나요?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 border-t border-jisan-ink pt-3">
            {fields.map((f) => (
              <div key={f.name} className="min-w-0">
                <p className="mb-1 text-[13px] font-bold text-jisan-logo">{f.name}</p>
                {f.situations.map((s) =>
                  s.center ? (
                    <Link key={s.label} href={`/${s.center}`} className={itemClass}>
                      {s.label}
                    </Link>
                  ) : (
                    <button key={s.label} type="button" onClick={() => preset(s.caseType ?? f.caseType)} className={itemClass}>
                      {s.label}
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
        {photo && (
          <div className="relative min-h-[320px] lg:min-h-0 lg:my-12">
            <Image src={photo} alt={`${siteConfig.name} 구성원`} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 36vw" />
          </div>
        )}
      </div>
    </section>
  )
}
