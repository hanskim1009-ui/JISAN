import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { lawyers } from "@/lib/lawyers"
import { SectionHead } from "@/components/main/section-head"

export const metadata: Metadata = {
  title: "법인 소개",
  description: `${siteConfig.name} 소개. 서울 서초동, 변호사 ${lawyers.length}명이 형사·가사·기업·민사 사건을 맡습니다.`,
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12">
        <div className="min-w-0">
          <SectionHead title="법인 소개" as="h1" />
          <div className="max-w-2xl space-y-5 text-[17px] leading-[1.85] text-[#2D323A]">
            <p>
              {siteConfig.nameTopic} 서울 서초동에 있는 변호사 {lawyers.length}명의 사무실입니다. 형사, 가사, 기업, 민사 사건을 맡습니다.
            </p>
            <p>
              변호사들이 일해 온 곳은 서로 다릅니다. 검찰청에서 수사와 공판을 맡았던 변호사, 금융회사와 벤처캐피탈에서 준법감시와
              투자 업무를 한 변호사, 로펌 파트너로 기업 자문을 해 온 변호사, 의료기관 자문을 맡아 온 변호사가 있습니다. 사건이
              들어오면 그 일을 해 본 변호사가 맡습니다.
            </p>
            <p>형사 고소와 민사 소송이 함께 걸린 사건처럼 여러 분야가 얽히면 담당 변호사들이 함께 봅니다.</p>
            <p>
              상담 전화는 밤과 주말에도 변호사가 받습니다. 상담했다고 선임을 권하지 않습니다. 할 수 있는 일과 없는 일을 먼저
              말씀드립니다.
            </p>
          </div>
        </div>
        <aside className="min-w-0">
          <SectionHead title="구성원" href="/lawyers" linkLabel="자세히" />
          <ul className="text-[15px]">
            {lawyers.map((l) => (
              <li key={l.slug} className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#E4E6E9] py-2.5">
                <Link href={`/lawyers#${l.slug}`} className="font-semibold text-jisan-ink hover:underline underline-offset-4">
                  {l.name} <span className="font-normal text-[#8A9099]">{l.title}</span>
                </Link>
                <span className="text-[#4A505A]">{l.field}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] text-[#4A505A]">
            {siteConfig.address}
            <br />
            {siteConfig.phone} · 24시간
          </p>
        </aside>
      </div>
    </div>
  )
}
