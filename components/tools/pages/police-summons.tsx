import { notFound } from "next/navigation"
import type { Lang } from "@/lib/langs"
import { toolText } from "@/lib/tools/i18n"
import { ToolShell } from "@/components/tools/tool-shell"
import { PoliceSummonsChecklist } from "@/components/tools/police-summons/police-summons-checklist"
import { brandName, relatedLinks, toolMetadata, type RelatedDef } from "./shared"

const RELATED: RelatedDef[] = [
  { href: "/crime/guide/police-summons", label: "경찰 출석 요구를 받았을 때", center: "crime", guide: "police-summons" },
  { href: "/crime/guide/reschedule-interview", label: "출석 일정을 미루고 싶어요", center: "crime", guide: "reschedule-interview" },
  { href: "/crime/guide/interrogation-record", label: "조서 열람·수정과 서명", center: "crime", guide: "interrogation-record" },
  { tool: "prosecution" },
  { href: "/crime", label: "형사 센터", center: "crime" },
]

export function policeSummonsMetadata(lang: Lang) {
  const t = toolText(lang, "police-summons")
  return t && toolText(lang, "common") ? toolMetadata(lang, "police-summons", "police-summons", t.page, true) : {}
}

/** 경찰 출석요구 체크리스트 페이지 (/tools/police-summons, /{언어}/tools/police-summons) */
export function PoliceSummonsPage({ lang }: { lang: Lang }) {
  const t = toolText(lang, "police-summons")
  if (!t || !toolText(lang, "common")) notFound()
  return (
    <ToolShell toolId="police-summons" lang={lang} title={t.page.title} lead={t.page.lead} consultType="형사" notice={t.page.notice} related={relatedLinks(lang, RELATED)}>
      <PoliceSummonsChecklist lang={lang} t={t} brand={brandName(lang)} />
    </ToolShell>
  )
}
