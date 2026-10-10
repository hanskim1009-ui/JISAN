import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { toolText } from "@/lib/tools/i18n"
import { ToolShell } from "@/components/tools/tool-shell"
import { ReservedShareCalculator } from "@/components/tools/family/reserved-share-calculator"
import { relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [
  { tool: "inheritance" },
  { tool: "child-support" },
  { href: "/inheritance", label: "상속센터", center: "family" },
  { href: "/divorce", label: "이혼센터", center: "family" },
]

export function reservedShareMetadata(lang: Lang) {
  const t = toolText(lang, "reserved-share")
  return t && toolText(lang, "inheritance") && toolText(lang, "common") ? toolMetadata(lang, "reserved-share", "reserved-share", t.page) : {}
}

/** 유류분 계산기 페이지 (상속인 입력은 상속분 계산기 사전을 함께 씀) */
export function ReservedSharePage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "reserved-share")
  const it = toolText(lang, "inheritance")
  const c = toolText(lang, "common")
  if (!t || !it || !c) notFound()
  return (
    <ToolShell toolId="reserved-share" lang={lang} title={t.page.title} lead={t.page.lead} consultType="상속" notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <ReservedShareCalculator lang={lang} t={t} it={it} c={c} />
    </ToolShell>
  )
}
