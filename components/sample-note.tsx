import type { Lang } from "@/lib/langs"
import { T } from "@/lib/i18n/t"

/** 개발 미리보기에서 예시 글이 보일 때 붙는 표시 (운영 사이트에는 예시 글 자체가 나가지 않음) */
export function SampleNote({ show, className = "", lang = "ko" }: { show: boolean; className?: string; lang?: Lang }) {
  if (!show) return null
  return (
    <p className={`inline-block bg-[#FFF4D6] px-2.5 py-1 text-xs font-semibold text-[#7A5A00] ${className}`}>
      {T(lang)("개발 미리보기 · 예시 글입니다. 실제 글이 등록되면 바뀝니다.")}
    </p>
  )
}
