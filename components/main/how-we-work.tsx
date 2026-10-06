import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { SectionHead } from "@/components/main/section-head"

const steps = [
  { title: "연락", body: `전화 ${siteConfig.phone}, 카카오톡, 상담 신청 페이지. 전화는 24시간 받습니다.` },
  { title: "담당 변호사 연결", body: "사건 분야를 듣고 그 분야 담당 변호사가 연락드립니다." },
  { title: "사무실 상담", body: "서초동 지산빌딩 6층에서 만납니다. 자료가 있으면 미리 보내 주셔도 됩니다." },
  { title: "위임 여부 결정", body: "상담 후에 정하시면 됩니다. 위임하시면 위임계약서를 씁니다." },
]

const documents = [
  { field: "형사", items: "출석요구서나 수사관 문자, 고소장, 상대방과 주고받은 메시지" },
  { field: "가사", items: "혼인·가족관계증명서, 재산 자료, 받은 소장" },
  { field: "기업", items: "계약서 초안, 정관, 주주명부, 이사회 의사록" },
  { field: "민사", items: "계약서·차용증, 입금 내역, 내용증명, 받은 소장" },
]

/** 상담 안내: 진행 순서 + 분야별로 챙겨 오면 좋은 자료 */
export function HowWeWork() {
  return (
    <section className="px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="상담 안내" href="/consult" linkLabel="상담 신청" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          <ol className="border-t border-jisan-ink">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-5">
                <span className="text-3xl font-bold text-brand-accent tabular-nums">{i + 1}</span>
                <div>
                  <h3 className="text-[17px] font-bold text-jisan-ink">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#4A505A]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="bg-brand-paper p-6 md:p-7">
            <h3 className="text-[17px] font-bold text-jisan-ink">상담 때 있으면 좋은 자료</h3>
            <dl className="mt-4 text-[15px]">
              {documents.map((d) => (
                <div key={d.field} className="grid grid-cols-[3rem_1fr] gap-3 border-b border-[#D9D4CA] py-3 last:border-b-0">
                  <dt className="font-bold text-brand-accent">{d.field}</dt>
                  <dd className="text-[#2D323A]">{d.items}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[13px] text-[#6B717B]">
              없어도 상담은 됩니다.{" "}
              <Link href="/consult" className="font-semibold text-brand-accent underline underline-offset-4">
                상담 신청
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
