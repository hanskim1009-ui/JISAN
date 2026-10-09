import type { Metadata } from "next"
import Link from "next/link"
import { officeAddress, openOffices, siteConfig } from "@/lib/site-config"
import { lawyers } from "@/lib/lawyers"
import { SectionHead } from "@/components/main/section-head"
import { foreignAlternates } from "@/components/site-pages/meta"
import type { Lang } from "@/lib/langs"
import { L, T } from "@/lib/i18n/t"
import { lawyerName } from "@/lib/lawyer-name"
import { officeAddr, officeName } from "@/lib/center-i18n"

export function aboutMetadata(lang: Lang): Metadata {
  const t = T(lang)
  return {
    title: t("법인 소개"),
    description: t("{name} 소개. 변호사 {n}명이 형사·가사·기업·의료·부동산·민사 사건을 맡습니다.", { name: t(siteConfig.name), n: lawyers.length }),
    alternates: foreignAlternates(lang, "/about"),
  }
}

const principles: [string, string][] = [
  ["그 일을 해 본 변호사가 맡습니다", "분야마다 담당 변호사가 정해져 있습니다. 사건이 들어오면 그 분야를 맡아 온 변호사가 상담부터 직접 합니다."],
  [
    "할 수 있는 일부터 말씀드립니다",
    "가능성이 낮은 사건에 근거 없는 기대를 드리지 않습니다. 할 수 있는 일과 어려운 일을 먼저 말씀드리고, 선임 여부는 그다음에 정하시면 됩니다.",
  ],
  ["여러 분야가 얽히면 함께 봅니다", "형사 고소와 민사 소송이 함께 걸린 사건처럼 여러 분야가 얽히면 담당 변호사들이 같이 봅니다."],
  ["밤과 주말에도 전화를 받습니다", "급한 일은 시간을 가리지 않습니다. 상담 전화는 24시간, 주말과 공휴일에도 받습니다."],
]

export function AboutPage({ lang }: { lang: Lang }) {
  const t = T(lang)
  const ko = lang === "ko"
  const name = t(siteConfig.name)
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12">
        <div className="min-w-0">
          <SectionHead title={t("법인 소개")} as="h1" />
          <p className="text-2xl md:text-[1.75rem] font-bold leading-snug tracking-[-0.03em] text-jisan-ink">
            {t("안녕하세요.")}
            <br />
            {t("{name}입니다.", { name })}
          </p>
          <div className="mt-6 max-w-2xl space-y-5 text-[1.0625rem] leading-[1.85] text-[#2D323A]">
            <p>{t("{topic} 변호사 {n}명이 형사, 가사, 기업, 의료, 부동산, 민사 사건을 맡고 있는 사무소입니다.", { topic: ko ? siteConfig.nameTopic : name, n: lawyers.length })}</p>
            <p>
              {t(
                "저희 변호사들은 일해 온 곳이 서로 다릅니다. 검찰청에서 검사로 수사와 공판을 맡았던 변호사, 은행·증권사와 벤처캐피탈에서 일한 변호사, 로펌 파트너로 기업 자문을 해 온 변호사, 병원과 의료단체의 자문을 맡아 온 변호사가 한 사무실에서 일합니다.",
              )}
            </p>
            <p>{t("변호사에게는 매주 만나는 일이어도, 의뢰인에게는 대부분 처음 겪는 일입니다. 그래서 상담에서는 법률 용어보다 지금 무엇을 해야 하는지부터 말씀드립니다.")}</p>
            <p>{t("지산은 ‘지혜의 산’이라는 뜻입니다.")}</p>
          </div>

          <h2 className="mt-14 text-xl font-bold tracking-[-0.02em] text-jisan-ink">{t("저희가 일하는 방식")}</h2>
          <dl className="mt-4 max-w-2xl border-t border-jisan-ink">
            {principles.map(([title, body]) => (
              <div key={title} className="border-b border-[#E4E6E9] py-5">
                <dt className="text-[1.0625rem] font-bold text-jisan-ink">{t(title)}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-[#4A505A]">{t(body)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[0.9375rem] text-[#4A505A]">{t("{name} 변호사 일동", { name })}</p>
        </div>
        <aside className="min-w-0">
          <SectionHead title={t("구성원")} href={L(lang, "/lawyers")} linkLabel={t("프로필 보기")} />
          <ul className="text-[0.9375rem]">
            {lawyers.map((l) => (
              <li key={l.slug} className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#E4E6E9] py-2.5">
                <Link href={`${L(lang, "/lawyers")}#${l.slug}`} className="font-semibold text-jisan-ink hover:underline underline-offset-4">
                  {lawyerName(l, lang)} <span className="font-normal text-[#8A9099]">{t(l.title)}</span>
                </Link>
                <span className="text-[#4A505A]">{t(l.field)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9375rem] text-[#4A505A]">
            {openOffices.map((o) => (
              <span key={o.name} className="block">
                <b className="font-semibold text-jisan-ink">{officeName(o.name, lang)}</b> {ko ? officeAddress(o) : officeAddr(o, lang)}
              </span>
            ))}
            {ko && `${t("전화")} ${siteConfig.phone} · ${t("24시간, 주말·공휴일 포함")}`}
          </p>
        </aside>
      </div>
    </div>
  )
}
