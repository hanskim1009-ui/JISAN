/**
 * 관리 화면 본문 → 칼럼 문단
 * 빈 줄로 문단을 나누고, '## '로 시작하면 소제목, 모든 줄이 '- '로 시작하면 목록입니다.
 */
export function parseBody(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (b.startsWith("## ")) return { type: "h2" as const, text: b.slice(3).trim() }
      const lines = b.split("\n").map((l) => l.trim())
      if (lines.every((l) => /^[-·•]\s+/.test(l))) return { type: "ul" as const, items: lines.map((l) => l.replace(/^[-·•]\s+/, "")) }
      return { type: "p" as const, text: lines.join(" ") }
    })
}
