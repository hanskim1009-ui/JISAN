"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import {
  Shield,
  Building2,
  Scale,
  Factory,
  TrendingDown,
  Heart,
  type LucideIcon,
} from "lucide-react"

type Practice = {
  name: string
  tag: string
  description: string
  icon: LucideIcon
}

const practices: Practice[] = [
  {
    name: "형사",
    tag: "Criminal Law",
    icon: Shield,
    description:
      "갑작스러운 고소장 수령, 경찰 출석 요구, 구속 위기 — 어떤 상황에서도 초기 대응이 결과를 결정합니다. 지산은 검사 출신 변호사의 수사 경험을 바탕으로 경찰·검찰 조사 단계부터 재판 선고까지 모든 절차에 직접 함께하며, 의뢰인의 방어권과 일상을 지킵니다.",
  },
  {
    name: "기업",
    tag: "Corporate",
    icon: Building2,
    description:
      "기업 운영 과정에서 발생하는 계약서 검토, 주주총회·이사회 운영 자문, 노무 분쟁, 임직원 형사 리스크 대응까지 폭넓게 지원합니다. 정기 법률 고문 계약을 통해 분쟁이 발생하기 전에 리스크를 차단하고, 문제 발생 시에는 신속하게 대응할 수 있는 체계를 함께 만들어갑니다.",
  },
  {
    name: "민사",
    tag: "Civil Litigation",
    icon: Scale,
    description:
      "대여금·투자금 반환, 손해배상 청구, 계약 해제·해지, 부당이득 반환 등 민사 분쟁 전반을 다룹니다. 승소 판결만이 아닌 실제 채권 회수와 강제집행까지 고려한 전략을 설계하여, 판결문이 아닌 실질적 결과로 이어지도록 합니다.",
  },
  {
    name: "건설·부동산",
    tag: "Construction & Real Estate",
    icon: Factory,
    description:
      "공사대금 미지급, 하자보수 책임, 설계 변경 분쟁, 재개발·재건축 갈등, 임대차 보증금 반환, 명도 소송 등 건설·부동산 분야의 복잡한 분쟁을 다룹니다. 계약 단계의 리스크 검토부터 소송·강제집행까지, 현장의 맥락을 이해하는 변호사가 실질적인 해결책을 제시합니다.",
  },
  {
    name: "회생·파산",
    tag: "Restructuring",
    icon: TrendingDown,
    description:
      "과도한 채무로 일상이 무너지기 전에 법적 절차를 통해 다시 시작할 수 있습니다. 개인회생·파산 신청부터 면책 결정까지, 지산은 의뢰인의 경제적 재기를 위한 현실적인 로드맵을 함께 설계합니다. 법인 회생·파산 절차 역시 풍부한 경험을 바탕으로 대응합니다.",
  },
  {
    name: "가사",
    tag: "Family Law",
    icon: Heart,
    description:
      "이혼 소송, 재산분할, 양육비 산정, 면접교섭권 조정, 가정폭력 보호명령, 상속 재산 분할 및 유류분 청구까지 — 가사 사건은 사실관계의 정밀한 정리와 증거 확보가 핵심입니다. 첫 상담부터 조정·재판 종결까지 담당 변호사가 직접 밀착 대응합니다.",
  },
]

export function PracticeSection() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section
      id="practice"
      className="px-6 py-24 md:px-12 lg:px-20 md:py-36 bg-[#eef2f8]"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 pb-6 border-b border-border transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-3 tracking-tight">
              사건의 시작부터 끝까지<br className="hidden md:block" /> 함께하는 지산의 역할
            </h2>
          </div>
        </div>

        {/* 그리드 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {practices.map((p) => {
            const PIcon = p.icon
            return (
              <div
                key={p.name}
                className="group flex flex-col bg-white rounded-2xl border border-[#e2e6ed] p-8 hover:border-[#1e3a8a] hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1e3a8a]/10 text-[#1e3a8a]">
                    <PIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1a1a2e] tracking-tight leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-[#aaa] tracking-[0.12em] uppercase mt-0.5">
                      {p.tag}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-[1.85] text-[#555] flex-1 mb-6">
                  {p.description}
                </p>
                <a
                  href="#contact"
                  className="inline-flex mt-6 text-sm font-semibold text-[#1e3a8a] group-hover:underline"
                >
                  상담 문의 →
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
