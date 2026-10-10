/** 계산기·자가진단 목록 (/tools 목록 페이지, 사이트맵, 메뉴가 함께 씀) */
export type ToolEntry = { href: string; title: string; desc: string; group: ToolGroup }
export type ToolGroup = "형사" | "가사·상속" | "민사·기한"

export const TOOL_GROUPS: ToolGroup[] = ["형사", "가사·상속", "민사·기한"]

export const TOOLS: ToolEntry[] = [
  { group: "형사", href: "/tools/prosecution", title: "구형 예상 계산기", desc: "죄명과 사정을 고르면 예상되는 처리 단계와 구형·벌금을 보여 드립니다." },
  { group: "형사", href: "/tools/sentencing", title: "선고형 예상 계산기 (양형기준)", desc: "범죄·유형·양형인자를 고르면 2026년 양형기준의 권고 형량범위와 집행유예 권고 여부를 보여 드립니다." },
  { group: "형사", href: "/tools/drunk-driving", title: "음주운전 처벌 기준 확인", desc: "혈중알코올농도·전력·사고 여부별 법정형과 면허 처분, 결격기간." },
  { group: "형사", href: "/tools/police-summons", title: "경찰 출석요구 체크리스트", desc: "출석 전, 조사 당일, 조사 후에 챙길 것을 상황에 맞춰 하나씩." },
  { group: "가사·상속", href: "/tools/child-support", title: "양육비 계산기", desc: "2021년 양육비 산정기준표에 따른 표준양육비와 분담액." },
  { group: "가사·상속", href: "/tools/inheritance", title: "상속분 계산기", desc: "상속 순위와 배우자 1.5배 규칙에 따른 사람별 법정상속분." },
  { group: "가사·상속", href: "/tools/reserved-share", title: "유류분 계산기", desc: "유류분 기초재산과 상속인별 유류분 금액. 2024년 헌재 결정 반영." },
  { group: "민사·기한", href: "/tools/interest", title: "지연이자 계산기", desc: "법정이율·소송촉진법 이율·약정이율로 기간별 이자와 합계." },
  { group: "민사·기한", href: "/tools/court-fees", title: "소송비용 계산기", desc: "소가와 사건 종류, 심급에 따른 인지액과 송달료." },
  { group: "민사·기한", href: "/tools/deadline", title: "법정 기한 계산기", desc: "항소·즉시항고·상고 등 마감일을 공휴일까지 반영해 계산." },
  { group: "민사·기한", href: "/tools/interest-cap", title: "최고이자율 확인", desc: "빌린 돈의 이자가 법정 최고이율(연 20%)을 넘는지와 넘는 금액." },
]
