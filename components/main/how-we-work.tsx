import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { SectionHead } from "@/components/main/section-head"

const steps = [
  {
    title: "연락",
    body: `전화(${siteConfig.phone}), 카카오톡, 상담 신청 중 편한 방법으로 연락하세요. 전화는 24시간, 주말·공휴일에도 받습니다.`,
  },
  { title: "변호사가 직접", body: "그 분야 담당 변호사가 사정을 직접 듣습니다. 밤과 주말에도 같습니다." },
  { title: "할 수 있는 일부터", body: "할 수 있는 일과 없는 일을 먼저 말씀드립니다. 서류가 있다면 함께 봅니다." },
  { title: "선임은 그다음", body: "선임 여부는 상담을 마친 뒤 정하시면 됩니다. 상담했다고 선임을 권하지 않습니다." },
]

/** 상담이 어떻게 진행되는지 네 단계 */
export function HowWeWork() {
  return (
    <section className="px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="상담은 이렇게 진행됩니다" href="/consult" linkLabel="상담 신청" />
        <ol className="grid grid-cols-1 border-t border-jisan-ink sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="border-b border-[#E4E6E9] py-7 sm:pr-6 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:not(:first-child)]:pl-6">
              <span className="font-display text-4xl font-light text-brand-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold text-jisan-ink">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#4A505A]">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[15px] text-[#4A505A]">
          형사와 민사가 함께 걸린 사건처럼 여러 분야가 얽히면 담당 변호사들이 함께 봅니다.{" "}
          <Link href="/consult" className="font-semibold text-brand-accent underline underline-offset-4">
            지금 상담 신청하기
          </Link>
        </p>
      </div>
    </section>
  )
}
