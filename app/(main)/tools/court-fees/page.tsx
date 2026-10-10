import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { CourtFeeCalculator } from "@/components/tools/civil/court-fee-calculator"

const TITLE = "소송비용 계산기"
const DESC = "소송목적의 값(소가)과 사건 종류, 심급을 고르면 소장·항소장·상고장에 붙일 인지액(전자소송 10% 할인 반영)과 미리 낼 송달료를 계산합니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/court-fees" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="소송을 시작할 때 법원에 내는 돈(인지액과 송달료)을 계산합니다. 민사 소송, 지급명령, 조정, 이혼 등 가사소송을 고를 수 있습니다."
      consultType="민사"
      notice="법원에 처음 내는 비용만 계산한 참고용 금액입니다. 변호사 보수, 감정료, 증인 비용은 들어 있지 않고, 청구를 합치거나 바꾸면 금액이 달라집니다. 실제 금액은 접수하는 법원에서 정하니, 소송을 내기 전에 변호사와 상의하세요."
      related={[
        { href: "/tools/interest", label: "지연이자 계산기" },
        { href: "/tools/deadline", label: "법정 기한 계산기" },
        { href: "/civil", label: "민사센터" },
        { href: "/divorce", label: "이혼센터" },
      ]}
    >
      <CourtFeeCalculator />
    </ToolShell>
  )
}
