"use client"

import { useEffect, useRef } from "react"

/** 겹 능선 색 (뒤 → 앞) */
export const ridgePalettes = {
  navy: ["rgba(74,101,138,0.50)", "rgba(52,79,116,0.70)", "rgba(33,57,90,0.90)", "rgba(19,39,66,1)", "rgba(8,22,40,1)"],
  warm: ["rgba(205,198,184,0.55)", "rgba(176,178,164,0.70)", "rgba(132,145,132,0.85)", "rgba(92,109,98,0.95)", "rgba(63,78,70,1)"],
} as const

const SHAPE = [
  { amp: 0.2, base: 0.42, seed: 1.3, sp: 0.004 },
  { amp: 0.2, base: 0.55, seed: 4.1, sp: 0.007 },
  { amp: 0.18, base: 0.67, seed: 7.7, sp: 0.011 },
  { amp: 0.16, base: 0.79, seed: 2.9, sp: 0.016 },
  { amp: 0.12, base: 0.9, seed: 9.4, sp: 0.024 },
]

/** 능선 높이: 큰 굴곡 하나 + 뾰족한 잔봉우리 몇 겹. 시간이 지나면 옆으로만 흐릅니다 */
function ridgeY(l: (typeof SHAPE)[number], x: number, t: number) {
  const u = x * 3 + t * l.sp * 6 + l.seed
  let s = 0
  let n = 0
  let a = 1
  let f = 1
  for (let i = 0; i < 4; i++) {
    const r = i === 0 ? (Math.sin(u * f + l.seed) + 1) / 2 : 1 - Math.abs(Math.sin(u * f + l.seed * i * 1.9))
    s += r * a
    n += a
    a *= 0.34
    f *= 2.4
  }
  return l.base - (s / n) * l.amp * 2.2 + l.amp * 0.6
}

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

    const size = () => {
      const r = cv.getBoundingClientRect()
      const d = Math.min(window.devicePixelRatio || 1, 2)
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
        for (let x = 0; x <= w; x += 4) ctx.lineTo(x, ridgeY(l, x / w, t) * h)
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
    const onResize = () => {
      size()
      draw()
    }
    window.addEventListener("resize", onResize)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener("resize", onResize)
    }
  }, [palette])

  return <canvas ref={ref} aria-hidden className={className} />
}
