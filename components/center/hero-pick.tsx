"use client"

import { useLayoutEffect } from "react"

/**
 * 센터 첫 화면에서 무작위로 정하는 두 가지:
 *  data-hero-pick  a 대표변호사 / b 단체 사진 (지금은 b 로 고정)
 *  data-hero-line  제목 문구 번호 (lib/prosecutor.ts heroLines)
 * 처음 열 때는 lead-hero.tsx 의 짧은 스크립트가 먼저 정하고(깜빡임 방지),
 * 사이트 안에서 다른 센터로 넘어올 때는 여기서 다시 정합니다.
 */
let firstLoad = true

export function HeroPick({ lines }: { lines: number }) {
  useLayoutEffect(() => {
    const d = document.documentElement
    if (firstLoad && d.getAttribute("data-hero-pick")) {
      firstLoad = false
      return
    }
    firstLoad = false
    d.setAttribute("data-hero-pick", "b")
    d.setAttribute("data-hero-line", String(Math.floor(Math.random() * lines)))
  }, [lines])
  return null
}
