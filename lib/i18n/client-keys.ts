import { fields } from "@/lib/practice"
import { lawyers } from "@/lib/lawyers"
import type { Lang } from "@/lib/langs"
import type { Dict } from "@/lib/i18n/fmt"
import { dictFor } from "@/lib/i18n/t"
import { lawyerName } from "@/lib/lawyer-name"

/**
 * 브라우저 컴포넌트가 쓰는 한국어 문장 목록. 서버에서 dictFor 로 그 언어 사전을 만들어 넘깁니다.
 * (번역 키 뽑는 스크립트도 이 목록을 읽습니다)
 */
const fieldWords = fields.flatMap((f) => [f.name, ...f.items])

export const HEADER_KEYS = [
  "법인 소개", "구성원", "외국인센터", "업무사례", "칼럼", "감사일기", "오시는 길", "주 메뉴", "업무영역", "상담 신청",
  "전화 상담", "메뉴 닫기", "메뉴 열기", "담당 변호사", "센터", ...fieldWords,
  ...lawyers.map((l) => l.title),
]

export const CASES_TABLE_KEYS = ["전체", "형사", "가사", "기업", "의료", "부동산", "민사", "분야", "시기", "의뢰인의 상황", "결과", "담당", "이 분야의 업무사례는 아직 정리 중입니다."]

export const FAQ_SEARCH_KEYS = [
  "찾는 질문이 없으신가요?", "센터별 질문 검색", "예: 합의금, 양육비, 보증금", "질문 목록을 불러오지 못했습니다. 잠시 뒤 다시 찾아 주세요.",
  "질문을 불러오는 중입니다…", "맞는 질문이 없습니다. 다른 말로 찾아보시거나 전화로 물어보셔도 됩니다.", "센터 질문 {n}개", "{name}에서 자세히 보기", "더 보기",
]

/** 변호사 한글 이름 → 그 언어 표기 */
export function nameDict(lang: Lang): Dict {
  if (lang === "ko") return {}
  return Object.fromEntries(lawyers.map((l) => [l.name, lawyerName(l, lang)]))
}

export const clientDict = (lang: Lang, keys: string[]): Dict => ({ ...dictFor(lang, keys), ...nameDict(lang) })

export const TEAM_KEYS = [
  "업무사례 보기", "자격", "경력", "학력", "← 이력보기", "주요 업무 사례", "이력 전체 보기", "이력", "구성원 소개",
  "검찰, 금융회사, 로펌, 의료기관 자문에서 일해 온 변호사들이 사건을 직접 수행합니다.", "변호사 바로 가기",
]

/** 칼럼 카드·목록·검색 (분야 이름, 변호사 직함 포함) */
export const COLUMN_KEYS = [
  "형사", "가사", "기업", "의료", "부동산", "민사", ...lawyers.map((l) => l.title),
  "센터별 칼럼", "전체", "칼럼 검색", "찾는 말을 넣어 보세요 (예: 합의, 보증금, 양육비)", "{n}편", "'{q}' 검색 결과",
  "맞는 칼럼이 없습니다. 다른 말로 찾아보세요.", "더 보기",
]
