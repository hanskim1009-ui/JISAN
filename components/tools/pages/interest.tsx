import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { toolText } from "@/lib/tools/i18n"
import { ToolShell } from "@/components/tools/tool-shell"
import { InterestCalculator } from "@/components/tools/civil/interest-calculator"
import { relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [{ tool: "court-fees" }, { tool: "interest-cap" }, { tool: "deadline" }, { href: "/civil", label: "민사센터" }]

export function interestMetadata(lang: Lang) {
  const t = toolText(lang, "interest")
  return t && toolText(lang, "common") ? toolMetadata(lang, "interest", "interest", t.page) : {}
}

/** 지연이자 계산기 페이지 */
export function InterestPage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "interest")
  const c = toolText(lang, "common")
  if (!t || !c) notFound()
  return (
    <ToolShell lang={lang} toolId="interest" title={t.page.title} lead={t.page.lead} consultType="민사" notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <InterestCalculator lang={lang} t={t} c={c} />
    </ToolShell>
  )
}
