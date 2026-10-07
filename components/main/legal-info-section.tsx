import type { ColumnItem } from "@/lib/content"
import type { FeedItem } from "@/lib/feeds"
import { SectionHead } from "@/components/main/section-head"
import { ColumnCard } from "@/components/column-parts"
import { LiteYouTube } from "@/components/lite-youtube"
import { SampleNote } from "@/components/sample-note"
import { Play } from "lucide-react"

/**
 * 법률 정보: 칼럼 3편(홈페이지 안 글) + 법인 유튜브(대표 영상 1 + 작은 영상 3)
 * 둘 다 없으면 통째로 숨깁니다. 네이버 블로그 글은 메인에 띄우지 않습니다.
 */
export function LegalInfoSection({ columns, videos, youtubeUrl }: { columns: ColumnItem[]; videos: FeedItem[]; youtubeUrl?: string }) {
  if (columns.length === 0 && videos.length === 0) return null
  const [main, ...rest] = videos
  const sampleVideos = videos.length > 0 && videos.every((v) => !v.videoId)

  return (
    <section id="info" className="screen scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div data-reveal className="max-w-7xl mx-auto space-y-14">
        {columns.length > 0 && (
          <div>
            <SectionHead title="칼럼" desc="실무에서 겪은 일을 지산 변호사들이 직접 씁니다." href="/column" linkLabel="더보기" />
            <SampleNote show={columns.some((c) => c.sample)} className="mb-4" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {columns.map((c) => (
                <ColumnCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        )}
        {main && (
          <div>
            <SectionHead title="유튜브" desc="법률 상담이 낯설지 않도록 변호사가 직접 설명합니다." href={youtubeUrl} linkLabel="채널 바로가기" />
            <SampleNote show={sampleVideos} className="mb-4" />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
              <figure className="min-w-0">
                <div className="relative aspect-video overflow-hidden bg-jisan-ink">
                  <Video v={main} />
                </div>
                <figcaption className="mt-2.5 text-[0.9375rem] font-semibold text-jisan-ink">{main.title}</figcaption>
              </figure>
              <ul className="grid grid-cols-1 content-start gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {rest.map((v) => (
                  <li key={v.link} className="grid min-w-0 grid-cols-[9rem_1fr] gap-3 sm:grid-cols-1 lg:grid-cols-[9rem_1fr]">
                    <div className="relative aspect-video overflow-hidden bg-jisan-ink">
                      <Video v={v} />
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

/** 실제 영상은 눌러서 재생, 예시 영상(영상 주소 없음)은 빈 자리만 */
function Video({ v }: { v: FeedItem }) {
  if (v.videoId) return <LiteYouTube videoId={v.videoId} title={v.title} thumbnail={v.thumbnail} />
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-tone to-brand">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
        <Play className="h-5 w-5 translate-x-px fill-current" />
      </span>
    </div>
  )
}
