/**
 * 첫 화면 하늘: 별·달(밤), 해 근처 빛(새벽·해 질 녘·낮). 보일지 말지는 html[data-sky] 에 따라 CSS로 정함 (globals.css .sky-*)
 * 별 위치는 매번 같게 고정 (서버·브라우저 그림이 어긋나지 않도록)
 */
const STARS = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  return { x: r(1) * 100, y: r(2) * 52, s: r(3) < 0.18 ? 2 : 1, d: (r(4) * 6).toFixed(2) }
})

export function SkyLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="sky-glow absolute inset-0" />
      <div className="sky-stars absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="sky-star absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
          />
        ))}
      </div>
      <div className="sky-moon absolute right-[7%] top-[2.5%] h-7 w-7 rounded-full md:right-[12%] md:top-[14%] md:h-11 md:w-11" />
    </div>
  )
}
