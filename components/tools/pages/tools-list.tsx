import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OG_LOCALE, LANGS, type Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/fmt"
import { SectionHead } from "@/components/main/section-head"
import { toolAlternates, toolAvailable, toolText } from "@/lib/tools/i18n"
import { GROUP_KEY, TOOLS, TOOL_GROUPS } from "@/lib/tools/registry"
import { crimeToolAvailable } from "@/lib/tools/tool-data-i18n"

/** 그 언어 목록에 보일 도구: 한국어는 전부, 외국어는 번역이 다 된 도구만 */
export function toolsFor(lang: Lang) {
  if (lang === "ko") return TOOLS
  if (!toolText(lang, "common")) return []
  return TOOLS.filter((t) =>
    t.id === "prosecution" || t.id === "sentencing" ? crimeToolAvailable(t.id, lang) : Boolean(t.i18nKey && toolAvailable(lang, t.i18nKey)),
  )
}

/** 목록 페이지가 있는 언어 */
export const toolsListLangs = () => LANGS.filter((l) => toolsFor(l).length > 0)

export function toolsListMetadata(lang: Lang): Metadata {
  const c = toolText(lang, "common")
  if (!c || toolsFor(lang).length === 0) return {}
  return {
    title: c.list.seoTitle,
    description: c.list.seoDescription,
    alternates: toolAlternates(lang, "/tools", toolsListLangs()),
    ...(lang !== "ko"
      ? { openGraph: { title: c.list.seoTitle, description: c.list.seoDescription, url: L(lang, "/tools"), type: "website" as const, locale: OG_LOCALE[lang] } }
      : {}),
  }
}

/** 계산기·자가진단 목록 (/tools, /{언어}/tools) */
export function ToolsListPage({ lang }: { lang: Lang }) {
  const c = toolText(lang, "common")
  const tools = toolsFor(lang)
  if (!c || tools.length === 0) notFound()
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHead title={c.list.title} as="h1" desc={c.list.lead} />
        <div className="space-y-12">
          {TOOL_GROUPS.filter((g) => tools.some((t) => t.group === g)).map((g) => (
            <section key={g}>
              <h2 className="border-b border-jisan-ink pb-3 text-lg font-bold text-jisan-ink">{c.groups[GROUP_KEY[g]]}</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools
                  .filter((t) => t.group === g)
                  .map((t) => (
                    <li key={t.href} className="min-w-0">
                      <Link href={L(lang, t.href)} className="block h-full rounded-2xl border border-[#E2E6ED] bg-white p-5 transition hover:border-jisan-ink">
                        <p className="font-semibold text-jisan-ink">{c.tools[t.id].title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-[#4A505A]">{c.tools[t.id].desc}</p>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
