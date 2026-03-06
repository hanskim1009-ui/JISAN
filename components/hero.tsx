"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import { QuickConsultForm } from "./quick-consult-form"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80",
    alt: "법정과 법전",
    label: "주말·공휴일 24시간 상담",
    title: "당신의 일상이 다시 평온해지도록,\n법률 그 이상의 마음으로 함께합니다.",
    sub: "형사 사건을 핵심으로 기업·민사·건설·부동산·회생·파산까지, 의뢰인의 일상 회복을 최우선 가치로 삼습니다.",
  },
  {
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=1920&q=80",
    alt: "법원과 법률",
    label: "검사 출신 변호사",
    title: "수사 단계부터 재판까지,\n치밀한 대응이 결과를 만듭니다.",
    sub: "수사 초기 대응에서 재판·항소심까지. 피의자·피고인의 방어권 보장을 최우선으로 구속·실형 가능성을 최소화합니다.",
  },
  {
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920&q=80",
    alt: "법률 서비스",
    label: "1:1 밀착 대응",
    title: "가장 힘든 순간,\n다시 일어설 수 있는 힘이 되어 드리겠습니다.",
    sub: "모든 사건을 숫자가 아닌 한 사람의 삶과 일상으로 바라보며, 과정에서도 충분히 보호받고 있다고 느끼실 수 있도록 함께합니다.",
  },
]

export function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const autoplay = useMemo(
    () => Autoplay({ delay: 5000, stopOnInteraction: false }),
    []
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [autoplay]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => emblaApi.off("select", onSelect)
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  return (
    <section className="relative h-[90vh] md:h-screen flex flex-col justify-end overflow-hidden border-b border-border">
      {/* Slide backgrounds */}
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={i} className="relative min-w-full shrink-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/70 mix-blend-multiply" />
            </div>
          ))}
        </div>
      </div>

      {/* Content overlay - same for all, but we'll show based on selected */}
      <div className="relative z-10 px-6 pb-16 md:px-12 lg:px-20 md:pb-24 text-background max-w-7xl mx-auto w-full">
        <div className="max-w-4xl relative min-h-[180px] md:min-h-[200px]">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-500 ${
                selectedIndex === i ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={selectedIndex !== i}
            >
              <p className="text-xs tracking-[0.12em] text-background/70 mb-5">
                {slide.label}
              </p>
              <h1 className="text-4xl md:text-5xl font-medium font-serif leading-[1.25] tracking-tight text-balance whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="mt-6 md:mt-8 max-w-xl text-base leading-relaxed text-background/85">
                {slide.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-14 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href="tel:0269514907"
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium tracking-[0.08em] hover:bg-primary/90 transition-colors duration-300 shrink-0"
            >
              지금 바로 전화 상담
            </a>
            <div className="flex items-center gap-4 text-xs text-background/70">
              <div className="w-10 h-px bg-background/40" />
              <p>검사 출신 변호사와의 1:1 밀착 대응</p>
            </div>
          </div>
          <div className="max-w-xl p-4 rounded-lg bg-background/10 border border-background/20">
            <p className="text-xs text-background/80 mb-3">빠른 상담 신청</p>
            <QuickConsultForm />
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === i
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-background/50 hover:bg-background/70"
              }`}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
