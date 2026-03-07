"use client"

import { useMemo } from "react"
import Autoplay from "embla-carousel-autoplay"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Testimonial = {
  quote: string
  role: string
  category: string
  gender?: "male" | "female"
}

const testimonials: Testimonial[] = [
  {
    quote:
      "가장 불안했던 시기에 바로 옆에서 대응해 주셔서 감사했습니다. 결과만큼이나 과정에서 받은 안정감이 컸습니다.",
    role: "형사 사건 의뢰인",
    category: "형사",
    gender: "male",
  },
  {
    quote:
      "복잡한 민사 분쟁에서 단계별로 설명해 주시고, 합리적인 방향으로 이끌어 주셔서 신뢰가 갔습니다.",
    role: "민사 분쟁 의뢰인",
    category: "민사",
    gender: "female",
  },
  {
    quote:
      "기업 리스크 점검부터 실제 대응까지 한 팀처럼 함께해 주셔서, 어려운 상황을 잘 넘길 수 있었습니다.",
    role: "기업 법률 자문 의뢰인",
    category: "기업",
    gender: "male",
  },
  {
    quote:
      "건설 대금 분쟁으로 힘들 때, 지산 변호사님이 합리적인 조정으로 원만히 마무리해 주셨습니다. 감사합니다.",
    role: "건설 하도급 의뢰인",
    category: "건설·부동산",
    gender: "male",
  },
  {
    quote:
      "개인회생 절차가 복잡해 보였는데, 처음부터 끝까지 차근차근 안내해 주셔서 무사히 마쳤습니다.",
    role: "개인회생 의뢰인",
    category: "회생·파산",
    gender: "female",
  },
  {
    quote:
      "음주운전 사건으로 불안했는데, 꼼꼼한 변호 덕분에 최선의 결과를 받았습니다. 추천합니다.",
    role: "형사 사건 의뢰인",
    category: "형사",
    gender: "male",
  },
  {
    quote:
      "임대차 분쟁에서 법적 근거를 잘 설명해 주시고, 상대방과의 협상도 효과적으로 이끌어 주셨습니다.",
    role: "부동산 분쟁 의뢰인",
    category: "건설·부동산",
    gender: "female",
  },
  {
    quote:
      "사기 혐의로 입건되었을 때 포기할 뻔했는데, 변호사님 덕분에 불기소로 끝나 정말 감사했습니다.",
    role: "형사 사건 의뢰인",
    category: "형사",
    gender: "male",
  },
]

function MaleAvatar() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <clipPath id="male-circle">
        <circle cx="20" cy="20" r="20" />
      </clipPath>
      <circle cx="20" cy="20" r="20" fill="#d1e3f8" />
      <circle cx="20" cy="15" r="7" fill="#5b8fc9" clipPath="url(#male-circle)" />
      <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#5b8fc9" clipPath="url(#male-circle)" />
    </svg>
  )
}

function FemaleAvatar() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <clipPath id="female-circle">
        <circle cx="20" cy="20" r="20" />
      </clipPath>
      <circle cx="20" cy="20" r="20" fill="#f8d1e3" />
      <circle cx="20" cy="15" r="7" fill="#c95b8f" clipPath="url(#female-circle)" />
      <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#c95b8f" clipPath="url(#female-circle)" />
    </svg>
  )
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="flex flex-col items-center pb-6">
      {/* 말풍선 */}
      <div className="relative bg-white rounded-2xl shadow-md px-6 py-6 w-full"
        style={{ minHeight: "160px" }}
      >
        <p
          className="text-[21px] leading-relaxed text-[#333] text-center"
          style={{ fontFamily: "'Nanum Pen Script', cursive" }}
        >
          &ldquo;{item.quote}&rdquo;
        </p>

        {/* 말풍선 꼬리 - 항상 카드 중앙 하단 */}
        <div
          style={{
            position: "absolute",
            bottom: "-14px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "14px solid white",
          }}
        />
      </div>

      {/* 아바타 + 이름 */}
      <div className="mt-5 flex flex-col items-center gap-1">
        {item.gender === "female" ? <FemaleAvatar /> : <MaleAvatar />}
        <span
          className="text-[17px] text-[#555]"
          style={{ fontFamily: "'Nanum Pen Script', cursive" }}
        >
          {item.role.replace("의뢰인", "").trim()} 의뢰인
        </span>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal(0.05)

  const autoplay = useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false }),
    []
  )

  return (
    <section
      id="testimonials"
      className="py-24 md:py-36 bg-[#eef2f8] overflow-x-hidden"
    >
      {/* 헤더 */}
      <div className="px-6 md:px-12 lg:px-20 mb-14 md:mb-18">
        <div className="max-w-7xl mx-auto">
          <div
            ref={ref}
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-3 tracking-tight">
              의뢰인이 전하는 지산과의 경험
            </h2>
          </div>
        </div>
      </div>

      {/* 캐러셀 full-bleed */}
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
            {testimonials.map((item, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-[85%] sm:basis-[60%] md:basis-[calc(33.333%-0.67rem)] lg:basis-[calc(20%-0.8rem)]"
              >
                <div className="h-full">
                  <TestimonialCard item={item} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-4 top-1/2 -translate-y-1/2 border border-border bg-background/95 hover:bg-secondary shadow-sm z-10" />
          <CarouselNext className="right-2 md:right-4 top-1/2 -translate-y-1/2 border border-border bg-background/95 hover:bg-secondary shadow-sm z-10" />
        </Carousel>
      </div>

      {/* 하단 안내 문구 */}
      <div className="px-6 md:px-12 lg:px-20 mt-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[#aaa] text-right">
            개인정보 보호를 위해 일부 표현을 조정해 공유합니다.
          </p>
        </div>
      </div>
    </section>
  )
}
