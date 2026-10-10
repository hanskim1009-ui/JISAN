import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { DrunkDrivingCalculator } from "@/components/tools/drunk-driving/drunk-driving-calculator"

const TITLE = "음주운전 처벌 기준 확인"
const DESC =
  "혈중알코올농도, 10년 안의 음주운전 전력, 측정 거부, 사고 여부를 고르면 현행 도로교통법 제148조의2의 법정형, 위험운전치상 등 사고 관련 법정형, 면허 정지·취소와 결격기간을 바로 보여 드립니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["음주운전 처벌 기준", "음주운전 벌금", "음주운전 재범", "음주측정 거부", "면허 취소 결격기간", "위험운전치상", "혈중알코올농도"],
  alternates: { canonical: "/tools/drunk-driving" },
  openGraph: { title: TITLE, description: DESC, url: "/tools/drunk-driving", type: "website" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="몇 가지를 고르면 법정형(법률이 정한 처벌의 범위)과 면허 처분 기준을 보여 드립니다. 실제로 받게 될 형을 예상하지는 않습니다."
      consultType="형사"
      notice="2026년 10월 현행 도로교통법·시행규칙 별표 28, 특정범죄 가중처벌 등에 관한 법률, 교통사고처리 특례법을 바탕으로 한 참고용 결과입니다. 실제 적용 조항과 처분은 측정 경위, 전력의 확정일, 사고 내용 등 구체적인 사정에 따라 달라지니 결정을 내리기 전에 변호사와 상의하세요."
      related={[
        { href: "/tools/prosecution", label: "구형 예상 계산기" },
        { href: "/crime/guide/drunk-driving-caught", label: "음주운전으로 단속됐을 때" },
        { href: "/crime/drunk-driving", label: "음주운전·교통사고" },
        { href: "/tools/police-summons", label: "경찰 출석요구 체크리스트" },
      ]}
    >
      <DrunkDrivingCalculator />
    </ToolShell>
  )
}
