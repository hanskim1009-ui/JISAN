import { fields } from "@/lib/practice"
import type { Lang } from "@/lib/langs"
import { T } from "@/lib/i18n/t"

/** 구성원과 업무영역 사이: 맡는 일이 한 줄로 천천히 흐르는 띠 (마우스를 올리면 멈춤) */
export function KeywordMarquee({ lang = "ko" }: { lang?: Lang }) {
  const t = T(lang)
  const words = fields.flatMap((f) => f.items).map((w) => t(w))
  const row = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-7 pr-7">
      {words.map((w) => (
        <span key={w} className="flex items-center gap-7 whitespace-nowrap">
          <span>{w}</span>
          <span aria-hidden className="text-white/30">/</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="overflow-hidden bg-brand py-4 text-[0.9375rem] font-semibold text-white/85 md:py-5 md:text-base">
      <div className="anim-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
