"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * data-reveal 이 붙은 구역이 화면에 들어올 때 한 번 살짝 올라오게 합니다.
 * 처음 열었을 때 이미 보이는 구역은 건드리지 않고, 스크립트가 없거나 '동작 줄이기'면 그대로 보입니다.
 */
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.reveal-in)"))
    const below = els.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.9)
    below.forEach((el) => el.classList.add("reveal-pending"))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.remove("reveal-pending")
          e.target.classList.add("reveal-in")
          io.unobserve(e.target)
        })
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    )
    below.forEach((el) => io.observe(el))
    // 빠르게 스크롤하거나 메뉴로 건너뛰어 지나친 구역도 숨은 채로 남지 않게 함
    let raf = 0
    const sweep = () => {
      raf = 0
      document.querySelectorAll<HTMLElement>(".reveal-pending").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.remove("reveal-pending")
          el.classList.add("reveal-in")
          io.unobserve(el)
        }
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
      below.forEach((el) => el.classList.remove("reveal-pending"))
    }
  }, [pathname])

  return null
}
