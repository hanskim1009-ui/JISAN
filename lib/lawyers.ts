import { lawyerImages, siteConfig } from "@/lib/site-config"

export type WorkCaseSection = { heading: string; items: string[] }

/** 자격 / 경력 / 학력을 구분해 표시 (구본우 등) */
export type StructuredResume = {
  qualifications: string[]
  career: string[]
  education: string[]
}

export type ResumeSection = { heading: string; items: string[] }

export type Lawyer = {
  /** 주소용 영문 이름 (/lawyers#kim-hansol) */
  slug: string
  /** 이름 위에 붙는 맡는 분야 (광고 규정상 '전문' 표기 없이 분야만) */
  field: string
  name: string
  title: string
  image: string
  summary: string
  career?: string[]
  highlights: string[]
  /** 개인 블로그 (칼럼 끝과 변호사 소개에 링크) */
  blogUrl?: string
  /** 이름 아래 한 줄 소개: "~하는 변호사" (경력에서 확인되는 것만) */
  tagline?: string
  /** 주요 경력 아래 자문·분야별 블록 (강현우 등) */
  resumeSections?: ResumeSection[]
  /** Next/Image className (구본우: 정사각 원본의 좌우 여백 축소) */
  photoImageClassName?: string
  structuredResume?: StructuredResume
  /** structuredResume과 함께 쓰면 이력 클릭 시 같은 영역에 주요 업무 사례 표시 */
  workCaseSections?: WorkCaseSection[]
}

export const lawyers: Lawyer[] = [
  {
    slug: "kim-hansol",
    field: "형사",
    name: "김한솔",
    tagline: "수사기관이 무엇을 보는지 알고, 조사 전에 대응 방향부터 잡는 변호사",
    title: "대표 변호사",
    image: lawyerImages.kim,
    blogUrl: "https://blog.naver.com/lawyerpassingby",
    summary:
      "김한솔 변호사는 인천지방검찰청, 수원지방검찰청 안산지청, 대전지방검찰청 홍성지청에서 검사로 일했습니다. 검사 시절 대전고등검찰청 수범검사로 선정됐고, 일하던 검사실이 인천지검과 홍성지청에서 우수검사실로 뽑혔습니다.\n지금은 형사 사건을 주로 맡고 있습니다. 조사 전 준비부터 조사 동석, 의견서, 재판까지 직접 수행합니다.",
    career: [
      `현) ${siteConfig.name} 대표변호사`,
      "전) 법무법인 온강 대표변호사",
      "전) 인천지방검찰청 검사",
      "전) 수원지방검찰청 안산지청 검사",
      "전) 대전지방검찰청 홍성지청 검사",
    ],
    highlights: [
      "인천지방검찰청 의료전담 검사",
      "대전고등검찰청 수범검사 선정",
      "인천지방검찰청 우수검사실 선정",
      "대전지방검찰청 홍성지청 우수검사실 선정",
      "성균관대학교 법학전문대학원 졸업",
      "캐나다 토론토 대학교 생명과학과 최우등 졸업 (High Distinction)",
    ],
  },
  {
    slug: "koo-bonwoo",
    field: "기업·금융",
    name: "구본우",
    tagline: "투자계약과 지분 구조를 읽고 경영권 분쟁의 쟁점을 짚는 변호사",
    title: "대표 변호사",
    image: lawyerImages.koo,
    summary:
      "구본우 변호사는 IBK기업은행, 하나증권, 스마일게이트인베스트먼트(준법감시인), 법무법인 시공과 법무법인 이한에서 일했습니다. 펀드투자상담사와 증권투자자문인력 자격도 갖고 있습니다.\n상장사 경영권 분쟁, 투자계약, 자본시장법 사건을 주로 맡고, 같은 쟁점이 형사 사건으로 번지면 형사 사건도 함께 봅니다.",
    structuredResume: {
      qualifications: ["변호사", "펀드투자상담사", "증권투자자문인력"],
      career: [
        "법무법인 이한",
        "스마일게이트인베스트먼트 준법감시인",
        "하나증권",
        "법무법인 시공",
        "IBK기업은행",
      ],
      education: ["성균관대학교 법학전문대학원", "연세대학교 법학과"],
    },
    workCaseSections: [
      {
        heading: "기업법무",
        items: [
          "중견업체 자회사 인수 및 매각을 위한 법률실사(L.D.D) 업무 수행",
          "VC 투자전 법률실사 업무 수행",
          "투자합자회사설립 관련 자문 수행",
          "코스닥 상장사 등 다수 기업 경영권 분쟁 관련 법률 자문 업무 수행",
          "금융감독원 보험 관련 법률 자문 업무 수행",
          "언론사, 제조자, 건설사 및 협회 등 다수 기업 법률 자문 수행",
        ],
      },
      {
        heading: "VC, 사모펀드, 스타트업",
        items: [
          "상환전환우선주 인수계약, 전환사채인수계약, 조건부지분전환계약, 주주간계약 등 다수 투자 관련 계약",
          "인도, 싱가폴, 미국 등 해외 소재 법인 투자 검토 수행",
          "펀드 설립 및 운용 검토",
          "주주총회 및 이사회 결의 자문",
          "사규(임원보수규정, 취업규칙 등) 검토",
          "신사업 적정성 법률 자문 업무 수행",
        ],
      },
      {
        heading: "형사",
        items: [
          "금융회사 관련 자본시장법 등에 관한 법률자문 업무 및 형사사건 업무 수행",
          "유사투자자문업 관련 자본시장법 위반 등 형사사건 업무 수행",
          "투자 사기, 자본시장법 상 사기적 부정거래 혐의 등에 관한 고소대리 업무 수행",
          "횡령, 배임 등 재산범죄 관련 사건 다수 수행",
        ],
      },
      {
        heading: "민사",
        items: [
          "분양계약해제 사건",
          "불법행위에 따른 손해배상청구 사건",
          "공사대금지급 청구 사건",
          "일조권 사건",
          "투자금 반환 사건",
        ],
      },
    ],
    highlights: [],
  },
  {
    slug: "park-jongjin",
    field: "민사·기업 자문",
    name: "박종진",
    tagline: "기업 자문 경험으로 분쟁이 되기 전에 계약의 위험을 살피는 변호사",
    title: "파트너 변호사",
    image: lawyerImages.park,
    summary:
      "박종진 변호사는 법무법인(유)효성과 법률사무소 더올에서 파트너 변호사로 일했습니다. 지금 주식회사 동화약품, 울산 해상풍력대책위원회, 주식회사 바른경영연구소의 자문을 맡고 있고, 대한한약사회 자문도 했습니다.\n기업 자문과 민사 사건을 주로 맡고 있습니다.",
    career: [
      `현) ${siteConfig.name} 파트너 변호사`,
      "전) 법무법인(유)효성 파트너 변호사",
      "전) 법률사무소 더올 파트너 변호사",
      "현) 주식회사 동화약품 자문변호사",
      "현) 울산 해상풍력대책위원회 자문변호사",
      "현) 주식회사 바른경영연구소 자문·협력변호사",
      "전) 대한한약사회 자문변호사",
      "다수의 중견·중소기업 자문 변호사",
    ],
    highlights: [
      "단국대학교 법학과",
      "성균관대학교 법학전문대학원",
      "단국대학교 대학원 박사과정",
    ],
  },
  {
    slug: "kang-hyunwoo",
    field: "의료·기업 자문",
    name: "강현우",
    tagline: "의료기관 자문을 맡아 병원 운영과 의료 분쟁을 함께 보는 변호사",
    title: "파트너 변호사",
    image: lawyerImages.kang,
    summary:
      "강현우 변호사는 법무법인 공간에서 변호사로 일했습니다. 대한병원협회, 경기도의료원, 경기도약사회와 여러 병원의 자문을 맡아 왔고, 서울시 옴부즈만과 경기복지재단 자문도 했습니다.\n병원 운영과 의료 분쟁, 기업 자문을 주로 맡고 있습니다.",
    career: [
      `현) ${siteConfig.name} 파트너 변호사`,
      "전) 법무법인 공간 변호사",
    ],
    resumeSections: [
      {
        heading: "의료·보건 분야 자문",
        items: [
          "대한병원협회 / 대한간호조무사협회 자문",
          "경기도의료원 / 경기도약사회 자문",
          "9988병원 / 예손병원 / 대정병원 / 밝은눈안과 / 이데아성형외과 등 다수 의료기관 전담 자문",
        ],
      },
      {
        heading: "공공·기관 자문",
        items: [
          "서울시 옴부즈만 자문 수행",
          "경기복지재단 자문 수행",
          "홍은 2-2구역 주민자치위원회 자문",
        ],
      },
      {
        heading: "기업 법률 리스크 관리",
        items: [
          "㈜프랭클린테크놀로지 / ㈜디엔엠 / ㈜당당 / ㈜맘스뷰티 등 다수 기업 자문",
        ],
      },
    ],
    highlights: ["건국대학교 자율전공학부", "전남대학교 법학전문대학원"],
  },
  // TODO: 김미소 변호사 정보 수령 후 직함·소개·이력·학력 입력 (사진: public/images/lawyers/kim-miso.jpg)
  {
    slug: "kim-miso",
    field: "가사",
    name: "김미소",
    title: "변호사",
    image: lawyerImages.kimMiso,
    summary: "프로필을 준비하고 있습니다.",
    career: [],
    highlights: [],
  },
  // TODO: 김충현 변호사 정보 수령 후 직함·소개·이력·학력 입력 (사진: public/images/lawyers/kim-chunghyeon.jpg)
  {
    slug: "kim-chunghyeon",
    field: "형사·민사",
    name: "김충현",
    title: "변호사",
    image: lawyerImages.kimChungHyeon,
    summary: "프로필을 준비하고 있습니다.",
    career: [],
    highlights: [],
  },
  // TODO: 박한민 변호사 직함·이력·학력·사진 수령 후 입력 (주력 분야는 확인됨) (사진: public/images/lawyers/park-hanmin.jpg)
  {
    slug: "park-hanmin",
    field: "부동산",
    name: "박한민",
    title: "변호사",
    image: lawyerImages.parkHanmin,
    tagline: "재개발·재건축, 설계변경, 하도급, 간접비, 하자보수 사건을 주로 맡는 변호사",
    summary: "박한민 변호사는 재개발·재건축, 설계변경, 하도급, 간접비, 하자보수 사건을 주로 맡습니다.",
    career: [],
    highlights: [],
  },
]

export function getLawyer(slug: string) {
  return lawyers.find((l) => l.slug === slug)
}
