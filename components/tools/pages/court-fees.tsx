import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { toolText } from "@/lib/tools/i18n"
import { ToolShell } from "@/components/tools/tool-shell"
import { CourtFeeCalculator } from "@/components/tools/civil/court-fee-calculator"
import { relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [
  { tool: "interest" },
  { tool: "deadline" },
  { href: "/civil", label: "민사센터" },
  { href: "/divorce", label: "이혼센터", center: "family" },
]

export function courtFeesMetadata(lang: Lang) {
  const t = toolText(lang, "court-fees")
  return t && toolText(lang, "common") ? toolMetadata(lang, "court-fees", "court-fees", t.page) : {}
}

/** 소송비용(인지액·송달료) 계산기 페이지 */
export function CourtFeesPage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "court-fees")
  const c = toolText(lang, "common")
  if (!t || !c) notFound()
  return (
    <ToolShell lang={lang} toolId="court-fees" title={t.page.title} lead={t.page.lead} consultType="민사" notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <CourtFeeCalculator lang={lang} t={t} c={c} />
    </ToolShell>
  )
}
