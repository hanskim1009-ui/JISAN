"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/** 계산기에서 상담 신청으로: 어느 계산기에서 왔는지(from) 붙여 관리 화면 통계에서 경로를 셀 수 있게 */
export function ToolConsultLink({ consultType, className, children }: { consultType?: string; className?: string; children: React.ReactNode }) {
  const path = usePathname()
  const q = new URLSearchParams()
  if (consultType) q.set("type", consultType)
  if (path) q.set("from", path)
  return (
    <Link href={`/consult?${q.toString()}`} className={className}>
      {children}
    </Link>
  )
}
