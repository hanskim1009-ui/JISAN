import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { ProsecutionCalculator } from "@/components/tools/prosecution/prosecution-calculator"
import { loadIndex } from "@/lib/tools/prosecution-data"
import { PROSECUTION_UI_KO as U } from "@/lib/tools/prosecution"
import { crimeToolAlternates } from "@/lib/tools/tool-data-i18n"

// 화면 문구 원문: content/tools/i18n/ko/prosecution-ui.json (외국어판과 같은 사전)
export const metadata: Metadata = {
  title: U.meta.title,
  description: U.meta.description,
  alternates: crimeToolAlternates("prosecution", "ko"),
}

export default function Page() {
  // 처음엔 죄명 목록(이름·묶음·법률·조문)만 넘기고, 고른 죄명 데이터는 /tools/prosecution/data/{조각} 에서 받음
  const crimes = loadIndex()
  return (
    <ToolShell
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
      <ProsecutionCalculator crimes={crimes} />
    </ToolShell>
  )
}
