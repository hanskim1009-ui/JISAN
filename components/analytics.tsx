"use client"

import { useEffect } from "react"
import Script from "next/script"
import { siteConfig } from "@/lib/site-config"

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    gtag?: Gtag
    dataLayer?: unknown[]
    wcs?: { inflow: (d: string) => void }
    wcs_add?: Record<string, string>
    wcs_do?: () => void
  }
}

/** 문의로 이어지는 클릭 (전화·메신저·상담 신청)을 구글 애널리틱스 이벤트로 남김 */
const CHAT_HOSTS: [RegExp, string][] = [
  [/pf\.kakao\.com/, "kakao"],
  [/t\.me\//, "telegram"],
  [/wa\.me\//, "whatsapp"],
  [/zalo\.me\//, "zalo"],
  [/m\.me\//, "messenger"],
  [/line\.me\//, "line"],
]

export function trackEvent(name: string, params: Record<string, string> = {}) {
  window.gtag?.("event", name, { ...params, page_path: location.pathname })
}

/** 구글 애널리틱스 4 + 네이버 애널리틱스. ID가 없으면 아무것도 넣지 않음 */
export function Analytics() {
  const { gaId, naverAnalyticsId } = siteConfig.seo

  useEffect(() => {
    if (!gaId) return
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("a,button") as HTMLAnchorElement | HTMLButtonElement | null
      if (!el) return
      const href = el instanceof HTMLAnchorElement ? el.href : ""
      if (href.startsWith("tel:")) return trackEvent("click_call")
      const chat = CHAT_HOSTS.find(([re]) => re.test(href))
      if (chat) return trackEvent("click_chat", { app: chat[1] })
      if (el.textContent?.trim() === "WeChat") return trackEvent("click_chat", { app: "wechat" })
    }
    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [gaId])

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
          </Script>
        </>
      )}
      {naverAnalyticsId && (
        <>
          <Script
            src="https://wcs.naver.net/wcslog.js"
            strategy="afterInteractive"
            onLoad={() => {
              window.wcs_add = window.wcs_add ?? {}
              window.wcs_add.wa = naverAnalyticsId
              window.wcs?.inflow("jisanlaw.com")
              window.wcs_do?.()
            }}
          />
        </>
      )}
    </>
  )
}
