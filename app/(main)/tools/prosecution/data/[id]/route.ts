import { loadChunk, loadChunkIds, loadIndex, loadIndexId } from "@/lib/tools/prosecution-data"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return [loadIndexId(), ...loadChunkIds()].map((id) => ({ id }))
}

/** 구형 계산기: 죄명 목록(index-…) 또는 죄명 데이터 조각 하나 (같은 묶음 죄명 수십 개, 빌드 때 정적 JSON 으로 만들어 둠) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  if (id === loadIndexId()) return Response.json(loadIndex())
  const list = loadChunk(id)
  if (!list) return new Response("Not Found", { status: 404 })
  return Response.json(list)
}
