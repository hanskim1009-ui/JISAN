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
    title: "대표 변호사",
    image: lawyerImages.kim,
    summary:
      "오랜 기간 검사로 재직하며 고등검찰청에서 수범검사로까지 선정되었던 형사 전문 변호사입니다. 검사 재직 시 쌓은 풍부한 수사·재판 경험을 바탕으로 의뢰인의 권익 보호에 최선을 다하고 있습니다.",
    career: [
      `현) ${siteConfig.name} 대표변호사`,
      "전) 법무법인 온강 대표변호사",
      "전) 인천지방검찰청 검사",
      "전) 수원지방검찰청 안산지청 검사",
      "전) 대전지방검찰청 홍성지청 검사",
    ],
    highlights: [
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
    title: "대표 변호사",
    image: lawyerImages.koo,
    summary:
      "로펌·금융사·VC 분야에서 기업법무와 준법감시 등을 경험한 대표 변호사입니다. 상장사 경영권 분쟁, 투자계약, 자본시장법 관련 형사·민사까지 아우르며 의뢰인의 거래와 분쟁 전반에 맞는 법률 서비스를 제공합니다.",
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
    title: "파트너 변호사",
    image: lawyerImages.park,
    summary:
      "시니어 변호사로 활동하며 기업 자문과 민·형사 사건을 아우러 왔습니다.\n동화약품, 울산 해상풍력대책위원회, 바른경영연구소 등 다양한 기관·기업의 자문을 맡아 왔으며, 기업 자문 경험을 바탕으로 의뢰인의 법률 리스크를 선제적으로 관리합니다.",
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
    title: "파트너 변호사",
    image: lawyerImages.kang,
    summary:
      "다수의 민·형사 사건 승소와 기업 자문을 통해 증명된 전문성으로 의뢰인의 신뢰에 보답하고 있습니다. 치밀한 법리 검토와 노련한 대응을 통해 어떠한 난관 속에서도 의뢰인의 이익을 최우선으로 지켜냅니다.",
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
]

export function getLawyer(slug: string) {
  return lawyers.find((l) => l.slug === slug)
}
