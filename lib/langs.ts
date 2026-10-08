/**
 * 사이트 언어 목록. 한국어가 기본(/), 나머지는 /en, /zh, /vi, /ru, /mn 아래에 메인과 외국인센터가 있습니다.
 * 각 외국어 페이지는 그 언어를 쓰는 사람만을 위한 페이지라, 다른 언어 상담 안내는 넣지 않습니다.
 */
export const LANGS = ["ko", "en", "zh", "vi", "ru", "mn"] as const
export type Lang = (typeof LANGS)[number]
export type ForeignLang = Exclude<Lang, "ko">
export const FOREIGN_LANGS = LANGS.filter((l) => l !== "ko") as ForeignLang[]

/** 언어 고르기에 보이는 이름 (그 언어로) */
export const LANG_NAME: Record<Lang, string> = {
  ko: "한국어",
  en: "English",
  zh: "中文",
  vi: "Tiếng Việt",
  ru: "Русский",
  mn: "Монгол",
}

/** 좁은 화면 버튼에 보이는 짧은 표시 */
export const LANG_SHORT: Record<Lang, string> = { ko: "한국어", en: "EN", zh: "中文", vi: "VI", ru: "RU", mn: "MN" }

/** hreflang 값 */
export const HREFLANG: Record<Lang, string> = { ko: "ko", en: "en", zh: "zh-Hans", vi: "vi", ru: "ru", mn: "mn" }

/** 언어별 메인 주소 */
export const homePath = (l: Lang) => (l === "ko" ? "/" : `/${l}`)

/** 메타데이터 alternates.languages (메인 페이지용) */
export const homeAlternates = () => ({
  ...Object.fromEntries(LANGS.map((l) => [HREFLANG[l], homePath(l)])),
  "x-default": "/",
})

/** 외국인센터 언어별 주소 */
export const foreignerPath = (l: Lang) => (l === "ko" ? "/foreigner" : `/${l}/foreigner`)
export const foreignerAlternates = () => Object.fromEntries(LANGS.map((l) => [l, foreignerPath(l)])) as Record<Lang, string>

/** 키릴 문자·베트남어 성조가 기본 글꼴(넥슨 Lv2 고딕)에 없어 별도 글꼴을 쓰는 언어 */
export const NEEDS_NOTO: Lang[] = ["vi", "ru", "mn"]
