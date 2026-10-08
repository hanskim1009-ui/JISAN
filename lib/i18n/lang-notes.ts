import type { Lang } from "@/lib/langs"

/**
 * 그 언어로 상담할 수 있다는 안내 (사무소가 확인한 언어만).
 * 영어: 김미소 변호사, 중국어: 김한솔 변호사. 베트남어·러시아어·몽골어는 상담 방식을 쓰지 않습니다.
 */
export const LANG_NOTE: Partial<Record<Lang, string>> = {
  en: "Consultations in English with Partner Miso Kim, including nights and weekends.",
  zh: "中文咨询由代表律师 Hansol Kim 亲自负责，晚上和周末也可以。",
}
