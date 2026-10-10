/**
 * 양형기준 계산기 데이터 읽기 (서버 전용, 빌드 때 읽음).
 * content/tools/sentencing/{id}.json (범죄군 하나당 파일 하나). 깨진 파일·항목은 버림.
 * 이름이 _ 로 시작하는 파일(_sample.json 등)은 시험용이라 읽지 않습니다.
 */
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import type { FactorSet, Range, SentCrime, SentencingGroup } from "./sentencing-types"
import type { GroupSummary } from "./sentencing"

const DIR = path.join(process.cwd(), "content", "tools", "sentencing")

const isRange = (x: unknown): x is Range => !!x && typeof x === "object" && typeof (x as Range).text === "string"

/** 인자 칸이 빠져 있으면 빈 배열로 채움 (화면이 깨지지 않게) */
function fixSet(x: unknown): FactorSet {
  const s = (x && typeof x === "object" ? x : {}) as Partial<FactorSet>
  const ok = (a: unknown) => (Array.isArray(a) ? a.filter((f) => f && typeof f.id === "string" && typeof f.label === "string") : [])
  return { act: ok(s.act), actor: ok(s.actor) }
}

function fixCrime(x: unknown): SentCrime | null {
  if (!x || typeof x !== "object") return null
  const c = x as SentCrime
  if (typeof c.id !== "string" || typeof c.name !== "string" || !Array.isArray(c.types)) return null
  const types = c.types.filter((t) => t && typeof t.no === "string" && isRange(t.mitigated) && isRange(t.basic) && isRange(t.aggravated))
  if (types.length === 0) return null
  return {
    ...c,
    types,
    special: { aggravating: fixSet(c.special?.aggravating), mitigating: fixSet(c.special?.mitigating) },
    general: { aggravating: fixSet(c.general?.aggravating), mitigating: fixSet(c.general?.mitigating) },
  }
}

export function readGroupFile(file: string): SentencingGroup | null {
  try {
    const g = JSON.parse(readFileSync(path.isAbsolute(file) ? file : path.join(DIR, file), "utf8")) as SentencingGroup
    if (!g || typeof g.id !== "string" || typeof g.name !== "string" || !Array.isArray(g.crimes)) return null
    const crimes = g.crimes.map(fixCrime).filter((c): c is SentCrime => c !== null)
    return crimes.length ? { ...g, crimes } : null
  } catch {
    return null
  }
}

let cache: SentencingGroup[] | null = null

/** 모든 범죄군 (가나다순). id 가 겹치면 앞의 것만 */
export function loadGroups(): SentencingGroup[] {
  if (cache) return cache
  let files: string[] = []
  try {
    files = readdirSync(DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_")).sort()
  } catch {
    files = []
  }
  const seen = new Set<string>()
  const out: SentencingGroup[] = []
  for (const f of files) {
    const g = readGroupFile(f)
    if (!g || seen.has(g.id)) continue
    seen.add(g.id)
    out.push(g)
  }
  out.sort((a, b) => a.name.localeCompare(b.name, "ko"))
  cache = out
  return out
}

export function loadGroup(id: string): SentencingGroup | undefined {
  return loadGroups().find((g) => g.id === id)
}

/** 페이지에 넘기는 가벼운 목록 */
export function loadIndex(): GroupSummary[] {
  return loadGroups().map((g) => ({ id: g.id, name: g.name, crimes: g.crimes.map((c) => ({ id: c.id, name: c.name })) }))
}
