"use client"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase"

let client: SupabaseClient | null = null

/** 관리 화면용 Supabase (로그인 상태를 브라우저에 기억) */
export function sb() {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } })
  return client
}

export type Options = {
  centers: { slug: string; name: string }[]
  lawyers: { slug: string; name: string; title: string }[]
  fields: string[]
  caseTypes: string[]
}

export type Me = { id: string; email: string; name: string; role: "writer" | "approver" }

export type PostKind = "column" | "diary" | "case"
export type PostStatus = "draft" | "pending" | "published" | "rejected"

export type PostRow = {
  id: string
  slug: string
  kind: PostKind
  status: PostStatus
  title: string
  field: string
  centers: string[]
  date: string
  data: Record<string, unknown>
  review_note: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  published_at: string | null
}

export type ConsultRow = {
  id: string
  created_at: string
  name: string
  phone: string
  case_type: string | null
  stage: string | null
  concern: string | null
  message: string | null
  source: string | null
  page: string | null
  status: "new" | "contacted" | "done"
  memo: string | null
}

export const KIND_LABEL: Record<PostKind, string> = { column: "칼럼", diary: "감사일기", case: "업무사례" }
export const STATUS_LABEL: Record<PostStatus, string> = { draft: "임시저장", pending: "검토 대기", published: "게시됨", rejected: "반려" }
export const STATUS_STYLE: Record<PostStatus, string> = {
  draft: "bg-[#EEF0F3] text-jisan-ink/70",
  pending: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
}

/**
 * 변호사 광고 규정상 쓰면 안 되는 표현 (저장은 되지만 경고를 띄웁니다).
 * '전문'은 '전문가', '전문의'처럼 쓰일 수 있어 경고만.
 */
const BANNED = ["승소율", "승률", "최고", "최상", "최초", "유일", "완벽", "압도적", "보장", "무료", "서초", "전관", "전문", "100%", "확실히 이깁", "무조건"]

export function adWarnings(text: string) {
  return BANNED.filter((w) => text.includes(w))
}

/** 게시·게시 취소 뒤 사이트가 바로 새로 읽게 */
export async function refreshSite() {
  const { data } = await sb().auth.getSession()
  const token = data.session?.access_token
  if (!token) return
  await fetch("/api/revalidate", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
}

export function newSlug(kind: PostKind, date: string) {
  const rand = Math.random().toString(36).slice(2, 7)
  return `${kind}-${date.replace(/-/g, "")}-${rand}`
}

export const today = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** 사진을 긴 변 1600px JPEG로 줄여서 올림 (휴대폰 사진도 5MB 안으로) */
export async function shrinkImage(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = rej
      i.src = url
    })
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.85))
  } finally {
    URL.revokeObjectURL(url)
  }
}

export const inputCls =
  "w-full rounded-lg border border-[#D5DAE1] bg-white px-3 py-2 text-[0.9375rem] outline-none focus:border-jisan-ink/60"
export const btnCls = "rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
