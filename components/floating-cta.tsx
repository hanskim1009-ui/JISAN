"use client"

import { useState, useEffect } from "react"
import { Phone, MessageCircle } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

export function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mounted])

  if (!mounted || !visible) return null

  return (
    <>
      {/* 모바일: 하단 가로 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 md:pb-4 md:hidden safe-area-pb">
        <div className="flex gap-3 max-w-md mx-auto shadow-lg rounded-full bg-background/95 backdrop-blur-md border border-border p-2">
          <a
            href={siteConfig.phoneHref}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Phone className="h-4 w-4 shrink-0" />
            전화 상담
          </a>
          <a
            href={siteConfig.kakaoTalkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#FEE500] text-[#191919] text-sm font-medium hover:bg-[#FEE500]/90 transition-colors"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            카카오톡
          </a>
        </div>
      </div>

      {/* PC: 우측 하단 세로 버튼 */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-40 flex-col gap-3">
        <a
          href={siteConfig.phoneHref}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          title="전화 상담"
        >
          <Phone className="h-6 w-6" />
        </a>
        <a
          href={siteConfig.kakaoTalkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[#191919] shadow-lg hover:bg-[#FEE500]/90 transition-colors"
          title="카카오톡 상담"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </>
  )
}
