"use client"

import { useState } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { ExternalLink } from "lucide-react"

type NewsItem = {
  type: "언론보도" | "칼럼"
  title: string
  source: string
  date: string
  href?: string
}

const newsItems: NewsItem[] = [
  {
    type: "언론보도",
    title: "형사 사건 초기 대응, 왜 중요할까",
    source: "법률신문",
    date: "2024.01",
  },
  {
    type: "칼럼",
    title: "개인회생 제도와 신청 절차 개요",
    source: "법률사무소 지산",
    date: "2024.02",
  },
  {
    type: "칼럼",
    title: "수사 단계 변호인 선임 시점과 효과",
    source: "법률사무소 지산",
    date: "2024.03",
  },
]

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.15)

  return (
    <article
      ref={ref}
      className={`group border border-border bg-background p-6 md:p-8 rounded-lg transition-all duration-700 hover:border-foreground/30 hover:shadow-md ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-block px-2.5 py-1 text-xs font-medium rounded mb-3 ${
              item.type === "언론보도"
                ? "bg-muted text-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {item.type}
          </span>
          <h3 className="card-title text-base md:text-lg leading-snug">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {item.source} · {item.date}
          </p>
        </div>
        {item.href && (
          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
        )}
      </div>
    </article>
  )
}

export function NewsSection() {
  const [tab, setTab] = useState<"all" | "press" | "column">("all")
  const { ref, isVisible } = useScrollReveal(0.05)

  const filtered = newsItems.filter((item) => {
    if (tab === "all") return true
    if (tab === "press") return item.type === "언론보도"
    return item.type === "칼럼"
  })

  return (
    <section
      id="news"
      className="px-6 py-24 md:px-12 lg:px-20 md:py-36 bg-secondary"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`mb-12 pb-6 border-b border-border transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-3 tracking-tight">
                새소식 & 법률 지식
              </h2>
              <p className="text-[13px] text-[#777] max-w-xl leading-relaxed">
                법률사무소 지산의 새로운 소식과 법률 상식을 만나보세요.
              </p>
            </div>
            <div className="flex gap-2">
              {[
                { id: "all" as const, label: "전체" },
                { id: "press" as const, label: "언론보도" },
                { id: "column" as const, label: "칼럼" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    tab === t.id
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-white border border-[#d0d5dd] text-[#555] hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((item, index) => (
            <NewsCard key={item.title} item={item} index={index} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">
            해당 분류의 소식이 없습니다.
          </p>
        )}
      </div>
    </section>
  )
}
