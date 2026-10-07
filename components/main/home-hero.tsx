import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { fields } from "@/lib/practice"
import { lawyers } from "@/lib/lawyers"
import { looksToRender, type Look } from "@/lib/look"
import { RidgeCanvas } from "@/components/look/ridge-canvas"
import { LOGO_BAR, LOGO_PIECES } from "@/components/brand-logo"

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
        className={`${dark ? "anim-rise" : ""} mt-4 text-[2.25rem] leading-[1.28] md:text-[3.25rem] md:leading-[1.24] font-bold tracking-[-0.04em]`}
      >
        검찰, 금융회사, 로펌에서
        <br />
        쌓은 경험으로
        <br />
        당신의 사건을 맡습니다
      </h1>
      <p
        {...rise(0.54)}
        className={`${dark ? "anim-rise text-white/75" : "text-jisan-ink/80"} mt-6 max-w-2xl text-base md:text-[17px] leading-[1.8]`}
      >
        {siteConfig.name}에는 형사·가사·기업·민사를 맡는 변호사 {lawyers.length}명이 있습니다. 사건 내용을 들은 담당 변호사가 직접
        연락드리고, 상담 전화는 24시간 받습니다.
      </p>
      <div {...rise(0.66)} className={`${dark ? "anim-rise" : ""} mt-8 flex flex-wrap gap-2.5`}>
        <Link
          href="/consult"
          className={`rounded-full px-6 py-3 text-[15px] font-semibold transition-colors ${
            dark ? "bg-white text-brand hover:bg-white/90" : "bg-brand text-white hover:bg-brand-tone"
          }`}
        >
          상담 신청
        </Link>
        <a
          href={siteConfig.phoneHref}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tabular-nums transition-colors ${
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
      <h2 className="mb-3 text-[15px] font-bold text-white [text-shadow:0_1px_10px_rgb(8_22_40/0.45)]">지금 어떤 상황이신가요?</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((f) => (
          <div
            key={f.name}
            className={`min-w-0 rounded-2xl p-4 md:p-5 backdrop-blur-md ${
              dark ? "border border-white/15 bg-white/[0.07] text-white" : "bg-white/75 text-brand shadow-[0_10px_30px_-18px_rgb(8_22_40/0.6)]"
            }`}
          >
            <p className={`text-[13px] font-bold ${dark ? "text-white/60" : "text-brand/60"}`}>{f.name}</p>
            <ul className="mt-1.5">
              {f.situations.map((s) => (
                <li key={s.label}>
                  <Link
                    href={situationHref(s, f.caseType)}
                    className={`group flex items-center justify-between gap-3 border-b py-2 text-[15px] font-semibold last:border-b-0 ${
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
      <RidgeCanvas className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] max-h-[560px] w-full" />
      <svg
        viewBox="40 14 345 312"
        aria-hidden
        className="anim-logo-draw pointer-events-none absolute right-[6%] top-14 hidden h-[19rem] w-auto lg:block xl:right-[10%]"
      >
        {LOGO_PIECES.map((d) => (
          <path key={d} d={d} fill="#fff" stroke="#fff" strokeWidth={2} style={{ ["--fo" as string]: 0.45 }} />
        ))}
        <path d={LOGO_BAR} fill="#fff" stroke="#fff" strokeWidth={2} />
        <path d={LOGO_BAR} fill="#fff" stroke="#fff" strokeWidth={2} transform="translate(105 0)" style={{ animationDelay: "0.25s" }} />
      </svg>
      <div className="relative max-w-7xl mx-auto flex flex-col gap-14 pt-12 pb-10 md:gap-24 md:pt-20 md:pb-14">
        <HeroCopy look="ridge" />
        <HeroPicker look="ridge" />
      </div>
    </section>
  )
}
