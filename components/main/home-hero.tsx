import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { fields } from "@/lib/practice"
import { lawyers } from "@/lib/lawyers"
import { looksToRender, type Look } from "@/lib/look"
import { RidgeCanvas } from "@/components/look/ridge-canvas"

/**
 * 첫 화면. 시안 두 가지(lib/look.ts):
 * photo(추천안) 능선 사진 위에 제목, 아래쪽 어두운 능선 위에 반투명 상황 선택 카드
 * ridge(B안)   남색 바탕 아래에 겹 능선 그래픽이 천천히 흐르고, 로고 획이 그려진 뒤 글이 올라옴
 */
export function HomeHero() {
  return (
    <>
      {looksToRender.map((look) => (look === "photo" ? <PhotoHero key={look} /> : <RidgeHero key={look} />))}
    </>
  )
}

const situationHref = (s: (typeof fields)[number]["situations"][number], caseType: string) =>
  s.center ? `/${s.center}` : `/consult?type=${encodeURIComponent(s.caseType ?? caseType)}`

function HeroCopy({ look }: { look: Look }) {
  const dark = look === "ridge"
  const rise = (d: number) => (dark ? { className: "anim-rise", style: { animationDelay: `${d}s` } } : {})
  return (
    <div className="max-w-3xl">
      <p {...rise(0.3)} className={`${dark ? "anim-rise text-white/65" : "text-jisan-ink/70"} text-sm font-semibold tracking-[0.06em]`}>
        형사 · 가사 · 기업 · 민사
      </p>
      <h1
        {...rise(0.42)}
        className={`${dark ? "anim-rise" : ""} mt-3 text-[1.875rem] leading-[1.3] sm:text-[2.25rem] md:mt-4 md:text-[3.25rem] md:leading-[1.24] font-bold tracking-[-0.04em]`}
      >
        검찰, 금융회사, 로펌에서
        <br />
        쌓은 경험으로
        <br />
        당신의 사건을 맡습니다
      </h1>
      <p
        {...rise(0.54)}
        className={`${dark ? "anim-rise text-white/75" : "text-jisan-ink/80"} mt-4 max-w-2xl text-[0.9375rem] leading-[1.75] md:mt-6 md:text-[1.0625rem] md:leading-[1.8]`}
      >
        {siteConfig.name}에는 형사·가사·기업·민사를 맡는 변호사 {lawyers.length}명이 있습니다. 사건 내용을 들은 담당 변호사가 직접
        연락드리고, 상담 전화는 24시간 받습니다.
      </p>
      <div {...rise(0.66)} className={`${dark ? "anim-rise" : ""} mt-6 flex flex-wrap gap-2.5 md:mt-8`}>
        <Link
          href="/consult"
          className={`rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold md:px-6 md:py-3 transition-colors ${
            dark ? "bg-white text-brand hover:bg-white/90" : "bg-brand text-white hover:bg-brand-tone"
          }`}
        >
          상담 신청
        </Link>
        <a
          href={siteConfig.phoneHref}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold md:px-6 md:py-3 tabular-nums transition-colors ${
            dark ? "border border-white/40 text-white hover:bg-white/10" : "bg-white/60 text-brand backdrop-blur hover:bg-white/80"
          }`}
        >
          <Phone className="h-4 w-4" /> {siteConfig.phone}
        </a>
      </div>
    </div>
  )
}

function HeroPicker({ look }: { look: Look }) {
  const dark = look === "ridge"
  return (
    <div className={dark ? "anim-rise" : ""} style={dark ? { animationDelay: "0.8s" } : undefined}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-[0.9375rem] font-bold text-white [text-shadow:0_1px_10px_rgb(8_22_40/0.45)]">지금 어떤 상황이신가요?</h2>
        <span aria-hidden className="text-xs font-medium text-white/60 lg:hidden">옆으로 넘겨 보세요 →</span>
      </div>
      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 md:-mx-12 md:scroll-px-12 md:px-12 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {fields.map((f) => (
          <div
            key={f.name}
            className={`w-[80%] shrink-0 snap-start rounded-2xl p-4 sm:w-[46%] md:p-5 lg:w-auto lg:min-w-0 backdrop-blur-md ${
              dark ? "border border-white/15 bg-white/[0.07] text-white" : "bg-white/75 text-brand shadow-[0_10px_30px_-18px_rgb(8_22_40/0.6)]"
            }`}
          >
            <p className={`text-[0.8125rem] font-bold ${dark ? "text-white/60" : "text-brand/60"}`}>{f.name}</p>
            <ul className="mt-1.5">
              {f.situations.map((s) => (
                <li key={s.label}>
                  <Link
                    href={situationHref(s, f.caseType)}
                    className={`group flex items-center justify-between gap-3 border-b py-1.5 text-[0.9375rem] font-semibold last:border-b-0 md:py-2 ${
                      dark ? "border-white/10" : "border-brand/10"
                    }`}
                  >
                    {s.label}
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
function PhotoHero() {
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
        <HeroCopy look="photo" />
        <HeroPicker look="photo" />
      </div>
    </section>
  )
}

/** B안: 남색 바탕 + 겹 능선 그래픽 + 로고 획 그리기 */
function RidgeHero() {
  return (
    <section className="screen look-ridge relative overflow-hidden bg-brand text-white px-5 md:px-12 lg:px-14">
      <RidgeCanvas className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] max-h-[35rem] w-full" />
      <div className="relative max-w-7xl mx-auto flex min-h-[calc(100svh-8rem)] flex-col justify-between gap-8 pt-7 pb-5 md:min-h-0 md:justify-start md:gap-24 md:pt-20 md:pb-14">
        <HeroCopy look="ridge" />
        <HeroPicker look="ridge" />
      </div>
    </section>
  )
}
