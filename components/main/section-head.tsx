import Link from "next/link"

/** 메인 섹션 제목: 굵은 위쪽 선 + 제목 + 한 줄 설명 + 오른쪽 링크 */
export function SectionHead({
  title,
  desc,
  href,
  linkLabel = "전체 보기",
  as: Tag = "h2",
}: {
  title: string
  desc?: string
  href?: string
  linkLabel?: string
  as?: "h1" | "h2"
}) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t-2 border-jisan-ink pt-4">
      <Tag className={`${Tag === "h1" ? "text-3xl md:text-[2.25rem]" : "text-2xl md:text-[1.75rem]"} font-bold tracking-tight text-jisan-ink`}>
        {title}
      </Tag>
      {desc && <p className="text-sm text-[#4A505A]">{desc}</p>}
      {href && (
        <Link
          href={href}
          className="ml-auto text-sm text-jisan-ink underline decoration-1 underline-offset-[5px] hover:text-jisan-logo"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
