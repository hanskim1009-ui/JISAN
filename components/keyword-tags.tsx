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
]

const TagItem = ({ tag, href }: { tag: string; href: string }) => (
  <a
    href={href}
    className="inline-flex shrink-0 items-center px-4 py-2 rounded-full text-sm font-medium tracking-[0.06em] bg-background text-muted-foreground hover:text-primary hover:border-primary/50 border border-transparent transition-colors duration-300 mx-2"
  >
    #{tag}
  </a>
)

export function KeywordTags() {
  const duplicatedTags = [...keywords, ...keywords, ...keywords]

  return (
    <section className="py-6 md:py-8 bg-secondary border-b border-border overflow-hidden">
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {duplicatedTags.map((k, i) => (
          <TagItem key={`${k.tag}-${i}`} tag={k.tag} href={k.href} />
        ))}
      </div>
    </section>
  )
}
