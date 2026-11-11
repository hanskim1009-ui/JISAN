import type { Center } from "@/lib/centers"
import { centerBase } from "@/lib/centers"
import { siteConfig } from "@/lib/site-config"
import { lawyerProfilePath } from "@/lib/lawyer-entities"

/**
 * 센터·분야 페이지의 '법률 서비스' 구조화 데이터 (화면에는 안 보임).
 * 누가 맡는지(담당 변호사 대표 페이지), 어디서 상담하는지(사무소), 어떤 일인지(분야 이름·설명)를 검색엔진·AI 에 알려 줍니다.
 */
export function serviceSchema(center: Center, opts: { name: string; description: string; path: string; keywords?: string[] }) {
  const site = siteConfig.siteUrl
  const lawyers = center.lawyers.map((l) => ({ "@id": `${site}${lawyerProfilePath("ko", l.slug)}#person` }))
  return {
    "@type": "Service",
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: `${site}${opts.path}`,
    category: center.name,
    ...(opts.keywords && opts.keywords.length > 0 ? { keywords: opts.keywords.join(", ") } : {}),
    provider: { "@id": `${site}/#organization` },
    ...(lawyers.length > 0 ? { employee: lawyers, brand: { "@type": "Brand", name: `${siteConfig.shortName} ${center.name}`, url: `${site}${centerBase(center)}` } } : {}),
    areaServed: { "@type": "Country", name: "KR" },
    availableChannel: { "@type": "ServiceChannel", servicePhone: siteConfig.phone, serviceUrl: `${site}/consult` },
  }
}
