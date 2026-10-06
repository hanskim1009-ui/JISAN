import type { CenterTone } from "@/lib/centers"

/**
 * 센터별 분위기. 폰트·여백·버튼 틀은 공통이고 색과 제목 서체만 바뀝니다.
 * dark: 형사·성범죄·마약 (단단하고 진지하게) / warm: 이혼·상간 (밝고 차분하게)
 */
export const centerTones: Record<
  CenterTone,
  {
    header: string
    divider: string
    headerLink: string
    logoSub: string
    headerCta: string
    hero: string
    heroTitle: string
    heroSub: string
    badge: string
    primaryBtn: string
    ghostBtn: string
    alt: string
    accent: string
    band: string
    bandBtn: string
    footer: string
  }
> = {
  dark: {
    header: "bg-jisan-navy text-white border-white/10",
    divider: "border-white/10",
    headerLink: "text-white/75 hover:text-white",
    logoSub: "text-white/55",
    headerCta: "bg-white text-jisan-navy hover:bg-white/90",
    hero: "bg-jisan-navy text-white",
    heroTitle: "font-sans font-extrabold tracking-tight",
    heroSub: "text-white/75",
    badge: "bg-white/10 text-white",
    primaryBtn: "bg-white text-jisan-navy hover:bg-white/90",
    ghostBtn: "border border-white/40 text-white hover:bg-white/10",
    alt: "bg-jisan-mist",
    accent: "text-jisan-blue",
    band: "bg-jisan-navy text-white",
    bandBtn: "bg-white text-jisan-navy hover:bg-white/90",
    footer: "bg-[#10172B] text-white/55",
  },
  warm: {
    header: "bg-[#FBF8F3] text-[#2B2925] border-[#E6DFD3]",
    divider: "border-[#E6DFD3]",
    headerLink: "text-[#2B2925]/70 hover:text-[#2B2925]",
    logoSub: "text-[#8B8478]",
    headerCta: "bg-[#3F4E46] text-white hover:bg-[#3F4E46]/90",
    hero: "bg-[#F3EFE8] text-[#2B2925]",
    heroTitle: "font-sans font-bold tracking-tight",
    heroSub: "text-[#5A554C]",
    badge: "bg-[#E4E8E1] text-[#3F4E46]",
    primaryBtn: "bg-[#3F4E46] text-white hover:bg-[#3F4E46]/90",
    ghostBtn: "border border-[#3F4E46]/30 text-[#3F4E46] hover:bg-[#3F4E46]/5",
    alt: "bg-[#F3EFE8]",
    accent: "text-[#3F4E46]",
    band: "bg-[#3F4E46] text-white",
    bandBtn: "bg-white text-[#3F4E46] hover:bg-white/90",
    footer: "bg-[#2E3832] text-white/55",
  },
}
