import type { Lang } from "@/lib/langs"

/** 센터 안 변호사 소개 페이지(/센터/lawyers/변호사) 문구. 경력·학력 같은 머리말은 사이트 번역(T)을 씀 */
export type ProfileText = {
  view: string
  lawyers: string
  highlights: string
  inCenter: (center: string) => string
  others: string
  back: (center: string) => string
  title: (name: string, title: string, center: string) => string
}

export const PROFILE_TEXT: Record<Lang, ProfileText> = {
  ko: {
    view: "프로필 보기",
    lawyers: "변호사",
    highlights: "주요 이력",
    inCenter: (c) => `${c}에서 맡는 일`,
    others: "함께 사건을 보는 변호사",
    back: (c) => `${c}로 돌아가기`,
    title: (n, t, c) => `${n} ${t} | ${c}`,
  },
  en: {
    view: "View profile",
    lawyers: "Lawyers",
    highlights: "Highlights",
    inCenter: (c) => `At the ${c}`,
    others: "Other lawyers",
    back: (c) => `Back to ${c}`,
    title: (n, t, c) => `${n}, ${t} | ${c}`,
  },
  zh: {
    view: "查看简介",
    lawyers: "律师",
    highlights: "主要履历",
    inCenter: (c) => `在${c}负责的业务`,
    others: "其他律师",
    back: (c) => `返回${c}`,
    title: (n, t, c) => `${n} ${t} | ${c}`,
  },
  vi: {
    view: "Xem hồ sơ",
    lawyers: "Luật sư",
    highlights: "Nổi bật",
    inCenter: (c) => `Công việc tại ${c}`,
    others: "Luật sư khác",
    back: (c) => `Quay lại ${c}`,
    title: (n, t, c) => `${n}, ${t} | ${c}`,
  },
  ru: {
    view: "Профиль",
    lawyers: "Адвокаты",
    highlights: "Основное",
    inCenter: (c) => `${c}: чем занимается`,
    others: "Другие адвокаты",
    back: (c) => `Назад: ${c}`,
    title: (n, t, c) => `${n}, ${t} | ${c}`,
  },
  mn: {
    view: "Танилцуулга үзэх",
    lawyers: "Өмгөөлөгчид",
    highlights: "Онцлох",
    inCenter: (c) => `${c}: хариуцдаг ажил`,
    others: "Бусад өмгөөлөгч",
    back: (c) => `${c} руу буцах`,
    title: (n, t, c) => `${n}, ${t} | ${c}`,
  },
}
