"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Lang } from "@/lib/langs"

/**
 * 계산기에서 상담 신청으로: 어느 계산기에서 왔는지(from) 붙여 관리 화면 통계에서 경로를 셀 수 있게.
 * 외국어판은 신청서 없이 메신저 문의 안내(/{언어}/consult)로만 보냄.
 */
export function ToolConsultLink({ consultType, className, children, lang = "ko" }: { consultType?: string; className?: string; children: React.ReactNode; lang?: Lang }) {
  const path = usePathname()
  if (lang !== "ko")
    return (
      <Link href={`/${lang}/consult`} className={className}>
        {children}
      </Link>
    )
  const q = new URLSearchParams()
  if (consultType) q.set("type", consultType)
  if (path) q.set("from", path)
  return (
    <Link href={`/consult?${q.toString()}`} className={className}>
      {children}
    </Link>
  )
}
