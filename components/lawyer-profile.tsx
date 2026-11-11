import { T } from "@/lib/i18n/t"
import type { Lang } from "@/lib/langs"
import type { Lawyer } from "@/lib/lawyers"
import { PROFILE_TEXT } from "@/lib/center-profile-text"
import { prosecutor } from "@/lib/prosecutor"

/** 변호사 소개 본문 (센터 안 소개 페이지와 변호사 대표 페이지가 같이 씀) */

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-jisan-ink/80">
          <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-jisan-ink/40" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#E2E6ED] pt-7">
      <h2 className="mb-4 text-lg font-bold text-jisan-ink">{title}</h2>
      {children}
    </section>
  )
}

/** 이력 묶음: 자격·경력·학력이 나뉜 변호사는 그대로, 아니면 경력 + 주요 이력 (+ 분야별 블록) */
export function Resume({ lawyer, lang }: { lawyer: Lawyer; lang: Lang }) {
  const t = T(lang)
  const P = PROFILE_TEXT[lang]
  const r = lawyer.structuredResume
  return (
    <div className="space-y-9">
      {r ? (
        <>
          {r.qualifications.length > 0 && <Block title={t("자격")}><List items={r.qualifications} /></Block>}
          {r.career.length > 0 && <Block title={t("경력")}><List items={r.career} /></Block>}
          {r.education.length > 0 && <Block title={t("학력")}><List items={r.education} /></Block>}
        </>
      ) : (
        <>
          {lawyer.career && lawyer.career.length > 0 && <Block title={lawyer.resumeSections?.length ? t("이력") : t("경력")}><List items={lawyer.career} /></Block>}
          {lawyer.resumeSections?.map((s) => (
            <Block key={s.heading} title={s.heading}>
              <List items={s.items} />
            </Block>
          ))}
          {lawyer.highlights.length > 0 && <Block title={lawyer.resumeSections?.length ? t("학력") : P.highlights}><List items={lawyer.highlights} /></Block>}
        </>
      )}
      {lawyer.workCaseSections && lawyer.workCaseSections.length > 0 && (
        <Block title={t("주요 업무 사례")}>
          <div className="space-y-6">
            {lawyer.workCaseSections.map((s) => (
              <div key={s.heading}>
                <p className="mb-2 text-[0.9375rem] font-semibold text-jisan-ink">{s.heading}</p>
                <ul className="list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-jisan-ink/80">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
      )}
    </div>
  )
}


/** 검사로 근무한 곳과 맡은 일 (센터 첫 페이지의 검사 경력 구역에서 이어짐) */
export function ProsecutorBlock({ lawyer, lang }: { lawyer: Lawyer; lang: Lang }) {
  return (
    <>
            {lang === "ko" && lawyer.slug === prosecutor.slug && (
              <div id="prosecutor" className="mt-10 scroll-mt-24 border-t border-border pt-6">
                <p className="mb-2 text-xs font-semibold text-foreground/90">검사로 근무한 곳</p>
                <ul className="text-sm leading-relaxed">
                  {prosecutor.posts.map((po, i) => (
                    <li key={i} className="grid grid-cols-1 gap-x-4 border-b border-[#E4E6E9] py-2.5 sm:grid-cols-[15rem_1fr]">
                      <span className="text-foreground/85">
                        {po.office} {po.dept}
                      </span>
                      <span className="text-foreground/65">{po.work}</span>
                    </li>
                  ))}
                </ul>
                <p className="mb-2 mt-8 text-xs font-semibold text-foreground/90">검사 재직 중 받은 평가</p>
                <ul className="text-sm leading-relaxed text-foreground/75">
                  {prosecutor.awards.map((aw) => (
                    <li key={aw.text} className="border-b border-[#E4E6E9] py-2.5">
                      {aw.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
    </>
  )
}
