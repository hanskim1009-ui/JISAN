"use client"

import Image from "next/image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCountUp } from "@/hooks/use-count-up"

const stats = [
  {
    value: 3,
    suffix: "명",
    label: "검사 출신 변호사",
    sub: "직접 상담·대응",
    desc: "고객의 신뢰는 변호사와의 직접 소통에서 나옵니다. 검사 경력의 시각으로 치밀하게 대응합니다.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=70",
  },
  {
    value: 5,
    suffix: "개",
    label: "주요 전문분야",
    sub: "형사·민사·기업·건설·회생",
    desc: "형사부터 회생·파산까지. 사건의 성격에 맞는 전문 분야를 선택할 수 있습니다.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&q=70",
  },
  {
    value: 24,
    suffix: "시간",
    label: "상담 대응",
    sub: "주말·공휴일 포함",
    desc: "형사 사건은 초기 대응이 중요합니다. 24시간 접근 가능한 상담을 제공합니다.",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&q=70",
  },
]

function StatBlock({
  value,
  suffix,
  label,
  sub,
  desc,
  image,
  index,
}: {
  value: number
  suffix: string
  label: string
  sub: string
  desc: string
  image: string
  index: number
}) {
  const { ref, isVisible } = useScrollReveal(0.15)
  const count = useCountUp(value, isVisible)

  return (
    <div
      ref={ref}
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-32 md:h-40 w-full overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-background px-6">
          <p className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            {count}
            <span className="text-2xl md:text-3xl text-foreground ml-1">{suffix}</span>
          </p>
          <p className="mt-1 text-sm font-medium tracking-[0.06em]">{label}</p>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <p className="text-xs tracking-[0.08em] text-foreground font-medium mb-1">
          {sub}
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  )
}

export function StatsSection() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section
      id="stats"
      className="px-6 py-20 md:py-32 bg-secondary border-y border-border"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`mb-10 md:mb-14 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] tracking-tight">경험과 신뢰</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatBlock key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
