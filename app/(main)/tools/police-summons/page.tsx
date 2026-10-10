import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { PoliceSummonsChecklist } from "@/components/tools/police-summons/police-summons-checklist"

const TITLE = "경찰 출석요구 체크리스트"
const DESC =
  "경찰에서 출석하라는 전화·문자나 출석요구서를 받았다면 상황을 고르고 출석 전, 조사 당일, 조사 후에 할 일을 하나씩 체크하세요. 연기 요청, 변호인 동석, 진술거부권, 휴대전화 제출, 조서 열람·수정까지 현행 형사소송법과 수사준칙 기준으로 정리했습니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["경찰 출석요구", "경찰조사 준비", "출석요구서", "출석 연기", "진술거부권", "변호인 참여", "피의자신문조서 열람", "참고인 조사"],
  alternates: { canonical: "/tools/police-summons" },
  openGraph: { title: TITLE, description: DESC, url: "/tools/police-summons", type: "website" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="지금 상황을 고르면 확인할 항목이 맞춰 바뀝니다. 체크한 내용은 이 브라우저에 저장되고, 인쇄해서 조사 때 가져갈 수 있습니다."
      consultType="형사"
      notice="일반적인 절차와 권리를 정리한 참고용 목록입니다. 2026. 10. 2. 시행된 형사소송법, 검사와 사법경찰관의 상호협력과 일반적 수사준칙에 관한 규정(수사준칙), 경찰수사규칙 기준이며, 중대범죄수사청 등 다른 수사기관의 조사에는 다른 규정이 적용될 수 있습니다. 실제 사건은 사정에 따라 다르니 조사 전에 변호사와 상의하세요."
      related={[
        { href: "/crime/guide/police-summons", label: "경찰 출석 요구를 받았을 때" },
        { href: "/crime/guide/reschedule-interview", label: "출석 일정을 미루고 싶어요" },
        { href: "/crime/guide/interrogation-record", label: "조서 열람·수정과 서명" },
        { href: "/tools/prosecution", label: "구형 예상 계산기" },
        { href: "/crime", label: "형사 센터" },
      ]}
    >
      <PoliceSummonsChecklist />
    </ToolShell>
  )
}
