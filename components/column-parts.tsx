import Link from "next/link"
import type { ColumnBlock, ColumnItem } from "@/lib/content"
import { getLawyer } from "@/lib/lawyers"
import { LawyerPhoto } from "@/components/lawyer-photo"

const dot = (d: string) => d.replaceAll("-", ".")

/** 쓴 변호사: 작은 원형 사진 + 이름 */
export function ColumnByline({ slug, date, size = "sm" }: { slug: string; date?: string; size?: "sm" | "md" }) {
  const l = getLawyer(slug)
  if (!l) return null
  const box = size === "md" ? "h-11 w-11" : "h-7 w-7"
  return (
    <span className="flex items-center gap-2.5 text-[13px] text-[#4A505A]">
      <span className={`relative block ${box} shrink-0 overflow-hidden rounded-full bg-[#C9CCD1]`}>
        <LawyerPhoto src={l.image} name={l.name} imageClassName="object-cover object-top origin-top scale-[2]" sizes="96px" initialClassName="text-xs" />
      </span>
      <span>
        <b className="font-semibold text-jisan-ink">{l.name}</b> {l.title}
        {date && <span className="ml-2 tabular-nums text-[#8A9099]">{dot(date)}</span>}
      </span>
    </span>
  )
}

/** 칼럼 카드: 분야 · 제목 · 요약 · 쓴 변호사 */
export function ColumnCard({ c }: { c: ColumnItem }) {
  return (
    <article className="flex min-w-0 flex-col border-t border-jisan-ink pt-4">
      <p className="text-xs font-bold text-brand-accent">{c.field}</p>
      <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-jisan-ink">
        <Link href={`/column/${c.id}`} className="hover:underline underline-offset-4">
          {c.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#4A505A]">{c.summary}</p>
      <div className="mt-auto pt-4">
        <ColumnByline slug={c.author} date={c.date} />
      </div>
    </article>
  )
}

/** 칼럼 목록 한 줄: 왼쪽 날짜, 오른쪽 제목·요약·변호사 */
export function ColumnRow({ c }: { c: ColumnItem }) {
  return (
    <article className="grid grid-cols-1 gap-2 border-b border-[#E4E6E9] py-6 md:grid-cols-[8rem_1fr] md:gap-8">
      <p className="text-[13px] tabular-nums text-[#8A9099]">
        {dot(c.date)}
        <span className="ml-2 font-bold text-brand-accent md:ml-0 md:mt-1 md:block">{c.field}</span>
      </p>
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-jisan-ink">
          <Link href={`/column/${c.id}`} className="hover:underline underline-offset-4">
            {c.title}
          </Link>
        </h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-[#4A505A]">{c.summary}</p>
        <div className="mt-3">
          <ColumnByline slug={c.author} />
        </div>
      </div>
    </article>
  )
}

/** 칼럼 본문 */
export function ColumnBody({ blocks }: { blocks: ColumnBlock[] }) {
  return (
    <div className="space-y-5 text-[17px] leading-[1.9] text-[#2D323A]">
      {blocks.map((b, i) =>
        b.type === "h2" ? (
          <h2 key={i} className="pt-4 text-xl font-bold text-jisan-ink">
            {b.text}
          </h2>
        ) : b.type === "ul" ? (
          <ul key={i} className="list-disc space-y-1.5 pl-5">
            {b.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        ) : (
          <p key={i} className="whitespace-pre-line">
            {b.text}
          </p>
        )
      )}
    </div>
  )
}
