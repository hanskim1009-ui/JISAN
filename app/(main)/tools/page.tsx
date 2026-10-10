import type { Metadata } from "next"
import Link from "next/link"
import { SectionHead } from "@/components/main/section-head"
import { TOOLS, TOOL_GROUPS } from "@/lib/tools/registry"

export const metadata: Metadata = {
  title: "계산기·자가진단",
  description: "구형 예상, 음주운전 처벌 기준, 경찰 출석요구 체크리스트, 양육비·상속분·유류분, 지연이자·소송비용·법정 기한 계산기를 한곳에 모았습니다.",
  alternates: { canonical: "/tools" },
}

export default function ToolsPage() {
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHead title="계산기·자가진단" as="h1" desc="내 사건에서 먼저 따져 볼 것들을 직접 계산해 보세요. 결과는 참고용이며, 정확한 판단은 변호사와 상의하세요." />
        <div className="space-y-12">
          {TOOL_GROUPS.map((g) => (
            <section key={g}>
              <h2 className="border-b border-jisan-ink pb-3 text-lg font-bold text-jisan-ink">{g}</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TOOLS.filter((t) => t.group === g).map((t) => (
                  <li key={t.href} className="min-w-0">
                    <Link href={t.href} className="block h-full rounded-2xl border border-[#E2E6ED] bg-white p-5 transition hover:border-jisan-ink">
                      <p className="font-semibold text-jisan-ink">{t.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[#4A505A]">{t.desc}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
