/**
 * 사이트 설정
 * 전화번호, SNS, 주소 등 변경 시 이 파일만 수정하면 됩니다.
 */

/**
 * 법인 등기 완료 후 true로 바꾸면 사이트 전체 상호가
 * "법무법인 지산앤파트너스"로 바뀌고, 메인 첫 화면에 출범 문구가 나옵니다.
 * (사업자등록번호·광고책임변호사도 함께 확인)
 */
const INCORPORATED = false

export type Office = { name: string; address: string; phone: string; mapUrl: string; open: boolean }

export const siteConfig = {
  incorporated: INCORPORATED,
  name: INCORPORATED ? "법무법인 지산앤파트너스" : "법률사무소 지산",
  /** 조사 붙은 상호 (문장 안에서 사용) */
  nameTopic: INCORPORATED ? "법무법인 지산앤파트너스는" : "법률사무소 지산은",
  /** 센터 로고 앞에 붙는 짧은 이름 (예: "지산 형사센터") */
  shortName: "지산",
  nameEn: INCORPORATED ? "JISAN & PARTNERS" : "JISAN LAW",
  siteUrl: "https://www.jisanlaw.com",
  phone: "02-6951-4097",
  phoneHref: "tel:02-6951-4097",
  phoneIntl: "+82-2-6951-4097",
  /** 카카오톡 채널 URL - 본인 채널로 교체 필요 */
  kakaoTalkUrl: "https://pf.kakao.com/_Mxlgyn/chat",
  address: "서울시 서초구 서초대로46길 109, 6층(지산빌딩)",
  addressShort: "서울시 서초구 서초대로46길 109",
  /** 지도 좌표 (지산빌딩 근사치) - 카카오맵/네이버맵용 */
  mapCoords: { lat: 37.4936, lng: 127.0284 },
  /** 네이버 지도 - 지산빌딩 (공유 링크) */
  naverMapUrl: "https://naver.me/FYrhnFqC",
  /** 카카오맵 검색 URL */
  kakaoMapUrl: "https://map.kakao.com/?q=서울시%20서초구%20서초대로46길%20109%20지산빌딩",
  /**
   * 사무소 목록. 주사무소 + 분사무소(인천·홍성·송파).
   * open이 true인 사무소는 맨 아래·오시는 길·법인 소개·상담 페이지에 보입니다. 주소가 비어 있으면 '주소 추후 안내'로 표시됩니다.
   * 문구에서는 특정 지역(서초동)을 내세우지 않고, 주소는 사무소 안내에서만 씁니다.
   */
  offices: [
    { name: "서울 주사무소", address: "서울시 서초구 서초대로46길 109, 6층(지산빌딩)", phone: "02-6951-4097", mapUrl: "https://naver.me/FYrhnFqC", open: true },
    { name: "인천 분사무소", address: "", phone: "", mapUrl: "", open: true },
    { name: "홍성 분사무소", address: "", phone: "", mapUrl: "", open: true },
    { name: "송파 분사무소", address: "", phone: "", mapUrl: "", open: true },
  ] as Office[],
  businessRegistration: "808-37-01374",
  advertisingAttorney: "김한솔",
  /**
   * 자동으로 가져오는 채널. 주소가 비어 있으면 해당 영역이 숨겨집니다.
   * firmBlogId: 법인 네이버 블로그 아이디 (blog.naver.com/아이디) → 메인 '블로그'
   * firmYoutubeChannelId: 법인 유튜브 채널 ID (UC로 시작) → 메인 '유튜브'
   */
  feeds: {
    firmBlogId: "",
    firmYoutubeChannelId: "",
  },
  /** 촬영 사진 경로. 비어 있으면 사진 자리 없이 배치됩니다 */
  photos: {
    /** 메인 첫 화면 구성원 단체 사진 (가로) */
    team: "",
  },
  /** Formspree form ID - 상담 폼 제출 시 사용 (https://formspree.io 에서 생성) */
  formspreeFormId: "mdawozrb",
}

/** 변호사 프로필 이미지 - /public/images/lawyers/ 에 파일 추가 시 해당 경로 사용 */
export const lawyerImages = {
  kim: "/images/lawyers/kim.jpg",
  koo: "/images/lawyers/koo.png",
  park: "/images/lawyers/park.jpg",
  kang: "/images/lawyers/kang.jpg",
  /** 사진 파일을 넣은 뒤 경로 입력 (예: "/images/lawyers/kim-miso.jpg"). 비어 있으면 이니셜로 표시 */
  kimMiso: "/images/lawyers/kim-miso.jpg",
  kimChungHyeon: "",
  parkHanmin: "",
} as const

/** 사이트에 보이는 사무소 (주사무소가 맨 앞) */
export const openOffices = siteConfig.offices.filter((o) => o.open)

/** 주소가 아직 없으면 보여 줄 문구 */
export const officeAddress = (o: Office) => o.address || "주소 추후 안내"
