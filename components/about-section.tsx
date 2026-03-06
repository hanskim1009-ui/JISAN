"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function AboutSection() {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal(0.15)
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollReveal(0.1)

  return (
    <section
      id="about"
      className="px-6 py-20 md:px-12 lg:px-20 md:py-28 bg-secondary"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div
            ref={headRef}
            className={`transition-all duration-1000 ${
              headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="section-label">법률사무소 소개</p>
            <h2 className="section-title">
              형사 사건 변호를 핵심으로,
              <br className="hidden md:block" />
              일상을 지키는 종합 법률 파트너
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
              법률사무소 지산은{" "}
              <span className="font-medium text-foreground">
                형사 사건 변호를 핵심 분야
              </span>
              로 하여, 기업, 민사, 건설·부동산, 회생·파산 등 다양한 영역에서
              의뢰인의 곁을 지켜온 전문 법률 팀입니다.
            </p>
            <p>
              수사 단계부터 재판에 이르기까지 사건의 전 흐름을 면밀히 분석하고,
              검사 출신 변호사의 시각에서 치밀하게 대응합니다. 모든 사건을
              숫자가 아닌{" "}
              <span className="font-medium text-foreground">
                한 사람의 삶과 일상
              </span>
              으로 바라보며, 결과뿐 아니라 과정에서도 충분히 보호받고 있다고
              느끼실 수 있도록 함께합니다.
            </p>
            <p>
              지산은 단순한 법률 대리인을 넘어, 가장 힘든 순간 다시 일어설 수
              있는 힘이 되고자 합니다.
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

