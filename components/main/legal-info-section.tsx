import type { ColumnItem } from "@/lib/content"
import type { FeedItem } from "@/lib/feeds"
import { SectionHead } from "@/components/main/section-head"
import { ColumnCard } from "@/components/column-parts"
import { LiteYouTube } from "@/components/lite-youtube"

/**
 * 법률 정보: 칼럼 3편(홈페이지 안 글) + 법인 유튜브(대표 영상 1 + 작은 영상 3)
 * 둘 다 없으면 통째로 숨깁니다. 네이버 블로그 글은 메인에 띄우지 않습니다.
 */
export function LegalInfoSection({ columns, videos, youtubeUrl }: { columns: ColumnItem[]; videos: FeedItem[]; youtubeUrl?: string }) {
  const playable = videos.filter((v) => v.videoId)
  if (columns.length === 0 && playable.length === 0) return null
  const [main, ...rest] = playable

  return (
    <section id="info" className="scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto space-y-14">
        {columns.length > 0 && (
          <div>
            <SectionHead title="칼럼" href="/column" linkLabel="칼럼 전체" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {columns.map((c) => (
                <ColumnCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        )}
        {main && (
          <div>
            <SectionHead title="유튜브" href={youtubeUrl} linkLabel="채널 보기" />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
              <figure className="min-w-0">
                <div className="relative aspect-video overflow-hidden bg-jisan-ink">
                  <LiteYouTube videoId={main.videoId!} title={main.title} thumbnail={main.thumbnail} />
                </div>
                <figcaption className="mt-2.5 text-[15px] font-semibold text-jisan-ink">{main.title}</figcaption>
              </figure>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {rest.map((v) => (
                  <li key={v.link} className="grid min-w-0 grid-cols-[9rem_1fr] gap-3 sm:grid-cols-1 lg:grid-cols-[9rem_1fr]">
                    <div className="relative aspect-video overflow-hidden bg-jisan-ink">
                      <LiteYouTube videoId={v.videoId!} title={v.title} thumbnail={v.thumbnail} />
                    </div>
                    <p className="text-sm font-semibold leading-snug text-jisan-ink">
                      {v.title}
                      <span className="mt-1 block text-xs font-normal tabular-nums text-[#8A9099]">{v.date.replaceAll("-", ".")}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
