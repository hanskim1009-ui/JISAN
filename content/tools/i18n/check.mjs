#!/usr/bin/env node
/**
 * 계산기 번역 사전 검사 (패키지 없이 node 로 실행)
 *   node content/tools/i18n/check.mjs en                  → 영어 사전 전부
 *   node content/tools/i18n/check.mjs en deadline         → 영어 법정 기한 계산기만 (common 도 함께 봄)
 *   node content/tools/i18n/check.mjs ko                  → 한국어 원문 자체 검사 + 사전별 글자 수
 * 기본으로 보는 사전은 아래 TOOLS (구형·양형 계산기는 check-crimes.mjs).
 * 오류(✗)가 있으면 종료 코드 1. 오류가 하나라도 있는 도구는 그 언어 페이지가 만들어지지 않습니다.
 * 경고(!)는 사람이 확인할 것. 기준은 lib/tools/i18n.ts 의 textErrors 와 같습니다.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(DIR, "../../..")
const LANGS = ["ko", "en", "zh", "vi", "ru", "mn"]
/** 한국어판에만 있는 키 (외국어판에 있으면 오류) */
const KO_ONLY = { common: ["shell.ctaPhone"] }
/** 함께 있어야 페이지가 생기는 사전 */
const DEPS = { "reserved-share": ["inheritance"] }
/** 길이를 맞추지 않아도 되는 배열 */
const FREE_ARRAYS = new Set(["keywords"])

/** 광고 규정상 쓰지 않는 말 (경고: 법률 용어·법 이름 안에 들어가 괜찮은 경우가 있어 사람이 확인. 예: 여신전문금융업법) */
const BANNED = {
  ko: [/전문가/, /전문(?!취업)/, /최고(?!이자율|이율)/, /1등/, /승소율/, /결과\s*보장/, /무료/, /서초/, /전관/],
  en: [/\bexpert/i, /\bspeciali[sz]/i, /\bbest\b/i, /\bNo\.\s*1\b/i, /\bnumber one\b/i, /\bguarantee/i, /\bfree of charge\b/i, /\bfree consultation/i, /\bwin rate/i, /\bSeocho/i],
  zh: [/专家/, /专业律师/, /最好/, /最佳/, /第一/, /保证/, /免费/, /胜诉率/, /瑞草/],
  vi: [/chuyên gia/i, /tốt nhất/i, /số 1\b/i, /đảm bảo kết quả/i, /miễn phí/i, /tỷ lệ thắng/i, /Seocho/i],
  ru: [/эксперт/i, /специалист/i, /лучш/i, /№\s*1/, /гарантир/i, /бесплатн/i, /процент выигр/i, /Сочхо/i, /Сочо/i],
  mn: [/мэргэжилтэн/i, /шилдэг/i, /баталгаа/i, /үнэгүй/i, /Сочо/i],
}
/** 외국어판: 전화번호·전화 권유 금지 (메신저로만 문의) */
const PHONE = {
  all: [/\d{2,3}-\d{3,4}-\d{4}/, /\+82/, /6951/, /tel:/i, /\{phone\}/],
  en: [/\bcall us\b/i, /\bphone us\b/i, /\bby phone\b/i, /\bgive us a call\b/i],
  zh: [/致电/, /打电话/, /来电/],
  vi: [/gọi điện/i, /gọi cho chúng tôi/i],
  ru: [/позвоните/i, /по телефону/i],
  mn: [/утсаар/i, /залга(?!мж)/i],
}
/** 상담 언어 약속 (외국어판에서 경고) */
const LANG_PROMISE = {
  en: [/\bin English\b/i],
  zh: [/中文咨询/, /用中文/],
  vi: [/bằng tiếng Việt/i],
  ru: [/на русском/i],
  mn: [/монгол хэлээр/i],
}

const readJson = (f) => JSON.parse(readFileSync(f, "utf8"))
const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",")

function textErrors(ko, tr, at, skip) {
  if (skip.includes(at)) return []
  if (typeof ko === "string") {
    if (typeof tr !== "string" || tr.trim() === "") return [`${at}: 없음`]
    return placeholders(ko) === placeholders(tr) ? [] : [`${at}: 자리표시자 다름 ({${placeholders(ko)}} ↔ {${placeholders(tr)}})`]
  }
  if (Array.isArray(ko)) {
    if (!Array.isArray(tr)) return [`${at}: 배열이 아님`]
    const key = at.split(".").pop() ?? ""
    if (FREE_ARRAYS.has(key)) return tr.length > 0 && tr.every((x) => typeof x === "string" && x.trim()) ? [] : [`${at}: 빈 배열`]
    if (ko.length !== tr.length) return [`${at}: 개수 ${tr.length} (원문 ${ko.length})`]
    return ko.flatMap((x, i) => textErrors(x, tr[i], `${at}[${i}]`, skip))
  }
  if (ko && typeof ko === "object") {
    if (!tr || typeof tr !== "object" || Array.isArray(tr)) return [`${at}: 객체가 아님`]
    return Object.entries(ko).flatMap(([k, v]) => textErrors(v, tr[k], at ? `${at}.${k}` : k, skip))
  }
  return ko === tr ? [] : [`${at}: 값이 원문과 같아야 함`]
}

/** 모든 문자열 (키 경로와 함께). 객체 키도 문장일 수 있어(공휴일 이름) 값만 봄 */
function* strings(x, p = "") {
  if (typeof x === "string") yield [p, x]
  else if (Array.isArray(x)) for (let i = 0; i < x.length; i++) yield* strings(x[i], `${p}[${i}]`)
  else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) yield* strings(v, p ? `${p}.${k}` : k)
}

/** 공휴일 표의 이름 전부 (deadline 사전 holidays 에 모두 있어야 함) */
function holidayNames() {
  const h = readJson(path.join(ROOT, "content/tools/civil/holidays.json"))
  return [...new Set(Object.values(h.days))]
}

const getPath = (o, p) => p.split(".").reduce((cur, k) => (cur && typeof cur === "object" ? cur[k] : undefined), o)

const [lang, only] = process.argv.slice(2)
if (!lang || !LANGS.includes(lang)) {
  console.log("사용법: node content/tools/i18n/check.mjs <ko|en|zh|vi|ru|mn> [도구]")
  process.exit(2)
}
/** 이 스크립트가 기본으로 보는 사전 (구형·양형 계산기 사전은 check-crimes.mjs 가 따로 검사. 이름을 주면 어느 사전이든 같은 기준으로 봄) */
const TOOLS = ["common", "police-summons", "drunk-driving", "deadline", "child-support", "inheritance", "reserved-share"]
const koFiles = readdirSync(path.join(DIR, "ko")).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort()
let tools = only ? [only, ...(DEPS[only] ?? []), "common"] : TOOLS.filter((t) => koFiles.includes(t))
tools = [...new Set(tools)]
let errors = 0
let warnings = 0
let total = 0
const bad = new Set()

for (const tool of tools) {
  const e = []
  const w = []
  const koFile = path.join(DIR, "ko", `${tool}.json`)
  const file = path.join(DIR, lang, `${tool}.json`)
  if (!existsSync(koFile)) {
    console.log(`✗ ${tool}: 한국어 원문(ko/${tool}.json)이 없음`)
    errors++
    continue
  }
  if (!existsSync(file)) {
    console.log(`- ${lang}/${tool}.json 없음 (이 도구는 ${lang} 페이지가 생기지 않음)`)
    bad.add(tool)
    continue
  }
  let ko, tr
  try {
    ko = readJson(koFile)
    tr = readJson(file)
  } catch (err) {
    console.log(`✗ ${lang}/${tool}.json: JSON 형식 오류: ${err.message}`)
    errors++
    bad.add(tool)
    continue
  }
  if (lang !== "ko") {
    const skip = KO_ONLY[tool] ?? []
    e.push(...textErrors(ko, tr, "", skip))
    for (const p of skip) if (getPath(tr, p) !== undefined) e.push(`${p}: 외국어판에는 넣지 않음 (전화 안내 금지)`)
  }
  // 공휴일 표에 새 이름이 생겼는데 한국어 사전에 없으면: ko 에 먼저 넣고(값 = 이름), 각 언어에 번역 추가
  if (tool === "deadline") for (const n of holidayNames()) if (typeof ko.holidays?.[n] !== "string") e.push(`holidays["${n}"]: 공휴일 표(content/tools/civil/holidays.json)에 있는데 한국어 사전에 없음`)
  let chars = 0
  for (const [p, s] of strings(tr)) {
    chars += s.length
    for (const re of BANNED[lang] ?? []) if (re.test(s)) w.push(`광고 규정 단어 ${re} → ${p}`)
    if (lang !== "ko") {
      for (const re of [...PHONE.all, ...(PHONE[lang] ?? [])]) if (re.test(s)) e.push(`전화번호·전화 안내 금지 ${re} → ${p}`)
      for (const re of LANG_PROMISE[lang] ?? []) if (re.test(s)) w.push(`상담 언어 약속처럼 보임 ${re} → ${p}`)
      if (/[가-힣]/.test(s) && !p.startsWith("holidays.")) w.push(`한글이 남아 있음 → ${p}`)
    }
  }
  total += chars
  for (const x of e) console.log(`✗ ${lang}/${tool}.json: ${x}`)
  for (const x of w) console.log(`! ${lang}/${tool}.json: ${x}`)
  if (e.length) bad.add(tool)
  errors += e.length
  warnings += w.length
  console.log(`${lang}/${tool}.json: 글자 ${chars.toLocaleString()}자${e.length ? ` · 오류 ${e.length}` : ""}${w.length ? ` · 경고 ${w.length}` : ""}`)
}

if (lang !== "ko") {
  const pages = tools.filter((t) => t !== "common")
  const ok = pages.filter((t) => !bad.has(t) && !bad.has("common") && (DEPS[t] ?? []).every((d) => !bad.has(d) && existsSync(path.join(DIR, lang, `${d}.json`))))
  console.log(`페이지가 생기는 도구: ${ok.length ? ok.join(", ") : "없음"}`)
}
console.log(`합계 글자 ${total.toLocaleString()}자`)
console.log(errors ? `오류 ${errors}개, 경고 ${warnings}개` : `통과 (경고 ${warnings}개)`)
process.exit(errors ? 1 : 0)
