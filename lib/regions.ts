/**
 * 지역 홈페이지 (jisanlaw.com/incheon, /suwon, /hongseong, /ansan)
 * 지역마다 따로 된 메인 홈페이지처럼 보이고, 첫 화면은 김한솔 변호사입니다. 분야는 기존 센터로 연결합니다.
 *
 * 관할 기관은 확인한 것만 적습니다 (2026-10-10 확인).
 * - 법원: 「각급 법원의 설치와 관할구역에 관한 법률」 별표 1·3·5 (법률 제21484호, 2026. 3. 17. 시행, law.go.kr)
 *   인천은 2028. 3. 1. 시행 별표(인천고등법원·인천지방법원 북부지원)도 함께 확인
 * - 공소청: 「공소청의 위치와 각급 공소청 및 지청의 명칭 및 위치에 관한 규정」 별표 (2026. 10. 2. 시행, law.go.kr).
 *   2026. 10. 2. 검찰청이 없어지고 공소청이 생겼습니다
 * - 경찰서: 인천경찰청(icpolice.go.kr) · 경기남부경찰청(ggpolice.go.kr) · 충남경찰청(cnpolice.go.kr) 누리집의 경찰서 목록
 * 법이 바뀌면 이 파일만 고치면 됩니다.
 *
 * 사무소: lib/site-config.ts 의 offices 중 이 지역 이름으로 시작하고 주소가 있는 사무소만 "○○ 사무소"로 보입니다.
 * 주소가 없으면 "○○ 지역 사건 상담"으로 쓰고, 방문 상담은 주소가 있는 사무소로 안내합니다.
 * 광고 규정: '전문', 결과 보장, 수사기관·법원과의 연고를 내세우는 표현은 쓰지 않습니다.
 */

import { openOffices, type Office } from "@/lib/site-config"
import { homeFaqs } from "@/lib/home-faq"

export type RegionSlug = "incheon" | "suwon" | "hongseong" | "ansan"

/** 지역 홈페이지 첫 화면 변호사 (lib/lawyers.ts slug) */
export const REGION_LAWYER = "kim-hansol"

export type RegionAgency = { name: string; desc?: string }

export type RegionAgencyGroup = {
  /** 법원 / 공소청 / 경찰서 */
  kind: string
  /** 처음 나오는 기관을 쉬운 말로 한 번 풀어 줌 */
  hint: string
  items: RegionAgency[]
}

export type Region = {
  slug: RegionSlug
  /** 화면에 쓰는 지역 이름 */
  name: string
  /** site-config 사무소 이름의 앞부분 (예: "홍성" → "홍성 분사무소"). 없으면 name */
  officePrefix?: string
  seo: { title: string; description: string; keywords: string[] }
  hero: { title: string; sub: string }
  /** '이 지역에서 사건이 진행되는 곳' 머리말 */
  agenciesLead: string
  agencies: RegionAgencyGroup[]
  /** 법 개정으로 바뀔 예정인 것 (시행일이 정해진 것만) */
  upcoming?: string
  /** 분야 센터 머리말 */
  centersLead: string
  /** 상담 안내 머리말 */
  consultLead: string
  /** 이 지역 첫 화면 맨 위 질문 */
  faqs: { q: string; a: string }[]
}

const PROSECUTION_HINT = "재판에 넘길지(기소) 정하는 곳입니다. 2026년 10월 2일 검찰청이 없어지고 공소청이 생겼습니다."

export const regions: Region[] = [
  {
    slug: "incheon",
    name: "인천",
    seo: {
      title: "인천 형사·가사 사건 상담",
      description:
        "인천에서 경찰 조사, 체포·구속, 형사재판이나 이혼·상속 문제를 겪고 계신다면 김한솔 변호사와 먼저 상담하세요. 인천지방법원·인천가정법원·인천지방공소청 사건 안내.",
      keywords: ["인천 형사변호사", "인천 이혼변호사", "인천지방법원", "인천가정법원", "인천 경찰 조사", "인천지방공소청"],
    },
    hero: {
      title: "인천 형사·가사 사건,\n조사 전에 방향부터",
      sub: "경찰 출석 요구를 받았거나 가족이 체포됐을 때, 이혼이나 상속 문제로 인천가정법원에 가야 할 때. 지금 단계에서 할 일부터 함께 정리합니다.",
    },
    agenciesLead: "인천에서 생긴 사건은 대부분 아래 기관에서 조사와 재판이 진행됩니다.",
    agencies: [
      {
        kind: "법원",
        hint: "인천광역시 사건의 1심 재판을 맡습니다.",
        items: [
          { name: "인천지방법원", desc: "형사·민사 재판" },
          { name: "인천가정법원", desc: "이혼·양육·상속 같은 가사 사건" },
        ],
      },
      {
        kind: "공소청",
        hint: PROSECUTION_HINT,
        items: [{ name: "인천지방공소청", desc: "옛 인천지방검찰청" }],
      },
      {
        kind: "경찰서",
        hint: "인천경찰청 소속 경찰서입니다. 사건이 생긴 곳이나 사는 곳을 맡은 경찰서에서 조사합니다.",
        items: ["제물포", "미추홀", "남동", "연수", "논현", "부평", "삼산", "계양", "서부", "영종", "강화"].map((n) => ({
          name: `${n}경찰서`,
        })),
      },
    ],
    upcoming:
      "법 개정으로 2028년 3월 1일부터 인천고등법원이 생기고, 검단구·계양구·서해구·강화군 사건은 새로 생기는 인천지방법원 북부지원이 맡습니다.",
    centersLead: "사건 종류에 맞는 센터에서 처벌 기준, 절차, 자주 묻는 질문을 더 자세히 볼 수 있습니다.",
    consultLead: "인천에서 상담을 원하시면 전화나 상담 신청서로 먼저 사건을 알려 주세요. 전화는 24시간, 주말·공휴일에도 받습니다.",
    faqs: [
      {
        q: "인천에 사는데, 다른 지역에서 생긴 사건은 어디서 재판하나요?",
        a: "형사소송법은 범죄가 일어난 곳, 피고인의 주소·거소(실제로 머무는 곳) 또는 현재지를 맡은 법원에서 재판할 수 있다고 정합니다. 그래서 사는 곳과 다른 지역 법원에서 재판이 열릴 수도 있습니다.",
      },
    ],
  },
  {
    slug: "suwon",
    name: "수원",
    seo: {
      title: "수원 형사·가사 사건 상담",
      description:
        "수원에서 경찰 출석 요구, 형사재판, 이혼·양육권 문제가 생겼다면 김한솔 변호사와 상담하세요. 수원지방법원·수원가정법원·수원지방공소청 사건 안내.",
      keywords: ["수원 형사변호사", "수원 이혼변호사", "수원지방법원", "수원가정법원", "수원 경찰 조사", "수원지방공소청"],
    },
    hero: {
      title: "수원에서 겪는 형사·가사 문제,\n처음부터 함께 봅니다",
      sub: "수원·오산·용인·화성의 1심 사건은 수원지방법원과 수원가정법원에서 열립니다. 조사 일정이 잡혔거나 소장을 받으셨다면 서류를 들고 먼저 연락 주세요.",
    },
    agenciesLead: "수원지방법원 본원은 수원시·오산시·용인시·화성시를 맡습니다. 수원시 안에서는 아래 기관을 주로 오가게 됩니다.",
    agencies: [
      {
        kind: "법원",
        hint: "수원시·오산시·용인시·화성시 사건의 1심 재판을 맡습니다.",
        items: [
          { name: "수원지방법원", desc: "형사·민사 재판" },
          { name: "수원가정법원", desc: "이혼·양육·상속 같은 가사 사건" },
        ],
      },
      {
        kind: "공소청",
        hint: PROSECUTION_HINT,
        items: [{ name: "수원지방공소청", desc: "옛 수원지방검찰청" }],
      },
      {
        kind: "경찰서",
        hint: "수원시를 맡는 경기남부경찰청 소속 경찰서입니다.",
        items: ["수원장안", "수원팔달", "수원권선", "수원영통"].map((n) => ({ name: `${n}경찰서` })),
      },
    ],
    centersLead: "형사·가사 말고도 기업, 의료, 부동산, 민사 사건은 각 센터에서 안내합니다.",
    consultLead: "수원 지역 사건도 전화와 상담 신청서로 바로 접수합니다. 받은 출석 요구서나 소장이 있으면 옆에 두고 연락 주세요.",
    faqs: [
      {
        q: "수원 사건인데 다른 지역 사무소 변호사에게 맡겨도 되나요?",
        a: "네. 변호사는 지역과 관계없이 전국의 경찰서·공소청·법원 사건을 맡을 수 있습니다. 조사와 재판은 사건이 진행되는 곳에서 열리고, 변호사도 그곳에 출석합니다.",
      },
    ],
  },
  {
    slug: "hongseong",
    name: "홍성",
    seo: {
      title: "홍성·보령·예산·서천 형사·가사 사건 상담",
      description:
        "홍성·보령·예산·서천에서 경찰 조사나 형사재판, 이혼·상속 문제를 겪고 계신다면 김한솔 변호사와 상담하세요. 대전지방법원 홍성지원·대전가정법원 홍성지원·대전지방공소청 홍성지청 사건 안내.",
      keywords: ["홍성 변호사", "홍성 형사변호사", "보령 변호사", "예산 변호사", "서천 변호사", "대전지방법원 홍성지원", "홍성지청"],
    },
    hero: {
      title: "홍성·보령·예산·서천\n형사·가사 사건 상담",
      sub: "네 곳의 1심 사건은 대전지방법원 홍성지원에서 열립니다. 서울이나 인천까지 오시기 어렵다면 전화로 먼저 상담하실 수 있습니다.",
    },
    agenciesLead: "보령시·홍성군·예산군·서천군 사건은 아래 기관에서 조사와 재판이 진행됩니다.",
    agencies: [
      {
        kind: "법원",
        hint: "지원(支院)은 지방법원의 지역 법원입니다. 보령시·홍성군·예산군·서천군 사건의 1심 재판을 맡습니다.",
        items: [
          { name: "대전지방법원 홍성지원", desc: "형사·민사 재판" },
          { name: "대전가정법원 홍성지원", desc: "이혼·양육·상속 같은 가사 사건" },
        ],
      },
      {
        kind: "공소청",
        hint: PROSECUTION_HINT,
        items: [{ name: "대전지방공소청 홍성지청", desc: "옛 대전지방검찰청 홍성지청" }],
      },
      {
        kind: "경찰서",
        hint: "충남경찰청 소속으로, 홍성지원이 맡는 네 곳의 경찰서입니다.",
        items: ["홍성", "보령", "예산", "서천"].map((n) => ({ name: `${n}경찰서` })),
      },
    ],
    centersLead: "사건 종류를 고르면 그 분야 센터에서 절차와 준비할 것을 볼 수 있습니다.",
    consultLead: "멀리 오시기 전에 전화나 상담 신청서로 먼저 사건 내용을 알려 주세요. 카카오톡 채팅으로도 상담을 예약할 수 있습니다.",
    faqs: [
      {
        q: "홍성 사건인데 서울·인천 사무소 변호사에게 맡겨도 되나요?",
        a: "네. 변호사는 지역과 관계없이 전국의 경찰서·공소청·법원 사건을 맡을 수 있습니다. 조사와 재판은 사건이 진행되는 곳에서 열리고, 변호사도 그곳에 출석합니다.",
      },
    ],
  },
  {
    slug: "ansan",
    name: "안산",
    seo: {
      title: "안산·시흥·광명 형사·가사 사건 상담",
      description:
        "안산·시흥·광명에서 경찰 조사, 형사재판, 이혼·양육 문제가 생겼다면 김한솔 변호사와 상담하세요. 수원지방법원 안산지원·수원가정법원 안산지원·수원지방공소청 안산지청 사건 안내.",
      keywords: ["안산 형사변호사", "안산 이혼변호사", "시흥 변호사", "광명 변호사", "수원지방법원 안산지원", "안산지청"],
    },
    hero: {
      title: "안산·시흥·광명 사건,\n지금 단계부터 짚어 드립니다",
      sub: "안산시·광명시·시흥시의 1심 사건은 수원지방법원 안산지원과 수원가정법원 안산지원에서 열립니다. 혼자 판단하기 전에 먼저 물어보세요.",
    },
    agenciesLead: "안산시·광명시·시흥시 사건은 아래 기관에서 조사와 재판이 진행됩니다.",
    agencies: [
      {
        kind: "법원",
        hint: "지원(支院)은 지방법원의 지역 법원입니다. 안산시·광명시·시흥시 사건의 1심 재판을 맡습니다.",
        items: [
          { name: "수원지방법원 안산지원", desc: "형사·민사 재판" },
          { name: "수원가정법원 안산지원", desc: "이혼·양육·상속 같은 가사 사건" },
        ],
      },
      {
        kind: "공소청",
        hint: PROSECUTION_HINT,
        items: [{ name: "수원지방공소청 안산지청", desc: "옛 수원지방검찰청 안산지청" }],
      },
      {
        kind: "경찰서",
        hint: "경기남부경찰청 소속으로, 안산지원이 맡는 세 도시의 경찰서입니다.",
        items: ["안산단원", "안산상록", "시흥", "광명"].map((n) => ({ name: `${n}경찰서` })),
      },
    ],
    centersLead: "분야별 센터에서 처벌 기준과 절차, 비슷한 상황의 질문과 답을 볼 수 있습니다.",
    consultLead: "출석 요구서나 소장을 받으셨다면 받은 날짜와 기한부터 알려 주세요. 전화는 24시간 받습니다.",
    faqs: [
      {
        q: "안산에 사는데 시흥에서 생긴 사건은 어디서 재판하나요?",
        a: "안산시·광명시·시흥시는 모두 수원지방법원 안산지원이 맡습니다. 형사 사건은 범죄가 일어난 곳이나 피고인이 사는 곳을 맡은 법원에서 재판할 수 있어, 다른 지역에서 생긴 사건은 그곳 법원에서 열릴 수도 있습니다.",
      },
    ],
  },
]

export function getRegion(slug: string) {
  return regions.find((r) => r.slug === slug)
}

/** 지역 주소 */
export const regionBase = (r: Pick<Region, "slug">) => `/${r.slug}`

const officeRegion = (o: Office) => o.name.split(" ")[0]

/** 이 지역 이름으로 등록된 사무소 (주소가 있을 때만). site-config 에 주소를 넣으면 자동으로 "○○ 분사무소"가 보입니다 */
export function regionOffice(r: Region): Office | undefined {
  const prefix = r.officePrefix ?? r.name
  return openOffices.find((o) => o.address && officeRegion(o) === prefix)
}

/** 방문 상담 장소: 주소가 있는 사무소만 (이 지역 사무소가 있으면 맨 앞) */
export function visitOffices(r: Region): Office[] {
  const own = regionOffice(r)
  const rest = openOffices.filter((o) => o.address && o !== own)
  return own ? [own, ...rest] : rest
}

/** 이 지역 이름표: 사무소가 있으면 "인천 분사무소", 없으면 "수원 지역 사건 상담" */
export function regionLabel(r: Region) {
  return regionOffice(r)?.name ?? `${r.name} 지역 사건 상담`
}

/** 메인 '자주 묻는 질문' 중 지역과 관계없는 형사·가사 질문 */
const COMMON_FAQ_QS = [
  "경찰 조사를 앞두고 있는데 변호사가 같이 갈 수 있나요?",
  "협의이혼은 얼마나 걸리나요?",
  "상담을 받으면 꼭 선임해야 하나요?",
  "상담 내용이 다른 사람에게 알려질까 걱정됩니다.",
]

/** 지역 첫 화면 질문: 지역 질문 + 공소청 + 공통 질문 */
export function regionFaqs(r: Region) {
  const common = COMMON_FAQ_QS.flatMap((q) => homeFaqs.filter((f) => f.q === q))
  return [
    ...r.faqs,
    {
      q: "검찰청이 공소청으로 바뀌었다는데, 무엇을 확인해야 하나요?",
      a: "2026년 10월 2일 검찰청이 없어지고 공소청이 생겼습니다. 그전에 받은 서류에는 '○○지방검찰청'으로 적혀 있을 수 있습니다. 받은 서류의 기관 이름과 사건번호를 그대로 알려 주시면 지금 어디에서 진행 중인지 확인해 드립니다.",
    },
    ...common,
  ]
}
