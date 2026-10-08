import type { Metadata } from "next"
import { Suspense } from "react"
import { getColumns } from "@/lib/content"
import { centers } from "@/lib/centers"
import { SectionHead } from "@/components/main/section-head"
import { ColumnRow } from "@/components/column-parts"
import { ColumnBrowser, type ColumnLite } from "@/components/column-browser"
import { SampleNote } from "@/components/sample-note"

export const metadata: Metadata = {
  title: "칼럼",
  description: "형사·가사·기업·의료·부동산·민사 사건을 맡는 변호사들이 직접 쓴 글입니다. 센터별로 모아 볼 수 있습니다.",
  alternates: { canonical: "/column" },
}

export const revalidate = 300

export default async function ColumnListPage() {
  const list = await getColumns()
  /** 목록에는 본문을 빼고 보냄 (글이 많아도 가볍게) */
  const items: ColumnLite[] = list.map(({ id, title, summary, field, centers, author, date, sample }) => ({ id, title, summary, field, centers, author, date, sample }))
  const centerList = centers.map((c) => ({ slug: c.slug, name: c.name }))
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="칼럼" as="h1" desc="사건을 맡는 변호사가 직접 씁니다. 센터별로 골라 보거나 찾는 말로 검색해 보세요." />
        <SampleNote show={list.some((c) => c.sample)} className="mb-4" />
        {list.length > 0 ? (
          <Suspense
            fallback={
              <div className="border-t border-jisan-ink">
                {list.slice(0, 20).map((c) => (
                  <ColumnRow key={c.id} c={c} />
                ))}
              </div>
            }
          >
            <ColumnBrowser items={items} centers={centerList} />
          </Suspense>
        ) : (
          <p className="py-10 text-[0.9375rem] text-[#4A505A]">첫 칼럼을 준비하고 있습니다.</p>
        )}
      </div>
    </div>
  )
}
