import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { toolText } from "@/lib/tools/i18n"
import { ToolShell } from "@/components/tools/tool-shell"
import { DeadlineCalculator } from "@/components/tools/civil/deadline-calculator"
import { relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [
  { tool: "court-fees" },
  { tool: "interest" },
  { href: "/civil", label: "민사센터" },
  { href: "/crime", label: "형사센터", center: "crime" },
]

export function deadlineMetadata(lang: Lang) {
  const t = toolText(lang, "deadline")
  return t && toolText(lang, "common") ? toolMetadata(lang, "deadline", "deadline", t.page) : {}
}

/** 법정 기한 계산기 페이지 */
export function DeadlinePage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "deadline")
  if (!t || !toolText(lang, "common")) notFound()
  return (
    <ToolShell lang={lang} title={t.page.title} lead={t.page.lead} notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <DeadlineCalculator lang={lang} t={t} />
    </ToolShell>
  )
}
