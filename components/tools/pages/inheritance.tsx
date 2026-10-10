import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { toolText } from "@/lib/tools/i18n"
import { ToolShell } from "@/components/tools/tool-shell"
import { InheritanceCalculator } from "@/components/tools/family/inheritance-calculator"
import { relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [
  { tool: "reserved-share" },
  { tool: "child-support" },
  { href: "/inheritance", label: "상속센터", center: "family" },
  { href: "/divorce", label: "이혼센터", center: "family" },
]

export function inheritanceMetadata(lang: Lang) {
  const t = toolText(lang, "inheritance")
  return t && toolText(lang, "common") ? toolMetadata(lang, "inheritance", "inheritance", t.page) : {}
}

/** 상속분 계산기 페이지 */
export function InheritancePage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "inheritance")
  const c = toolText(lang, "common")
  if (!t || !c) notFound()
  return (
    <ToolShell lang={lang} title={t.page.title} lead={t.page.lead} consultType="상속" notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <InheritanceCalculator lang={lang} t={t} c={c} />
    </ToolShell>
  )
}
