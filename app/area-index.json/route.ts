import { buildAreaIndex } from "@/lib/area-index"

export const dynamic = "force-static"

/** 메인 첫 화면 검색이 처음 쓰일 때 한 번 받아 가는 업무분야 목록 */
export function GET() {
  return Response.json(buildAreaIndex())
}
