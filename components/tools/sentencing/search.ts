/** 범죄 검색: 구형 계산기와 같은 방식(띄어쓰기 무시, 초성 검색) */
import { matchKo } from "@/components/tools/prosecution/search"
import type { GroupSummary } from "@/lib/tools/sentencing"

/** 범죄군 이름이 맞으면 그 범죄군의 세부 범죄 모두, 아니면 이름이 맞는 세부 범죄만 */
export function filterGroups(groups: GroupSummary[], query: string): GroupSummary[] {
  if (!query.trim()) return groups
  const out: GroupSummary[] = []
  for (const g of groups) {
    if (matchKo(g.name, query)) out.push(g)
    else {
      const crimes = g.crimes.filter((c) => matchKo(c.name, query))
      if (crimes.length) out.push({ ...g, crimes })
    }
  }
  return out
}
