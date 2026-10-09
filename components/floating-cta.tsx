"use client"

import { useState, useEffect } from "react"
import { Phone, MessageCircle } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import type { Lang } from "@/lib/langs"
import { extraLangs } from "@/lib/i18n/extra-langs"

const TEXT: Record<Lang, { call: string; kakao: string; consult: string; callAria: string; kakaoAria: string }> = {
  ko: { call: "전화", kakao: "카카오톡", consult: "상담 신청", callAria: "전화 상담", kakaoAria: "카카오톡 상담" },
  en: { call: "Call", kakao: "KakaoTalk", consult: "Contact us", callAria: "Call us", kakaoAria: "KakaoTalk" },
  zh: { call: "电话", kakao: "KakaoTalk", consult: "申请咨询", callAria: "电话咨询", kakaoAria: "KakaoTalk 咨询" },
  vi: extraLangs.vi.floating,
  ru: extraLangs.ru.floating,
  mn: extraLangs.mn.floating,
}

/** 모바일 하단 바(전화·카카오톡·상담 신청) + PC 우측 하단 버튼 */
export function FloatingCTA({ consultHref = "/#contact", lang = "ko", chatLabel }: { consultHref?: string; lang?: Lang; chatLabel?: string }) {
  const [visible, setVisible] = useState(false)
  const T = TEXT[lang]

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  // 외국어 센터: 전화 없이 메신저 문의 버튼 하나 (누르면 페이지 아래 메신저 목록으로)
  if (chatLabel)
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-border px-3 pt-2.5 safe-area-pb shadow-[0_-6px_16px_rgba(20,30,60,0.06)]">
          <div className="max-w-md mx-auto pb-2.5">
            <a href={consultHref} className="flex items-center justify-center gap-2 rounded-lg bg-jisan-blue py-3 text-sm font-semibold text-white">
              <MessageCircle className="h-4 w-4 shrink-0" />
              {chatLabel}
            </a>
          </div>
        </div>
        <div className="hidden md:flex fixed bottom-8 right-8 z-40">
          <a
            href={consultHref}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-jisan-blue text-white shadow-lg hover:bg-jisan-blue/90 transition-colors"
            title={chatLabel}
            aria-label={chatLabel}
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        </div>
      </>
    )

  return (
    <>
      {/* 모바일: 하단 가로 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-border px-3 pt-2.5 safe-area-pb shadow-[0_-6px_16px_rgba(20,30,60,0.06)]">
        <div className="grid grid-cols-[1fr_1fr_1.2fr] gap-2 max-w-md mx-auto pb-2.5">
          <a
            href={siteConfig.phoneHref}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-3 text-sm font-semibold text-jisan-ink"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {T.call}
          </a>
          <a
            href={siteConfig.kakaoTalkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-[#FEE500] py-3 text-sm font-semibold text-[#191919]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            {T.kakao}
          </a>
          <a
            href={consultHref}
            className="flex items-center justify-center rounded-lg bg-jisan-blue py-3 text-sm font-semibold text-white"
          >
            {T.consult}
          </a>
        </div>
      </div>

      {/* PC: 우측 하단 세로 버튼 */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-40 flex-col gap-3">
        <a
          href={siteConfig.phoneHref}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-jisan-blue text-white shadow-lg hover:bg-jisan-blue/90 transition-colors"
          title={T.callAria}
          aria-label={T.callAria}
        >
          <Phone className="h-6 w-6" />
        </a>
        <a
          href={siteConfig.kakaoTalkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[#191919] shadow-lg hover:bg-[#FEE500]/90 transition-colors"
          title={T.kakaoAria}
          aria-label={T.kakaoAria}
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </>
  )
}
