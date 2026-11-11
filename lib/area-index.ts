import { centerBase, centers } from "@/lib/centers"
import { getCenterPages } from "@/lib/center-pages"

/**
 * 메인 첫 화면 검색용: 모든 (한국어) 센터의 업무분야 페이지 목록.
 * n 분야 이름, c 센터 이름, h 주소, k 찾는 말(검색 키워드·묶음 이름), s 한 줄 설명
 */
export type AreaHit = { n: string; c: string; h: string; k: string; s: string }

export function buildAreaIndex(): AreaHit[] {
  const out: AreaHit[] = []
  for (const center of centers) {
    const pages = getCenterPages(center.slug)
    if (!pages) continue
    const base = centerBase(center)
    for (const a of pages.areaPages) {
      out.push({
        n: a.areaName,
        c: center.name,
        h: `${base}/${a.slug}`,
        k: [...a.seo.keywords, a.group ?? "", a.title].join(" "),
        s: a.summary ?? a.lead,
      })
    }
  }
  return out
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "")

/** 찾는 말에 맞는 업무분야를 점수 순으로. 이름이 맞으면 가장 높고, 키워드·설명이 맞으면 그다음 */
export function searchAreas(index: AreaHit[], query: string, limit = 6): AreaHit[] {
  const q = norm(query)
  if (q.length < 2) return []
  const words = query.trim().toLowerCase().split(/\s+/).filter((w) => w.length >= 2)
  const scored: [number, number, AreaHit][] = []
  index.forEach((a, i) => {
    const name = norm(a.n)
    const kw = norm(a.k)
    let score = 0
    if (name.includes(q)) score = 100
    else if (a.n.split(/[·()\s]/).some((part) => part.length >= 2 && q.includes(norm(part)))) score = 80
    else if (kw.includes(q)) score = 60
    else if (words.length > 0 && words.every((w) => name.includes(w) || kw.includes(w))) score = 45
    else if (norm(a.s).includes(q)) score = 25
    else if (words.length > 1 && words.some((w) => name.includes(w))) score = 15
    if (score > 0) scored.push([score, i, a])
  })
  return scored.sort((x, y) => y[0] - x[0] || x[1] - y[1]).slice(0, limit).map((x) => x[2])
}
