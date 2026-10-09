import { siteConfig } from "@/lib/site-config"
import type { Lang } from "@/lib/langs"

/** 외국어 센터 문의용 메신저 (site-config 의 chat 에 값이 있는 것만 보임) */
export type ChatApp = "kakao" | "wechat" | "telegram" | "whatsapp" | "zalo" | "messenger" | "line"

export type ChatChannel = { app: ChatApp; name: string; href?: string; wechatId?: string; wechatQr?: string; bg: string; fg: string }

const c = siteConfig.chat

const ALL: Record<ChatApp, ChatChannel | undefined> = {
  kakao: c.kakaoUrl ? { app: "kakao", name: "KakaoTalk", href: c.kakaoUrl, bg: "#FEE500", fg: "#191919" } : undefined,
  wechat: c.wechatId ? { app: "wechat", name: "WeChat", wechatId: c.wechatId, wechatQr: c.wechatQr || undefined, bg: "#07C160", fg: "#FFFFFF" } : undefined,
  telegram: c.telegramUrl ? { app: "telegram", name: "Telegram", href: c.telegramUrl, bg: "#229ED9", fg: "#FFFFFF" } : undefined,
  whatsapp: c.whatsappUrl ? { app: "whatsapp", name: "WhatsApp", href: c.whatsappUrl, bg: "#1DA851", fg: "#FFFFFF" } : undefined,
  zalo: c.zaloUrl ? { app: "zalo", name: "Zalo", href: c.zaloUrl, bg: "#0068FF", fg: "#FFFFFF" } : undefined,
  messenger: c.messengerUrl ? { app: "messenger", name: "Messenger", href: c.messengerUrl, bg: "#0084FF", fg: "#FFFFFF" } : undefined,
  line: c.lineUrl ? { app: "line", name: "LINE", href: c.lineUrl, bg: "#06C755", fg: "#FFFFFF" } : undefined,
}

/** 언어마다 그 나라 사람이 많이 쓰는 메신저를 앞에 */
const ORDER: Record<Lang, ChatApp[]> = {
  ko: ["kakao", "wechat", "telegram", "whatsapp", "zalo", "messenger", "line"],
  en: ["whatsapp", "telegram", "kakao", "wechat", "messenger", "line", "zalo"],
  zh: ["wechat", "kakao", "telegram", "whatsapp", "line", "messenger", "zalo"],
  vi: ["zalo", "messenger", "kakao", "whatsapp", "telegram", "wechat", "line"],
  ru: ["telegram", "whatsapp", "kakao", "wechat", "messenger", "line", "zalo"],
  mn: ["messenger", "telegram", "kakao", "whatsapp", "wechat", "line", "zalo"],
}

export function chatChannels(lang: Lang = "ko"): ChatChannel[] {
  return ORDER[lang].flatMap((a) => ALL[a] ?? [])
}

/** 전화 대신 채팅으로만 문의받는 센터 (외국어판 센터) */
export const chatOnly = (lang?: Lang) => Boolean(lang && lang !== "ko")
