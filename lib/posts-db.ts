/**
 * 관리 화면에서 쓰고 승인자가 게시한 글을 읽어 옵니다 (서버에서만).
 * 5분마다 새로 읽고, 승인자가 게시하면 /api/revalidate 가 바로 새로 읽게 합니다.
 * 읽기에 실패하면 빈 목록을 돌려줘, 파일에 있는 글만으로 사이트가 그대로 보입니다.
 */
import { cache } from "react"
import { SUPABASE_URL, restHeaders } from "@/lib/supabase"

export type PostKind = "column" | "diary" | "case"

export type DbPost = {
  slug: string
  kind: PostKind
  title: string
  field: string
  centers: string[]
  date: string
  data: Record<string, unknown>
}

export const POSTS_TAG = "posts"

export const getPublishedPosts = cache(async (): Promise<DbPost[]> => {
  if (!SUPABASE_URL) return []
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=slug,kind,title,field,centers,date,data&status=eq.published&order=date.desc,published_at.desc`,
      { headers: restHeaders(), next: { revalidate: 300, tags: [POSTS_TAG] } },
    )
    if (!res.ok) return []
    return (await res.json()) as DbPost[]
  } catch {
    return []
  }
})

export { parseBody } from "@/lib/parse-body"
