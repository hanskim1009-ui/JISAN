import { Noto_Sans } from "next/font/google"

/** 베트남어·러시아어·몽골어 페이지 글꼴 (기본 글꼴에 키릴 문자·베트남어 성조가 없음) */
export const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext", "vietnamese", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
})
