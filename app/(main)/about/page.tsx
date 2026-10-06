import type { Metadata } from "next"
import Link from "next/link"
import { officeAddress, openOffices, siteConfig } from "@/lib/site-config"
import { lawyers } from "@/lib/lawyers"
import { SectionHead } from "@/components/main/section-head"

export const metadata: Metadata = {
  title: "법인 소개",
  description: `${siteConfig.name} 소개. 변호사 ${lawyers.length}명이 형사·가사·기업·민사 사건을 맡습니다.`,
  alternates: { canonical: "/about" },
}

const principles: [string, string][] = [
  ["그 일을 해 본 변호사가 맡습니다", "분야마다 담당 변호사가 정해져 있습니다. 사건이 들어오면 그 분야를 맡아 온 변호사가 상담부터 직접 합니다."],
  [
    "할 수 있는 일부터 말씀드립니다",
    "가능성이 낮은 사건에 근거 없는 기대를 드리지 않습니다. 할 수 있는 일과 어려운 일을 먼저 말씀드리고, 선임 여부는 그다음에 정하시면 됩니다.",
  ],
  ["여러 분야가 얽히면 함께 봅니다", "형사 고소와 민사 소송이 함께 걸린 사건처럼 여러 분야가 얽히면 담당 변호사들이 같이 봅니다."],
  ["밤과 주말에도 전화를 받습니다", "급한 일은 시간을 가리지 않습니다. 상담 전화는 24시간, 주말과 공휴일에도 받습니다."],
]

export default function AboutPage() {
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12">
        <div className="min-w-0">
          <SectionHead title="법인 소개" as="h1" />
          <p className="text-2xl md:text-[1.75rem] font-bold leading-snug tracking-[-0.03em] text-jisan-ink">
            안녕하세요.
            <br />
            {siteConfig.name}입니다.
          </p>
          <div className="mt-6 max-w-2xl space-y-5 text-[17px] leading-[1.85] text-[#2D323A]">
            <p>
              {siteConfig.nameTopic} 변호사 {lawyers.length}명이 형사, 가사, 기업, 민사 사건을 맡고 있는 사무소입니다.
            </p>
            <p>
              저희 변호사들은 일해 온 곳이 서로 다릅니다. 검찰청에서 검사로 수사와 공판을 맡았던 변호사, 은행·증권사와 벤처캐피탈에서
              일한 변호사, 로펌 파트너로 기업 자문을 해 온 변호사, 병원과 의료단체의 자문을 맡아 온 변호사가 한 사무실에서 일합니다.
            </p>
            <p>
              변호사에게는 매주 만나는 일이어도, 의뢰인에게는 대부분 처음 겪는 일입니다. 그래서 상담에서는 법률 용어보다 지금 무엇을
              해야 하는지부터 말씀드립니다.
            </p>
            <p>지산은 ‘지혜의 산’이라는 뜻입니다.</p>
          </div>

          <h2 className="mt-14 text-xl font-bold tracking-[-0.02em] text-jisan-ink">저희가 일하는 방식</h2>
          <dl className="mt-4 max-w-2xl border-t border-jisan-ink">
            {principles.map(([title, body]) => (
              <div key={title} className="border-b border-[#E4E6E9] py-5">
                <dt className="text-[17px] font-bold text-jisan-ink">{title}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-[#4A505A]">{body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[15px] text-[#4A505A]">{siteConfig.name} 변호사 일동</p>
        </div>
        <aside className="min-w-0">
          <SectionHead title="구성원" href="/lawyers" linkLabel="프로필 보기" />
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
            {openOffices.map((o) => (
              <span key={o.name} className="block">
                <b className="font-semibold text-jisan-ink">{o.name}</b> {officeAddress(o)}
              </span>
            ))}
            전화 {siteConfig.phone} · 24시간, 주말·공휴일 포함
          </p>
        </aside>
      </div>
    </div>
  )
}
