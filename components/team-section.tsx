"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { lawyerImages } from "@/lib/site-config"

type Lawyer = {
  name: string
  title: string
  image: string
  initials: string
  highlights: string[]
}

const lawyers: Lawyer[] = [
  {
    name: "김한솔",
    title: "검사출신 대표 변호사",
    image: lawyerImages.kim,
    initials: "김한솔",
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
    initials: "구본우",
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
    initials: "박종진",
    highlights: [
      "대전고등검찰청 수범검사 선정",
      "인천지방검찰청 우수검사실 선정",
      "대전지방검찰청 홍성지청 우수검사실 선정",
      "성균관대학교 법학전문대학원 졸업",
      "캐나다 토론토 대학교 생명과학과 최우등 졸업 (High Distinction)",
    ],
  },
]

function LawyerCard({ lawyer, index }: { lawyer: Lawyer; index: number }) {
  const [open, setOpen] = useState(false)
  const { ref, isVisible } = useScrollReveal(0.15)

  return (
    <article
      ref={ref}
      className={`border border-border bg-background rounded-lg transition-all duration-700 overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full p-8 md:p-10 flex flex-col items-start text-left hover:bg-secondary/50 transition-colors"
      >
        <div className="flex w-full items-start justify-between gap-4">
          <div>
            <Avatar className="h-24 w-24 md:h-28 md:w-28 rounded-full mb-6 ring-2 ring-primary/20">
              <AvatarImage src={lawyer.image} alt={lawyer.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {lawyer.initials.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground tracking-[0.08em] mb-2">
              변호사
            </p>
            <h3 className="card-title text-xl md:text-2xl">{lawyer.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground tracking-[0.06em]">
              {lawyer.title}
            </p>
          </div>
          <span
            className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-border transition-transform duration-300 ${
              open ? "rotate-180 bg-primary/10" : "bg-secondary"
            }`}
            aria-hidden
          >
            <ChevronDown className="h-5 w-5 text-foreground" />
          </span>
        </div>
        <span className="mt-4 text-sm font-medium text-primary">
          {open ? "접기" : "펼쳐보기 +"}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border p-8 pt-6 md:p-10 md:pt-6">
            <ul className="space-y-2.5 text-base leading-relaxed text-foreground">
              {lawyer.highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[0.4rem] h-[3px] w-[10px] rounded-full bg-primary/60 shrink-0" />
                  <span>{item}</span>
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
    <section
      id="team"
      className="px-6 py-20 md:px-12 lg:px-20 md:py-28 bg-secondary"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`mb-14 md:mb-16 pb-6 border-b border-border transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="section-label">구성원</p>
          <h2 className="section-title">
            검사 출신 변호사가<br className="hidden md:block" />
            직접 함께합니다
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {lawyers.map((lawyer, index) => (
            <LawyerCard key={lawyer.name} lawyer={lawyer} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
