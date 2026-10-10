import { groupFor, sentencingIntl } from "@/lib/tools/tool-data-i18n"

export const dynamic = "force-static"
export const dynamicParams = false

/** 번역이 없으면 빈 목록 → 만들지 않음 */
export function generateStaticParams() {
  return (sentencingIntl("zh")?.groups ?? []).map((g) => ({ id: g.id }))
}

/** 양형 계산기 (zh): 번역을 덮어쓴 범죄군 데이터 하나 (빌드 때 정적 JSON) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = groupFor("zh", (await params).id)
  if (!g) return new Response("Not Found", { status: 404 })
  return Response.json(g)
}
