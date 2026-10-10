import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/fmt"
import { toolAvailable, toolText } from "@/lib/tools/i18n"
import { toolById } from "@/lib/tools/registry"
import { ToolShell } from "@/components/tools/tool-shell"
import { DrunkDrivingCalculator } from "@/components/tools/drunk-driving/drunk-driving-calculator"
import { relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [
  { tool: "prosecution" },
  { tool: "sentencing" },
  { href: "/crime/guide/drunk-driving-caught", label: "음주운전으로 단속됐을 때", center: "crime", guide: "drunk-driving-caught" },
  { href: "/crime/drunk-driving", label: "음주운전·교통사고", center: "crime" },
  { tool: "police-summons" },
]

export function drunkDrivingMetadata(lang: Lang) {
  const t = toolText(lang, "drunk-driving")
  return t && toolText(lang, "common") ? toolMetadata(lang, "drunk-driving", "drunk-driving", t.page, true) : {}
}

/** 구형 예상 계산기 주소: 한국어는 늘, 외국어는 그 언어판이 있을 때만 */
function prosecutionHref(lang: Lang) {
  const e = toolById("prosecution")
  if (!e) return undefined
  return lang === "ko" || (e.i18nKey && toolAvailable(lang, e.i18nKey)) ? L(lang, e.href) : undefined
}

/** 음주운전 처벌 기준 확인 페이지 */
export function DrunkDrivingPage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "drunk-driving")
  const c = toolText(lang, "common")
  if (!t || !c) notFound()
  return (
    <ToolShell lang={lang} title={t.page.title} lead={t.page.lead} consultType="형사" notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <DrunkDrivingCalculator t={t} c={c} prosecutionHref={prosecutionHref(lang)} />
    </ToolShell>
  )
}
