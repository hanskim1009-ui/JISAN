import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ToolShell } from "@/components/tools/tool-shell"
import { SentencingCalculator } from "@/components/tools/sentencing/sentencing-calculator"
import { L } from "@/lib/i18n/fmt"
import type { ForeignLang } from "@/lib/langs"
import { crimeToolAlternates, crimeToolAvailable, sentencingIntl } from "@/lib/tools/tool-data-i18n"

/** 외국어판 양형 계산기 메타데이터 (번역이 없으면 빈 값 → 페이지는 notFound) */
export function sentencingIntlMetadata(lang: ForeignLang): Metadata {
  const s = crimeToolAvailable("sentencing", lang) ? sentencingIntl(lang) : null
  if (!s) return {}
  return { title: s.ui.meta.title, description: s.ui.meta.description, alternates: crimeToolAlternates("sentencing", lang) }
}

/**
 * 외국어판 양형 계산기 (/{lang}/tools/sentencing): 외국인 사건에 자주 나오는 범죄군만 번역해 보여 주고,
 * 나머지는 메시지 문의(/{lang}/consult)로 안내. 형량 범위는 언어별 표기로 다시 만듦
 */
export function SentencingIntlPage({ lang }: { lang: ForeignLang }) {
  const s = crimeToolAvailable("sentencing", lang) ? sentencingIntl(lang) : null
  if (!s) notFound()
  const u = s.ui
  const related = [
    ...(crimeToolAvailable("prosecution", lang) ? [{ href: L(lang, "/tools/prosecution"), label: u.meta.relatedProsecution }] : []),
    { href: L(lang, "/crime"), label: u.meta.relatedCrimeCenter },
  ]
  return (
    <ToolShell lang={lang} title={u.meta.title} lead={u.meta.lead} notice={u.meta.notice} related={related}>
      <SentencingCalculator
        groups={s.index}
        intl={{ lang, ui: u, num: s.num, dataBase: L(lang, "/tools/sentencing/data"), consultHref: L(lang, "/consult") }}
      />
    </ToolShell>
  )
}
