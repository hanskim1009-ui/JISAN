import { siteConfig, openOffices } from "@/lib/site-config"
import { allCenters, centerBase, centers } from "@/lib/centers"
import { lawyers } from "@/lib/lawyers"
import { lawyerI18n } from "@/lib/lawyers-i18n"
import { regions, regionBase } from "@/lib/regions"
import { getCenterPages } from "@/lib/center-pages"
import { lawyerEntity, lawyerProfilePath } from "@/lib/lawyer-entities"

/**
 * /llms.txt — AI 검색(ChatGPT, Perplexity, Gemini, 네이버 큐 등)이 사이트를 빨리 파악하도록 정리한 안내 파일.
 * 법인·변호사·센터·분야 페이지 주소를 사실 위주로 나열합니다. 화면에는 나오지 않습니다.
 * 광고 규정: 사실만. '전문', '최고', 결과 예측, 비교 표현은 쓰지 않습니다.
 */
export const revalidate = 3600

export async function GET() {
  const u = (p: string) => `${siteConfig.siteUrl}${p}`
  const lines: string[] = []
  lines.push(`# ${siteConfig.name} (JISAN & PARTNERS)`)
  lines.push("")
  lines.push(`> 서울 서초에 주사무소를 둔 한국 법무법인입니다. 형사(성범죄·마약·음주운전·경제범죄·도박), 가사·상속, 학교폭력, 기업, 의료, 부동산, 민사 사건을 맡습니다. 한국에 사는 외국인의 형사·체류·가사 사건도 맡습니다. 김한솔 대표변호사가 영어로 직접 상담하고, 그 밖의 언어는 AI 통역을 함께 써서 상담합니다. 영어·중국어·베트남어·러시아어·몽골어 안내 페이지가 있습니다. 상담 전화 ${siteConfig.phone} (24시간, 주말·공휴일 포함).`)
  lines.push("")
  lines.push(`> A Korean law firm headquartered in Seocho, Seoul. Criminal defense (sexual offences, drugs, drink-driving, fraud, gambling), family and inheritance, school violence, corporate, medical, real estate and civil matters. Regularly represents foreign nationals living in Korea. Consultations directly in English, and in other languages with AI interpretation. Pages in English, Chinese, Vietnamese, Russian and Mongolian: ${u("/en")}`)
  lines.push("")
  lines.push("## 사무소")
  for (const o of openOffices) lines.push(`- ${o.name}: ${o.address}${o.phone ? ` (${o.phone})` : ""}`)
  lines.push("")
  lines.push("## 변호사")
  for (const l of lawyers) {
    const about = lawyerEntity(l.slug)?.about.ko ?? (l.tagline ?? l.summary).replace(/\n/g, " ")
    const en = lawyerI18n(l.slug, "en")?.name
    lines.push(`- [${l.name} ${l.title}${en ? ` (${en})` : ""}](${u(lawyerProfilePath("ko", l.slug))}): ${about}`)
  }
  lines.push("")
  lines.push("## 분야별 센터")
  for (const c of centers) {
    lines.push(`- [${c.name}](${u(centerBase(c))}): ${c.summary}`)
    const pages = getCenterPages(c.slug)
    for (const a of pages?.areaPages ?? []) lines.push(`  - [${a.areaName}](${u(`${centerBase(c)}/${a.slug}`)})`)
  }
  lines.push("")
  lines.push("## 지역")
  for (const r of regions) lines.push(`- [${siteConfig.name} ${r.name}](${u(regionBase(r))}): ${r.seo.description}`)
  lines.push("")
  lines.push("## Foreign-language centers")
  for (const c of allCenters.filter((x) => x.lang && x.lang !== "ko")) lines.push(`- [${c.name}](${u(centerBase(c))}) (${c.lang})`)
  lines.push("")
  lines.push("## 더 보기")
  lines.push(`- [업무사례](${u("/cases")}): 실제로 맡았던 사건의 쟁점과 결과`)
  lines.push(`- [칼럼](${u("/column")})`)
  lines.push(`- [상담 신청](${u("/consult")})`)
  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
