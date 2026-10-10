import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { SentencingCalculator } from "@/components/tools/sentencing/sentencing-calculator"
import { loadIndex } from "@/lib/tools/sentencing-data"
import { SENTENCING_UI_KO as U } from "@/lib/tools/sentencing"
import { crimeToolAlternates } from "@/lib/tools/tool-data-i18n"

// 화면 문구 원문: content/tools/i18n/ko/sentencing-ui.json (외국어판과 같은 사전)
export const metadata: Metadata = {
  title: U.meta.title,
  description: U.meta.description,
  alternates: crimeToolAlternates("sentencing", "ko"),
}

export default function Page() {
  // 처음엔 범죄군 이름·세부 범죄 이름만 넘기고, 고른 범죄군 데이터는 /tools/sentencing/data/{id} 에서 받음
  const groups = loadIndex()
  return (
    <ToolShell toolId="sentencing"
      title={U.meta.title}
      lead={U.meta.lead}
      consultType="형사"
      notice={U.meta.notice}
      related={[
        { href: "/tools/prosecution", label: U.meta.relatedProsecution },
        { href: "/tools/drunk-driving", label: U.meta.relatedDrunkDriving },
        { href: "/crime", label: U.meta.relatedCrimeCenter },
      ]}
    >
      <SentencingCalculator groups={groups} />
    </ToolShell>
  )
}
