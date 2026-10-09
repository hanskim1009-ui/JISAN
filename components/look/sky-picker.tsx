"use client"

import { useEffect, useState } from "react"
import { SEASONS, SKY_EVENT, SKY_PHASES, phaseOf, readSky, seasonOfMonth, type Season, type SkyPhase } from "@/lib/sky"

const PHASE_KO: Record<SkyPhase, string> = { night: "밤", dawn: "새벽", day: "낮" }
const SEASON_KO: Record<Season, string> = { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" }

/** 미리보기 전용 전환 버튼 (주소에 ?skypreview=1 · ?sky= · ?season= 이 있을 때만 보임) */
export function SkyPicker() {
  const [show, setShow] = useState(false)
  const [cur, setCur] = useState<{ phase: SkyPhase; season: Season }>({ phase: "night", season: "autumn" })

  useEffect(() => {
    setShow(document.documentElement.getAttribute("data-sky-preview") === "1")
    setCur(readSky())
  }, [])
  if (!show) return null

  const set = (phase: SkyPhase, season: Season) => {
    const d = document.documentElement
    d.setAttribute("data-sky", phase)
    d.setAttribute("data-season", season)
    setCur({ phase, season })
    window.dispatchEvent(new Event(SKY_EVENT))
  }
  const auto = () => {
    const m = +new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", month: "numeric" }).format(new Date())
    set(phaseOf(new Date().getHours()), seasonOfMonth(m))
  }
  const btn = (on: boolean) => `rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "bg-white text-brand" : "bg-white/10 text-white hover:bg-white/20"}`

  return (
    <div className="fixed bottom-4 left-4 z-[70] w-max max-w-[calc(100vw-2rem)] rounded-2xl bg-black/55 p-3 text-white shadow-lg backdrop-blur">
      <p className="mb-2 text-[0.6875rem] font-bold tracking-wide text-white/70">하늘 미리보기 (실제 사이트에는 안 보임)</p>
      <div className="flex flex-wrap gap-1.5">
        {SKY_PHASES.map((p) => (
          <button key={p} type="button" className={btn(cur.phase === p)} onClick={() => set(p, cur.season)}>
            {PHASE_KO[p]}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {SEASONS.map((s) => (
          <button key={s} type="button" className={btn(cur.season === s)} onClick={() => set(cur.phase, s)}>
            {SEASON_KO[s]}
          </button>
        ))}
        <button type="button" className={btn(false)} onClick={auto}>
          지금 시각
        </button>
      </div>
    </div>
  )
}
