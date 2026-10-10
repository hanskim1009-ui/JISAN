import type { Metadata } from "next"
import Link from "next/link"
import { ToolShell } from "@/components/tools/tool-shell"
import { ProsecutionCalculator } from "@/components/tools/prosecution/prosecution-calculator"
import { loadIndex, loadIndexId } from "@/lib/tools/prosecution-data"
import { POPULAR_CRIMES } from "@/lib/tools/prosecution"
import { PROSECUTION_UI_KO as U } from "@/lib/tools/prosecution"
import { crimeToolAlternates } from "@/lib/tools/tool-data-i18n"
import { crimePageText } from "@/lib/tools/prosecution-page"

// 화면 문구 원문: content/tools/i18n/ko/prosecution-ui.json (외국어판과 같은 사전)
export const metadata: Metadata = {
  title: U.meta.title,
  description: U.meta.description,
  alternates: crimeToolAlternates("prosecution", "ko"),
}

export default function Page() {
  // 죄명 1,700여 개 목록은 페이지에 싣지 않고 정적 JSON(/tools/prosecution/data/index-…)으로 받음. 처음엔 자주 찾는 죄명만.
  // 고른 죄명 데이터는 /tools/prosecution/data/{조각} 에서 받음
  const index = loadIndex()
  const seed = POPULAR_CRIMES.flatMap((id) => index.find((c) => c.id === id) ?? [])
  return (
    <ToolShell toolId="prosecution"
      title={U.meta.title}
      lead={U.meta.lead}
      consultType="형사"
      notice={U.meta.notice}
      related={[
        { href: "/tools/sentencing", label: U.meta.relatedSentencing },
        { href: "/tools/police-summons", label: U.meta.relatedPoliceSummons },
        { href: "/crime", label: U.meta.relatedCrimeCenter },
      ]}
    >
      <ProsecutionCalculator
        indexUrl={`/tools/prosecution/data/${loadIndexId()}`}
        seed={seed}
        detail={{ base: "/tools/prosecution", label: crimePageText("ko")!.detailLink }}
      />
      <p className="mt-8 text-sm">
        <Link href="/tools/prosecution/crimes" className="text-[#4A505A] underline underline-offset-4 hover:text-jisan-ink">
          {crimePageText("ko")!.allCrimes}
        </Link>
      </p>
    </ToolShell>
  )
}
