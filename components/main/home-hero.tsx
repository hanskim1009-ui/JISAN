import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { fields } from "@/lib/practice"
import { looksToRender, type Look } from "@/lib/look"
import { RidgeCanvas } from "@/components/look/ridge-canvas"
import type { Lang } from "@/lib/langs"
import { L, T, type TFn } from "@/lib/i18n/t"
import { LANG_NOTE } from "@/lib/i18n/lang-notes"

/**
 * 첫 화면. 시안 두 가지(lib/look.ts):
 * photo(추천안) 능선 사진 위에 제목, 아래쪽 어두운 능선 위에 반투명 상황 선택 카드
 * ridge(B안)   남색 바탕 아래에 겹 능선 그래픽이 천천히 흐르고, 로고 획이 그려진 뒤 글이 올라옴
 */
export function HomeHero({ lang = "ko" }: { lang?: Lang }) {
  return (
    <>
      {looksToRender.map((look) => (look === "photo" ? <PhotoHero key={look} lang={lang} /> : <RidgeHero key={look} lang={lang} />))}
    </>
  )
}

/** 상황 버튼: 한국어는 센터로, 외국어는 (센터가 번역돼 있지 않으므로) 상담 신청으로 */
const situationHref = (s: (typeof fields)[number]["situations"][number], caseType: string, lang: Lang, t: TFn) =>
  lang === "ko"
    ? s.center
      ? `/${s.center}`
      : `/consult?type=${encodeURIComponent(s.caseType ?? caseType)}`
    : `${L(lang, "/consult")}?type=${encodeURIComponent(t(s.caseType ?? caseType))}`

function HeroCopy({ look, lang }: { look: Look; lang: Lang }) {
  const t = T(lang)
  const ko = lang === "ko"
  const dark = look === "ridge"
  const rise = (d: number) => (dark ? { className: "anim-rise", style: { animationDelay: `${d}s` } } : {})
  return (
    <div className="max-w-3xl">
      <p {...rise(0.3)} className={`${dark ? "anim-rise text-white/65" : "text-jisan-ink/70"} text-sm font-semibold tracking-[0.06em]`}>
        {t("형사 · 가사 · 기업 · 의료 · 부동산 · 민사")}
      </p>
      <h1
        {...rise(0.42)}
        className={`${dark ? "anim-rise" : ""} mt-3 text-[1.875rem] leading-[1.3] sm:text-[2.25rem] md:mt-4 md:text-[3.25rem] md:leading-[1.24] font-bold tracking-[-0.04em]`}
      >
        {t("처음 겪는 일이라 막막할 때,")}
        <br />
        {t("무엇을 해야할지 모를 때")}
      </h1>
      <p
        {...rise(0.54)}
        className={`${dark ? "anim-rise text-white/75" : "text-jisan-ink/80"} mt-4 max-w-2xl text-balance text-[0.9375rem] leading-[1.75] md:mt-6 md:text-[1.0625rem] md:leading-[1.8]`}
      >
        {t("아직 아무것도 정해진 게 없어도 괜찮습니다.")}
        <br className="hidden md:block" /> {t("지산 변호사가 상황에 맞춰 전부 해드리겠습니다. 밤과 주말이어도 괜찮습니다.")}
      </p>
      {LANG_NOTE[lang] && (
        <p {...rise(0.6)} className={`${dark ? "anim-rise text-white" : "text-jisan-ink"} mt-3 text-[0.9375rem] font-semibold`}>
          {LANG_NOTE[lang]}
        </p>
      )}
      <div {...rise(0.66)} className={`${dark ? "anim-rise" : ""} mt-6 flex flex-wrap gap-2.5 md:mt-8`}>
        <Link
          href={L(lang, "/consult")}
          className={`rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold md:px-6 md:py-3 transition-colors ${
            dark ? "bg-white text-brand hover:bg-white/90" : "bg-brand text-white hover:bg-brand-tone"
          }`}
        >
          {t("상담 신청")}
        </Link>
        {/* 외국어 사이트는 전화 없이 채팅으로만 문의 (상담 신청 페이지가 메신저 목록) */}
        {ko && <a
          href={siteConfig.phoneHref}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold md:px-6 md:py-3 tabular-nums transition-colors ${
            dark ? "border border-white/40 text-white hover:bg-white/10" : "bg-white/60 text-brand backdrop-blur hover:bg-white/80"
          }`}
        >
          <Phone className="h-4 w-4" /> {siteConfig.phone}
        </a>}
      </div>
    </div>
  )
}

function HeroPicker({ look, lang }: { look: Look; lang: Lang }) {
  const t = T(lang)
  const dark = look === "ridge"
  return (
    <div className={dark ? "anim-rise" : ""} style={dark ? { animationDelay: "0.8s" } : undefined}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-[0.9375rem] font-bold text-white [text-shadow:0_1px_10px_rgb(8_22_40/0.45)]">{t("지금 어떤 상황이신가요?")}</h2>
        <span aria-hidden className="text-xs font-medium text-white/60 lg:hidden">{t("옆으로 넘겨 보세요")}&nbsp;→</span>
      </div>
      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 md:-mx-12 md:scroll-px-12 md:px-12 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {fields.filter((f) => f.situations.length > 0).map((f) => (
          <div
            key={f.name}
            className={`w-[80%] shrink-0 snap-start rounded-2xl p-4 sm:w-[46%] md:p-5 lg:w-auto lg:min-w-0 backdrop-blur-md ${
              dark ? "border border-white/15 bg-white/[0.07] text-white" : "bg-white/75 text-brand shadow-[0_10px_30px_-18px_rgb(8_22_40/0.6)]"
            }`}
          >
            <p className={`text-[0.8125rem] font-bold ${dark ? "text-white/60" : "text-brand/60"}`}>{t(f.name)}</p>
            <ul className="mt-1.5">
              {f.situations.map((s) => (
                <li key={s.label}>
                  <Link
                    href={situationHref(s, f.caseType, lang, t)}
                    className={`group flex items-center justify-between gap-3 border-b py-1.5 text-[0.9375rem] font-semibold last:border-b-0 md:py-2 ${
                      dark ? "border-white/10" : "border-brand/10"
                    }`}
                  >
                    {t(s.label)}
                    <span aria-hidden className="shrink-0 opacity-40 transition-transform group-hover:translate-x-1 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 추천안: 능선 사진 (Unsplash 무료 사진, 상업 사용 가능) */
function PhotoHero({ lang }: { lang: Lang }) {
  return (
    <section className="screen look-photo relative overflow-hidden bg-[#E6D8C6] text-brand px-5 md:px-12 lg:px-14">
      <div aria-hidden className="anim-kenburns absolute -inset-[4%]">
        <Image src="/images/hero/ridge.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[center_68%]" />
      </div>
      <div
        aria-hidden
        className="anim-mist pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(40% 18% at 20% 58%, rgb(255 250 242 / 0.55), transparent 70%), radial-gradient(35% 14% at 75% 66%, rgb(255 250 242 / 0.45), transparent 70%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#F3EFE7]/55 via-transparent via-45% to-brand/70" />
      <div className="relative max-w-7xl mx-auto flex flex-col gap-14 pt-12 pb-10 md:gap-24 md:pt-20 md:pb-14">
        <HeroCopy look="photo" lang={lang} />
        <HeroPicker look="photo" lang={lang} />
      </div>
    </section>
  )
}

/** B안: 남색 바탕 + 겹 능선 그래픽 + 로고 획 그리기 */
function RidgeHero({ lang }: { lang: Lang }) {
  return (
    <section className="screen look-ridge relative overflow-hidden bg-brand text-white px-5 md:px-12 lg:px-14">
      <RidgeCanvas className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] max-h-[35rem] w-full" />
      <div className="relative max-w-7xl mx-auto flex min-h-[calc(100svh-8rem)] flex-col justify-between gap-8 pt-7 pb-5 md:min-h-0 md:justify-start md:gap-24 md:pt-20 md:pb-14">
        <HeroCopy look="ridge" lang={lang} />
        <HeroPicker look="ridge" lang={lang} />
      </div>
    </section>
  )
}
