"use client"

import { useState, useMemo } from "react"
import Autoplay from "embla-carousel-autoplay"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { lawyerImages } from "@/lib/site-config"

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
  lawyers: { name: string; image: string; initials: string }[]
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
    lawyers: [
      { name: "김한솔", image: lawyerImages.kim, initials: "김" },
      { name: "구본우", image: lawyerImages.koo, initials: "구" },
    ],
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
    lawyers: [
      { name: "김한솔", image: lawyerImages.kim, initials: "김" },
    ],
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
    lawyers: [
      { name: "구본우", image: lawyerImages.koo, initials: "구" },
      { name: "박종진", image: lawyerImages.park, initials: "박" },
    ],
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
    lawyers: [
      { name: "김한솔", image: lawyerImages.kim, initials: "김" },
      { name: "박종진", image: lawyerImages.park, initials: "박" },
    ],
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
    lawyers: [
      { name: "구본우", image: lawyerImages.koo, initials: "구" },
      { name: "박종진", image: lawyerImages.park, initials: "박" },
    ],
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
    lawyers: [
      { name: "박종진", image: lawyerImages.park, initials: "박" },
    ],
  },
]

const outcomeStyles: Record<string, string> = {
  criminal: "bg-foreground/90 text-background",
  civil: "bg-primary/20 text-primary",
  corporate: "bg-foreground/80 text-background",
  rehab: "bg-emerald-100 text-emerald-800",
}

const CATEGORIES: CaseCategory[] = ["전체", "형사", "민사", "기업", "건설·부동산", "회생·파산"]

function CaseCard({ item }: { item: CaseItem }) {
  return (
    <article className="group border border-border bg-background rounded-lg overflow-hidden h-full transition-all duration-500 hover:shadow-lg hover:border-primary/20">
      <div className="p-6 md:p-8">
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded mb-4 ${outcomeStyles[item.outcomeVariant] || outcomeStyles.civil}`}
        >
          {item.outcomeTag}
        </span>
        <h3 className="text-lg font-semibold text-foreground mb-3 leading-snug">
          {item.title}
        </h3>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
          {item.summary}{" "}
          <span className="font-semibold text-foreground">{item.summaryBold}</span>
          {item.particle || "를"} 이끌어냈습니다.
        </p>
        <div className="mt-6 flex items-center gap-2 flex-wrap">
          {item.lawyers.map((lawyer) => (
            <div
              key={lawyer.name}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Avatar className="h-6 w-6 ring-1 ring-border">
                <AvatarImage src={lawyer.image} alt={lawyer.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {lawyer.initials}
                </AvatarFallback>
              </Avatar>
              <span>법률사무소 지산 {lawyer.name}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export function SuccessCasesSection() {
  const [filter, setFilter] = useState<CaseCategory>("전체")
  const [search, setSearch] = useState("")
  const { ref, isVisible } = useScrollReveal(0.05)

  const autoplay = useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false }),
    []
  )

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchCategory = filter === "전체" || c.category === filter
      const matchSearch =
        !search.trim() ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.summary.toLowerCase().includes(search.toLowerCase()) ||
        c.outcomeTag.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [filter, search])

  return (
    <section
      id="cases"
      className="py-20 md:py-28 bg-secondary overflow-x-hidden"
    >
      {/* 헤더 + 필터 (max-w 내부) */}
      <div className="px-6 md:px-12 lg:px-20 mb-10 md:mb-12">
        <div className="max-w-7xl mx-auto">
          <div
            ref={ref}
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <p className="section-label mb-2">성공 사례</p>
                <h2 className="section-title mb-4">
                  의뢰인과 함께한
                  <br className="hidden md:block" />
                  사건 대응 경험
                </h2>
                <p className="text-base text-muted-foreground max-w-2xl">
                  의뢰인과 함께한 경험을 바탕으로, 법률사무소 지산은 직접 소통하며
                  전략적인 대응을 준비합니다.
                </p>
              </div>
              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="검색어를 입력해주세요"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === cat
                      ? "bg-foreground text-background"
                      : "bg-background border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 캐러셀 full-bleed (뷰포트 전체 너비) */}
      {filteredCases.length > 0 ? (
        <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: false,
            }}
            plugins={[autoplay]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {filteredCases.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 basis-[85%] sm:basis-[70%] md:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.67rem)]"
                >
                  <div className="h-full">
                    <CaseCard item={item} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 top-1/2 -translate-y-1/2 border border-border bg-background/95 hover:bg-secondary shadow-sm z-10" />
            <CarouselNext className="right-2 md:right-4 top-1/2 -translate-y-1/2 border border-border bg-background/95 hover:bg-secondary shadow-sm z-10" />
          </Carousel>
        </div>
      ) : (
        <div className="px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <p className="text-center py-16 text-muted-foreground">
              해당 조건에 맞는 사례가 없습니다.
            </p>
          </div>
        </div>
      )}

      <div className="px-6 md:px-12 lg:px-20 mt-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            개인정보 보호를 위해 사건 유형과 결과 중심으로 요약하여 안내드립니다.
          </p>
        </div>
      </div>
    </section>
  )
}
