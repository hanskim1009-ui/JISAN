/**
 * 메인 사이트 '업무영역' — 형사·가사·기업·민사를 같은 무게로 보여 줍니다.
 * centers: 이 분야의 센터 사이트(lib/centers.ts slug). 센터가 생기면 여기에 추가합니다.
 * lawyers: 담당 변호사(lib/lawyers.ts slug). 임시 배정이며 확정되면 고칩니다.
 */
export type Situation = {
  label: string
  /** 센터가 있으면 센터로 이동 */
  center?: string
  /** 센터가 없으면 상담 칸의 분야를 미리 선택 */
  caseType?: string
}

export type Field = {
  name: string
  /** 업무영역 칸의 한 줄 설명 */
  desc: string
  caseType: string
  items: string[]
  lawyers: string[]
  centers: string[]
  situations: Situation[]
}

export const fields: Field[] = [
  {
    name: "형사",
    desc: "경찰 조사부터 재판까지, 단계마다 의뢰인에게 가장 유리한 대응 방향을 준비합니다.",
    caseType: "형사",
    items: ["경찰 조사 동석, 체포·구속", "성범죄 · 마약", "사기·횡령·자본시장법", "학교폭력, 음주·교통"],
    lawyers: ["kim-hansol", "kim-chunghyeon", "koo-bonwoo"],
    centers: ["crime", "sex-crime", "drug", "school-violence"],
    situations: [
      { label: "경찰 출석 요구를 받았어요", center: "crime" },
      { label: "가족이 체포됐어요", center: "crime" },
      { label: "성범죄 사건이에요", center: "sex-crime" },
      { label: "학교폭력 신고가 들어왔어요", center: "school-violence" },
    ],
  },
  {
    name: "가사",
    desc: "이혼, 상속, 양육 문제를 이혼 이후의 생활까지 생각하며 함께 정리합니다.",
    caseType: "가사",
    items: ["이혼, 재산분할", "상간 소송", "양육권·양육비", "상속, 유류분"],
    lawyers: ["kim-miso"],
    centers: ["divorce", "adultery"],
    situations: [
      { label: "이혼을 준비하고 있어요", center: "divorce" },
      { label: "상간 소장을 받았어요", center: "adultery" },
      { label: "양육비를 못 받고 있어요", center: "divorce" },
      { label: "상속 문제가 생겼어요", caseType: "가사" },
    ],
  },
  {
    name: "기업",
    desc: "투자계약, 주주 분쟁, 경영권 문제를 사업이 법에 막히기 전에 함께 살핍니다.",
    caseType: "기업",
    items: ["투자계약, 주주간계약", "주주총회·이사회", "경영권 분쟁", "의료기관·기업 자문"],
    lawyers: ["koo-bonwoo", "kang-hyunwoo", "park-jongjin"],
    centers: ["corporate", "medical"],
    situations: [
      { label: "투자계약을 검토해야 해요", center: "corporate" },
      { label: "주주 간 분쟁이 생겼어요", center: "corporate" },
      { label: "정기 자문이 필요해요", center: "corporate" },
      { label: "병원 운영 문제예요", center: "medical" },
    ],
  },
  {
    name: "민사",
    desc: "빌려준 돈, 공사대금, 보증금처럼 받아야 할 돈을 돌려받는 일과 회생·파산을 맡습니다.",
    caseType: "민사",
    items: ["대여금·투자금 반환", "공사대금, 하자", "임대차 보증금, 명도", "개인회생·파산"],
    lawyers: ["park-jongjin", "kang-hyunwoo", "kim-chunghyeon", "park-hanmin"],
    centers: ["civil", "construction", "insolvency"],
    situations: [
      { label: "빌려준 돈을 못 받았어요", center: "civil" },
      { label: "공사대금 문제예요", center: "construction" },
      { label: "보증금을 못 받았어요", center: "civil" },
      { label: "빚을 정리하고 싶어요", center: "insolvency" },
    ],
  },
]

/** 상담 폼의 '어떤 일인가요?' 선택지 */
export const CASE_TYPES = ["형사", "성범죄", "마약", "학교폭력", "이혼", "상간", "가사", "기업", "의료", "민사", "건설·부동산", "회생·파산", "기타"]
