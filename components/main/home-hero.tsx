"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { ConsultForm, presetConsult } from "@/components/consult-form"

type Situation = { label: string; target: string } & ({ center: string } | { caseType: string })

/** 의뢰인의 말로 적은 상황 → 센터 사이트로 이동하거나, 센터가 없는 분야는 상담 폼 사건 유형을 미리 선택 */
const situations: Situation[] = [
  { label: "경찰 출석 요구를 받았어요", target: "형사센터", center: "crime" },
  { label: "가족이 체포·구속됐어요", target: "형사센터", center: "crime" },
  { label: "성범죄 혐의로 조사를 받아요", target: "성범죄센터", center: "sex-crime" },
  { label: "마약 사건에 연루됐어요", target: "형사센터", center: "crime" },
  { label: "투자 사기를 당했어요", target: "형사센터", center: "crime" },
  { label: "이혼을 준비하고 있어요", target: "가사 상담", caseType: "가사" },
  { label: "상간 소장을 받았어요", target: "가사 상담", caseType: "가사" },
  { label: "회사 법률 자문이 필요해요", target: "기업 상담", caseType: "기업" },
]

const chipClass =
  "group flex items-center justify-between gap-3 rounded-lg border border-[#E2E6ED] bg-white px-4 py-3.5 text-left text-[15px] font-semibold text-jisan-ink transition-colors hover:border-jisan-blue"

export function HomeHero() {
  const onPreset = (caseType: string) => {
    presetConsult(caseType)
    document.getElementById("hero-consult")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <section className="bg-jisan-ivory border-b border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_0.9fr] gap-12 lg:gap-16 px-6 md:px-12 lg:px-20 pt-14 pb-14 md:pt-20 md:pb-20">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.16em] text-jisan-gold mb-4">
            {siteConfig.incorporated ? "2026 · 법무법인 출범" : "서초 · 형사 · 기업 · 가사"}
          </p>
          <h1 className="font-serif text-[2.5rem] leading-[1.2] md:text-[3.25rem] xl:text-6xl md:leading-[1.15] font-semibold tracking-tight text-jisan-ink text-balance">
            사건마다,
            <br />
            변호사가 직접 맡습니다.
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-[17px] leading-relaxed text-jisan-ink/70">
            {siteConfig.incorporated
              ? "법률사무소 지산이 법무법인 지산앤파트너스로 새롭게 출범했습니다. 형사·기업·가사 사건을 변호사들이 처음부터 끝까지 직접 맡습니다."
              : "형사 사건을 중심으로 기업·민사·가사 사건까지, 변호사들이 상담부터 재판까지 처음부터 끝까지 직접 맡습니다."}
          </p>

          <h2 className="mt-10 mb-4 text-lg font-bold text-jisan-ink">지금 어떤 상황이신가요?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {situations.map((s) =>
              "center" in s ? (
                <Link key={s.label} href={`/${s.center}`} className={chipClass}>
                  {s.label}
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-jisan-blue">
                    {s.target} <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ) : (
                <button key={s.label} type="button" onClick={() => onPreset(s.caseType)} className={chipClass}>
                  {s.label}
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-jisan-blue">
                    {s.target} <ArrowRight className="h-3 w-3" />
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        <div id="hero-consult" className="min-w-0 lg:pt-6 scroll-mt-24">
          <div className="rounded-xl border border-[#E2E6ED] bg-white p-6 md:p-7 shadow-[0_8px_30px_rgba(20,30,60,0.06)]">
            <h2 className="text-lg font-bold text-jisan-ink">빠른 상담 신청</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">담당 변호사가 직접 연락드립니다.</p>
            <ConsultForm idPrefix="hero" compact source="메인 첫 화면" />
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-white">
        <dl className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 md:divide-x divide-border px-6 md:px-0">
          {[
            ["상담", "365일 24시간 전화 · 카카오톡"],
            ["위치", siteConfig.addressShort.replace("서울시 ", "")],
            ["진행", "접수 → 담당 변호사 배정 → 1:1 상담"],
          ].map(([k, v]) => (
            <div key={k} className="py-4 md:py-5 md:px-12 lg:px-20 border-b md:border-b-0 border-border last:border-b-0">
              <dt className="text-[11px] tracking-[0.14em] text-muted-foreground">{k}</dt>
              <dd className="text-[15px] text-jisan-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
