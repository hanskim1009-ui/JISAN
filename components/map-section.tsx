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
      className={`px-6 py-16 md:px-12 lg:px-20 md:py-24 bg-secondary transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="section-label mb-2">오시는 길</p>
        <h2 className="section-title">
          법률사무소 지산
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
            <p className="text-sm font-medium text-foreground">주소</p>
            <p className="text-base text-muted-foreground mt-1">{siteConfig.address}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">전화</p>
              <a href={siteConfig.phoneHref} className="text-sm text-primary hover:underline mt-1 block">
                {siteConfig.phone}
              </a>
              <p className="text-sm text-muted-foreground mt-1">주말/공휴일 24시간 상담가능</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">상담 가능</p>
              <p className="text-base text-muted-foreground mt-1">평일 09:00–18:00 / 주말·공휴일 24시간</p>
            </div>
          </div>
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href={siteConfig.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              네이버 지도에서 보기 →
            </a>
            <a
              href={siteConfig.kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              카카오맵에서 보기 →
            </a>
          </div>
        </div>

        <a
          href={siteConfig.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block rounded-xl overflow-hidden border border-border shadow-sm aspect-[4/3] lg:aspect-[16/10] min-h-[220px] hover:opacity-95 transition-opacity"
        >
          <Image
            src="/images/jisan-map.png"
            alt="법률사무소 지산 위치 - 네이버 지도"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </a>
      </div>
      </div>
    </section>
  )
}
