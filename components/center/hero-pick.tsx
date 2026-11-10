"use client"

import { useLayoutEffect } from "react"

/**
 * 센터 첫 화면 두 가지(대표변호사 / 단체 사진) 중 하나를 고릅니다.
 * 처음 열 때는 lead-hero.tsx 의 짧은 스크립트가 먼저 정하고,
 * 사이트 안에서 다른 센터로 넘어올 때는 여기서 다시 무작위로 정합니다.
 */
let firstLoad = true

export function HeroPick() {
  useLayoutEffect(() => {
    const d = document.documentElement
    if (firstLoad && d.getAttribute("data-hero-pick")) {
      firstLoad = false
      return
    }
    firstLoad = false
    d.setAttribute("data-hero-pick", Math.random() < 0.5 ? "a" : "b")
  }, [])
  return null
}
