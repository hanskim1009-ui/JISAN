import { loadGroup, loadGroups } from "@/lib/tools/sentencing-data"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return loadGroups().map((g) => ({ id: g.id }))
}

/** 양형 계산기: 고른 범죄군 하나의 데이터 (빌드 때 정적 JSON 으로 만들어 둠) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = loadGroup((await params).id)
  if (!g) return new Response("Not Found", { status: 404 })
  return Response.json(g)
}
