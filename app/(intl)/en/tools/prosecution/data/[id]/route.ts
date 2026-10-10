import { prosecutionChunk, prosecutionChunkIds } from "@/lib/tools/tool-data-i18n"

export const dynamic = "force-static"
export const dynamicParams = false

/** 번역이 없으면 빈 목록 → 만들지 않음 */
export function generateStaticParams() {
  return prosecutionChunkIds("en").map((id) => ({ id }))
}

/** 구형 계산기 (en): 번역을 덮어쓴 죄명 데이터 조각 하나 (빌드 때 정적 JSON) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const list = prosecutionChunk("en", (await params).id)
  if (!list) return new Response("Not Found", { status: 404 })
  return Response.json(list)
}
