"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function AboutSection() {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal(0.15)
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollReveal(0.1)

  return (
    <section
      id="about"
      className="px-6 py-24 md:px-12 lg:px-20 md:py-36 bg-secondary"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div
            ref={headRef}
            className={`transition-all duration-1000 ${
              headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
              사건 해결을 넘어,<br className="hidden md:block" /> 의뢰인의 일상까지 책임집니다
            </h2>
          </div>

          <div
            ref={bodyRef}
            className={`flex flex-col justify-between gap-10 transition-all duration-1000 delay-150 ${
              bodyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex flex-col gap-5 max-w-xl text-base leading-relaxed text-foreground">
            <p>
              법률사무소 지산은 형사·민사·기업·건설·부동산·회생·파산·가사까지,{" "}
              <span className="font-medium text-foreground">
                하나의 팀이 여섯 개 분야를 일관되게
              </span>{" "}
              다루는 종합 법률사무소입니다. 분야마다 다른 사무소를 찾을 필요 없이,
              사건의 성격에 관계없이 처음부터 끝까지 한 곳에서 해결할 수 있습니다.
            </p>
            <p>
              각 분야의 전문성을 갖춘 변호사들이 사건을{" "}
              <span className="font-medium text-foreground">
                다각도로 분석
              </span>
              하고, 형사와 민사가 얽힌 복합 사건에서도 분야 간 협업을 통해
              빈틈없는 전략을 설계합니다.
            </p>
            <p>
              모든 사건을 숫자가 아닌 한 사람의 삶으로 바라보며, 결과뿐 아니라
              과정에서도 충분히 보호받고 있다고 느끼실 수 있도록 함께합니다.
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

