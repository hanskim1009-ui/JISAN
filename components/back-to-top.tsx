"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronUp } from "lucide-react"

/** 칼럼 목록·본문에서는 글을 가리지 않도록 숨깁니다 */
const HIDDEN = /^\/column(\/|$)/

export function BackToTop() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible || HIDDEN.test(pathname ?? "")) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[5.25rem] right-4 z-30 md:bottom-8 md:left-8 md:right-auto flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-colors"
      aria-label="맨 위로"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}
