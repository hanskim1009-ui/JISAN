import type { Metadata } from "next"
import { SiteLayout } from "@/components/site-pages/site-layout"
import { siteConfig } from "@/lib/site-config"

// 외국어 페이지 제목 끝에는 영문 법인명 (한국어 법인명이 붙지 않게)
export const metadata: Metadata = { title: { template: `%s | ${siteConfig.nameEn}`, default: siteConfig.nameEn } }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="ru">{children}</SiteLayout>
}
