import Image from "next/image"
import { siteConfig } from "@/lib/site-config"
import { SectionHead } from "@/components/main/section-head"

/** 오시는 길: 주소·전화·지도 */
export function MapSection() {
  const rows = [
    ["주소", siteConfig.address],
    ["전화", `${siteConfig.phone} · 24시간 · 주말·공휴일 포함`],
  ]

  return (
    <section id="map" className="scroll-mt-20 px-5 md:px-12 lg:px-14 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="오시는 길" href={siteConfig.naverMapUrl} linkLabel="네이버 지도에서 보기" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          <dl className="text-[15px]">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-3">
                <dt className="font-semibold text-jisan-ink">{k}</dt>
                <dd className="text-[#4A505A]">{v}</dd>
              </div>
            ))}
          </dl>
          <a
            href={siteConfig.naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-[2/1] overflow-hidden border border-[#E4E6E9] hover:opacity-90 transition-opacity"
          >
            <Image src="/images/map.png" alt={`${siteConfig.name} 위치 지도`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
          </a>
        </div>
      </div>
    </section>
  )
}
