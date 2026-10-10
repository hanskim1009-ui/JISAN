/**
 * 계산기 페이지의 자주 묻는 질문 (서버 전용). content/tools/faq/{언어}.json = { 도구id: [{ q, a }] }.
 * 그 언어 파일에 그 도구가 없으면 질문 칸을 만들지 않습니다. ToolShell 이 화면과 구조화 데이터(FAQPage)에 함께 씀.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import type { Lang } from "@/lib/langs"

export type FaqItem = { q: string; a: string }

const DIR = path.join(process.cwd(), "content", "tools", "faq")
const cache = new Map<Lang, Record<string, FaqItem[]>>()

function read(lang: Lang): Record<string, FaqItem[]> {
  if (cache.has(lang)) return cache.get(lang)!
  let out: Record<string, FaqItem[]> = {}
  try {
    const x: unknown = JSON.parse(readFileSync(path.join(DIR, `${lang}.json`), "utf8"))
    if (x && typeof x === "object" && !Array.isArray(x)) out = x as Record<string, FaqItem[]>
  } catch {
    out = {}
  }
  cache.set(lang, out)
  return out
}

export function toolFaq(lang: Lang, toolId: string): FaqItem[] {
  const list = read(lang)[toolId]
  return Array.isArray(list) ? list.filter((f) => f && typeof f.q === "string" && typeof f.a === "string" && f.q.trim() && f.a.trim()) : []
}
