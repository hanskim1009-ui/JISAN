import Link from "next/link"
import { WaveBar } from "@/components/brand-logo"

/** 메인 섹션 제목: 로고의 물결 띠 + 명조 제목 + 한 줄 설명 + 오른쪽 링크 */
export function SectionHead({
  title,
  desc,
  href,
  linkLabel = "더보기",
  as: Tag = "h2",
}: {
  title: string
  desc?: string
  href?: string
  linkLabel?: string
  as?: "h1" | "h2"
}) {
  return (
    <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-1">
      <div className="flex items-center gap-3">
        <WaveBar className={`${Tag === "h1" ? "h-9" : "h-8"} w-auto shrink-0 text-brand`} />
        <Tag className={`${Tag === "h1" ? "text-3xl md:text-[2.375rem]" : "text-[1.625rem] md:text-[1.875rem]"} font-bold tracking-[-0.03em] text-jisan-ink`}>
          {title}
        </Tag>
      </div>
      {desc && <p className="text-sm text-[#4A505A]">{desc}</p>}
      {href && (
        <Link
          href={href}
          className="ml-auto text-sm text-jisan-ink underline decoration-1 underline-offset-[0.3125rem] hover:text-brand-accent"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
