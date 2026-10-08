"use client"

import type { Lang } from "@/lib/langs"
import { LangMenu } from "@/components/lang-menu"

/** 언어 바꾸기 (지구본 펼침 목록, 여섯 언어) */
export function LangSwitch({ current, dark = true, className = "", align = "right" }: { current: Lang; dark?: boolean; className?: string; align?: "left" | "right" }) {
  return <LangMenu current={current} dark={dark} className={className} align={align} />
}
