"use client"

import { useState } from "react"
import { Check, Copy, MessageCircle } from "lucide-react"
import type { ChatChannel } from "@/lib/chat"

export type ChatButtonText = { wechatId: string; copy: string; copied: string; wechatScan: string }

/**
 * 메신저 채팅 버튼 묶음 (외국어 센터는 전화 대신 이것으로만 문의).
 * 위챗은 웹 링크로 친구 추가가 안 되어 누르면 ID(복사)와 QR 이미지를 펼쳐 보여 줌
 */
export function ChatButtons({ channels, text, compact = false }: { channels: ChatChannel[]; text: ChatButtonText; compact?: boolean }) {
  const [wechatOpen, setWechatOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const wechat = channels.find((c) => c.app === "wechat")
  const btn = compact
    ? "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
    : "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold"

  const copy = async () => {
    if (!wechat?.wechatId) return
    try {
      await navigator.clipboard.writeText(wechat.wechatId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 복사가 막혀도 ID는 화면에 보임 */
    }
  }

  return (
    <div>
      <div className={`flex flex-wrap gap-2.5 ${compact ? "" : "sm:grid sm:grid-cols-2"}`}>
        {channels.map((c) =>
          c.app === "wechat" ? (
            <button
              key={c.app}
              type="button"
              onClick={() => setWechatOpen((v) => !v)}
              aria-expanded={wechatOpen}
              className={btn}
              style={{ background: c.bg, color: c.fg }}
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden /> {c.name}
            </button>
          ) : (
            <a key={c.app} href={c.href} target="_blank" rel="noopener noreferrer" className={btn} style={{ background: c.bg, color: c.fg }}>
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden /> {c.name}
            </a>
          ),
        )}
      </div>
      {wechat && wechatOpen && (
        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 text-jisan-ink">
          {wechat.wechatQr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wechat.wechatQr} alt="WeChat QR" width={112} height={112} className="h-28 w-28 rounded-lg border border-[#E2E6ED]" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-jisan-ink/60">{text.wechatId}</p>
            <p className="mt-0.5 flex items-center gap-2 text-lg font-bold">
              {wechat.wechatId}
              <button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded-full border border-[#E2E6ED] px-2.5 py-1 text-xs font-semibold">
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                {copied ? text.copied : text.copy}
              </button>
            </p>
            {wechat.wechatQr && <p className="mt-1 text-xs text-jisan-ink/60">{text.wechatScan}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
