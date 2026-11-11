import { prosecutor } from "@/lib/prosecutor"

/**
 * 센터마다 앞에 세우는 변호사 (첫 화면 꼬리표, 사진 아래 이름표, 본인 이름으로 나가는 글, 경력 목록).
 * 여기에 센터가 들어 있으면 그 센터 첫 페이지는 '누가 맡는지를 앞에' 두는 순서와 단체 사진 첫 화면을 씁니다.
 *
 * 광고 규정: 경력은 사실만. '전관', 영향력 암시, 다른 변호사와의 비교, 결과 예측은 쓰지 않습니다.
 * letter(본인 글)는 그 변호사 본인이 정한 문장만 넣습니다.
 */
export type LeadLawyer = {
  slug: string
  /** 센터 첫 페이지 구역 사진 (가로로 넓게 자른 책상 컷) */
  photo: string
  /** 첫 화면 꼬리표 */
  tag: string
  /** 사진 아래 이름표 */
  caption: { name: string; lines: string[] }
  /** 본인 이름으로 나가는 글 (손글씨로 보임, 줄바꿈 그대로) */
  letter: string[]
  /** 글 아래 목록 (평가·활동 등) */
  list?: { title: string; items: string[] }
  /** 사진 아래 프로필 링크 문구와 프로필 안 이동 위치 */
  profileLabel: string
  profileAnchor?: string
  /** 변호사 구역 머리 단체 사진 옆 글 */
  teamText: string
  centers: string[]
}

export const leadLawyers: LeadLawyer[] = [
  {
    slug: prosecutor.slug,
    photo: "/images/lawyers/kim-hansol-desk.jpg",
    tag: prosecutor.tag,
    caption: prosecutor.caption,
    letter: prosecutor.letter,
    list: { title: "검사 재직 중 받은 평가", items: prosecutor.awards.map((a) => a.text) },
    profileLabel: "근무한 곳과 프로필 보기",
    profileAnchor: "prosecutor",
    teamText:
      "형사 사건에 돈 문제, 회사 문제, 가족 문제가 함께 걸려 있으면 그 분야를 맡아 온 변호사가 같이 봅니다. 금융회사와 기업 자문, 의료, 부동산, 가사를 맡는 변호사가 한 사무실에서 일합니다.",
    centers: ["crime", "sex-crime", "drug", "dui", "economic-crime", "gambling", "unfair-competition"],
  },
  {
    slug: "kim-miso",
    photo: "/images/lawyers/kim-miso-desk.jpg",
    tag: "한국여성변호사회 정회원 · 한국의료변호사협회 이사",
    caption: {
      name: "가사·상속 파트너변호사 김미소",
      lines: ["한국여성변호사회 정회원 한국의료변호사협회 이사", "전) 주식회사 위메이드 법무팀 사내변호사"],
    },
    // 지금 구성원 소개에 실린 본인 소개 글. 본인이 새로 쓴 글을 받으면 바꿉니다
    letter: [
      "누구에게도 쉽게 꺼내기 어려운 이야기가 있습니다.\n그 이야기에 깊이 귀 기울이고, 당신에게 가장 나은 해결을 끝까지 고민하겠습니다.\n복잡하게 얽힌 문제를 풀어, 당신의 소중한 일상을 되찾는 데 함께하겠습니다.",
    ],
    list: { title: "활동", items: ["(사)한국여성변호사회 정회원", "한국의료변호사협회 이사", "광진구 선거방송토론위원회 위원"] },
    profileLabel: "프로필 보기",
    teamText:
      "이혼과 상속에 재산 문제, 회사 지분, 형사 고소가 함께 걸려 있으면 그 분야를 맡아 온 변호사가 같이 봅니다. 기업 자문, 부동산, 형사를 맡는 변호사가 한 사무실에서 일합니다.",
    centers: ["divorce", "adultery", "inheritance"],
  },
]

/** 그 센터 앞에 세우는 변호사 (없으면 원래 구성) */
export const leadFor = (centerSlug: string) => leadLawyers.find((l) => l.centers.includes(centerSlug))
