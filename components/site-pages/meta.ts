import { HREFLANG, LANGS, type Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/t"

/** 메인 사이트 페이지의 canonical + 언어별 주소 (같은 경로를 여섯 언어로) */
export function foreignAlternates(lang: Lang, path: string) {
  return {
    canonical: L(lang, path),
    languages: { ...Object.fromEntries(LANGS.map((l) => [HREFLANG[l], L(l, path)])), "x-default": path },
  }
}
