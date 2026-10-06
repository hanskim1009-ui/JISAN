/**
 * 메인 사이트 업무분야 (센터 사이트가 없는 분야)
 * 센터가 생기면 여기서 빼고 lib/centers.ts에 추가합니다.
 */
export type PracticeArea = {
  name: string
  tag: string
  /** 상담 폼 사건 유형 (components/consult-form.tsx CASE_TYPES) */
  caseType: string
  description: string
}

export const practiceAreas: PracticeArea[] = [
  {
    name: "기업",
    tag: "Corporate",
    caseType: "기업",
    description:
      "계약서 검토, 주주총회·이사회 운영 자문, 투자계약, 경영권 분쟁, 임직원 형사 리스크까지 지원합니다. 정기 법률 고문 계약으로 분쟁이 생기기 전에 리스크를 차단합니다.",
  },
  {
    name: "민사",
    tag: "Civil Litigation",
    caseType: "민사",
    description:
      "대여금·투자금 반환, 손해배상 청구, 계약 해제·해지, 부당이득 반환 등 민사 분쟁 전반을 다룹니다. 판결에서 끝나지 않고 실제 채권 회수와 강제집행까지 고려합니다.",
  },
  {
    name: "건설·부동산",
    tag: "Construction & Real Estate",
    caseType: "건설·부동산",
    description:
      "공사대금 미지급, 하자보수, 재개발·재건축 갈등, 임대차 보증금 반환, 명도 소송 등. 계약 단계 검토부터 소송·강제집행까지 함께합니다.",
  },
  {
    name: "회생·파산",
    tag: "Restructuring",
    caseType: "회생·파산",
    description:
      "개인회생·파산 신청부터 면책 결정까지 경제적 재기를 위한 현실적인 로드맵을 설계합니다. 법인 회생·파산 절차도 대응합니다.",
  },
  {
    name: "가사",
    tag: "Family Law",
    caseType: "가사",
    description:
      "이혼 소송, 재산분할, 양육비, 면접교섭, 상간 소송, 상속 재산 분할과 유류분 청구까지. 첫 상담부터 조정·재판 종결까지 담당 변호사가 직접 대응합니다.",
  },
]
