import type { FeedItem } from "@/lib/feeds"

/** 블로그 글 목록: 제목 + 날짜 한 줄 (외부 링크) */
export function BlogList({ posts, dark = false }: { posts: FeedItem[]; dark?: boolean }) {
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.link} className={`border-b ${dark ? "border-white/15" : "border-[#E4E6E9]"}`}>
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 text-[15px] hover:underline underline-offset-4"
          >
            <span className="min-w-0">{p.title}</span>
            <span className={`text-[13px] tabular-nums ${dark ? "text-white/55" : "text-[#8A9099]"}`}>{p.date.slice(5).replace("-", ".")}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
