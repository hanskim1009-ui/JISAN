"use client"

import Image from "next/image"
import { useState, useRef, useLayoutEffect } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { lawyerImages } from "@/lib/site-config"

function LawyerPhoto({
  src,
  name,
  imageClassName,
}: {
  src: string
  name: string
  /** 양옆 여백 축소 등: object-cover + scale + object-center */
  imageClassName?: string
}) {
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
      className={imageClassName ?? "object-cover object-top"}
      sizes="(max-width: 768px) 100vw, 38vw"
      onError={() => setError(true)}
    />
  )
}

type WorkCaseSection = { heading: string; items: string[] }

/** 자격 / 경력 / 학력을 구분해 표시 (구본우 등) */
type StructuredResume = {
  qualifications: string[]
  career: string[]
  education: string[]
}

type ResumeSection = { heading: string; items: string[] }

type Lawyer = {
  name: string
  title: string
  image: string
  summary: string
  career?: string[]
  highlights: string[]
  /** 주요 경력 아래 자문·분야별 블록 (강현우 등) */
  resumeSections?: ResumeSection[]
  /** Next/Image className (구본우: 정사각 원본의 좌우 여백 축소) */
  photoImageClassName?: string
  structuredResume?: StructuredResume
  /** structuredResume과 함께 쓰면 이력 클릭 시 같은 영역에 주요 업무 사례 표시 */
  workCaseSections?: WorkCaseSection[]
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
      "로펌·금융사·VC 분야에서 기업법무와 준법감시 등을 경험한 대표 변호사입니다. 상장사 경영권 분쟁, 투자계약, 자본시장법 관련 형사·민사까지 아우르며 의뢰인의 거래와 분쟁 전반에 맞는 법률 서비스를 제공합니다.",
    structuredResume: {
      qualifications: ["변호사", "펀드투자상담사", "증권투자자문인력"],
      career: [
        "법무법인 이한",
        "스마일게이트인베스트먼트 준법감시인",
        "하나증권",
        "법무법인 시공",
        "IBK기업은행",
      ],
      education: ["성균관대학교 법학전문대학원", "연세대학교 법학과"],
    },
    workCaseSections: [
      {
        heading: "기업법무",
        items: [
          "중견업체 자회사 인수 및 매각을 위한 법률실사(L.D.D) 업무 수행",
          "VC 투자전 법률실사 업무 수행",
          "투자합자회사설립 관련 자문 수행",
          "코스닥 상장사 등 다수 기업 경영권 분쟁 관련 법률 자문 업무 수행",
          "금융감독원 보험 관련 법률 자문 업무 수행",
          "언론사, 제조자, 건설사 및 협회 등 다수 기업 법률 자문 수행",
        ],
      },
      {
        heading: "VC, 사모펀드, 스타트업",
        items: [
          "상환전환우선주 인수계약, 전환사채인수계약, 조건부지분전환계약, 주주간계약 등 다수 투자 관련 계약",
          "인도, 싱가폴, 미국 등 해외 소재 법인 투자 검토 수행",
          "펀드 설립 및 운용 검토",
          "주주총회 및 이사회 결의 자문",
          "사규(임원보수규정, 취업규칙 등) 검토",
          "신사업 적정성 법률 자문 업무 수행",
        ],
      },
      {
        heading: "형사",
        items: [
          "금융회사 관련 자본시장법 등에 관한 법률자문 업무 및 형사사건 업무 수행",
          "유사투자자문업 관련 자본시장법 위반 등 형사사건 업무 수행",
          "투자 사기, 자본시장법 상 사기적 부정거래 혐의 등에 관한 고소대리 업무 수행",
          "횡령, 배임 등 재산범죄 관련 사건 다수 수행",
        ],
      },
      {
        heading: "민사",
        items: [
          "분양계약해제 사건",
          "불법행위에 따른 손해배상청구 사건",
          "공사대금지급 청구 사건",
          "일조권 사건",
          "투자금 반환 사건",
        ],
      },
    ],
    highlights: [],
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
    name: "강현우",
    title: "파트너 변호사",
    image: lawyerImages.kang,
    summary:
      "다수의 민·형사 사건 승소와 기업 자문을 통해 증명된 전문성으로 의뢰인의 신뢰에 보답하고 있습니다. 치밀한 법리 검토와 노련한 대응을 통해 어떠한 난관 속에서도 의뢰인의 이익을 최우선으로 지켜냅니다.",
    career: [
      "현) 법률사무소 지산 파트너 변호사",
      "전) 법무법인 공간 변호사",
    ],
    resumeSections: [
      {
        heading: "의료·보건 분야 자문",
        items: [
          "대한병원협회 / 대한간호조무사협회 자문",
          "경기도의료원 / 경기도약사회 자문",
          "9988병원 / 예손병원 / 대정병원 / 밝은눈안과 / 이데아성형외과 등 다수 의료기관 전담 자문",
        ],
      },
      {
        heading: "공공·기관 자문",
        items: [
          "서울시 옴부즈만 자문 수행",
          "경기복지재단 자문 수행",
          "홍은 2-2구역 주민자치위원회 자문",
        ],
      },
      {
        heading: "기업 법률 리스크 관리",
        items: [
          "㈜프랭클린테크놀로지 / ㈜디엔엠 / ㈜당당 / ㈜맘스뷰티 등 다수 기업 자문",
        ],
      },
    ],
    highlights: ["건국대학교 자율전공학부", "전남대학교 법학전문대학원"],
  },
]

function ResumeList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/75">
          <span className="mt-[0.45rem] h-px w-4 bg-foreground/40 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function WorkCasesBlock({ sections }: { sections: WorkCaseSection[] }) {
  return (
    <>
      {sections.map((sec) => (
        <div key={sec.heading} className="mb-6 last:mb-0">
          <p className="text-sm font-medium text-foreground mb-2">{sec.heading}</p>
          <ul className="space-y-2 text-sm leading-relaxed text-foreground/75 list-disc pl-5">
            {sec.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

/** 이력 ↔ 주요 업무 사례 토글, 이력 높이에 맞춰 패널 세로 고정 */
function StructuredResumeToggle({
  resume,
  sections,
}: {
  resume: StructuredResume
  sections: WorkCaseSection[]
}) {
  const [showCases, setShowCases] = useState(false)
  const resumeRootRef = useRef<HTMLDivElement>(null)
  const [panelHeightPx, setPanelHeightPx] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (showCases) return
    const root = resumeRootRef.current
    if (!root) return
    const measure = () => {
      setPanelHeightPx(Math.ceil(root.getBoundingClientRect().height))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
  }, [showCases])

  const btnClass =
    "text-sm font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"

  return (
    <div
      className="border-t border-border pt-6"
      style={
        panelHeightPx != null
          ? { height: panelHeightPx, minHeight: panelHeightPx }
          : undefined
      }
    >
      {!showCases ? (
        <div ref={resumeRootRef} className="flex flex-col">
          <div className="mb-4 flex shrink-0 justify-end">
            <button type="button" onClick={() => setShowCases(true)} className={btnClass}>
              업무사례 보기 →
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-foreground/90 mb-2">자격</p>
              <ResumeList items={resume.qualifications} />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/90 mb-2">경력</p>
              <ResumeList items={resume.career} />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/90 mb-2">학력</p>
              <ResumeList items={resume.education} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="mb-3 flex shrink-0 items-center">
            <button type="button" onClick={() => setShowCases(false)} className={btnClass}>
              ← 이력보기
            </button>
          </div>
          <h4 className="mb-2 shrink-0 text-sm font-semibold tracking-wide text-foreground">
            주요 업무 사례
          </h4>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 -mr-1">
            <WorkCasesBlock sections={sections} />
          </div>
        </div>
      )}
    </div>
  )
}

function LawyerRow({ lawyer, index }: { lawyer: Lawyer; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.1)
  const isEven = index % 2 === 0

  const hasStructuredCases =
    lawyer.structuredResume &&
    lawyer.workCaseSections &&
    lawyer.workCaseSections.length > 0

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
          <LawyerPhoto
            src={lawyer.image}
            name={lawyer.name}
            imageClassName={lawyer.photoImageClassName}
          />
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

          {/* 구본우: 이력 ↔ 주요 업무 사례 같은 영역에서 토글 */}
          {hasStructuredCases && lawyer.structuredResume ? (
            <StructuredResumeToggle
              resume={lawyer.structuredResume}
              sections={lawyer.workCaseSections!}
            />
          ) : (
            <>
              {lawyer.career && lawyer.career.length > 0 && (
                <div className="border-t border-border pt-6 mb-6">
                  {lawyer.resumeSections && lawyer.resumeSections.length > 0 && (
                    <p className="text-xs font-semibold text-foreground/90 mb-2">이력</p>
                  )}
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

              {lawyer.resumeSections?.map((sec) => (
                <div key={sec.heading} className="border-t border-border pt-6 mb-6">
                  <p className="text-xs font-semibold text-foreground/90 mb-2">{sec.heading}</p>
                  <ResumeList items={sec.items} />
                </div>
              ))}

              {lawyer.highlights.length > 0 && (
                <div className="border-t border-border pt-6">
                  {lawyer.resumeSections && lawyer.resumeSections.length > 0 && (
                    <p className="text-xs font-semibold text-foreground/90 mb-2">학력</p>
                  )}
                  <ul className="space-y-3">
                    {lawyer.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/75">
                        <span className="mt-[0.45rem] h-px w-4 bg-foreground/40 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
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
