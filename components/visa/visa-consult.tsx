import Link from "next/link"
import { Phone } from "lucide-react"
import type { Lang } from "@/lib/langs"
import type { VisaUi } from "@/lib/visa"
import { siteConfig } from "@/lib/site-config"
import { L, fmt } from "@/lib/i18n/fmt"
import { centerText } from "@/lib/center-i18n"
import { chatChannels } from "@/lib/chat"
import { ChatButtons } from "@/components/center/chat-buttons"

/** 체류자격 안내 맨 아래 상담 연결: 한국어는 상담 신청·전화, 외국어는 메신저 채팅으로만 */
export function VisaConsult({ lang, ui }: { lang: Lang; ui: VisaUi["ui"] }) {
  if (lang !== "ko") {
    const C = centerText(lang)
    return (
      <section className="mt-12 rounded-2xl bg-brand p-6 text-white md:p-8">
        <h2 className="text-xl font-bold text-balance">{ui.ctaTitle}</h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/80">{ui.ctaLead}</p>
        <div className="mt-6">
          <ChatButtons channels={chatChannels(lang)} text={{ wechatId: C.wechatId, copy: C.copy, copied: C.copied, wechatScan: C.wechatScan }} />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-white/70">{C.chatNote}</p>
      </section>
    )
  }
  return (
    <section className="mt-12 flex flex-col gap-5 rounded-2xl bg-jisan-ink p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-balance">{ui.ctaTitle}</h2>
        <p className="mt-1 text-sm leading-relaxed text-white/75">{ui.ctaLead}</p>
        {ui.ctaPhone && <p className="mt-1 text-sm text-white/75 tabular-nums">{fmt(ui.ctaPhone, { phone: siteConfig.phone })}</p>}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2.5">
        <Link
          href={L(lang, "/consult")}
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[0.9375rem] font-semibold text-jisan-ink hover:bg-white/90"
        >
          {ui.ctaButton}
        </Link>
        <a
          href={siteConfig.phoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-3 text-[0.9375rem] font-semibold tabular-nums text-white hover:bg-white/10"
        >
          <Phone className="h-4 w-4" aria-hidden /> {siteConfig.phone}
        </a>
      </div>
    </section>
  )
}
