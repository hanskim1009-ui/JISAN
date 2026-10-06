/**
 * 네이버 블로그·유튜브 최신 글을 RSS로 가져옵니다.
 * 한 시간마다 새로 읽고, 실패하면 빈 목록을 돌려줘 해당 영역만 숨겨집니다.
 */

export type FeedItem = { title: string; link: string; date: string; category?: string; thumbnail?: string; videoId?: string }

const pick = (xml: string, tag: string) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  if (!m) return ""
  return m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim()
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")

const toDate = (s: string) => {
  const d = new Date(s)
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10)
}

async function fetchText(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return ""
    return await res.text()
  } catch {
    return ""
  }
}

export async function getNaverBlogPosts(blogId: string, limit = 5): Promise<FeedItem[]> {
  if (!blogId) return []
  const xml = await fetchText(`https://rss.blog.naver.com/${blogId}.xml`)
  return xml
    .split("<item>")
    .slice(1, limit + 1)
    .map((item) => ({
      title: decode(pick(item, "title")),
      link: pick(item, "link").replace(/\?fromRss=true.*$/, ""),
      date: toDate(pick(item, "pubDate")),
      category: decode(pick(item, "category")) || undefined,
    }))
    .filter((p) => p.title && p.link)
}

export async function getYoutubeVideos(channelId: string, limit = 3): Promise<FeedItem[]> {
  if (!channelId) return []
  const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
  return xml
    .split("<entry>")
    .slice(1, limit + 1)
    .map((entry) => {
      const videoId = pick(entry, "yt:videoId")
      return {
        title: decode(pick(entry, "title")),
        link: `https://www.youtube.com/watch?v=${videoId}`,
        date: pick(entry, "published").slice(0, 10),
        thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined,
        videoId: videoId || undefined,
      }
    })
    .filter((v) => v.title)
}
