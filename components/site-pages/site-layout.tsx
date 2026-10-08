import { SiteHeader } from "@/components/main/site-header"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { Footer } from "@/components/footer"
import { getCases, getColumns, getDiary } from "@/lib/content"
import { HREFLANG, NEEDS_NOTO, type Lang } from "@/lib/langs"
import { notoSans } from "@/lib/noto-font"
import { L } from "@/lib/i18n/t"
import { HEADER_KEYS, clientDict } from "@/lib/i18n/client-keys"

/** 메인 사이트(법인 전체) 공통 틀. 한국어(/)와 외국어(/en 등)가 같은 틀을 씁니다. 글이 없는 메뉴는 숨깁니다 */
export async function SiteLayout({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const flags = {
    showCases: (await getCases({ lang })).length > 0,
    showDiary: (await getDiary({ lang })).length > 0,
    showColumns: (await getColumns({ lang })).length > 0,
  }
  const body = (
    <>
      {lang !== "ko" && <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(HREFLANG[lang])}` }} />}
      <SiteHeader {...flags} lang={lang} dict={clientDict(lang, HEADER_KEYS)} />
      <FloatingCTA consultHref={L(lang, "/consult")} lang={lang} />
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
