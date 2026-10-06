"use client"

import { useState } from "react"
import { Play } from "lucide-react"

/** 썸네일만 먼저 보여 주고, 누르면 그때 유튜브 영상을 불러옵니다 (페이지를 가볍게) */
export function LiteYouTube({ videoId, title, thumbnail }: { videoId: string; title: string; thumbnail?: string }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    )
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`${title} 재생`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumbnail ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-colors group-hover:bg-[#E62117]">
        <Play className="h-5 w-5 translate-x-px fill-current" />
      </span>
    </button>
  )
}
