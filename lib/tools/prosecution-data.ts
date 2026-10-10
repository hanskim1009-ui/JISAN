/**
 * 구형 예상 계산기 데이터 읽기 (서버 전용, 빌드 때 읽음).
 * content/tools/prosecution/*.json (Crime[]) 를 모두 읽음. 이름이 _ 로 시작하는 파일(_sample.json 등)은 시험용이라 빼고.
 * 읽는 순서: penal.json → penal-*.json → special.json → special-*.json → derived.json → 그 밖 (id 가 겹치면 앞의 것만).
 *
 * 화면에는 가벼운 목록(loadIndex)만 넘기고, 죄명 데이터는 묶음 조각(chunk) 단위로
 * /tools/prosecution/data/{chunk} 정적 JSON 으로 받아 갑니다.
 */
import { createHash } from "node:crypto"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import type { Crime } from "./prosecution-types"
import { groupRank, lawNameOf, tidyLawName, type CrimeSummary } from "./prosecution"

const DIR = path.join(process.cwd(), "content", "tools", "prosecution")

/** 조각 하나의 대략 최대 크기 (JSON 바이트). 묶음이 바뀌면 크기와 상관없이 새 조각 */
const CHUNK_BYTES = 80_000

const str = (v: unknown) => (typeof v === "string" ? v : "")
const strList = (v: unknown) => (Array.isArray(v) ? v.filter((s): s is string => typeof s === "string" && s.trim() !== "") : [])

/** 모양 확인 + 화면이 쓰는 필드만 남김. ref·consultOnly 가 있으면 questions·tiers 가 비어 있어도 됨 */
function fixCrime(x: unknown): Crime | null {
  if (!x || typeof x !== "object") return null
  const c = x as Partial<Crime>
  if (typeof c.id !== "string" || !c.id.trim() || typeof c.name !== "string" || !c.name.trim() || typeof c.group !== "string") return null
  const ref = c.ref && typeof c.ref.href === "string" && typeof c.ref.label === "string" ? { href: c.ref.href, label: c.ref.label } : undefined
  const questions = Array.isArray(c.questions) ? c.questions.filter((q) => q && typeof q.id === "string" && typeof q.label === "string") : []
  const tiers = Array.isArray(c.tiers) ? c.tiers.filter((t) => t && typeof t.level === "string" && Array.isArray(t.when)) : []
  const consultOnly = c.consultOnly === true
  if (!ref && !consultOnly && tiers.length === 0) return null
  const aliases = strList(c.aliases)
  const notes = strList(c.notes)
  const law = str(c.law)
  return {
    id: c.id,
    name: c.name,
    law,
    group: c.group.trim() || "기타",
    statutory: str(c.statutory),
    ...(aliases.length ? { aliases } : {}),
    questions,
    tiers,
    ...(notes.length ? { notes } : {}),
    ...(c.basis === "guideline-x2" ? { basis: c.basis } : {}),
    ...(ref ? { ref } : {}),
    ...(consultOnly ? { consultOnly } : {}),
    lawName: tidyLawName(str(c.lawName)) || lawNameOf(law),
  }
}

export function readCrimeFile(file: string): Crime[] {
  try {
    const data: unknown = JSON.parse(readFileSync(path.isAbsolute(file) ? file : path.join(DIR, file), "utf8"))
    return Array.isArray(data) ? data.map(fixCrime).filter((c): c is Crime => c !== null) : []
  } catch {
    return []
  }
}

/** 파일 읽는 순서: 형법 → 특별법 → 파생 → 그 밖 (같은 칸 안에서는 이름순) */
function fileRank(f: string) {
  if (f === "penal.json") return 0
  if (f.startsWith("penal-")) return 1
  if (f === "special.json") return 2
  if (f.startsWith("special-")) return 3
  if (f === "derived.json") return 4
  return 5
}

export function crimeFiles(dir = DIR): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
      .sort((a, b) => fileRank(a) - fileRank(b) || a.localeCompare(b, "en", { numeric: true }))
  } catch {
    return []
  }
}

type Loaded = { crimes: Crime[]; chunks: Map<string, Crime[]>; chunkOf: Map<string, string> }

let cache: Loaded | null = null

/**
 * 묶음 순서로 늘어놓고, 묶음 안에서는 법률 이름끼리 모아 CHUNK_BYTES 씩 자름. 조각 id 에 내용 해시를 붙여 배포가 바뀌면 주소도 바뀜.
 * 외국어판(lib/tools/tool-data-i18n.ts)도 같은 방식으로 자름
 */
export function makeChunks(crimes: Crime[]) {
  const order = crimes
    .map((c, i) => ({ c, i }))
    .sort((a, b) => groupRank(a.c.group) - groupRank(b.c.group) || a.c.group.localeCompare(b.c.group, "ko") || (a.c.lawName ?? "").localeCompare(b.c.lawName ?? "", "ko") || a.i - b.i)
  const parts: Crime[][] = []
  let cur: Crime[] = []
  let bytes = 0
  for (const { c } of order) {
    const size = Buffer.byteLength(JSON.stringify(c))
    if (cur.length && (cur[0].group !== c.group || bytes + size > CHUNK_BYTES)) {
      parts.push(cur)
      cur = []
      bytes = 0
    }
    cur.push(c)
    bytes += size
  }
  if (cur.length) parts.push(cur)
  const chunks = new Map<string, Crime[]>()
  const chunkOf = new Map<string, string>()
  parts.forEach((list, n) => {
    const id = `${n + 1}-${createHash("sha1").update(JSON.stringify(list)).digest("hex").slice(0, 8)}`
    chunks.set(id, list)
    for (const c of list) chunkOf.set(c.id, id)
  })
  return { chunks, chunkOf }
}

function load(): Loaded {
  if (cache) return cache
  const seen = new Set<string>()
  const crimes: Crime[] = []
  for (const f of crimeFiles()) {
    for (const c of readCrimeFile(f)) {
      if (seen.has(c.id)) continue
      seen.add(c.id)
      crimes.push(c)
    }
  }
  cache = { crimes, ...makeChunks(crimes) }
  return cache
}

/** 모든 죄명 (읽은 순서) */
export function loadCrimes(): Crime[] {
  return load().crimes
}

/** 페이지에 넘기는 가벼운 목록 */
export function loadIndex(): CrimeSummary[] {
  const { crimes, chunkOf } = load()
  return crimes.map((c) => ({
    id: c.id,
    name: c.name,
    group: c.group,
    lawName: c.lawName ?? "",
    law: c.law,
    ...(c.aliases?.length ? { aliases: c.aliases } : {}),
    chunk: chunkOf.get(c.id)!,
  }))
}

let indexId: string | null = null

/** 목록 정적 JSON 의 조각 id (index-내용해시). 목록이 바뀌면 주소도 바뀌어 오래 캐시해도 됨 */
export function loadIndexId(): string {
  indexId ??= `index-${createHash("sha1").update(JSON.stringify(loadIndex())).digest("hex").slice(0, 8)}`
  return indexId
}

export function loadChunkIds(): string[] {
  return [...load().chunks.keys()]
}

export function loadChunk(id: string): Crime[] | undefined {
  return load().chunks.get(id)
}
