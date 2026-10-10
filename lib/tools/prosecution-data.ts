/**
 * 구형 예상 계산기 데이터 읽기 (서버 전용, 빌드 때 읽음).
 * content/tools/prosecution/penal.json(형법) + special.json(특별법). 파일이 없거나 깨졌으면 빈 배열.
 * _sample.json 은 시험 스크립트 전용이라 여기서 읽지 않습니다.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import type { Crime } from "./prosecution-types"

const DIR = path.join(process.cwd(), "content", "tools", "prosecution")
const FILES = ["penal.json", "special.json"]

/** 최소한의 모양 확인 (깨진 항목은 버림) */
function isCrime(x: unknown): x is Crime {
  if (!x || typeof x !== "object") return false
  const c = x as Partial<Crime>
  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    typeof c.group === "string" &&
    Array.isArray(c.questions) &&
    Array.isArray(c.tiers) &&
    c.tiers.length > 0
  )
}

export function readCrimeFile(file: string): Crime[] {
  try {
    const data: unknown = JSON.parse(readFileSync(path.isAbsolute(file) ? file : path.join(DIR, file), "utf8"))
    return Array.isArray(data) ? data.filter(isCrime) : []
  } catch {
    return []
  }
}

let cache: Crime[] | null = null

/** 형법 → 특별법 순. id 가 겹치면 앞의 것만 */
export function loadCrimes(): Crime[] {
  if (cache) return cache
  const seen = new Set<string>()
  const out: Crime[] = []
  for (const f of FILES) {
    for (const c of readCrimeFile(f)) {
      if (seen.has(c.id)) continue
      seen.add(c.id)
      out.push(c)
    }
  }
  cache = out
  return out
}
