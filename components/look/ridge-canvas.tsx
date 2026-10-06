"use client"

import { useEffect, useRef } from "react"
import { RIDGE_LAYERS as SHAPE, ridgeY } from "@/lib/ridge"

/** 겹 능선 색 (뒤 → 앞) */
export const ridgePalettes = {
  navy: ["rgba(74,101,138,0.50)", "rgba(52,79,116,0.70)", "rgba(33,57,90,0.90)", "rgba(19,39,66,1)", "rgba(8,22,40,1)"],
  warm: ["rgba(205,198,184,0.55)", "rgba(176,178,164,0.70)", "rgba(132,145,132,0.85)", "rgba(92,109,98,0.95)", "rgba(63,78,70,1)"],
} as const

/**
 * 여러 겹의 산 능선을 캔버스에 그리고 천천히 흐르게 합니다 (B안 첫 화면).
 * 화면에 보일 때만 움직이고, '동작 줄이기' 설정이면 멈춘 그림으로 둡니다.
 */
export function RidgeCanvas({ palette = "navy", className = "" }: { palette?: keyof typeof ridgePalettes; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return
    const colors = ridgePalettes[palette]
    let t = Math.random() * 40
    let last = 0
    let raf = 0
    let visible = true
    let dpr = 1

    const size = () => {
      const r = cv.getBoundingClientRect()
      const d = Math.min(window.devicePixelRatio || 1, 2)
      dpr = d
      cv.width = Math.max(1, Math.round(r.width * d))
      cv.height = Math.max(1, Math.round(r.height * d))
    }
    const draw = () => {
      const w = cv.width
      const h = cv.height
      ctx.clearRect(0, 0, w, h)
      SHAPE.forEach((l, i) => {
        ctx.beginPath()
        ctx.moveTo(0, h)
        // 화면이 넓어도 봉우리 폭이 늘어나지 않게 1440px 기준으로 계산
        for (let x = 0; x <= w; x += 4) ctx.lineTo(x, ridgeY(l, (x / dpr) / 1440, t) * h)
        ctx.lineTo(w, h)
        ctx.closePath()
        ctx.fillStyle = colors[i]
        ctx.fill()
      })
    }
    const loop = (ts: number) => {
      if (!last) last = ts
      t += Math.min(ts - last, 64) / 1000
      last = ts
      if (visible) draw()
      raf = requestAnimationFrame(loop)
    }

    size()
    draw()
    // 크기가 바뀔 때마다 다시 그림 (창 크기 변경, 시안 전환으로 숨겨졌다 보일 때 포함)
    const ro = new ResizeObserver(() => {
      size()
      draw()
    })
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [palette])

  return <canvas ref={ref} aria-hidden className={className} />
}
