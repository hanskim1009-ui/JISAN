import { centers } from "@/lib/centers"
import { getCenterPages } from "@/lib/center-pages"

/** 메인 '자주 묻는 질문' 검색용: 모든 센터의 질문과 답 (센터 기본 질문, 주제별 질문, 업무분야·안내 글의 질문) */
export type FaqHit = { q: string; a: string; c: string; n: string; h: string }

export function buildFaqIndex(): FaqHit[] {
  const out: FaqHit[] = []
  for (const center of centers) {
    const seen = new Set<string>()
    const n = center.name
    const add = (q: string, a: string, h: string) => {
      if (seen.has(q)) return
      seen.add(q)
      out.push({ q, a, c: center.slug, n, h })
    }
    const pages = getCenterPages(center.slug)
    for (const f of center.faqs) add(f.q, f.a, `/${center.slug}/faq`)
    if (!pages) continue
    for (const f of pages.moreFaqs) add(f.q, f.a, `/${center.slug}/faq`)
    for (const p of pages.areaPages) for (const f of p.faqs ?? []) add(f.q, f.a, `/${center.slug}/${p.slug}`)
    for (const g of pages.guides) for (const f of g.faqs ?? []) add(f.q, f.a, `/${center.slug}/guide/${g.slug}`)
  }
  return out
}
