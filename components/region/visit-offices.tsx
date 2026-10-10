import { MapPin, Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { regionOffice, visitOffices, type Region } from "@/lib/regions"

/**
 * 방문 상담 장소: 주소가 있는 사무소만. 이 지역 사무소가 생기면(site-config 에 주소 입력) 맨 앞에 '이 지역 사무소'로 보입니다.
 * 주소가 없는 지역은 사무소라고 쓰지 않고 가까운 사무소로 안내합니다.
 */
export function VisitOffices({ region }: { region: Region }) {
  const own = regionOffice(region)
  const offices = visitOffices(region)
  return (
    <div className="min-w-0">
      <p className="mb-4 text-[0.9375rem] leading-relaxed text-jisan-ink/75">
        {own ? "" : `${region.name} 지역 사건은 전화와 상담 신청서로 먼저 받고, `}방문 상담은 {offices.map((o) => o.name).join(" · ")}에서 받습니다.
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {offices.map((o) => (
          <li key={o.name} className="min-w-0 border border-[#E2E6ED] bg-white p-5">
            {o === own && <span className="mb-2 inline-block rounded-full bg-jisan-ink px-2.5 py-0.5 text-xs font-bold text-white">이 지역 사무소</span>}
            <p className="text-lg font-bold text-jisan-ink">{o.name}</p>
            <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-jisan-ink/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-keep">{o.address}</span>
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold tabular-nums text-jisan-ink">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${(o.phone || siteConfig.phone).replace(/-/g, "")}`}>{o.phone || siteConfig.phone}</a>
            </p>
            {o.mapUrl && (
              <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-jisan-blue">
                지도 보기&nbsp;→
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
