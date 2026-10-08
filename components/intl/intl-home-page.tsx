import Image from "next/image"
import Link from "next/link"
import { Nanum_Pen_Script } from "next/font/google"
import { Phone, Plus } from "lucide-react"
import { lawyers, getLawyer } from "@/lib/lawyers"
import { lawyerI18n } from "@/lib/lawyers-i18n"
import { officeAddr, officeName } from "@/lib/center-i18n"
import { openOffices, siteConfig } from "@/lib/site-config"
import type { IntlHome, IntlLang } from "@/lib/intl-home"
import { RidgeCanvas } from "@/components/look/ridge-canvas"
import { SectionHead } from "@/components/main/section-head"
import { InkMountains } from "@/components/main/ink-mountains"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { ConsultForm } from "@/components/consult-form"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { LogoSvg } from "@/components/brand-logo"
import { IntlHeader, LangSwitch } from "@/components/intl/intl-header"

/** 영문 인사말 손글씨 (중문은 글꼴에 한자가 없어 보통 글씨) */
const pen = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], display: "swap", preload: false })

const intlPhoneHref = `tel:${siteConfig.phoneIntl.replace(/-/g, "")}`

/** 영문(/en)·중문(/zh) 메인: 첫 화면 → 외국인센터 → 구성원 → 업무영역 → 법인 소개 → 상담 안내 → 질문 → 사무소 → 상담 신청 */
export function IntlHomePage({ lang, t }: { lang: IntlLang; t: IntlHome }) {
  const tr = (slug: string) => lawyerI18n(slug, lang)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: t.htmlLang,
    mainEntity: t.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }

  return (
    <div lang={t.htmlLang}>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(t.htmlLang)}` }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <IntlHeader lang={lang} t={t} />
      <FloatingCTA consultHref="#contact" lang={lang} />
      <BackToTop />
      <div className="pb-24 md:pb-0">
        <main id="main-content">
          {/* 첫 화면 */}
          <section className="screen relative overflow-hidden bg-brand px-5 text-white md:px-12 lg:px-14">
            <RidgeCanvas className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] max-h-[35rem] w-full" />
            <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-7xl flex-col justify-between gap-10 pt-8 pb-6 md:min-h-0 md:justify-start md:gap-20 md:pt-20 md:pb-14">
              <div className="max-w-3xl">
                <p className="anim-rise text-sm font-semibold tracking-[0.04em] text-white/65" style={{ animationDelay: "0.3s" }}>
                  {t.kicker}
                </p>
                <h1
                  className="anim-rise mt-3 text-[1.875rem] font-bold leading-[1.25] tracking-[-0.03em] sm:text-[2.25rem] md:mt-4 md:text-[3.25rem] md:leading-[1.18]"
                  style={{ animationDelay: "0.42s" }}
                >
                  {t.heroTitle[0]}
                  <br />
                  {t.heroTitle[1]}
                </h1>
                <p className="anim-rise mt-4 max-w-2xl text-balance text-[0.9375rem] leading-[1.75] text-white/75 md:mt-6 md:text-[1.0625rem]" style={{ animationDelay: "0.54s" }}>
                  {t.heroSub}
                </p>
                <div className="anim-rise mt-6 flex flex-wrap gap-2.5 md:mt-8" style={{ animationDelay: "0.66s" }}>
                  <Link href="#contact" className="rounded-full bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-brand transition-colors hover:bg-white/90 md:px-6 md:py-3">
                    {t.consult}
                  </Link>
                  <a
                    href={intlPhoneHref}
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-[0.9375rem] font-semibold tabular-nums text-white transition-colors hover:bg-white/10 md:px-6 md:py-3"
                  >
                    <Phone className="h-4 w-4" /> {siteConfig.phoneIntl}
                  </a>
                </div>
              </div>
              <Link
                href={`/${lang}/foreigner`}
                className="anim-rise group block max-w-xl rounded-2xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-md transition-colors hover:bg-white/[0.12]"
                style={{ animationDelay: "0.8s" }}
              >
                <p className="text-[0.8125rem] font-bold text-white/60">{t.foreigner.kicker}</p>
                <p className="mt-1 flex items-center justify-between gap-3 text-[1.0625rem] font-semibold">
                  {t.foreigner.title}
                  <span aria-hidden className="shrink-0 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </p>
                <p className="mt-1.5 text-[0.8125rem] text-white/60">{t.foreigner.groups.map((g) => g.title).join(" · ")}</p>
              </Link>
            </div>
          </section>

          {/* 외국인센터 */}
          <section id="foreigner" className="screen scroll-mt-20 bg-brand-paper px-5 py-14 md:px-12 md:py-20 lg:px-14">
            <div data-reveal className="mx-auto max-w-7xl">
              <p className="text-sm font-bold text-brand-accent">{t.foreigner.kicker}</p>
              <h2 className="mt-2 text-[1.75rem] font-bold leading-snug tracking-[-0.03em] text-jisan-ink md:text-[2.25rem]">{t.foreigner.title}</h2>
              <p className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-[#4A505A] md:text-base">{t.foreigner.lead}</p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {t.foreigner.groups.map((g) => (
                  <div key={g.title} className="rounded-2xl bg-white p-5">
                    <h3 className="text-[1.0625rem] font-bold text-jisan-ink">{g.title}</h3>
                    <ul className="mt-2 text-[0.9375rem] text-[#4A505A]">
                      {g.items.map((it) => (
                        <li key={it} className="border-b border-[#E4E6E9] py-1.5 last:border-b-0">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={`/${lang}/foreigner`} className="rounded-full bg-brand px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-tone">
                  {t.foreigner.cta}&nbsp;→
                </Link>
                <div className="flex items-center gap-3">
                  <span className="flex -space-x-2">
                    {["kim-miso", "kim-hansol"].map((slug) => {
                      const l = getLawyer(slug)
                      return l ? (
                        <span key={slug} className="relative block h-9 w-9 overflow-hidden rounded-full border-2 border-brand-paper bg-[#C9CCD1]">
                          <LawyerPhoto src={l.image} name={tr(slug)?.name ?? l.name} imageClassName="object-cover object-top origin-top scale-[2]" sizes="128px" initialClassName="text-xs" />
                        </span>
                      ) : null
                    })}
                  </span>
                  <span className="text-sm font-semibold text-jisan-ink">{t.foreigner.lawyersNote}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 구성원 */}
          <section id="lawyers" className="screen scroll-mt-20 px-5 py-14 md:px-12 md:py-20 lg:px-14">
            <div data-reveal className="mx-auto max-w-7xl">
              <SectionHead title={t.lawyers.title} desc={t.lawyers.desc} />
              <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-7">
                {lawyers.map((l) => {
                  const x = tr(l.slug)
                  return (
                    <li key={l.slug} className="w-[62%] shrink-0 snap-start sm:w-auto sm:min-w-0">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#C9CCD1] sm:aspect-[3/4]">
                        <LawyerPhoto src={l.image} name={x?.name ?? l.name} imageClassName={l.photoImageClassName} sizes="(max-width: 640px) 75vw, (max-width: 1024px) 33vw, 16vw" />
                      </div>
                      <p className="mt-2.5 text-xs font-bold text-brand-accent">{x?.field || " "}</p>
                      <p className="text-lg font-bold text-jisan-ink sm:text-base">{x?.name ?? l.name}</p>
                      <p className="text-[0.8125rem] text-[#8A9099]">{x?.title ?? l.title}</p>
                      {x?.line && <p className="mt-2 border-t border-[#E4E6E9] pt-2 text-[0.8125rem] leading-snug text-[#4A505A]">{x.line}</p>}
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>

          {/* 업무영역 */}
          <section id="practice" className="screen scroll-mt-20 bg-brand-paper px-5 py-14 md:px-12 md:py-20 lg:px-14">
            <div data-reveal className="mx-auto max-w-7xl">
              <SectionHead title={t.practice.title} desc={t.practice.desc} />
              {/* 모바일은 옆으로 넘기는 카드 */}
              <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
                {t.practice.fields.map((f) => (
                  <div key={f.name} className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-white p-5 sm:w-auto md:p-6">
                    <h3 className="text-[1.5rem] font-bold tracking-[-0.02em] text-jisan-ink">{f.name}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#4A505A]">{f.desc}</p>
                    <ul className="mt-4 text-[0.9375rem] text-jisan-ink">
                      {f.items.map((it) => (
                        <li key={it} className="border-b border-[#E4E6E9] py-2">
                          {it}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-xs font-bold text-[#8A9099]">{t.practice.inCharge}</p>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      {f.lawyers.map((slug) => {
                        const l = getLawyer(slug)
                        const x = tr(slug)
                        if (!l) return null
                        return (
                          <li key={slug} className="flex items-center gap-2 text-sm font-semibold text-jisan-ink">
                            <span className="relative block h-7 w-7 shrink-0 overflow-hidden rounded-full bg-[#C9CCD1]">
                              <LawyerPhoto src={l.image} name={x?.name ?? l.name} imageClassName="object-cover object-top origin-top scale-[2]" sizes="96px" initialClassName="text-xs" />
                            </span>
                            {x?.name ?? l.name}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 법인 소개 */}
          <section id="about" className="screen relative scroll-mt-20 overflow-hidden bg-brand px-5 pt-16 pb-56 text-white md:px-12 md:py-24 lg:px-14">
            <InkMountains idPrefix="ink-im" crop="560 250 880 650" moon={false} className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full md:hidden" />
            <InkMountains idPrefix="ink-id" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" />
            <div data-reveal className="relative mx-auto max-w-7xl">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-white/60">{t.about.kicker}</p>
                <h2 className="mt-3 text-[2rem] font-bold leading-[1.3] tracking-[-0.03em] md:text-[2.5rem]">
                  {t.about.title[0]}
                  <br />
                  {t.about.title[1]}
                </h2>
                <div
                  className={`mt-7 space-y-3 text-white/90 ${
                    lang === "en" ? `${pen.className} text-[1.5rem] leading-[1.45] md:text-[1.75rem]` : "text-[1.0625rem] leading-[1.9]"
                  }`}
                >
                  {t.about.letter.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <p className={`mt-5 text-right text-white/75 ${lang === "en" ? `${pen.className} text-[1.5rem] md:text-[1.75rem]` : "text-[1.0625rem]"}`}>{t.about.sign}</p>
              </div>
            </div>
          </section>

          {/* 상담 안내 */}
          <section className="px-5 py-14 md:px-12 md:py-20 lg:px-14">
            <div data-reveal className="mx-auto max-w-7xl">
              <SectionHead title={t.steps.title} desc={t.steps.desc} />
              <ol className="grid grid-cols-1 border-t border-jisan-ink lg:grid-cols-2 lg:gap-x-12">
                {t.steps.items.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-5">
                    <span className="text-3xl font-bold tabular-nums text-brand-accent">{i + 1}</span>
                    <div>
                      <h3 className="text-[1.0625rem] font-bold text-jisan-ink">{s.title}</h3>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#4A505A]">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 자주 묻는 질문 */}
          <section className="px-5 py-14 md:px-12 md:py-20 lg:px-14">
            <div data-reveal className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_2fr]">
              <SectionHead title={t.faq.title} />
              <div className="border-t border-jisan-ink">
                {t.faq.items.map((f) => (
                  <details key={f.q} className="group border-b border-[#E4E6E9]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-bold text-jisan-ink [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <Plus className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="pb-5 text-[0.9375rem] leading-relaxed text-[#4A505A]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* 사무소 */}
          <section id="offices" className="scroll-mt-20 px-5 py-14 md:px-12 md:py-20 lg:px-14">
            <div data-reveal className="mx-auto max-w-7xl">
              <SectionHead title={t.offices.title} desc={t.offices.desc} />
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
                <dl className="text-[0.9375rem]">
                  {openOffices.map((o) => (
                    <div key={o.name} className="border-b border-[#E4E6E9] py-3.5">
                      <dt className="font-semibold text-jisan-ink">{officeName(o.name, lang)}</dt>
                      <dd className="mt-1 text-[#4A505A]">
                        {o.mapUrl && o.address ? (
                          <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                            {officeAddr(o, lang)}
                          </a>
                        ) : (
                          officeAddr(o, lang)
                        )}
                      </dd>
                    </div>
                  ))}
                  <div className="py-3.5 text-[#4A505A]">
                    <span className="block font-semibold tabular-nums text-jisan-ink">
                      {t.offices.phone} {siteConfig.phoneIntl}
                    </span>
                    {t.offices.note}
                  </div>
                </dl>
                <a
                  href={openOffices[0]?.mapUrl || siteConfig.naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[2/1] overflow-hidden border border-[#E4E6E9] transition-opacity hover:opacity-90"
                >
                  <Image src="/images/map.png" alt={`${t.firm} ${officeName(openOffices[0]?.name ?? "", lang)}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-jisan-ink">{t.offices.map}&nbsp;→</span>
                </a>
              </div>
            </div>
          </section>

          {/* 상담 신청 */}
          <section id="contact" className="scroll-mt-20 bg-brand-paper px-5 py-14 md:px-12 md:py-20 lg:px-14">
            <div data-reveal className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <SectionHead title={t.contact.title} />
                <p className="-mt-3 text-[0.9375rem] leading-relaxed text-[#4A505A]">{t.contact.desc}</p>
                <p className="mt-3 text-[0.9375rem] font-semibold text-jisan-ink">{t.langNote}</p>
                <a href={intlPhoneHref} className="mt-5 inline-flex items-center gap-2 text-[1.5rem] font-bold tabular-nums text-jisan-ink">
                  <Phone className="h-5 w-5" /> {siteConfig.phoneIntl}
                </a>
                <p className="mt-1 text-sm text-[#8A9099]">{t.offices.note}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 md:p-8">
                <ConsultForm idPrefix={`intl-${lang}`} lang={lang} caseTypes={t.contact.caseTypes} stageOptions={t.contact.stages} source={lang === "en" ? "영문 홈페이지" : "중문 홈페이지"} />
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-brand-deep px-5 pt-14 pb-10 text-white/70 md:px-12 md:pt-16 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <Link href={`/${lang}`} className="inline-flex items-center gap-4 text-white">
                <LogoSvg variant="reverse" className="h-11 w-auto md:h-14" />
                <span className="text-2xl font-bold tracking-[-0.02em] md:text-[2rem]">{t.firm}</span>
              </Link>
              <a href={intlPhoneHref} className="md:text-right">
                <span className="block text-[1.75rem] font-bold tabular-nums tracking-tight text-white">{siteConfig.phoneIntl}</span>
                <span className="text-[0.8125rem] text-white/60">{t.offices.note}</span>
              </a>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-1.5 border-t border-white/15 pt-6 text-sm md:grid-cols-2">
              <div className="space-y-1">
                {openOffices.map((o) => (
                  <p key={o.name}>
                    <span className="text-white/90">{officeName(o.name, lang)}</span> {officeAddr(o, lang)}
                  </p>
                ))}
              </div>
              <p className="md:text-right">
                {t.footer.bizNo} {siteConfig.businessRegistration} · {t.footer.adLawyer} {tr("kim-hansol")?.name}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 text-[0.8125rem] md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <LangSwitch current={lang} className="-ml-2" />
                <Link href="/privacy" hrefLang="ko" className="transition-colors hover:text-white">
                  {t.footer.privacy}
                </Link>
                <Link href="/disclaimer" hrefLang="ko" className="transition-colors hover:text-white">
                  {t.footer.disclaimer}
                </Link>
              </div>
              <p className="text-white/45">
                Copyright {new Date().getFullYear()}. {siteConfig.name} ({t.firm})
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
