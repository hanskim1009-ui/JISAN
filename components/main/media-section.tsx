import type { FeedItem } from "@/lib/feeds"
import { SectionHead } from "@/components/main/section-head"
import { BlogList } from "@/components/blog-list"

/** 유튜브·블로그: siteConfig.feeds 주소가 있는 채널만 보입니다 */
export function MediaSection({
  videos,
  posts,
  youtubeUrl,
  blogUrl,
}: {
  videos: FeedItem[]
  posts: FeedItem[]
  youtubeUrl?: string
  blogUrl?: string
}) {
  if (videos.length === 0 && posts.length === 0) return null
  const both = videos.length > 0 && posts.length > 0

  return (
    <section id="media" className="scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className={`max-w-7xl mx-auto grid grid-cols-1 gap-12 ${both ? "lg:grid-cols-[7fr_5fr]" : ""}`}>
        {videos.length > 0 && (
          <div className="min-w-0">
            <SectionHead title="유튜브" href={youtubeUrl} linkLabel="채널 보기" />
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
              {videos.map((v, i) => (
                <a
                  key={v.link}
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block min-w-0 ${i === 0 ? "sm:row-span-2" : ""}`}
                >
                  <div className="relative aspect-video overflow-hidden bg-jisan-ink">
                    {v.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-jisan-ink group-hover:underline underline-offset-4">{v.title}</p>
                  <p className="text-xs text-[#8A9099] tabular-nums">{v.date}</p>
                </a>
              ))}
            </div>
          </div>
        )}
        {posts.length > 0 && (
          <div className="min-w-0">
            <SectionHead title="블로그" href={blogUrl} linkLabel="블로그 보기" />
            <BlogList posts={posts} />
          </div>
        )}
      </div>
    </section>
  )
}
