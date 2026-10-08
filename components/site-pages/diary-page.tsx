import type { Metadata } from "next"
import { getDiary } from "@/lib/content"
import { DiaryList } from "@/components/diary-entries"
import { SectionHead } from "@/components/main/section-head"
import { SampleNote } from "@/components/sample-note"
import { foreignAlternates } from "@/components/site-pages/meta"
import type { Lang } from "@/lib/langs"
import { T } from "@/lib/i18n/t"

export function diaryMetadata(lang: Lang): Metadata {
  const t = T(lang)
  return {
    title: t("감사일기"),
    description: t("사건이 끝난 뒤 의뢰인이 보내 주신 문자와 선물을 직원이 적어 둡니다."),
    alternates: foreignAlternates(lang, "/diary"),
  }
}

export async function DiaryPage({ lang }: { lang: Lang }) {
  const t = T(lang)
  const entries = await getDiary({ lang })
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead
          title={t("감사일기")}
          as="h1"
          desc={t("사건이 끝난 뒤 의뢰인이 보내 주신 문자와 선물을 직원이 적어 둡니다. 보내 주신 분께 허락을 받고, 누구인지 알 수 없게 가립니다.")}
        />
        <SampleNote show={entries.some((e) => e.sample)} className="mb-4" lang={lang} />
        {entries.length > 0 ? (
          <DiaryList entries={entries} lang={lang} />
        ) : (
          <p className="py-10 text-[0.9375rem] text-[#4A505A]">{t("첫 일기를 준비하고 있습니다.")}</p>
        )}
      </div>
    </div>
  )
}
