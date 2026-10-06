import type { Metadata } from "next"
import { getCases } from "@/lib/content"
import { CasesTable } from "@/components/cases-table"
import { SectionHead } from "@/components/main/section-head"
import { SampleNote } from "@/components/sample-note"

export const metadata: Metadata = {
  title: "업무사례",
  description: "형사·가사·기업·민사 업무사례. 의뢰인의 동의를 받은 사건만, 누구인지 알 수 없게 고쳐 싣습니다.",
  alternates: { canonical: "/cases" },
}

export default function CasesPage() {
  const cases = getCases()
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead
          title="업무사례"
          as="h1"
          desc="의뢰인의 동의를 받은 사건만, 누구인지 알 수 없게 고쳐 싣습니다. 같은 결과를 약속하지 않습니다."
        />
        <SampleNote show={cases.some((c) => c.sample)} className="mb-4" />
        {cases.length > 0 ? (
          <CasesTable items={cases} />
        ) : (
          <p className="py-10 text-[15px] text-[#4A505A]">업무사례를 정리하고 있습니다. 의뢰인의 동의를 받은 사건부터 차례로 올립니다.</p>
        )}
      </div>
    </div>
  )
}
