/**
 * 겹 능선 모양 (B안 첫 화면 그래픽과 분야별 센터 카드가 같이 씀)
 * base: 능선이 놓이는 높이(0 위 ~ 1 아래), amp: 굴곡 크기, seed: 모양을 바꾸는 값, sp: 흐르는 속도
 */
export type RidgeLayer = { amp: number; base: number; seed: number; sp: number }

export const RIDGE_LAYERS: RidgeLayer[] = [
  { amp: 0.2, base: 0.42, seed: 1.3, sp: 0.004 },
  { amp: 0.2, base: 0.55, seed: 4.1, sp: 0.007 },
  { amp: 0.18, base: 0.67, seed: 7.7, sp: 0.011 },
  { amp: 0.16, base: 0.79, seed: 2.9, sp: 0.016 },
  { amp: 0.12, base: 0.9, seed: 9.4, sp: 0.024 },
]

/** 능선 높이: 큰 굴곡 하나 + 뾰족한 잔봉우리 몇 겹. x는 1440px 너비를 1로 본 값 */
export function ridgeY(l: RidgeLayer, x: number, t = 0) {
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

/** 멈춘 능선 한 겹을 SVG path로 (width×height 상자, 아래는 막힘). scale: 1440px 대비 가로 배율 */
export function ridgePath(l: RidgeLayer, width: number, height: number, scale = 1) {
  const pts: string[] = []
  for (let x = 0; x <= width; x += 4) pts.push(`${x},${(ridgeY(l, (x / 1440) * scale) * height).toFixed(1)}`)
  return `M0,${height} L${pts.join(" L")} L${width},${height} Z`
}
