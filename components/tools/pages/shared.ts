/**
 * 계산기 페이지 공용 (서버 전용): 메타데이터, 관련 링크, 사무소 이름.
 * 한국어 /tools/* 와 외국어 /{언어}/tools/* 가 같은 페이지 컴포넌트(components/tools/pages/*)를 씁니다.
 */
import type { Metadata } from "next"
import { OG_LOCALE, type Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/fmt"
import { T } from "@/lib/i18n/t"
import { siteConfig } from "@/lib/site-config"
import { centerBase, getCenter } from "@/lib/centers"
import { getGuide } from "@/lib/center-pages"
import { toolAlternates, toolAvailable, toolLangs, toolText } from "@/lib/tools/i18n"
import { toolById, type ToolId } from "@/lib/tools/registry"

/**
 * 관련 링크 하나: 다른 계산기({ tool }) 또는 센터·안내 글.
 * 센터 링크의 href·label 은 한국어판용, center·guide 는 외국어판에서 그 언어 센터(crime-en 등)의 같은 글을 찾는 데 씀 (없으면 외국어판에서 뺌).
 */
export type RelatedDef = { tool: ToolId } | { href: string; label: string; center?: "crime" | "family" | "foreigner"; guide?: string }

export function relatedLinks(lang: Lang, defs: RelatedDef[]): { href: string; label: string }[] {
  const c = toolText(lang, "common")
  if (!c) return []
  const out: { href: string; label: string }[] = []
  for (const d of defs) {
    let link: { href: string; label: string } | undefined
    if ("tool" in d) {
      const e = toolById(d.tool)
      if (e && (lang === "ko" || (e.i18nKey && toolAvailable(lang, e.i18nKey)))) link = { href: L(lang, e.href), label: c.tools[d.tool].title }
    } else if (lang === "ko") link = { href: d.href, label: d.label }
    else if (d.center) {
      const slug = `${d.center}-${lang}`
      const center = getCenter(slug)
      if (center) {
        const base = centerBase(center)
        const g = d.guide ? getGuide(slug, d.guide) : undefined
        link = d.guide ? (g ? { href: `${base}/guide/${g.slug}`, label: g.title } : undefined) : { href: base, label: center.name }
      }
    }
    if (link && !out.some((x) => x.href === link.href)) out.push(link)
  }
  return out
}

/** 도구 페이지 메타데이터. og: 한국어판에서 openGraph 를 넣던 페이지 (외국어판은 늘 넣음) */
export function toolMetadata(lang: Lang, id: ToolId, key: string, page: { title: string; description: string; keywords?: string[] }, og = false): Metadata {
  const path = `/tools/${id}`
  const url = L(lang, path)
  return {
    title: page.title,
    description: page.description,
    ...(page.keywords ? { keywords: page.keywords } : {}),
    alternates: toolAlternates(lang, path, toolLangs(key)),
    ...(og || lang !== "ko"
      ? { openGraph: { title: page.title, description: page.description, url, type: "website" as const, ...(lang !== "ko" ? { locale: OG_LOCALE[lang] } : {}) } }
      : {}),
  }
}

/** 인쇄물 등에 쓰는 사무소 이름 (외국어는 사이트 번역) */
export const brandName = (lang: Lang) => T(lang)(siteConfig.name)
