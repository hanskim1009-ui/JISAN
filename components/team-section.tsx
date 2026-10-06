"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { lawyers, type Lawyer, type StructuredResume, type WorkCaseSection } from "@/lib/lawyers"

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
      id={lawyer.slug}
      className={`scroll-mt-24 transition-all duration-700 ${
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
          <p className="mb-1 text-xs font-bold text-jisan-logo">{lawyer.field}</p>
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
      <div className="px-5 pt-12 pb-10 md:px-12 lg:px-14 md:pt-16 md:pb-12 border-b border-border">
        <div
          ref={ref}
          className={`max-w-7xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="border-t-2 border-jisan-ink pt-4 text-3xl md:text-[2.25rem] font-bold text-jisan-ink tracking-tight">
            구성원
          </h1>
          <p className="mt-2 text-[15px] text-[#4A505A]">변호사마다 일해 온 곳과 맡는 분야가 다릅니다. 사건이 들어오면 그 일을 해 본 변호사가 맡습니다.</p>
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
