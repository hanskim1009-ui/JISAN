import Image from "next/image"
import { officeAddress, openOffices, siteConfig } from "@/lib/site-config"
import { SectionHead } from "@/components/main/section-head"

/** 오시는 길: 문을 연 사무소마다 주소·전화 + 주사무소 지도 (분사무소가 열리면 목록에 더해집니다) */
export function MapSection() {
  const main = openOffices[0]
  const several = openOffices.length > 1

  return (
    <section id="map" className="screen scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div data-reveal className="max-w-7xl mx-auto">
        <SectionHead
          title="오시는 길"
          desc={several ? `사무소 ${openOffices.length}곳 중 가까운 곳으로 오시면 됩니다.` : undefined}
          href={main?.mapUrl || siteConfig.naverMapUrl}
          linkLabel="네이버 지도에서 보기"
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          <dl className="text-[0.9375rem]">
            {openOffices.map((o) => (
              <div key={o.name} className="border-b border-[#E4E6E9] py-3.5">
                <dt className="font-semibold text-jisan-ink">{o.name}</dt>
                <dd className="mt-1 text-[#4A505A]">
                  {o.mapUrl ? (
                    <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                      {officeAddress(o)}
                    </a>
                  ) : (
                    officeAddress(o)
                  )}
                  {o.phone && <span className="block tabular-nums">전화 {o.phone}</span>}
                </dd>
              </div>
            ))}
            <div className="py-3.5 text-[#4A505A]">상담 전화는 24시간, 주말·공휴일에도 받습니다.</div>
          </dl>
          <a
            href={main?.mapUrl || siteConfig.naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-[2/1] overflow-hidden border border-[#E4E6E9] hover:opacity-90 transition-opacity"
          >
            <Image src="/images/map.png" alt={`${siteConfig.name} ${main?.name ?? ""} 위치 지도`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
          </a>
        </div>
      </div>
    </section>
  )
}
