/**
 * 메인 사이트 '맡는 일' — 형사·가사·기업·민사를 같은 무게로 보여 줍니다.
 * centers: 이 분야의 센터 사이트(lib/centers.ts slug). 센터가 생기면 여기에 추가합니다.
 * lawyers: 맡는 변호사(lib/lawyers.ts slug). 임시 배정이며 확정되면 고칩니다.
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
  caseType: string
  items: string[]
  lawyers: string[]
  centers: string[]
  situations: Situation[]
}

export const fields: Field[] = [
  {
    name: "형사",
    caseType: "형사",
    items: ["경찰 조사 동석, 체포·구속", "성범죄 · 마약", "사기·횡령·자본시장법", "음주·교통, 폭행"],
    lawyers: ["kim-hansol", "kim-chunghyeon", "koo-bonwoo"],
    centers: ["crime", "sex-crime"],
    situations: [
      { label: "경찰 출석 요구를 받았어요", center: "crime" },
      { label: "가족이 체포됐어요", center: "crime" },
      { label: "성범죄 사건이에요", center: "sex-crime" },
      { label: "사기로 고소하려 해요", center: "crime" },
    ],
  },
  {
    name: "가사",
    caseType: "가사",
    items: ["이혼, 재산분할", "상간 소송", "양육권·양육비", "상속, 유류분"],
    lawyers: ["kim-miso"],
    centers: [],
    situations: [
      { label: "이혼을 준비하고 있어요", caseType: "가사" },
      { label: "상간 소장을 받았어요", caseType: "가사" },
      { label: "양육비를 못 받고 있어요", caseType: "가사" },
      { label: "상속 문제가 생겼어요", caseType: "가사" },
    ],
  },
  {
    name: "기업",
    caseType: "기업",
    items: ["투자계약, 주주간계약", "주주총회·이사회", "경영권 분쟁", "의료기관·기업 자문"],
    lawyers: ["koo-bonwoo", "kang-hyunwoo", "park-jongjin"],
    centers: [],
    situations: [
      { label: "투자계약을 검토해야 해요", caseType: "기업" },
      { label: "주주 간 분쟁이 생겼어요", caseType: "기업" },
      { label: "정기 자문이 필요해요", caseType: "기업" },
      { label: "병원 운영 문제예요", caseType: "기업" },
    ],
  },
  {
    name: "민사",
    caseType: "민사",
    items: ["대여금·투자금 반환", "공사대금, 하자", "임대차 보증금, 명도", "개인회생·파산"],
    lawyers: ["park-jongjin", "kang-hyunwoo", "kim-chunghyeon"],
    centers: [],
    situations: [
      { label: "빌려준 돈을 못 받았어요", caseType: "민사" },
      { label: "공사대금 문제예요", caseType: "건설·부동산" },
      { label: "보증금을 못 받았어요", caseType: "민사" },
      { label: "빚을 정리하고 싶어요", caseType: "회생·파산" },
    ],
  },
]

/** 상담 폼의 '어떤 일인가요?' 선택지 */
export const CASE_TYPES = ["형사", "성범죄", "가사", "기업", "민사", "건설·부동산", "회생·파산", "기타"]
