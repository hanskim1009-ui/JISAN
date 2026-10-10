import { siteConfig } from "@/lib/site-config"

/**
 * 상담 신청이 들어오면 사무소 텔레그램(그룹 또는 개인)으로 알림을 보냅니다.
 * Vercel 환경변수 (서버 전용, NEXT_PUBLIC 아님):
 * - TELEGRAM_BOT_TOKEN: BotFather가 준 봇 토큰
 * - TELEGRAM_CHAT_ID: 알림 받을 그룹·개인 채팅 ID (여러 곳이면 쉼표로)
 * - TELEGRAM_NOTIFY_FULL: "1"이면 연락처·상담 내용까지 보냄. 없으면 이름(가림)·분야·단계만 보내고 자세한 건 관리 화면에서 확인
 * 둘 중 하나라도 없으면 아무것도 보내지 않습니다.
 */

const MAX = 600
const clip = (v: unknown, n = MAX) => (typeof v === "string" ? v.trim().slice(0, n) : "")
const maskName = (n: string) => (n.length <= 1 ? n : n[0] + "○".repeat(Math.min(n.length - 1, 3)))

/** 같은 곳에서 짧은 시간에 여러 번 보내면 무시 (인스턴스별 간이 제한) */
const hits = new Map<string, number[]>()
function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 500) hits.clear()
  return recent.length > 5
}

function allowedOrigin(origin: string | null) {
  if (!origin) return false
  try {
    const h = new URL(origin).hostname
    return h === new URL(siteConfig.siteUrl).hostname || h.endsWith(".vercel.app") || h === "localhost"
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map((s) => s.trim()).filter(Boolean)
  if (!token || chatIds.length === 0) return Response.json({ ok: false, reason: "not-configured" })
  if (!allowedOrigin(req.headers.get("origin"))) return Response.json({ ok: false }, { status: 403 })

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?"
  if (limited(ip)) return Response.json({ ok: false }, { status: 429 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  const name = clip(body.name, 40)
  if (!name) return Response.json({ ok: false }, { status: 400 })

  const full = process.env.TELEGRAM_NOTIFY_FULL === "1"
  const time = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())

  const lines = [
    "📩 새 상담 신청",
    `이름: ${full ? name : maskName(name)}`,
    full && clip(body.phone, 40) ? `연락처: ${clip(body.phone, 40)}` : null,
    clip(body.caseType, 40) ? `분야: ${clip(body.caseType, 40)}` : null,
    clip(body.stage, 60) ? `단계: ${clip(body.stage, 60)}` : null,
    full && clip(body.concern) ? `걱정되는 점: ${clip(body.concern)}` : null,
    full && clip(body.message) ? `내용: ${clip(body.message, 1500)}` : null,
    clip(body.source, 60) ? `신청 위치: ${clip(body.source, 60)}` : null,
    clip(body.page, 120) ? `페이지: ${clip(body.page, 120)}` : null,
    `시각: ${time}`,
    "",
    `관리 화면에서 확인: ${siteConfig.siteUrl}/admin`,
  ].filter((l) => l !== null)

  const results = await Promise.allSettled(
    chatIds.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text: lines.join("\n"), disable_web_page_preview: true }),
        cache: "no-store",
      }),
    ),
  )
  const ok = results.some((r) => r.status === "fulfilled" && r.value.ok)
  return Response.json({ ok })
}
