import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { toolText } from "@/lib/tools/i18n"
import { ToolShell } from "@/components/tools/tool-shell"
import { InterestCapCalculator } from "@/components/tools/civil/interest-cap-calculator"
import { relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [{ tool: "interest" }, { tool: "court-fees" }, { href: "/civil", label: "민사센터" }]

export function interestCapMetadata(lang: Lang) {
  const t = toolText(lang, "interest-cap")
  return t && toolText(lang, "common") ? toolMetadata(lang, "interest-cap", "interest-cap", t.page) : {}
}

/** 최고이자율 확인 페이지 */
export function InterestCapPage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "interest-cap")
  const c = toolText(lang, "common")
  if (!t || !c) notFound()
  return (
    <ToolShell lang={lang} toolId="interest-cap" title={t.page.title} lead={t.page.lead} consultType="민사" notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <InterestCapCalculator lang={lang} t={t} c={c} />
    </ToolShell>
  )
}
