import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { DeadlineCalculator } from "@/components/tools/civil/deadline-calculator"

const TITLE = "법정 기한 계산기"
const DESC = "판결·결정을 송달받은 날이나 선고일과 절차(민사 항소 2주, 형사 항소 7일, 즉시항고, 상고, 이의신청 등)를 고르면 공휴일과 대체공휴일을 반영한 마감일을 계산합니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/deadline" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="항소·상고·이의신청처럼 법이 정한 기한이 언제 끝나는지 계산합니다. 첫날은 빼고 세고, 마지막 날이 주말이나 공휴일이면 다음 날로 미룹니다."
      notice="법조문의 일반적인 계산 방법에 따른 참고용 날짜입니다. 송달받은 날을 잘못 알고 있거나 특별한 규정이 있으면 마감일이 달라집니다. 기한을 넘기면 다시 다투기 어려우니, 마감이 가까우면 바로 변호사와 상의하세요."
      related={[
        { href: "/tools/court-fees", label: "소송비용 계산기" },
        { href: "/tools/interest", label: "지연이자 계산기" },
        { href: "/civil", label: "민사센터" },
        { href: "/crime", label: "형사센터" },
      ]}
    >
      <DeadlineCalculator />
    </ToolShell>
  )
}
