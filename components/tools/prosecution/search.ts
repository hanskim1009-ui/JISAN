/** 죄명 검색: 띄어쓰기 무시, 한글 초성(ㅇㅈㅇㅈ → 음주운전)과 섞어 쓴 말(음ㅈ운)도 찾음 */
import type { Crime } from "@/lib/tools/prosecution-types"

const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "")

/** 글자 하나가 검색 글자 하나와 맞는지 (검색 글자가 초성이면 그 초성으로 시작하는 음절도 맞음) */
function charMatch(t: string, q: string) {
  if (t === q) return true
  if (!CHO.includes(q)) return false
  const code = t.charCodeAt(0) - 0xac00
  return code >= 0 && code < 11172 && CHO[Math.floor(code / 588)] === q
}

export function matchKo(target: string, query: string): boolean {
  const t = norm(target)
  const q = norm(query)
  if (!q) return true
  if (t.includes(q)) return true
  outer: for (let i = 0; i + q.length <= t.length; i++) {
    for (let j = 0; j < q.length; j++) if (!charMatch(t[i + j], q[j])) continue outer
    return true
  }
  return false
}

/** 이름·다른 이름·묶음 중 하나라도 맞으면 */
export function crimeMatches(c: Pick<Crime, "name" | "aliases" | "group">, query: string): boolean {
  if (!norm(query)) return true
  return [c.name, c.group, ...(c.aliases ?? [])].some((s) => matchKo(s, query))
}
