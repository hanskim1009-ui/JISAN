/**
 * 법인 소개 띠 배경: 오른쪽으로 갈수록 높아지는 뾰족한 봉우리 여러 겹이 아래로 안개처럼 흐려지는 수묵 산.
 * 서버에서 한 번 계산한 SVG라 움직이지 않습니다.
 */
const W = 1440
const H = 900

/** 뒤 → 앞. base가 클수록 낮은 산, amp가 클수록 높은 봉우리 */
const LAYERS = [
  { color: "#2A4466", opacity: 0.55, base: 0.48, amp: 0.3, seed: 2.2 },
  { color: "#203A5C", opacity: 0.7, base: 0.6, amp: 0.26, seed: 5.1 },
  { color: "#17304F", opacity: 0.85, base: 0.72, amp: 0.22, seed: 8.3 },
  { color: "#0F2541", opacity: 1, base: 0.84, amp: 0.16, seed: 3.7 },
]

function layerPath(l: (typeof LAYERS)[number]) {
  const pts: string[] = []
  for (let x = 0; x <= W; x += 4) {
    const xx = x / W
    // 왼쪽(글이 있는 쪽)은 낮게, 오른쪽으로 갈수록 높게
    const lift = Math.pow(Math.max(0, (xx - 0.35) / 0.65), 1.2)
    const u = xx * 4 + l.seed
    let s = 0
    let n = 0
    let a = 1
    let f = 1
    for (let k = 0; k < 4; k++) {
      s += (1 - Math.abs(Math.sin(u * f + l.seed * k * 1.7))) * a
      n += a
      a *= 0.45
      f *= 2.3
    }
    const peak = 1 - l.base + l.amp * (s / n) * 1.6
    pts.push(`${x},${((1 - lift * peak * 1.15) * H).toFixed(1)}`)
  }
  return `M0,${H}L${pts.join("L")}L${W},${H}Z`
}

const PATHS = LAYERS.map(layerPath)

/** idPrefix: 한 페이지에 두 번 쓸 때 그라데이션 이름이 겹치지 않게. crop: 좁은 화면에서 오른쪽 봉우리만 크게 보이도록 잘라 볼 영역 (x y w h) */
export function InkMountains({ className = "", moon = true, crop, idPrefix = "ink" }: { className?: string; moon?: boolean; crop?: string; idPrefix?: string }) {
  return (
    <svg aria-hidden viewBox={crop ?? `0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice" className={className}>
      <defs>
        {LAYERS.map((l, i) => (
          <linearGradient key={i} id={`${idPrefix}-mist-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={l.color} stopOpacity={l.opacity} />
            <stop offset="0.55" stopColor={l.color} stopOpacity={l.opacity * 0.55} />
            <stop offset="1" stopColor="#0C1E36" stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {moon && <circle cx="1180" cy="210" r="34" fill="#F3EFE7" opacity="0.22" />}
      {PATHS.map((d, i) => (
        <path key={i} d={d} fill={`url(#${idPrefix}-mist-${i})`} />
      ))}
    </svg>
  )
}
