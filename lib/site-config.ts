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
  siteUrl: "https://jisanlaw.com",
  phone: "02-6951-4097",
  phoneHref: "tel:02-6951-4097",
  phoneIntl: "+82-2-6951-4097",
  /** 카카오톡 채널 URL - 본인 채널로 교체 필요 */
  kakaoTalkUrl: "https://pf.kakao.com/_Mxlgyn/chat",
  /**
   * 외국어 센터(외국인·형사·가사센터 외국어판)는 전화 대신 메신저 채팅으로만 문의를 받습니다.
   * 값을 넣은 메신저만 버튼으로 보입니다 (비어 있으면 숨김). 직원이 채팅으로 먼저 답하고 변호사에게 넘깁니다.
   * - wechatId: 위챗 ID (위챗은 웹 링크로 친구 추가가 안 되어 ID와 QR 이미지를 보여 줌)
   * - wechatQr: public 폴더 안 QR 이미지 경로 (예: "/chat/wechat-qr.png")
   * - telegramUrl: https://t.me/아이디   - whatsappUrl: https://wa.me/8210xxxxxxxx (국가번호 포함, + 없이)
   * - zaloUrl: https://zalo.me/전화번호   - messengerUrl: https://m.me/페이지이름   - lineUrl: https://line.me/R/ti/p/@아이디
   */
  /**
   * 검색엔진 소유 확인 코드 · 방문 분석 ID (값이 있으면 사이트에 자동으로 들어감. Vercel 환경변수로 넣어도 됨)
   * - google: 구글 서치콘솔 > 속성 추가 > URL 접두어 > 'HTML 태그'의 content 값   (env NEXT_PUBLIC_VERIFY_GOOGLE)
   * - naver: 네이버 서치어드바이저 > 사이트 등록 > 'HTML 태그'의 content 값        (env NEXT_PUBLIC_VERIFY_NAVER)
   * - bing: 빙 웹마스터 도구 > 'msvalidate.01' 태그의 content 값                 (env NEXT_PUBLIC_VERIFY_BING)
   * - yandex: 얀덱스 웹마스터 > 'Meta tag'의 content 값                          (env NEXT_PUBLIC_VERIFY_YANDEX)
   * - baidu: 바이두 站长平台 > 'HTML标签'의 content 값                            (env NEXT_PUBLIC_VERIFY_BAIDU)
   * - gaId: 구글 애널리틱스 4 측정 ID (G-로 시작)                                 (env NEXT_PUBLIC_GA_ID)
   * - naverAnalyticsId: 네이버 애널리틱스 사이트 ID                               (env NEXT_PUBLIC_NAVER_ANALYTICS_ID)
   */
  seo: {
    google: process.env.NEXT_PUBLIC_VERIFY_GOOGLE ?? "",
    naver: process.env.NEXT_PUBLIC_VERIFY_NAVER ?? "",
    bing: process.env.NEXT_PUBLIC_VERIFY_BING ?? "",
    yandex: process.env.NEXT_PUBLIC_VERIFY_YANDEX ?? "",
    baidu: process.env.NEXT_PUBLIC_VERIFY_BAIDU ?? "",
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
    naverAnalyticsId: process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID ?? "",
  },
  chat: {
    kakaoUrl: "https://pf.kakao.com/_Mxlgyn/chat",
    wechatId: "",
    wechatQr: "",
    telegramUrl: "",
    whatsappUrl: "",
    zaloUrl: "",
    messengerUrl: "",
    lineUrl: "",
  },
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
    { name: "인천 분사무소", address: "인천광역시 검단구 이음4로 6, 606호(KR법조타워)", phone: "", mapUrl: "https://map.naver.com/p/search/%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EA%B2%80%EB%8B%A8%EA%B5%AC%20%EC%9D%B4%EC%9D%8C4%EB%A1%9C%206%20KR%EB%B2%95%EC%A1%B0%ED%83%80%EC%9B%8C", open: true },
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
  parkHanmin: "/images/lawyers/park-hanmin.jpg",
} as const

/** 사이트에 보이는 사무소 (주사무소가 맨 앞) */
export const openOffices = siteConfig.offices.filter((o) => o.open)

/** 주소가 아직 없으면 보여 줄 문구 */
export const officeAddress = (o: Office) => o.address || "주소 추후 안내"
