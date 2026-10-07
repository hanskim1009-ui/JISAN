import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { SectionHead } from "@/components/main/section-head"

const steps = [
  { title: "상담 접수", body: `전화(${siteConfig.phone}), 카카오톡, 홈페이지로 사건 내용을 남겨 주세요. 전화는 24시간 받습니다.` },
  { title: "사실관계 검토", body: "출석요구서, 계약서, 주고받은 문자처럼 가지고 계신 자료를 담당 변호사가 함께 확인합니다." },
  { title: "대응 방향 안내", body: "할 수 있는 일과 어려운 일, 앞으로의 절차를 먼저 말씀드립니다. 선임 여부는 그다음에 정하시면 됩니다." },
  { title: "사건 진행", body: "위임하시면 담당 변호사가 조사 입회, 서면 작성, 재판 출석까지 직접 맡습니다." },
]

const documents = [
  { field: "형사", items: "출석요구서나 수사관 문자, 고소장, 상대방과 주고받은 메시지" },
  { field: "가사", items: "혼인·가족관계증명서, 재산 자료, 받은 소장" },
  { field: "기업", items: "계약서 초안, 정관, 주주명부, 이사회 의사록" },
  { field: "민사", items: "계약서·차용증, 입금 내역, 내용증명, 받은 소장" },
]

/** 상담 안내: 상담 접수부터 사건 진행까지 + 분야별로 준비하면 좋은 자료 */
export function HowWeWork() {
  return (
    <section className="screen px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div data-reveal className="max-w-7xl mx-auto">
        <SectionHead title="상담 안내" desc="상담은 방문과 전화로 진행됩니다. 부담 갖지 마시고 편하게 연락 주세요." href="/consult" linkLabel="상담 신청하기" />
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
            <h3 className="text-[17px] font-bold text-jisan-ink">상담 전에 준비하시면 좋은 자료</h3>
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
