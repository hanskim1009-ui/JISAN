import type { Lang } from "@/lib/langs"
import { lawyerI18n } from "@/lib/lawyers-i18n"

/** 변호사 이름: 한국어는 한글, 외국어는 로마자 (Hansol Kim) */
export const lawyerName = (l: { slug: string; name: string }, lang: Lang) =>
  lang === "ko" ? l.name : (lawyerI18n(l.slug, lang)?.name ?? l.name)
