import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ChevronRight } from "lucide-react"
import { OG_LOCALE, type Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/fmt"
import { siteConfig } from "@/lib/site-config"
import {
  VISA_GROUPS,
  getVisa,
  getVisaUi,
  visaAlternates,
  visaList,
  visaPath,
  visaRelatedLinks,
  type VisaDoc,
  type VisaUi,
} from "@/lib/visa"
import { SectionHead } from "@/components/main/section-head"
import { FaqList } from "@/components/center/faq-list"
import { VisaConsult } from "@/components/visa/visa-consult"

const h2 = "text-[1.375rem] md:text-[1.625rem] font-bold tracking-tight text-jisan-ink leading-snug text-balance"
const para = "text-[1rem] leading-[1.85] text-jisan-ink/80"

export function visaListMetadata(lang: Lang): Metadata {
  const v = getVisaUi(lang)
  if (!v) return {}
  const url = visaPath(lang)
  return {
    title: v.ui.listSeoTitle,
    description: v.ui.listSeoDescription,
    alternates: visaAlternates(lang),
    openGraph: { type: "website", locale: OG_LOCALE[lang], url, title: v.ui.listSeoTitle, description: v.ui.listSeoDescription },
  }
}

export function visaDetailMetadata(lang: Lang, slug: string): Metadata {
  const d = getVisa(lang, slug)
  if (!d || !getVisaUi(lang)) return {}
  const url = visaPath(lang, d.slug)
  return {
    title: d.seo.title,
    description: d.seo.description,
    alternates: visaAlternates(lang, d.slug),
    openGraph: { type: "article", locale: OG_LOCALE[lang], url, title: d.seo.title, description: d.seo.description },
  }
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

function Crumbs({ items, label }: { items: { label: string; href?: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="mb-6 flex flex-wrap items-center gap-1 text-[0.8125rem] text-[#6B717B]">
      {items.map((c, i) => (
        <span key={c.label} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
          {c.href ? (
            <Link href={c.href} className="hover:text-jisan-ink hover:underline underline-offset-4">
              {c.label}
            </Link>
          ) : (
            <span aria-current="page">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

function CodeChip({ code, className = "" }: { code: string; className?: string }) {
  return <span className={`inline-flex w-fit shrink-0 rounded-full bg-jisan-mist px-2.5 py-0.5 font-bold tabular-nums text-jisan-ink ${className}`}>{code}</span>
}

/** 모든 자격에 공통인 '처분 결과에 따라 체류에 생기는 일' */
function CommonImpact({ common }: { common: VisaUi["common"] }) {
  return (
    <section>
      <h2 className={h2}>{common.title}</h2>
      <p className={`mt-3 ${para}`}>{common.lead}</p>
      <dl className="mt-5 divide-y divide-[#E2E6ED] border-y border-[#E2E6ED]">
        {common.items.map((it) => (
          <div key={it.title} className="grid grid-cols-1 gap-1.5 py-4 md:grid-cols-[12rem_1fr] md:gap-6">
            <dt className="text-[0.9375rem] font-bold text-jisan-ink">{it.title}</dt>
            <dd className="min-w-0 text-[0.9375rem] leading-relaxed text-jisan-ink/75">{it.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** /visa 목록 */
export function VisaListPage({ lang }: { lang: Lang }) {
  const v = getVisaUi(lang)
  const docs = visaList(lang)
  if (!v || docs.length === 0) notFound()
  const { ui } = v
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ui.home, item: `${siteConfig.siteUrl}${L(lang, "/")}` },
      { "@type": "ListItem", position: 2, name: ui.crumb, item: `${siteConfig.siteUrl}${visaPath(lang)}` },
    ],
  }
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl">
        <SectionHead title={ui.listTitle} as="h1" desc={ui.listLead} />
        <div className="space-y-12">
          {VISA_GROUPS.map((g) => {
            const items = docs.filter((d) => d.group === g)
            if (items.length === 0) return null
            return (
              <section key={g}>
                <h2 className="text-lg font-bold text-jisan-ink">{ui.groups[g]}</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((d) => (
                    <li key={d.slug} className="min-w-0">
                      <Link
                        href={visaPath(lang, d.slug)}
                        className="flex h-full flex-col rounded-2xl border border-[#E2E6ED] bg-white p-5 transition-colors hover:border-jisan-ink"
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          <CodeChip code={d.code} className="text-sm" />
                          <span className="text-lg font-bold text-jisan-ink">{d.name}</span>
                        </span>
                        <span className="mt-2 text-sm leading-relaxed text-[#4A505A]">{d.summary}</span>
                        <span className="mt-auto pt-4 text-sm font-semibold text-brand-accent">{ui.readMore} →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
          <div className="max-w-4xl">
            <CommonImpact common={v.common} />
          </div>
        </div>
        <p className="mt-10 max-w-4xl rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
          {ui.notice} {ui.basis}
        </p>
        <div className="max-w-4xl">
          <VisaConsult lang={lang} ui={ui} />
        </div>
      </div>
    </div>
  )
}

/** /visa/[code] 자격별 안내 */
export function VisaDetailPage({ lang, slug }: { lang: Lang; slug: string }) {
  const v = getVisaUi(lang)
  const d = getVisa(lang, slug)
  if (!v || !d) notFound()
  const { ui } = v
  const others = visaList(lang).filter((x) => x.slug !== d.slug)
  const related = visaRelatedLinks(lang, d)
  const title = `${d.code} ${d.name}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: `${siteConfig.siteUrl}${L(lang, "/")}` },
          { "@type": "ListItem", position: 2, name: ui.crumb, item: `${siteConfig.siteUrl}${visaPath(lang)}` },
          { "@type": "ListItem", position: 3, name: title, item: `${siteConfig.siteUrl}${visaPath(lang, d.slug)}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: d.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  }

  return (
    <div className="px-5 md:px-12 lg:px-14 py-10 md:py-14">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl">
        <Crumbs label={ui.crumb} items={[{ label: ui.home, href: L(lang, "/") }, { label: ui.crumb, href: visaPath(lang) }, { label: title }]} />
        <header className="max-w-4xl">
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-brand-accent">
            <CodeChip code={d.code} className="text-sm" />
            {ui.groups[d.group]}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-jisan-ink md:text-[2.375rem] text-balance">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-[#4A505A] md:text-[1.0625rem]">{d.summary}</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_15rem] lg:gap-16">
          <article className="min-w-0 max-w-4xl space-y-14">
            <section>
              <h2 className={h2}>{ui.about}</h2>
              <div className="mt-4 space-y-4">
                {d.about.map((p) => (
                  <p key={p} className={para}>
                    {p}
                  </p>
                ))}
              </div>
            </section>

            <section>
              <h2 className={h2}>{ui.impact}</h2>
              <p className={`mt-4 ${para}`}>{d.impact.lead}</p>
              <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {d.impact.items.map((it) => (
                  <li key={it.title} className="min-w-0 rounded-2xl bg-jisan-mist/60 p-5">
                    <p className="font-bold text-jisan-ink">{it.title}</p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-jisan-ink/75">{it.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className={h2}>{ui.issues}</h2>
              <div className="mt-6 space-y-8">
                {d.issues.map((s) => (
                  <div key={s.title}>
                    <h3 className="text-lg font-bold text-jisan-ink">{s.title}</h3>
                    <div className="mt-2 space-y-3">
                      {s.body.map((p) => (
                        <p key={p} className={para}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <CommonImpact common={v.common} />

            <section>
              <h2 className={h2}>{ui.faq}</h2>
              <div className="mt-4">
                <FaqList items={d.faqs} />
              </div>
            </section>

            <section className="rounded-2xl border border-jisan-ink/15 p-6 md:p-7">
              <h2 className="text-lg font-bold text-jisan-ink">{ui.consultWhen}</h2>
              <ul className="mt-4 space-y-2.5">
                {d.consultWhen.map((c) => (
                  <li key={c} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-jisan-ink/80">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand-accent" aria-hidden />
                    <span className="min-w-0">{c}</span>
                  </li>
                ))}
              </ul>
            </section>

            {related.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-jisan-ink">{ui.related}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {related.map((r) => (
                    <li key={r.href} className="min-w-0">
                      <Link
                        href={r.href}
                        className="inline-block rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-[#4A505A] hover:border-jisan-ink hover:text-jisan-ink"
                      >
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
              <p className="font-semibold text-jisan-ink">{ui.laws}</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                {d.laws.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="mt-3">{ui.basis}</p>
              <p className="mt-1.5">{ui.notice}</p>
            </section>
          </article>

          <OtherVisas lang={lang} ui={ui} docs={others} />
        </div>

        <div className="max-w-4xl">
          <VisaConsult lang={lang} ui={ui} />
        </div>
      </div>
    </div>
  )
}

/** 넓은 화면 오른쪽(좁은 화면은 본문 아래): 다른 자격으로 이동 */
function OtherVisas({ lang, ui, docs }: { lang: Lang; ui: VisaUi["ui"]; docs: VisaDoc[] }) {
  if (docs.length === 0) return null
  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      <p className="text-sm font-bold text-jisan-ink/60">{ui.otherVisas}</p>
      <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-1">
        {docs.map((d) => (
          <li key={d.slug} className="min-w-0">
            <Link href={visaPath(lang, d.slug)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-jisan-ink/80 hover:bg-jisan-mist hover:text-jisan-ink">
              <CodeChip code={d.code} className="text-xs" />
              <span className="truncate">{d.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={visaPath(lang)} className="mt-3 inline-block text-sm font-semibold text-brand-accent hover:underline underline-offset-4">
        {ui.crumb} →
      </Link>
    </aside>
  )
}
