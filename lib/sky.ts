/**
 * 첫 화면 산 그림의 밤낮·사계절 (미리보기 단계).
 * - 시간대: 방문한 사람의 시계 기준 (외국에서 보면 그 나라 하늘)
 * - 계절: 한국 날짜 기준 (3~5월 봄, 6~8월 여름, 9~11월 가을, 12~2월 겨울)
 * - 시간대는 밤(19~5시)·새벽(5~7시)·낮(7~19시) 세 가지 (해 질 녘은 넣지 않기로 함)
 * - 주소 뒤 ?sky=night|dawn|day&season=spring|summer|autumn|winter 로 강제 지정, ?skypreview=1 이면 전환 버튼
 * 색은 남색(브랜드)을 벗어나지 않는 범위에서만 바뀝니다. 위쪽은 늘 헤더와 같은 남색에서 시작.
 */
export type SkyPhase = "night" | "dawn" | "day"
export type Season = "spring" | "summer" | "autumn" | "winter"

export const SKY_PHASES: SkyPhase[] = ["night", "dawn", "day"]
export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"]

/** 다섯 겹 능선 색 (뒤 → 앞), 시간대별 */
const PHASE_RIDGES: Record<SkyPhase, string[]> = {
  night: ["#3A5378", "#2A4366", "#1B3253", "#112440", "#08162A"],
  dawn: ["#6D6F8E", "#4D5A7D", "#30446A", "#1C3152", "#0D1F38"],
  day: ["#7E98B8", "#5A7AA0", "#3C5D86", "#24456C", "#122C4C"],
}

/** 계절 색을 앞쪽 능선에 살짝 섞음 (layer별 섞는 비율, 뒤 → 앞) */
const SEASON_TINT: Record<Season, { color: string; mix: number[] }> = {
  // 첫 화면에서 실제로 보이는 건 뒤쪽 2~3겹(앞쪽은 상황 카드에 가려짐)이라 뒤쪽에 더 섞음
  spring: { color: "#A9CB8E", mix: [0.2, 0.24, 0.22, 0.16, 0.08] },
  summer: { color: "#2F7A62", mix: [0.18, 0.28, 0.28, 0.2, 0.1] },
  autumn: { color: "#CB8243", mix: [0.24, 0.3, 0.24, 0.16, 0.08] },
  winter: { color: "#D5DEEA", mix: [0.26, 0.16, 0.08, 0.02, 0] },
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
function mix(a: string, b: string, t: number) {
  const [x, y] = [hex(a), hex(b)]
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`
}

/** 시간대·계절에 맞는 능선 다섯 겹 색 */
export function ridgeColors(phase: SkyPhase, season: Season) {
  const tint = SEASON_TINT[season]
  return PHASE_RIDGES[phase].map((c, i) => mix(c, tint.color, tint.mix[i] ?? 0))
}

/** 겨울엔 뒤쪽 두 겹 봉우리 끝에 눈선 */
export const snowLayers = (season: Season) => (season === "winter" ? [0, 1] : [])

export function phaseOf(hour: number): SkyPhase {
  if (hour >= 5 && hour < 7) return "dawn"
  if (hour >= 7 && hour < 19) return "day"
  return "night"
}

export function seasonOfMonth(month: number): Season {
  if (month >= 3 && month <= 5) return "spring"
  if (month >= 6 && month <= 8) return "summer"
  if (month >= 9 && month <= 11) return "autumn"
  return "winter"
}

/**
 * 첫 화면이 그려지기 전에 html[data-sky][data-season] 을 정하는 스크립트 (깜빡임 방지).
 * 위 phaseOf / seasonOfMonth 와 같은 규칙.
 */
export const skyInitScript = `(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search),h=new Date().getHours(),p=h>=5&&h<7?'dawn':h>=7&&h<19?'day':'night',m=+new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',month:'numeric'}).format(new Date()),s=m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter',qs=q.get('sky'),qn=q.get('season');if(['night','dawn','day'].indexOf(qs)>=0)p=qs;if(['spring','summer','autumn','winter'].indexOf(qn)>=0)s=qn;d.setAttribute('data-sky',p);d.setAttribute('data-season',s);if(q.has('skypreview')||qs||qn)d.setAttribute('data-sky-preview','1')}catch(e){}})()`

/** 미리보기 전환 버튼이 바꿀 때 알리는 이벤트 이름 */
export const SKY_EVENT = "jisan-sky"

export function readSky(): { phase: SkyPhase; season: Season } {
  const d = typeof document !== "undefined" ? document.documentElement : null
  const p = d?.getAttribute("data-sky") as SkyPhase | null
  const s = d?.getAttribute("data-season") as Season | null
  return { phase: p && SKY_PHASES.includes(p) ? p : "night", season: s && SEASONS.includes(s) ? s : "autumn" }
}
