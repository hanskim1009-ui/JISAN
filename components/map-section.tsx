"use client"

import Image from "next/image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { siteConfig } from "@/lib/site-config"
import { MapPin, Phone, Clock } from "lucide-react"

export function MapSection() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section
      id="map"
      className={`px-6 py-20 md:px-12 lg:px-20 md:py-32 bg-secondary transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="section-title">
            법률사무소 지산으로 오시는 길
          </h2>
        </div>

        {/* 텍스트 정보 - 카드 스타일 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 flex gap-4 items-start shadow-sm border border-[#e8ecf0]">
            <MapPin className="h-5 w-5 text-[#1e3a8a] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-[#999] mb-1">Address</p>
              <p className="text-[15px] text-[#333] leading-relaxed">{siteConfig.address}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex gap-4 items-start shadow-sm border border-[#e8ecf0]">
            <Phone className="h-5 w-5 text-[#1e3a8a] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-[#999] mb-1">Tel</p>
              <a href={siteConfig.phoneHref} className="text-[15px] text-[#333] hover:underline block">
                {siteConfig.phone}
              </a>
              <p className="text-[13px] text-[#999] mt-1">주말·공휴일 24시간 상담가능</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex gap-4 items-start shadow-sm border border-[#e8ecf0]">
            <Clock className="h-5 w-5 text-[#1e3a8a] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-[#999] mb-1">Hours</p>
              <p className="text-[15px] text-[#333] leading-relaxed">평일 00:00–24:00</p>
              <p className="text-[13px] text-[#999] mt-1">주말·공휴일 24시간 상담가능</p>
            </div>
          </div>
        </div>

        {/* 지도 이미지 - 전체 너비 */}
        <a
          href={siteConfig.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full aspect-[3/1] rounded-xl overflow-hidden border border-border shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Image
            src="/images/map.png"
            alt="법률사무소 지산 위치"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </a>

        {/* 지도 링크 */}
        <div className="flex gap-6 mt-4">
          <a
            href={siteConfig.naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground hover:underline"
          >
            네이버 지도에서 보기 →
          </a>
        </div>
      </div>
    </section>
  )
}
