import { revalidatePath, revalidateTag } from "next/cache"
import { SUPABASE_URL, restHeaders } from "@/lib/supabase"
import { POSTS_TAG } from "@/lib/posts-db"

/**
 * 관리 화면에서 글을 게시·게시 취소한 뒤 부릅니다. 사이트가 게시된 글을 바로 다시 읽게 합니다.
 * 로그인한 관리자만: 보낸 토큰으로 Supabase에 물어 관리자 목록에 있는지 확인합니다.
 */
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return Response.json({ ok: false }, { status: 401 })

  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: restHeaders(token), cache: "no-store" })
  if (!userRes.ok) return Response.json({ ok: false }, { status: 401 })
  const user = (await userRes.json()) as { id?: string }
  if (!user.id) return Response.json({ ok: false }, { status: 401 })

  const adminRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?select=user_id&user_id=eq.${user.id}`, {
    headers: restHeaders(token),
    cache: "no-store",
  })
  const rows = adminRes.ok ? ((await adminRes.json()) as unknown[]) : []
  if (rows.length === 0) return Response.json({ ok: false }, { status: 403 })

  revalidateTag(POSTS_TAG, "max")
  revalidatePath("/", "layout")
  return Response.json({ ok: true })
}
