"use client"

import Image from "next/image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function EditorialBreak() {
  const { ref: imgRef, isVisible: imgVisible } = useScrollReveal(0.15)
  const { ref: quoteRef, isVisible: quoteVisible } = useScrollReveal(0.2)

  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <div
          ref={imgRef}
          className={`lg:col-span-7 overflow-hidden transition-all duration-1000 ${
            imgVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Image
            src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=1400&q=80"
            alt="서울 법원 일대 전경"
            width={1400}
            height={788}
            className="w-full aspect-[16/9] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            sizes="(max-width: 1024px) 100vw, 80vw"
          />
        </div>
        <div
          ref={quoteRef}
          className={`lg:col-span-4 lg:col-start-9 transition-all duration-1000 delay-200 ${
            quoteVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="w-10 h-px bg-foreground/30 mb-8" />
          <blockquote className="text-xl md:text-2xl font-semibold leading-[1.5] tracking-tight text-foreground text-balance">
            “의뢰인의 하루가 다시 평온해질 수 있도록, 결과뿐 아니라 과정을 함께
            책임지는 것이 지산의 역할이라고 믿습니다.”
          </blockquote>
          <p className="mt-6 text-sm tracking-[0.08em] text-muted-foreground">
            김한솔 대표변호사 · 법률사무소 지산
          </p>
        </div>
      </div>
      </div>
    </section>
  )
}

