import type { Metadata } from "next"
import { getColumns } from "@/lib/content"
import { SectionHead } from "@/components/main/section-head"
import { ColumnRow } from "@/components/column-parts"
import { SampleNote } from "@/components/sample-note"

export const metadata: Metadata = {
  title: "칼럼",
  description: "형사·가사·기업·민사 사건을 맡는 변호사들이 직접 쓴 글입니다.",
  alternates: { canonical: "/column" },
}

export default function ColumnListPage() {
  const list = getColumns()
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="칼럼" as="h1" desc="사건을 맡는 변호사가 직접 씁니다." />
        <SampleNote show={list.some((c) => c.sample)} className="mb-4" />
        {list.length > 0 ? (
          <div className="border-t border-jisan-ink">
            {list.map((c) => (
              <ColumnRow key={c.id} c={c} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-[0.9375rem] text-[#4A505A]">첫 칼럼을 준비하고 있습니다.</p>
        )}
      </div>
    </div>
  )
}
