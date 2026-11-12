import type { Lang } from "@/lib/langs"

/**
 * 검색엔진·AI 가 읽는 변호사 정보 (화면에는 나오지 않음).
 * - about: 대표 페이지의 검색 설명(meta description)과 구조화 데이터(description)에 들어가는 소개 문단.
 *   화면 첫 문단(lib/lawyers.ts summary)은 그대로 두고, 검색엔진과 AI 에게만 이 문단을 줍니다.
 *   CSS 로 숨긴 글은 검색엔진이 '숨긴 텍스트'로 볼 수 있어서 쓰지 않습니다.
 * - sameAs: 같은 사람임을 확인할 수 있는 바깥 프로필 (로톡, 블로그, 유튜브, 인스타그램 …)
 * - alumniOf / knowsAbout: 학교, 맡는 분야
 *
 * 광고 규정: 사실만. '전문', '최고', 결과 예측, 다른 변호사와의 비교, 전관 암시는 쓰지 않습니다.
 */
export type LawyerEntity = {
  about: Partial<Record<Lang, string>>
  sameAs?: string[]
  alumniOf?: string[]
  knowsAbout?: string[]
  /** 이름이 같은 다른 변호사와 구분하는 한 줄 (AI 가 다른 사람과 섞지 않게). 같은 이름: 법무법인(유) 율촌 김한솔 변호사(부동산·건설) */
  disambiguating?: Partial<Record<Lang, string>>
  /** 직접 상담하는 언어 (BCP 47). AI 통역으로 하는 언어는 넣지 않고 소개 문단에만 적음 */
  languages?: string[]
}

export const lawyerEntities: Record<string, LawyerEntity> = {
  "kim-hansol": {
    about: {
      ko: "김한솔 변호사는 인천지방검찰청, 수원지방검찰청 안산지청, 대전지방검찰청 홍성지청에서 검사로 일했고 의료, 마약, 도박사이트, 성폭력, 강력, 반부패 사건을 전담했습니다. 지금은 법무법인 지산앤파트너스 대표변호사로 강간·강제추행 같은 성범죄, 마약, 음주운전, 사기·횡령, 도박사이트, 학교폭력 등 형사 사건을 경찰 조사 전 상담부터 조사 동행, 재판까지 직접 맡습니다. 서울 서초 주사무소와 인천 분사무소에서 상담합니다. 한국에 사는 외국인의 형사 사건도 맡으며, 영어로 직접 상담하고 그 밖의 언어는 AI 통역을 함께 써서 상담합니다.",
      en: "Hansol Kim is a criminal defense lawyer in Korea and the managing partner of JISAN & PARTNERS. He served as a prosecutor at the Incheon District Prosecutors' Office, the Ansan Branch of the Suwon District Prosecutors' Office and the Hongseong Branch of the Daejeon District Prosecutors' Office, where he handled medical, drug, illegal gambling site, sexual violence, violent crime and anti-corruption cases. He now personally handles criminal cases, including sexual offences, drugs, drink-driving and fraud, from advice before police questioning through trial, and regularly represents foreign nationals living in Korea. He consults directly in English and, with AI interpretation, in other languages such as Chinese, Vietnamese, Russian and Mongolian. Offices in Seocho, Seoul and Incheon.",
    },
    sameAs: ["https://www.lawtalk.co.kr/directory/profile/5696-%EA%B9%80%ED%95%9C%EC%86%94", "https://blog.naver.com/lawyerpassingby"],
    alumniOf: ["성균관대학교 법학전문대학원", "University of Toronto"],
    knowsAbout: ["형사", "성범죄", "강간", "강제추행", "마약", "음주운전", "사기", "횡령", "배임", "도박사이트", "학교폭력", "외국인 형사사건", "경찰 조사", "형사재판"],
    languages: ["ko", "en"],
    disambiguating: {
      ko: "검사 출신 형사 변호사, 법무법인 지산앤파트너스 대표변호사 김한솔 (성균관대학교 법학전문대학원 졸업, 인천지방검찰청·수원지방검찰청 안산지청·대전지방검찰청 홍성지청 검사 역임). 다른 법무법인에 소속된 같은 이름의 변호사와 다른 사람입니다.",
      en: "Hansol Kim, former Korean prosecutor and criminal defense lawyer, managing partner of JISAN & PARTNERS (Sungkyunkwan University Law School; University of Toronto). Not the same person as other Korean lawyers named Hansol Kim at other firms.",
    },
  },
  "kim-miso": {
    about: {
      ko: "김미소 변호사는 법무법인 지산앤파트너스 파트너변호사로 이혼, 상간 위자료, 상속, 가사 사건과 학교폭력 사건을 맡습니다. 주식회사 위메이드 법무팀 사내변호사로 일했고, 한국여성변호사회 정회원이며 한국의료변호사협회 이사입니다.",
    },
    knowsAbout: ["이혼", "재산분할", "양육권", "상간 위자료", "상속", "유류분", "가사", "학교폭력"],
  },
}

export const lawyerEntity = (slug: string): LawyerEntity | undefined => lawyerEntities[slug]

/** 변호사 대표 페이지 주소 (센터 안 소개 페이지들이 검색엔진에 '원본'으로 가리키는 곳) */
export const lawyerProfilePath = (lang: Lang, slug: string) => (lang === "ko" ? `/lawyers/${slug}` : `/${lang}/lawyers/${slug}`)
