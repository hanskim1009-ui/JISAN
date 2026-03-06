"use client"

import { useState, useMemo } from "react"
import Autoplay from "embla-carousel-autoplay"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type CaseCategory = "전체" | "형사" | "민사" | "기업" | "건설·부동산" | "회생·파산"

type CaseItem = {
  id: string
  category: CaseCategory
  title: string
  summary: string
  summaryBold?: string
  /** 조사: '을' 또는 '를' (예: 권고를, 결정을) */
  particle?: "을" | "를"
  outcomeTag: string
  outcomeVariant: "criminal" | "civil" | "corporate" | "rehab"
}

const cases: CaseItem[] = [
  {
    id: "1",
    category: "형사",
    title: "사기 혐의 피의자 변호",
    summary: "대출 및 투자 관련 사기 혐의로 불구속 입건된 의뢰인. 수사 단계에서 혐의의 취지 검토 및 자료 제출을 통해",
    summaryBold: "불기소 권고",
    particle: "를",
    outcomeTag: "불기소",
    outcomeVariant: "criminal",
  },
  {
    id: "2",
    category: "형사",
    title: "음주운전 사건 변호",
    summary: "혈중알코올농도가 높아 방어권 행사에 어려움이 있었으나, 치밀한 대응으로",
    summaryBold: "집행유예 결정",
    particle: "을",
    outcomeTag: "집행유예",
    outcomeVariant: "criminal",
  },
  {
    id: "3",
    category: "민사",
    title: "채무 변제 분쟁",
    summary: "대출금 상환 분쟁 및 채권 추심 요청. 조정 및 합의를 통한",
    summaryBold: "분쟁 해결",
    particle: "을",
    outcomeTag: "합의",
    outcomeVariant: "civil",
  },
  {
    id: "4",
    category: "기업",
    title: "기업 형사 리스크 대응",
    summary: "임직원 관련 형사 혐의에 따른 기업 리스크 점검. 내부 조사 및 절차 권고를 통한",
    summaryBold: "사전 대응 완료",
    particle: "를",
    outcomeTag: "사전 대응",
    outcomeVariant: "corporate",
  },
  {
    id: "5",
    category: "회생·파산",
    title: "개인회생 인가",
    summary: "급여소득자 5천만 원대 채무로 어려움을 겪던 의뢰인. 월 10만 원대 변제금으로 총 채무의 약",
    summaryBold: "89% 탕감",
    particle: "을",
    outcomeTag: "인가결정",
    outcomeVariant: "rehab",
  },
  {
    id: "6",
    category: "건설·부동산",
    title: "공사대금 분쟁",
    summary: "건설 현장 하도급 대금 분쟁. 협상 및 조정을 통해",
    summaryBold: "분할 변제 합의",
    particle: "를",
    outcomeTag: "합의",
    outcomeVariant: "civil",
  },
  {
    id: "7",
    category: "형사",
    title: "마약 투약 혐의 변호",
    summary: "초범으로 마약 투약 혐의를 받은 의뢰인. 적극적인 치료 의지와 반성을 입증하여",
    summaryBold: "기소유예 결정",
    particle: "을",
    outcomeTag: "기소유예",
    outcomeVariant: "criminal",
  },
  {
    id: "8",
    category: "형사",
    title: "폭행·상해 사건 변호",
    summary: "우발적 폭행으로 기소된 의뢰인. 피해자와의 합의 및 양형 자료 제출을 통해",
    summaryBold: "벌금형 처분",
    particle: "을",
    outcomeTag: "벌금형",
    outcomeVariant: "criminal",
  },
  {
    id: "9",
    category: "민사",
    title: "손해배상 청구 사건",
    summary: "교통사고로 인한 후유장해 손해배상 청구. 적극적인 증거 수집 및 의견서 제출로",
    summaryBold: "청구액 전액 인용",
    particle: "을",
    outcomeTag: "전액 인용",
    outcomeVariant: "civil",
  },
  {
    id: "10",
    category: "기업",
    title: "횡령 혐의 임직원 변호",
    summary: "회사 자금 유용 혐의를 받은 임직원. 내부 자료 분석을 통해 혐의 부인에 성공,",
    summaryBold: "무혐의 처분",
    particle: "을",
    outcomeTag: "무혐의",
    outcomeVariant: "corporate",
  },
  {
    id: "11",
    category: "회생·파산",
    title: "법인 파산 신청",
    summary: "경영 악화로 채무 변제가 불가능해진 중소기업. 신속한 파산 절차 진행으로",
    summaryBold: "면책 결정",
    particle: "을",
    outcomeTag: "면책결정",
    outcomeVariant: "rehab",
  },
  {
    id: "12",
    category: "건설·부동산",
    title: "임대차 보증금 반환 소송",
    summary: "임대인이 보증금 반환을 거부한 사건. 명도 집행 절차와 병행하여",
    summaryBold: "전액 반환 판결",
    particle: "을",
    outcomeTag: "전액 반환",
    outcomeVariant: "civil",
  },
  {
    id: "13",
    category: "형사",
    title: "성범죄 무고 사건 변호",
    summary: "허위 고소로 인한 성범죄 혐의. 객관적 증거와 진술 모순을 분석하여",
    summaryBold: "무죄 판결",
    particle: "을",
    outcomeTag: "무죄",
    outcomeVariant: "criminal",
  },
  {
    id: "14",
    category: "민사",
    title: "계약 해제 분쟁",
    summary: "분양 계약 해제 및 위약금 반환 청구 소송. 계약 조건의 하자를 입증하여",
    summaryBold: "위약금 전액 반환",
    particle: "을",
    outcomeTag: "전액 반환",
    outcomeVariant: "civil",
  },
  {
    id: "15",
    category: "회생·파산",
    title: "개인파산 면책",
    summary: "사업 실패로 1억 원대 채무를 진 의뢰인. 성실한 면책 심문 준비를 통해",
    summaryBold: "면책 인가",
    particle: "을",
    outcomeTag: "면책인가",
    outcomeVariant: "rehab",
  },
  {
    id: "16",
    category: "기업",
    title: "계약서 검토 및 분쟁 예방",
    summary: "대규모 납품 계약 체결 전 리스크 분석. 불리한 조항 수정 및 협상을 통해",
    summaryBold: "분쟁 사전 방지",
    particle: "를",
    outcomeTag: "사전 방지",
    outcomeVariant: "corporate",
  },
]

const outcomeStyles: Record<string, string> = {
  criminal: "bg-[#1e3a8a] text-white",
  civil: "bg-[#1e3a8a] text-white",
  corporate: "bg-[#1e3a8a] text-white",
  rehab: "bg-[#1e3a8a] text-white",
}

const CATEGORIES: CaseCategory[] = ["전체", "형사", "민사", "기업", "건설·부동산", "회생·파산"]

function CaseCard({ item }: { item: CaseItem }) {
  return (
    <article className="group border border-[#e8ecf0] bg-white rounded-xl overflow-hidden h-full transition-all duration-300 hover:shadow-md">
      <div className="p-6">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${outcomeStyles[item.outcomeVariant]}`}
        >
          {item.outcomeTag}
        </span>
        <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-3 leading-snug">
          {item.title}
        </h3>
        <p className="text-[13px] leading-relaxed text-[#555]">
          {item.summary}{" "}
          <span className="font-bold text-[#1e3a8a]">[{item.summaryBold}]</span>
          {item.particle || "를"} 이끌어냈습니다.
        </p>
      </div>
    </article>
  )
}

export function SuccessCasesSection() {
  const [filter, setFilter] = useState<CaseCategory>("전체")
  const { ref, isVisible } = useScrollReveal(0.05)

  const autoplay = useMemo(
    () => Autoplay({ delay: 2500, stopOnInteraction: false }),
    []
  )

  const filteredCases = useMemo(() => {
    return cases.filter((c) => filter === "전체" || c.category === filter)
  }, [filter])

  return (
    <section
      id="cases"
      className="py-20 md:py-32 bg-white overflow-x-hidden"
    >
      {/* 헤더 + 필터 */}
      <div className="px-6 md:px-12 lg:px-20 mb-10 md:mb-16">
        <div className="max-w-7xl mx-auto">
          <div
            ref={ref}
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* 제목: 좌측 정렬 */}
            <div className="text-left mb-8">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-3 tracking-tight">
                사건사례
              </h2>
              <p className="text-[13px] text-[#777] max-w-2xl leading-relaxed">
                수십 건의 형사·민사·기업 사건 경험을 기반으로, 유사한 상황의 의뢰인에게 실질적인 도움이 되는 전략을 제시합니다.
              </p>
            </div>

            {/* 필터 버튼: 중앙 정렬, pill형 */}
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === cat
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-white border border-[#d0d5dd] text-[#555] hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 캐러셀 full-bleed */}
      {filteredCases.length > 0 ? (
        <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            plugins={[autoplay]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {filteredCases.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 basis-[85%] sm:basis-[60%] md:basis-[calc(33.333%-0.67rem)] lg:basis-[calc(20%-0.8rem)]"
                >
                  <div className="h-full">
                    <CaseCard item={item} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 top-1/2 -translate-y-1/2 border border-[#d0d5dd] bg-white hover:bg-[#f5f7fa] shadow-sm z-10" />
            <CarouselNext className="right-2 md:right-4 top-1/2 -translate-y-1/2 border border-[#d0d5dd] bg-white hover:bg-[#f5f7fa] shadow-sm z-10" />
          </Carousel>
        </div>
      ) : (
        <div className="px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <p className="text-center py-16 text-[#999]">
              해당 조건에 맞는 사례가 없습니다.
            </p>
          </div>
        </div>
      )}

      <div className="px-6 md:px-12 lg:px-20 mt-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[#aaa] text-right">
            개인정보 보호를 위해 사건 유형과 결과 중심으로 요약하여 안내드립니다.
          </p>
        </div>
      </div>
    </section>
  )
}
