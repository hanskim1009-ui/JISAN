import { SiteHeader } from "@/components/main/site-header"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { Footer } from "@/components/footer"
import { getCases, getColumns, getDiary } from "@/lib/content"
import { HREFLANG, NEEDS_NOTO, type Lang } from "@/lib/langs"
import { notoSans } from "@/lib/noto-font"
import { L } from "@/lib/i18n/t"
import { HEADER_KEYS, clientDict } from "@/lib/i18n/client-keys"
import { centerText } from "@/lib/center-i18n"
import { centerBase, centers, getCenter } from "@/lib/centers"
import type { CenterLink } from "@/components/main/site-header"

/** 메인 사이트(법인 전체) 공통 틀. 한국어(/)와 외국어(/en 등)가 같은 틀을 씁니다. 글이 없는 메뉴는 숨깁니다 */
export async function SiteLayout({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const flags = {
    showCases: (await getCases({ lang })).length > 0,
    showDiary: (await getDiary({ lang })).length > 0,
    showColumns: (await getColumns({ lang })).length > 0,
  }
  /** 헤더의 센터 링크 (센터 내용 전체를 브라우저로 보내지 않도록 이름·주소만). 외국어는 그 언어로 옮긴 센터만 */
  const intl = (k: string) => (lang === "ko" ? undefined : getCenter(`${k}-${lang}`))
  const centerLinks: CenterLink[] =
    lang === "ko"
      ? centers.map((c) => ({ slug: c.slug, name: c.name, href: centerBase(c) }))
      : [
          ["foreigner", "foreigner"],
          ["crime", "crime"],
          ["family", "divorce"],
          ["family", "adultery"],
          ["family", "inheritance"],
        ].flatMap(([k, slug]) => {
          const c = intl(k)
          return c ? [{ slug, name: c.name, href: centerBase(c) }] : []
        })
  /** 추가 메뉴: 한국어는 계산기 (외국어 체류자격 안내는 메뉴가 넘쳐서 바닥글에) */
  const extraLinks = lang === "ko" ? [{ label: "계산기", href: "/tools" }] : []
  const body = (
    <>
      {lang !== "ko" && <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(HREFLANG[lang])}` }} />}
      {/* 빙 등은 문서 언어를 이 값으로도 판단 (html lang 은 공통 틀이라 한국어로 고정) */}
      {lang !== "ko" && <meta httpEquiv="content-language" content={HREFLANG[lang]} />}
      <SiteHeader {...flags} lang={lang} dict={clientDict(lang, HEADER_KEYS)} centerLinks={centerLinks} extraLinks={extraLinks} />
      <FloatingCTA consultHref={L(lang, "/consult")} lang={lang} chatLabel={lang === "ko" ? undefined : centerText(lang).chatTitle} />
      <BackToTop />
      <div className="pb-24 md:pb-0">
        <main id="main-content">{children}</main>
        <Footer lang={lang} />
      </div>
    </>
  )
  if (lang === "ko") return body
  return (
    <div lang={HREFLANG[lang]} className={NEEDS_NOTO.includes(lang) ? notoSans.className : undefined}>
      {body}
    </div>
  )
}
