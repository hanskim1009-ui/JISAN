import Image from "next/image"
import type { DiaryEntry } from "@/lib/content"

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"]

function formatDate(date: string) {
  // "2025-12-03"을 서버 시간대와 무관하게 그대로 읽습니다
  const [y, m, d] = date.split("-").map(Number)
  const mm = String(m).padStart(2, "0")
  const dd = String(d).padStart(2, "0")
  return {
    md: `${mm}.${dd}`,
    full: `${y}.${mm}.${dd}`,
    yw: `${y} · ${WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}요일`,
  }
}

/** 메인: 최근 감사일기 3개 (사진 + 날짜 + 짧은 글) */
export function DiaryGrid({ entries }: { entries: DiaryEntry[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {entries.map((e) => (
        <article key={e.id} className="min-w-0">
          {e.photos[0] ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-[#E4E6E9]">
              <Image src={e.photos[0]} alt={e.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          ) : (
            e.sample && <div className="flex aspect-[4/3] items-center justify-center bg-[#E4E1DA] text-sm text-[#8A857B]">사진 자리</div>
          )}
          <p className="mt-3 text-[13px] text-[#8A9099] tabular-nums">{formatDate(e.date).full}</p>
          <h3 className="mt-0.5 text-[17px] font-bold text-jisan-ink">{e.title}</h3>
          <p className="mt-1.5 text-[15px] leading-[1.75] text-[#2D323A]">{e.body}</p>
          <p className="mt-2 text-xs font-bold text-brand-accent">{e.field}</p>
        </article>
      ))}
    </div>
  )
}

/** 감사일기 페이지: 왼쪽 날짜, 가운데 사진, 오른쪽 글 */
export function DiaryList({ entries }: { entries: DiaryEntry[] }) {
  return (
    <div>
      {entries.map((e) => {
        const d = formatDate(e.date)
        return (
          <article key={e.id} className="grid grid-cols-1 md:grid-cols-[9rem_18rem_1fr] gap-4 md:gap-8 border-t border-[#E4E6E9] py-7">
            <p className="text-[13px] text-[#8A9099] tabular-nums">
              <span className="block text-2xl font-bold tracking-tight text-jisan-ink">{d.md}</span>
              {d.yw}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {e.photos.slice(0, 2).map((p, i) => (
                <div key={p} className={`relative overflow-hidden bg-[#E4E6E9] ${e.photos.length === 1 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}>
                  <Image src={p} alt={`${e.title} 사진 ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 18rem" />
                </div>
              ))}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-jisan-ink">{e.title}</h2>
              <p className="mt-2 text-[15px] leading-[1.85] text-[#2D323A] whitespace-pre-line">{e.body}</p>
              <p className="mt-3 text-[13px] text-[#8A9099]">
                <b className="text-brand-accent">{e.field}</b> · {e.author} · 보내 주신 분의 허락을 받았습니다
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
