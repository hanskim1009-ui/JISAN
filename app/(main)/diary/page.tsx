import type { Metadata } from "next"
import { getDiary } from "@/lib/content"
import { DiaryList } from "@/components/diary-entries"
import { SectionHead } from "@/components/main/section-head"
import { SampleNote } from "@/components/sample-note"

export const metadata: Metadata = {
  title: "감사일기",
  description: "사건이 끝난 뒤 의뢰인이 보내 주신 문자와 선물을 직원이 적어 둡니다.",
  alternates: { canonical: "/diary" },
}

export default function DiaryPage() {
  const entries = getDiary()
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead
          title="감사일기"
          as="h1"
          desc="사건이 끝난 뒤 의뢰인이 보내 주신 문자와 선물을 직원이 적어 둡니다. 보내 주신 분께 허락을 받고, 누구인지 알 수 없게 가립니다."
        />
        <SampleNote show={entries.some((e) => e.sample)} className="mb-4" />
        {entries.length > 0 ? (
          <DiaryList entries={entries} />
        ) : (
          <p className="py-10 text-[0.9375rem] text-[#4A505A]">첫 일기를 준비하고 있습니다.</p>
        )}
      </div>
    </div>
  )
}
