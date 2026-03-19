"use client"

import Image from "next/image"
import { useState } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { lawyerImages } from "@/lib/site-config"

function LawyerPhoto({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false)
  const initials = name.slice(0, 1)

  if (error) {
    return (
      <div className="absolute inset-0 bg-[hsl(230_35%_18%)] flex items-center justify-center">
        <span className="text-white/80 text-7xl font-light tracking-widest select-none">
          {initials}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      className="object-cover object-top"
      sizes="(max-width: 768px) 100vw, 38vw"
      onError={() => setError(true)}
    />
  )
}

type Lawyer = {
  name: string
  title: string
  image: string
  summary: string
  career?: string[]
  highlights: string[]
}

const lawyers: Lawyer[] = [
  {
    name: "김한솔",
    title: "대표 변호사",
    image: lawyerImages.kim,
    summary:
      "오랜 기간 검사로 재직하며 고등검찰청에서 수범검사로까지 선정되었던던 형사 전문 변호사입니다. 검사 재직 시 쌓은 풍부한 수사·재판 경험을 바탕으로 의뢰인의 권익 보호에 최선을 다하고 있습니다.",
    career: [
      "현) 법률사무소 지산 대표변호사",
      "전) 법무법인 온강 대표변호사",
      "전) 인천지방검찰청 검사",
      "전) 수원지방검찰청 안산지청 검사",
      "전) 대전지방검찰청 홍성지청 검사",
    ],
    highlights: [
      "대전고등검찰청 수범검사 선정",
      "인천지방검찰청 우수검사실 선정",
      "대전지방검찰청 홍성지청 우수검사실 선정",
      "성균관대학교 법학전문대학원 졸업",
      "캐나다 토론토 대학교 생명과학과 최우등 졸업 (High Distinction)",
    ],
  },
  {
    name: "구본우",
    title: "대표 변호사",
    image: lawyerImages.koo,
    summary:
      "다양한 형사·민사 사건에서 실전 경험을 쌓아온 대표 변호사로서, 의뢰인의 상황에 맞는 맞춤형 법률 서비스를 제공합니다. 사건의 처음부터 끝까지 직접 담당하는 것을 원칙으로 합니다.",
    highlights: [
      "대전고등검찰청 수범검사 선정",
      "인천지방검찰청 우수검사실 선정",
      "대전지방검찰청 홍성지청 우수검사실 선정",
      "성균관대학교 법학전문대학원 졸업",
      "캐나다 토론토 대학교 생명과학과 최우등 졸업 (High Distinction)",
    ],
  },
  {
    name: "박종진",
    title: "파트너 변호사",
    image: lawyerImages.park,
    summary:
      "시니어 변호사로 활동하며 기업 자문과 민·형사 사건을 아우러 왔습니다.\n동화약품, 울산 해상풍력대책위원회, 바른경영연구소 등 다양한 기관·기업의 자문을 맡아 왔으며, 기업 자문 경험을 바탕으로 의뢰인의 법률 리스크를 선제적으로 관리합니다.",
    career: [
      "현) 법률사무소 지산 파트너 변호사",
      "전) 법무법인(유)효성 파트너 변호사",
      "전) 법률사무소 더올 파트너 변호사",
      "현) 주식회사 동화약품 자문변호사",
      "현) 울산 해상풍력대책위원회 자문변호사",
      "현) 주식회사 바른경영연구소 자문·협력변호사",
      "전) 대한한약사회 자문변호사",
      "다수의 중견·중소기업 자문 변호사",
    ],
    highlights: [
      "단국대학교 법학과",
      "성균관대학교 법학전문대학원",
      "단국대학교 대학원 박사과정",
    ],
  },
  {
    name: "김충현",
    title: "파트너 변호사",
    image: lawyerImages.kimChungHyeon,
    summary:
      "형사·민사 분야에서 오랜 경험을 보유한 파트너 변호사입니다. 의뢰인의 입장에서 사건을 바라보며, 최적의 법률적 해결책을 찾기 위해 항상 최선을 다합니다.",
    highlights: [
      "법학전문대학원 졸업",
      "형사 전문 변호사",
      "다수 형사사건 무죄·불기소 처분 획득",
    ],
  },
  {
    name: "강현우",
    title: "파트너 변호사",
    image: lawyerImages.kang,
    summary:
      "민사·형사 전반에 걸쳐 다양한 사건 경험을 보유한 파트너 변호사입니다. 복잡한 법률 문제를 명쾌하게 분석하고 의뢰인이 이해하기 쉽게 설명하는 것을 중요하게 생각합니다.",
    highlights: [
      "법학전문대학원 졸업",
      "민사·형사 전문 변호사",
      "다수 소송 승소 경험",
    ],
  },
]

function LawyerRow({ lawyer, index }: { lawyer: Lawyer; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.1)
  const isEven = index % 2 === 0

  return (
    <article
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        className={`flex flex-col md:flex-row ${
          isEven ? "" : "md:flex-row-reverse"
        } border-b border-border`}
      >
        {/* 사진 영역 */}
        <div className="relative w-full md:w-[38%] aspect-[3/4] md:aspect-auto md:min-h-[480px] shrink-0 overflow-hidden bg-muted">
          <LawyerPhoto src={lawyer.image} name={lawyer.name} />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col justify-center px-8 py-12 md:px-14 md:py-16 flex-1">
          {/* 이름 + 직함 */}
          <div className="flex items-baseline gap-3 mb-8 border-b border-border pb-8">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {lawyer.name}
            </h3>
            <p className="text-sm tracking-[0.12em] text-primary font-medium">
              {lawyer.title}
            </p>
          </div>

          {/* 소개 텍스트 (줄바꿈은 \n + whitespace-pre-line) */}
          <p className="text-base leading-[1.9] text-foreground/80 mb-8 whitespace-pre-line">
            {lawyer.summary}
          </p>

          {/* 주요 경력 */}
          {lawyer.career && lawyer.career.length > 0 && (
            <div className="border-t border-border pt-6 mb-6">
              <ul className="space-y-3">
                {lawyer.career.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/75">
                    <span className="mt-[0.45rem] h-px w-4 bg-foreground/40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 수상 및 학력 */}
          <div className="border-t border-border pt-6">
            <ul className="space-y-3">
              {lawyer.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/75">
                  <span className="mt-[0.45rem] h-px w-4 bg-foreground/40 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}

export function TeamSection() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section id="team" className="bg-background pb-16 md:pb-24">
      {/* 섹션 헤더 */}
      <div className="px-6 pt-24 pb-14 md:px-12 lg:px-20 md:pt-36 md:pb-20 border-b border-border">
        <div
          ref={ref}
          className={`max-w-7xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[11px] tracking-[0.2em] text-muted-foreground font-medium mb-4 uppercase">
            Our Lawyers
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] tracking-tight leading-tight">
            의뢰인 곁에서,<br className="hidden md:block" />
            직접 함께하는 변호사들
          </h2>
        </div>
      </div>

      {/* 변호사 목록 */}
      <div className="max-w-7xl mx-auto">
        {lawyers.map((lawyer, index) => (
          <LawyerRow key={lawyer.name} lawyer={lawyer} index={index} />
        ))}
      </div>
    </section>
  )
}
