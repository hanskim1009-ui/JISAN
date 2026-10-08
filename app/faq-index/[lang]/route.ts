import { buildFaqIndex } from "@/lib/faq-index"
import { FOREIGN_LANGS, type ForeignLang } from "@/lib/langs"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return FOREIGN_LANGS.map((lang) => ({ lang }))
}

/** 외국어 메인 '자주 묻는 질문' 검색용 (그 언어 외국인센터 질문) */
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  return Response.json(buildFaqIndex((await params).lang as ForeignLang))
}
