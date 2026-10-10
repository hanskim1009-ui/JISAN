"use client"

import { showId, type ConsultProgress, type ConsultRow } from "@/components/admin/shared"

/** 처리 단계 순서·이름·색 */
export const PROGRESS: { key: ConsultProgress; label: string; cls: string; bar: string }[] = [
  { key: "received", label: "접수", cls: "bg-red-100 text-red-700", bar: "bg-red-400" },
  { key: "contacted", label: "연락함", cls: "bg-amber-100 text-amber-800", bar: "bg-amber-400" },
  { key: "booked", label: "상담 예약", cls: "bg-sky-100 text-sky-800", bar: "bg-sky-400" },
  { key: "consulted", label: "상담함", cls: "bg-indigo-100 text-indigo-800", bar: "bg-indigo-400" },
  { key: "retained", label: "수임", cls: "bg-emerald-100 text-emerald-800", bar: "bg-emerald-500" },
  { key: "declined", label: "미수임", cls: "bg-[#EEF0F3] text-jisan-ink/70", bar: "bg-[#9AA3AF]" },
  { key: "unreachable", label: "연락 안 됨", cls: "bg-[#EEF0F3] text-jisan-ink/50", bar: "bg-[#C4CAD3]" },
]
export const PROGRESS_OF = Object.fromEntries(PROGRESS.map((p) => [p.key, p])) as Record<ConsultProgress, (typeof PROGRESS)[number]>

/** 끝난 단계 (처리 중에서 빠짐) */
export const CLOSED: ConsultProgress[] = ["retained", "declined", "unreachable"]
export const isOpen = (r: Pick<ConsultRow, "progress">) => !CLOSED.includes(r.progress)
/** 상담까지 간 건 (상담 대비 수임률의 분모) */
export const MET: ConsultProgress[] = ["consulted", "retained", "declined"]

export type AdminLite = { user_id: string; email: string; name: string }
export const adminName = (a?: AdminLite) => (a ? a.name || showId(a.email) : "")

export const when = (s: string) =>
  new Date(s).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })

/** 로컬 날짜 YYYY-MM-DD */
export const ymd = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** 다음 연락일이 오늘 이전이고 아직 처리 중 */
export const overdue = (r: ConsultRow, todayStr: string) => isOpen(r) && !!r.next_contact_on && r.next_contact_on < todayStr

/** 신청 경로: 출처(source)·페이지(page)로 묶음 — 메인, 센터별, 지역, 계산기 등 */
export function channelOf(r: Pick<ConsultRow, "source" | "page">) {
  const s = (r.source ?? "").trim()
  const page = r.page ?? ""
  // /consult?from=/tools/... 처럼 넘어온 곳이 적혀 있으면 그것을 먼저 봄
  const from = page.includes("?") ? new URLSearchParams(page.slice(page.indexOf("?") + 1)).get("from") ?? "" : ""
  const path = from || page.split("?")[0]
  if (path.startsWith("/tools") || path.includes("/tools/")) return "계산기"
  if (s === "메인 상담 페이지") return "메인 상담 페이지"
  if (s.endsWith("상담 페이지")) return "외국어 상담 페이지"
  if (s.startsWith("지역:")) return "지역 페이지"
  if (s) return s.split(" · ")[0]
  if (!path) return "알 수 없음"
  if (path === "/") return "메인"
  return `/${path.split("/")[1]}`
}

/** 경로 아래 세부 (센터 안의 어느 페이지에서 왔는지 등) */
export const detailOf = (r: Pick<ConsultRow, "source" | "page">) => r.source?.trim() || r.page || "알 수 없음"

export const rate = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "–")

export function Badge({ p }: { p: ConsultProgress }) {
  const x = PROGRESS_OF[p] ?? PROGRESS[0]
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${x.cls}`}>{x.label}</span>
}
