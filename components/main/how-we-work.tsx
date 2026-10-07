import { siteConfig } from "@/lib/site-config"
import { SectionHead } from "@/components/main/section-head"

const steps = [
  { title: "상담 접수", body: `전화(${siteConfig.phone}), 카카오톡, 홈페이지로 사건 내용을 남겨 주세요. 전화는 24시간 받습니다.` },
  { title: "사실관계 검토", body: "출석요구서, 계약서, 주고받은 문자처럼 가지고 계신 자료를 담당 변호사가 함께 확인합니다." },
  { title: "대응 방향 안내", body: "할 수 있는 일과 어려운 일, 앞으로의 절차를 먼저 말씀드립니다. 선임 여부는 그다음에 정하시면 됩니다." },
  { title: "사건 진행", body: "위임하시면 담당 변호사가 조사 입회, 서면 작성, 재판 출석까지 직접 맡습니다." },
]

/** 상담 안내: 상담 접수부터 사건 진행까지 네 단계 */
export function HowWeWork() {
  return (
    <section className="screen px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div data-reveal className="max-w-7xl mx-auto">
        <SectionHead title="상담 안내" desc="자료가 다 준비되지 않아도 됩니다. 편하게 전화를 주셔도 됩니다." href="/consult" linkLabel="상담 신청하기" />
        <div>
          <ol className="grid grid-cols-1 border-t border-jisan-ink lg:grid-cols-2 lg:gap-x-12">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-5">
                <span className="text-3xl font-bold text-brand-accent tabular-nums">{i + 1}</span>
                <div>
                  <h3 className="text-[1.0625rem] font-bold text-jisan-ink">{s.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#4A505A]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
