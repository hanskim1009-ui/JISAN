import type { Metadata } from "next"
import { TeamSection } from "@/components/team-section"
import { foreignAlternates } from "@/components/site-pages/meta"
import { lawyers } from "@/lib/lawyers"
import type { Lang } from "@/lib/langs"
import { T } from "@/lib/i18n/t"
import { TEAM_KEYS, clientDict } from "@/lib/i18n/client-keys"
import { translateLawyer } from "@/lib/i18n/translate-lawyer"

export function lawyersMetadata(lang: Lang): Metadata {
  const t = T(lang)
  return {
    title: t("구성원"),
    description: t("사건을 직접 맡는 변호사들의 경력, 학력, 주요 업무 사례를 소개합니다."),
    alternates: foreignAlternates(lang, "/lawyers"),
  }
}

export function LawyersPage({ lang }: { lang: Lang }) {
  if (lang === "ko") return <TeamSection />
  return <TeamSection people={lawyers.map((l) => translateLawyer(l, lang))} dict={clientDict(lang, TEAM_KEYS)} />
}
