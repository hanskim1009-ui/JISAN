/**
 * 법률사무소 지산 사이트 설정
 * 전화번호, SNS, 주소 등 변경 시 이 파일만 수정하면 됩니다.
 */
export const siteConfig = {
  name: "법률사무소 지산",
  nameEn: "Jisan Law",
  phone: "02-6951-4907",
  phoneHref: "tel:02-6951-4907",
  /** 카카오톡 채널 URL - 본인 채널로 교체 필요 */
  kakaoTalkUrl: "https://pf.kakao.com/_xExample", // TODO: 실제 카카오톡 채널 URL로 교체
  address: "서울시 서초구 서초대로46길 109, 6층(지산빌딩)",
  addressShort: "서울시 서초구 서초대로46길 109",
  /** 지도 좌표 (지산빌딩 근사치) - 카카오맵/네이버맵용 */
  mapCoords: { lat: 37.4936, lng: 127.0284 },
  /** 네이버 지도 - 지산빌딩 (공유 링크) */
  naverMapUrl: "https://naver.me/FYrhnFqC",
  /** 카카오맵 검색 URL */
  kakaoMapUrl: "https://map.kakao.com/?q=서울시%20서초구%20서초대로46길%20109%20지산빌딩",
  businessRegistration: "808-37-01374",
  advertisingAttorney: "김한솔",
  /** Formspree form ID - 상담 폼 제출 시 사용 (https://formspree.io 에서 생성) */
  formspreeFormId: "mdawozrb",
}

/** 변호사 프로필 이미지 - /public/images/lawyers/ 에 파일 추가 시 해당 경로 사용 */
export const lawyerImages = {
  kim: "/images/lawyers/kim.jpg",
  koo: "/images/lawyers/koo.jpg",
  park: "/images/lawyers/park.jpg",
  kimChungHyeon: "/images/lawyers/kim-chung-hyeon.jpg",
  kang: "/images/lawyers/kang.jpg",
} as const
