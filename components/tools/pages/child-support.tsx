import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { toolText } from "@/lib/tools/i18n"
import { ToolShell } from "@/components/tools/tool-shell"
import { ChildSupportCalculator } from "@/components/tools/family/child-support-calculator"
import { relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [
  { tool: "inheritance" },
  { tool: "reserved-share" },
  { href: "/divorce", label: "이혼센터", center: "family" },
  { href: "/inheritance", label: "상속센터" },
]

export function childSupportMetadata(lang: Lang) {
  const t = toolText(lang, "child-support")
  return t && toolText(lang, "common") ? toolMetadata(lang, "child-support", "child-support", t.page) : {}
}

/** 양육비 계산기 페이지 */
export function ChildSupportPage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "child-support")
  const c = toolText(lang, "common")
  if (!t || !c) notFound()
  return (
    <ToolShell lang={lang} title={t.page.title} lead={t.page.lead} consultType="이혼" notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <ChildSupportCalculator lang={lang} t={t} c={c} />
    </ToolShell>
  )
}
