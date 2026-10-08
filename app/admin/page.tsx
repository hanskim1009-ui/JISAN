import { centers } from "@/lib/centers"
import { lawyers } from "@/lib/lawyers"
import { CASE_TYPES } from "@/lib/practice"
import { AdminApp } from "@/components/admin/admin-app"

/** 관리 화면: 칼럼·감사일기·업무사례 쓰기, 상담 신청 보기 (초대받은 관리자만) */
export default function AdminPage() {
  return (
    <AdminApp
      options={{
        centers: centers.map((c) => ({ slug: c.slug, name: c.name })),
        lawyers: lawyers.map((l) => ({ slug: l.slug, name: l.name, title: l.title })),
        fields: ["형사", "가사", "기업", "의료", "부동산", "민사"],
        caseTypes: CASE_TYPES,
      }}
    />
  )
}
