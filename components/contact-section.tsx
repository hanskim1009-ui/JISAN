"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { MessageCircle, Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { ConsultForm } from "./consult-form"

const consultSteps = [
  { title: "상담접수", desc: "최소한의 정보로 빠르게 상담 접수" },
  { title: "담당변호사 확인", desc: "확인 후 담당자가 연락" },
  { title: "1:1 상담", desc: "담당 변호사가 직접 연락" },
]

export function ContactSection() {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal(0.15)
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollReveal(0.1)

  return (
    <section
      id="contact"
      className="px-6 py-24 md:px-12 lg:px-20 md:py-36 bg-foreground text-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div
            ref={headRef}
            className={`transition-all duration-1000 ${
              headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-[1.3] tracking-tight text-balance">
              가장 힘든 순간,
              <br className="hidden md:block" />
              혼자가 아니어야 합니다.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-background/85 max-w-xl">
              지금 이 순간에도 해결책은 존재합니다. 작은 궁금증도 괜찮습니다.
              먼저 연락 주시면, 담당 변호사가 직접 확인하고 빠르게 회신드립니다.
            </p>

            {/* 상담 단계 - 타임라인 */}
            <div className="mt-10">
              <div className="flex items-start w-full">
                {consultSteps.map((step, i) => {
                  return (
                    <div key={step.title} className="flex-1 flex flex-col items-center text-center">
                      {/* 원 + 연결선 */}
                      <div className="relative flex items-center justify-center w-full h-10 mb-3">
                        {i > 0 && (
                          <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-1/2 border-t border-dashed border-background/30" />
                        )}
                        {i < consultSteps.length - 1 && (
                          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-1/2 border-t border-dashed border-background/30" />
                        )}
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background/20 ring-2 ring-background/40 text-background text-xs font-bold">
                          0{i + 1}
                        </div>
                      </div>
                      {/* 텍스트 */}
                      <p className="text-sm font-medium text-background/95">{step.title}</p>
                      <p className="text-xs text-background/60 mt-0.5">{step.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium tracking-[0.08em] hover:bg-background/90 transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                전화 {siteConfig.phone}
              </a>
              <a
                href={siteConfig.kakaoTalkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#FEE500]/60 bg-[#FEE500] text-[#191919] px-6 py-3 text-sm font-medium tracking-[0.08em] hover:bg-[#FEE500]/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                카카오톡 상담
              </a>
            </div>
            <p className="mt-4 text-sm text-background/75">
              통화 연결이 어려운 경우,{" "}
              <span className="hidden lg:inline">오른쪽 폼이나</span>
              <span className="lg:hidden">하단 폼이나</span>
              {" "}카카오톡으로 연락처와 간단한 사건 내용을 남겨주시면 확인 후 회신드립니다.
            </p>
          </div>

          <div
            ref={bodyRef}
            className={`transition-all duration-1000 delay-150 ${
              bodyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="rounded-xl border border-background/20 bg-background p-6 md:p-8 text-foreground">
              <h3 className="text-base font-medium tracking-[0.08em] text-muted-foreground mb-6">
                상담 신청
              </h3>
              <ConsultForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
