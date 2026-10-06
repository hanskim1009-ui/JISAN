/**
 * 개발 미리보기용 예시 글 (lib/preview.ts의 SHOW_SAMPLES일 때만 쓰임)
 * 실제 사건·의뢰인이 아닙니다. 운영 사이트에는 나가지 않습니다.
 */
import type { CaseItem, ColumnItem, DiaryEntry } from "@/lib/content"
import type { FeedItem } from "@/lib/feeds"

const note = "예시 글입니다. 실제 사건이 아니며, 실제 업무사례가 등록되면 사라집니다."

export const sampleCases: CaseItem[] = [
  { id: "sample-embezzlement", sample: true, field: "형사", centers: ["crime"], decidedOn: "2025.12", situation: "회사 돈을 빼돌렸다는 고소를 당한 재무팀장", caseType: "업무상횡령", clientRole: "피의자", stage: "수사", result: "혐의없음", issue: note, work: note, lawyers: ["koo-bonwoo"] },
  { id: "sample-indecent", sample: true, field: "형사", centers: ["sex-crime"], decidedOn: "2025.11", situation: "회식 자리 신체 접촉으로 고소된 직장인", caseType: "강제추행", clientRole: "피의자", stage: "수사", result: "혐의없음", issue: note, work: note, lawyers: ["kim-hansol"] },
  { id: "sample-divorce", sample: true, field: "가사", decidedOn: "2025.11", situation: "별거 3년, 재산분할 비율을 두고 다툰 50대 배우자", caseType: "이혼·재산분할", clientRole: "원고", stage: "1심", result: "조정 성립", issue: note, work: note, lawyers: ["kim-miso"] },
  { id: "sample-construction", sample: true, field: "민사", decidedOn: "2025.10", situation: "공사를 마치고 대금 2억 원을 받지 못한 인테리어 업체", caseType: "공사대금", clientRole: "원고", stage: "1심", result: "전부 인용", issue: note, work: note, lawyers: ["park-jongjin"] },
  { id: "sample-shareholder", sample: true, field: "기업", decidedOn: "2025.09", situation: "공동창업자와 지분 정리를 두고 갈등한 스타트업", caseType: "주주 간 분쟁", clientRole: "회사", stage: "협상", result: "합의 성립", issue: note, work: note, lawyers: ["koo-bonwoo"] },
  { id: "sample-deposit", sample: true, field: "민사", decidedOn: "2025.09", situation: "계약이 끝났는데 보증금 1억 2천만 원을 돌려받지 못한 세입자", caseType: "임대차보증금", clientRole: "원고", stage: "조정", result: "조정 성립", issue: note, work: note, lawyers: ["kang-hyunwoo"] },
]

const body = (title: string): ColumnItem["body"] => [
  { type: "p", text: `‘${title}’ 칼럼이 들어갈 자리입니다. 실제 칼럼은 담당 변호사가 쓰고 광고책임변호사가 확인한 뒤 올라갑니다.` },
  { type: "h2", text: "소제목 예시" },
  { type: "p", text: "본문 문단 예시입니다. 의뢰인이 실제로 묻는 질문에 답하는 형식으로 씁니다." },
  { type: "ul", items: ["확인할 것 하나", "확인할 것 둘", "확인할 것 셋"] },
]

export const sampleColumns: ColumnItem[] = [
  { id: "sample-police-summons", sample: true, field: "형사", centers: ["crime"], date: "2026-09-28", title: "경찰 출석 요구를 받았을 때 먼저 할 일", summary: "출석 일정은 수사관과 협의해 조정할 수 있습니다. 조사 전에 사실관계와 자료를 정리해 두는 것이 중요합니다.", author: "kim-hansol", body: body("경찰 출석 요구를 받았을 때 먼저 할 일") },
  { id: "sample-adultery-answer", sample: true, field: "가사", date: "2026-09-20", title: "상간 소장을 받았다면 답변서 기한부터 확인하세요", summary: "소장을 받은 날부터 30일 안에 답변서를 내야 합니다. 기한을 넘기면 원고 주장을 인정한 것으로 보고 판결이 날 수 있습니다.", author: "kim-miso", body: body("상간 소장을 받았다면 답변서 기한부터 확인하세요") },
  { id: "sample-investment-terms", sample: true, field: "기업", date: "2026-09-12", title: "투자계약서에서 먼저 볼 조항 다섯 가지", summary: "상환 조건, 투자자 동의권, 우선매수권처럼 나중에 경영권에 영향을 주는 조항을 먼저 봅니다.", author: "koo-bonwoo", body: body("투자계약서에서 먼저 볼 조항 다섯 가지") },
]

export const sampleDiary: DiaryEntry[] = [
  { id: "sample-tangerine", sample: true, date: "2025-12-02", title: "귤 한 상자", body: "예시 글입니다. 사건이 끝나고 몇 주 뒤 제주에서 귤 한 상자가 왔습니다. 상자 안 메모를 사무실 게시판에 붙여 두었습니다.", field: "형사", photos: [], author: "직원" },
  { id: "sample-late-text", sample: true, date: "2025-11-17", title: "밤 11시 40분의 문자", body: "예시 글입니다. 조정이 끝난 날 밤, 오늘은 처음으로 푹 잘 수 있을 것 같다는 문자가 왔습니다.", field: "가사", photos: [], author: "직원" },
  { id: "sample-coffee", sample: true, date: "2025-10-30", title: "커피 열두 잔", body: "예시 글입니다. 공사대금을 받은 날, 대표님이 직원들 수만큼 커피를 들고 사무실에 들르셨습니다.", field: "민사", photos: [], author: "직원" },
]

export const sampleVideos: FeedItem[] = [
  { title: "경찰 출석 요구를 받았을 때 (예시 영상)", link: "#", date: "2026-09-25" },
  { title: "이혼 재산분할, 무엇이 나뉘나 (예시 영상)", link: "#s2", date: "2026-09-18" },
  { title: "투자계약서 볼 때 주의할 점 (예시 영상)", link: "#s3", date: "2026-09-11" },
  { title: "보증금을 못 받았을 때 (예시 영상)", link: "#s4", date: "2026-09-04" },
]
