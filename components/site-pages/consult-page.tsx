import type { Metadata } from "next"
import { officeAddress, openOffices, siteConfig } from "@/lib/site-config"
import { CASE_TYPES, DEFAULT_STAGE_OPTIONS } from "@/lib/practice"
import { ConsultForm } from "@/components/consult-form"
import { SectionHead } from "@/components/main/section-head"
import { foreignAlternates } from "@/components/site-pages/meta"
import { LANG_NAME, type Lang } from "@/lib/langs"
import { T } from "@/lib/i18n/t"
import { centerText, officeAddr, officeName } from "@/lib/center-i18n"
import { chatChannels } from "@/lib/chat"
import { ChatButtons } from "@/components/center/chat-buttons"
import { LANG_NOTE } from "@/lib/i18n/lang-notes"

export function consultMetadata(lang: Lang): Metadata {
  const t = T(lang)
  return {
    title: t("상담 신청"),
    description: t("{name} 상담 신청. 변호사가 내용을 확인하고 연락드립니다. 전화는 24시간, 주말·공휴일에도 받습니다.", { name: t(siteConfig.name) }),
    alternates: foreignAlternates(lang, "/consult"),
  }
}

/** 메인 사이트 상담 신청: 첫 화면의 상황 링크(/consult?type=가사)로 들어오면 분야가 미리 골라져 있습니다 */
export async function ConsultPage({ lang, searchParams }: { lang: Lang; searchParams: Promise<{ type?: string }> }) {
  const t = T(lang)
  const ko = lang === "ko"
  const { type } = await searchParams
  const caseTypes = CASE_TYPES.map((c) => t(c))
  const defaultCaseType = type && caseTypes.includes(type) ? type : undefined

  if (!ko) {
    // 외국어 사이트: 전화·신청서 없이 메신저 채팅으로만 문의 (직원이 먼저 답하고 변호사에게 넘김)
    const C = centerText(lang)
    return (
      <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <SectionHead title={t("상담 신청")} as="h1" desc={t("사건 내용을 남겨 주시면 담당 변호사가 직접 연락드립니다.")} />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0 rounded-2xl bg-brand p-6 text-white md:p-8">
              <h2 className="text-xl font-bold">{C.chatTitle}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/80">{C.bandLead}</p>
              <div className="mt-6">
                <ChatButtons channels={chatChannels(lang)} text={{ wechatId: C.wechatId, copy: C.copy, copied: C.copied, wechatScan: C.wechatScan }} />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-white/70">{C.chatNote}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[0.9375rem] leading-[1.8] text-[#4A505A]">
                {t("지금 고민되는 것을 편하게 적어 주세요. 체포나 다음 날 조사처럼 급한 일은 전화가 빠릅니다. 전화는 24시간 받습니다.")}
              </p>
              <dl className="mt-6 border-t border-jisan-ink text-[0.9375rem]">
                {openOffices.map((o) => (
                  <div key={o.name} className="border-b border-[#E4E6E9] py-3.5">
                    <dt className="font-semibold text-jisan-ink">{officeName(o.name, lang)}</dt>
                    <dd className="mt-1 text-[#4A505A]">
                      {o.mapUrl ? (
                        <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">
                          {officeAddr(o, lang)}
                        </a>
                      ) : (
                        officeAddr(o, lang)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ways = [
    { label: t("전화"), value: `${ko ? siteConfig.phone : siteConfig.phoneIntl} · ${t("24시간, 주말·공휴일 포함")}`, href: ko ? siteConfig.phoneHref : `tel:${siteConfig.phoneIntl.replace(/-/g, "")}` },
    { label: t("카카오톡"), value: t("채팅으로 상담 예약"), href: siteConfig.kakaoTalkUrl, external: true },
    {
      label: t("방문"),
      value: openOffices.map((o) => `${officeName(o.name, lang)} · ${ko ? officeAddress(o) : officeAddr(o, lang)}`).join("\n"),
      href: openOffices[0]?.mapUrl,
      external: true,
    },
  ]

  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead title={t("상담 신청")} as="h1" desc={t("사건 내용을 남겨 주시면 담당 변호사가 직접 연락드립니다.")} />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="min-w-0">
            <p className="text-[0.9375rem] leading-[1.8] text-[#4A505A]">
              {t("지금 고민되는 것을 편하게 적어 주세요. 체포나 다음 날 조사처럼 급한 일은 전화가 빠릅니다. 전화는 24시간 받습니다.")}
            </p>
            {LANG_NOTE[lang] && <p className="mt-3 text-[0.9375rem] font-semibold text-jisan-ink">{LANG_NOTE[lang]}</p>}
            <dl className="mt-6 border-t border-jisan-ink text-[0.9375rem]">
              {ways.map((w) => (
                <div key={w.label} className={`grid ${ko ? "grid-cols-[4.5rem_1fr]" : "grid-cols-[6.5rem_1fr]"} gap-3 border-b border-[#E4E6E9] py-3.5`}>
                  <dt className="font-semibold text-jisan-ink">{w.label}</dt>
                  <dd>
                    <a
                      href={w.href}
                      {...(w.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="whitespace-pre-line text-[#4A505A] hover:text-brand-accent"
                    >
                      {w.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0 bg-brand-paper p-6 md:p-8">
            <ConsultForm
              idPrefix="consult-page"
              source={ko ? "메인 상담 페이지" : `${LANG_NAME[lang]} 상담 페이지`}
              defaultCaseType={defaultCaseType}
              lang={lang}
              caseTypes={caseTypes}
              stageOptions={DEFAULT_STAGE_OPTIONS.map((s) => t(s))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
