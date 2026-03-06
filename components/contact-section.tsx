"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { MessageCircle, Phone, FileCheck, UserCheck, PhoneCall } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { ConsultForm } from "./consult-form"

const consultSteps = [
  { icon: FileCheck, title: "상담접수", desc: "최소한의 정보로 빠르게 상담 접수" },
  { icon: UserCheck, title: "담당변호사 확인", desc: "확인 후 담당자가 연락" },
  { icon: PhoneCall, title: "1:1 상담", desc: "담당 변호사가 직접 연락" },
]

export function ContactSection() {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal(0.15)
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollReveal(0.1)

  return (
    <section
      id="contact"
      className="px-6 py-20 md:px-12 lg:px-20 md:py-28 bg-foreground text-background"
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
              형사 사건은 초기 대응이 무엇보다 중요합니다. 지산은 주말·공휴일을
              포함해 24시간 상담이 가능하며, 사건의 성격과 절박함을 이해하는 것에서
              출발합니다.
            </p>

            {/* 상담 단계 시각화 (로엘 스타일) */}
            <div className="mt-10">
              <p className="text-xs tracking-[0.1em] text-background/60 mb-4 uppercase">
                상담 진행 절차
              </p>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                {consultSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div
                      key={step.title}
                      className="flex items-start gap-4 sm:flex-1 sm:flex-col sm:items-center sm:text-center sm:max-w-[140px]"
                    >
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/20 text-background ring-2 ring-background/30">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="mt-1 text-[10px] font-medium text-background/70">
                          0{i + 1}
                        </span>
                      </div>
                      <div className="sm:mt-4 min-w-0">
                        <p className="text-sm font-medium text-background/95">
                          {step.title}
                        </p>
                        <p className="text-xs text-background/70 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
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
              통화 연결이 어려운 경우, 하단 폼이나 카카오톡으로 연락처와 간단한
              사건 내용을 남겨주시면 확인 후 회신드립니다.
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
