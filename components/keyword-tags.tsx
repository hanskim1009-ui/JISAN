"use client"

const keywords = [
  { tag: "형사", href: "#practice" },
  { tag: "민사", href: "#practice" },
  { tag: "기업", href: "#practice" },
  { tag: "건설·부동산", href: "#practice" },
  { tag: "회생·파산", href: "#practice" },
  { tag: "개인회생", href: "#practice" },
  { tag: "음주운전", href: "#practice" },
  { tag: "사기", href: "#practice" },
  { tag: "폭행", href: "#practice" },
  { tag: "성범죄", href: "#practice" },
  { tag: "마약", href: "#practice" },
  { tag: "횡령", href: "#practice" },
  { tag: "배임", href: "#practice" },
  { tag: "명예훼손", href: "#practice" },
  { tag: "스토킹", href: "#practice" },
  { tag: "보이스피싱", href: "#practice" },
  { tag: "무고", href: "#practice" },
  { tag: "교통사고", href: "#practice" },
  { tag: "뺑소니", href: "#practice" },
  { tag: "불기소", href: "#cases" },
  { tag: "집행유예", href: "#cases" },
  { tag: "무죄", href: "#cases" },
  { tag: "기소유예", href: "#cases" },
  { tag: "구속취소", href: "#cases" },
  { tag: "손해배상", href: "#practice" },
  { tag: "계약분쟁", href: "#practice" },
  { tag: "채권추심", href: "#practice" },
  { tag: "임대차", href: "#practice" },
  { tag: "부동산분쟁", href: "#practice" },
  { tag: "공사대금", href: "#practice" },
  { tag: "하도급", href: "#practice" },
  { tag: "법인파산", href: "#practice" },
  { tag: "개인파산", href: "#practice" },
  { tag: "면책", href: "#practice" },
  { tag: "이혼", href: "#practice" },
  { tag: "양육권", href: "#practice" },
  { tag: "재산분할", href: "#practice" },
  { tag: "상속분쟁", href: "#practice" },
]

const TagItem = ({ tag, href }: { tag: string; href: string }) => (
  <a
    href={href}
    className="inline-flex shrink-0 items-center px-4 py-2 rounded-full text-sm font-medium tracking-[0.06em] bg-background text-muted-foreground hover:text-foreground hover:border-foreground/50 border border-transparent transition-colors duration-300 mx-2"
  >
    #{tag}
  </a>
)

export function KeywordTags() {
  const duplicatedTags = [...keywords, ...keywords]

  return (
    <section className="py-6 md:py-8 bg-secondary border-b border-border overflow-hidden">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {duplicatedTags.map((k, i) => (
          <TagItem key={`${k.tag}-${i}`} tag={k.tag} href={k.href} />
        ))}
      </div>
    </section>
  )
}
