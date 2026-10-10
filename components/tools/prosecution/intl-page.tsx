import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ToolShell } from "@/components/tools/tool-shell"
import { ProsecutionCalculator } from "@/components/tools/prosecution/prosecution-calculator"
import { L } from "@/lib/i18n/fmt"
import type { ForeignLang } from "@/lib/langs"
import Link from "next/link"
import { crimeToolAlternates, crimeToolAvailable, prosecutionIntl } from "@/lib/tools/tool-data-i18n"
import { crimePageSet } from "@/lib/tools/prosecution-page"

/** 외국어판 구형 계산기 메타데이터 (번역이 없으면 빈 값 → 페이지는 notFound) */
export function prosecutionIntlMetadata(lang: ForeignLang): Metadata {
  const p = crimeToolAvailable("prosecution", lang) ? prosecutionIntl(lang) : null
  if (!p) return {}
  return { title: p.ui.meta.title, description: p.ui.meta.description, alternates: crimeToolAlternates("prosecution", lang) }
}

/**
 * 외국어판 구형 계산기 (/{lang}/tools/prosecution): 외국인 사건에 자주 나오는 죄명만 번역해 보여 주고,
 * 나머지 죄명은 메시지 문의(/{lang}/consult)로 안내. 전화·신청서 없음
 */
export function ProsecutionIntlPage({ lang }: { lang: ForeignLang }) {
  const p = crimeToolAvailable("prosecution", lang) ? prosecutionIntl(lang) : null
  if (!p) notFound()
  const u = p.ui
  const page = crimePageSet(lang)?.text
  const related = [
    ...(crimeToolAvailable("sentencing", lang) ? [{ href: L(lang, "/tools/sentencing"), label: u.meta.relatedSentencing }] : []),
    { href: L(lang, "/crime"), label: u.meta.relatedCrimeCenter },
  ]
  return (
    <ToolShell toolId="prosecution" lang={lang} title={u.meta.title} lead={u.meta.lead} notice={u.meta.notice} related={related}>
      <ProsecutionCalculator
        crimes={p.index}
        intl={{ lang, ui: u, num: p.num, dataBase: L(lang, "/tools/prosecution/data"), consultHref: L(lang, "/consult") }}
        detail={page ? { base: L(lang, "/tools/prosecution"), label: page.detailLink } : undefined}
      />
      {page && (
        <p className="mt-8 text-sm">
          <Link href={L(lang, "/tools/prosecution/crimes")} className="text-[#4A505A] underline underline-offset-4 hover:text-jisan-ink">
            {page.allCrimes}
          </Link>
        </p>
      )}
    </ToolShell>
  )
}
