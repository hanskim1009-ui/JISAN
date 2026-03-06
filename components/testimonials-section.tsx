"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Quote } from "lucide-react"

type Testimonial = {
  quote: string
  role: string
  category: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "가장 불안했던 시기에 바로 옆에서 대응해 주셔서 감사했습니다. 결과만큼이나 과정에서 받은 안정감이 컸습니다.",
    role: "형사 사건 의뢰인",
    category: "형사",
  },
  {
    quote:
      "복잡한 민사 분쟁에서 단계별로 설명해 주시고, 합리적인 방향으로 이끌어 주셔서 신뢰가 갔습니다.",
    role: "민사 분쟁 의뢰인",
    category: "민사",
  },
  {
    quote:
      "기업 리스크 점검부터 실제 대응까지 한 팀처럼 함께해 주셔서, 어려운 상황을 잘 넘길 수 있었습니다.",
    role: "기업 법률 자문 의뢰인",
    category: "기업",
  },
]

function TestimonialCard({
  item,
  index,
}: {
  item: Testimonial
  index: number
}) {
  const { ref, isVisible } = useScrollReveal(0.15)

  return (
    <article
      ref={ref}
      className={`group bg-background p-6 md:p-8 border border-border rounded-lg transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Quote className="h-8 w-8 text-foreground/40 mb-4" />
      <p className="text-base leading-relaxed text-foreground mb-6">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <span className="text-xs tracking-[0.08em] text-foreground font-medium">
          {item.category}
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span className="text-sm text-muted-foreground">{item.role}</span>
      </div>
    </article>
  )
}

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section
      id="testimonials"
      className="px-6 py-20 md:px-12 lg:px-20 md:py-28 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`mb-14 md:mb-16 pb-6 border-b border-border transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title">
            의뢰인이 전하는
            <br className="hidden md:block" />
            지산과의 경험
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          개인정보 보호를 위해 일부 표현을 조정해 공유합니다.
        </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((item, index) => (
          <TestimonialCard key={item.role} item={item} index={index} />
        ))}
      </div>
      </div>
    </section>
  )
}
