/** 범죄 검색: 구형 계산기와 같은 방식(띄어쓰기 무시, 초성 검색) */
import { matchKo, normIntl } from "@/components/tools/prosecution/search"
import type { GroupSummary } from "@/lib/tools/sentencing"

/** 범죄군 이름이 맞으면 그 범죄군의 세부 범죄 모두, 아니면 이름이 맞는 세부 범죄만. intl 이면 외국어 다듬기(악센트 무시)로 */
export function filterGroups(groups: GroupSummary[], query: string, intl = false): GroupSummary[] {
  if (!query.trim()) return groups
  const q = normIntl(query)
  const match = intl ? (s: string) => !!q && normIntl(s).includes(q) : (s: string) => matchKo(s, query)
  const out: GroupSummary[] = []
  for (const g of groups) {
    if (match(g.name)) out.push(g)
    else {
      const crimes = g.crimes.filter((c) => match(c.name))
      if (crimes.length) out.push({ ...g, crimes })
    }
  }
  return out
}
