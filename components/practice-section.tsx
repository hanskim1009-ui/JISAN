"use client"

import { useState } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import {
  Shield,
  Building2,
  Scale,
  Factory,
  TrendingDown,
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
      "수사 초기 대응에서 재판, 항소심까지. 피의자·피고인의 방어권 보장을 최우선으로 하여 구속·실형 가능성을 최소화합니다.",
  },
  {
    name: "기업",
    tag: "Corporate",
    icon: Building2,
    description:
      "기업 형사 리스크, 준법감시, 계약·분쟁 자문 등 기업 활동 전반을 아우르는 맞춤형 법률 솔루션을 제공합니다.",
  },
  {
    name: "민사",
    tag: "Civil Litigation",
    icon: Scale,
    description:
      "채권·채무, 손해배상, 각종 계약 분쟁 등 복잡한 민사 사건을 전략적으로 설계하여 실질적인 회복을 이끌어냅니다.",
  },
  {
    name: "건설·부동산",
    tag: "Construction & Real Estate",
    icon: Factory,
    description:
      "공사대금, 하자, 개발 프로젝트, 임대차 등 건설·부동산 영역에서의 분쟁을 현장 이해를 바탕으로 해결합니다.",
  },
  {
    name: "회생·파산",
    tag: "Restructuring",
    icon: TrendingDown,
    description:
      "개인·법인 회생 및 파산 절차 전반을 설계하여, 새로운 출발을 위한 최선의 길을 함께 모색합니다.",
  },
]

export function PracticeSection() {
  const [selected, setSelected] = useState(0)
  const { ref, isVisible } = useScrollReveal(0.05)
  const current = practices[selected]
  const Icon = current.icon

  return (
    <section
      id="practice"
      className="px-6 py-20 md:px-12 lg:px-20 md:py-28 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 pb-6 border-b border-border transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <p className="section-label">업무분야</p>
            <h2 className="section-title">
              사건의 시작부터 끝까지
              <br className="hidden md:block" />
              함께하는 지산의 역할
            </h2>
          </div>
          <span className="mt-4 md:mt-0 text-xs text-muted-foreground tracking-[0.08em]">
            {String(practices.length).padStart(2, "0")}개의 핵심 분야
          </span>
        </div>

        {/* 탭 버튼 */}
        <div className="flex flex-wrap gap-2 mb-10 md:mb-12">
          {practices.map((p, i) => {
            const IconItem = p.icon
            return (
              <button
                key={p.name}
                onClick={() => setSelected(i)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium tracking-[0.06em] transition-all duration-300 ${
                  selected === i
                    ? "bg-foreground text-background shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                <IconItem className="h-4 w-4 shrink-0" />
                {p.name}
              </button>
            )
          })}
        </div>

        {/* 선택된 분야 상세 */}
        <div className="bg-secondary p-8 md:p-12 rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground tracking-[0.08em]">
                {current.tag}
              </p>
              <h3 className="card-title text-xl md:text-2xl">
                {current.name} 사건
              </h3>
            </div>
          </div>
          <div className="w-12 h-px bg-primary/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-foreground max-w-2xl">
            {current.description}
          </p>
          <a
            href="#contact"
            className="inline-flex mt-8 text-sm font-medium text-primary hover:underline"
          >
            상담 문의하기 →
          </a>
        </div>
      </div>
    </section>
  )
}
