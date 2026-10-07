import { buildFaqIndex } from "@/lib/faq-index"

export const dynamic = "force-static"

/** 메인 '자주 묻는 질문' 검색이 처음 쓰일 때 한 번 받아 가는 질문 목록 */
export function GET() {
  return Response.json(buildFaqIndex())
}
