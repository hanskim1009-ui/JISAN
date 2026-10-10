#!/usr/bin/env node
/**
 * 구형·양형 계산기 외국어판 번역 검사 (안내: content/tools/i18n/TRANSLATE-crimes.md)
 *
 *   node content/tools/i18n/check-crimes.mjs             검사 (오류가 있으면 종료 코드 1)
 *   node content/tools/i18n/check-crimes.mjs --write-ko  원문(ko/prosecution-crimes.json, ko/sentencing-groups.json)을
 *                                                        원본 데이터와 고른 id 목록에서 다시 뽑기
 *
 * 검사: 원문이 원본 데이터와 같은지, 언어별 파일의 키 누락·남는 키, 자리표시자({n} 등), 금지어, 전화번호·전화 안내,
 *       상담 언어 약속, 한글이 남은 곳, 숫자가 빠진 곳(경고).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, "..", "..", "..")
const PROS_DIR = path.join(ROOT, "content", "tools", "prosecution")
const SENT_DIR = path.join(ROOT, "content", "tools", "sentencing")
const LANGS = ["en", "zh", "vi", "ru", "mn"]

/** 번역할 파일: 이름 → 종류 (crimes: 죄명 데이터, ui: 화면 문구, num: 금액·기간 표기) */
const FILES = {
  "prosecution-crimes.json": "crimes",
  "prosecution-ui.json": "ui",
  "sentencing-groups.json": "crimes",
  "sentencing-ui.json": "ui",
  "num-format.json": "num",
}

const read = (f) => JSON.parse(readFileSync(f, "utf8"))
const write = (f, v) => writeFileSync(f, JSON.stringify(v, null, 2) + "\n")
const strList = (v) => (Array.isArray(v) ? v.filter((s) => typeof s === "string" && s.trim() !== "") : [])

/* ---------- 원본 데이터에서 원문 뽑기 (lib/tools/prosecution-data.ts·sentencing-data.ts 와 같은 순서·같은 거름) ---------- */

function fileRank(f) {
  if (f === "penal.json") return 0
  if (f.startsWith("penal-")) return 1
  if (f === "special.json") return 2
  if (f.startsWith("special-")) return 3
  if (f === "derived.json") return 4
  return 5
}

function loadProsecution() {
  const files = readdirSync(PROS_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort((a, b) => fileRank(a) - fileRank(b) || a.localeCompare(b, "en", { numeric: true }))
  const out = new Map()
  for (const f of files) {
    let list
    try {
      list = read(path.join(PROS_DIR, f))
    } catch {
      continue
    }
    if (!Array.isArray(list)) continue
    for (const c of list) {
      if (!c || typeof c.id !== "string" || !c.id.trim() || typeof c.name !== "string" || !c.name.trim() || typeof c.group !== "string") continue
      const tiers = Array.isArray(c.tiers) ? c.tiers.filter((t) => t && typeof t.level === "string" && Array.isArray(t.when)) : []
      const ref = c.ref && typeof c.ref.href === "string" && typeof c.ref.label === "string"
      if (!ref && c.consultOnly !== true && tiers.length === 0) continue
      if (out.has(c.id)) continue
      out.set(c.id, { ...c, tiers, questions: Array.isArray(c.questions) ? c.questions.filter((q) => q && typeof q.id === "string" && typeof q.label === "string") : [] })
    }
  }
  return out
}

/** 죄명 하나에서 번역할 글자만 */
function crimeText(c) {
  const t = { name: c.name }
  const aliases = strList(c.aliases)
  if (aliases.length) t.aliases = aliases
  t.statutory = typeof c.statutory === "string" ? c.statutory : ""
  if (typeof c.law === "string" && c.law) t.law = c.law
  t.questions = {}
  for (const q of c.questions) {
    const x = { label: q.label }
    if (q.help) x.help = q.help
    if (q.type === "select") x.options = Object.fromEntries((q.options ?? []).map((o) => [String(o.value), o.label]))
    else if (q.unit) x.unit = q.unit
    t.questions[q.id] = x
  }
  t.tiers = c.tiers.map((x) => ({ ...(x.sentence ? { sentence: x.sentence } : {}), ...(x.note ? { note: x.note } : {}) }))
  const notes = strList(c.notes)
  if (notes.length) t.notes = notes
  if (c.ref) t.ref = { label: c.ref.label }
  return t
}

const PROB_KEYS = ["negativeMajor", "negativeGeneral", "positiveMajor", "positiveGeneral"]

function probText(p) {
  if (!p || typeof p !== "object") return undefined
  const out = {}
  for (const k of PROB_KEYS) if (Array.isArray(p[k])) out[k] = p[k].filter((s) => typeof s === "string")
  return Object.keys(out).length ? out : undefined
}

const isRange = (x) => !!x && typeof x === "object" && typeof x.text === "string"

function groupText(g) {
  const t = { name: g.name, scope: g.scope ?? "" }
  const notes = strList(g.notes)
  if (notes.length) t.notes = notes
  const prob = probText(g.probation)
  if (prob) t.probation = prob
  t.crimes = {}
  for (const c of g.crimes ?? []) {
    if (!c || typeof c.id !== "string" || typeof c.name !== "string" || !Array.isArray(c.types)) continue
    const types = c.types.filter((x) => x && typeof x.no === "string" && isRange(x.mitigated) && isRange(x.basic) && isRange(x.aggravated))
    if (!types.length) continue
    const ct = { name: c.name }
    if (c.scope) ct.scope = c.scope
    ct.types = Object.fromEntries(types.map((x) => [x.no, { name: x.name ?? "", ...(x.desc ? { desc: x.desc } : {}) }]))
    ct.factors = {}
    for (const side of ["special", "general"])
      for (const dir of ["aggravating", "mitigating"])
        for (const kind of ["act", "actor"])
          for (const f of c[side]?.[dir]?.[kind] ?? []) {
            if (!f || typeof f.id !== "string" || typeof f.label !== "string") continue
            ct.factors[f.id] ??= { label: f.label, ...(f.desc ? { desc: f.desc } : {}) }
          }
    const cn = strList(c.notes)
    if (cn.length) ct.notes = cn
    const cp = probText(c.probation)
    if (cp) ct.probation = cp
    t.crimes[c.id] = ct
  }
  return t
}

function extract(errors) {
  const pIds = read(path.join(HERE, "prosecution-ids.json")).map((x) => x.id)
  const sIds = read(path.join(HERE, "sentencing-ids.json")).map((x) => x.id)
  const all = loadProsecution()
  const crimes = {}
  for (const id of pIds) {
    const c = all.get(id)
    if (!c) errors.push(`prosecution-ids.json: 원본 데이터에 없는 id "${id}"`)
    else crimes[id] = crimeText(c)
  }
  const groups = {}
  for (const id of sIds) {
    const f = path.join(SENT_DIR, `${id}.json`)
    if (!existsSync(f)) {
      errors.push(`sentencing-ids.json: 원본 데이터에 없는 범죄군 "${id}"`)
      continue
    }
    groups[id] = groupText(read(f))
  }
  /** 고른 죄명들의 법률 이름 (화면의 "법률별" 묶음 이름) */
  return { crimes, groups }
}

/* ---------- 비교 ---------- */

/** 개수를 맞추지 않아도 되는 목록 (검색어) */
const FREE_LISTS = new Set(["aliases"])

/** 원문(ko)과 같은 모양인지: 키 누락은 오류, 남는 키는 경고 */
function compareShape(ko, tr, at, errors, warns, leaves) {
  if (typeof ko === "string") {
    if (typeof tr !== "string") return errors.push(`${at}: 번역 없음`)
    if (ko.trim() !== "" && tr.trim() === "") return errors.push(`${at}: 빈 번역`)
    leaves.push([at, ko, tr])
    return
  }
  if (Array.isArray(ko)) {
    if (!Array.isArray(tr)) return errors.push(`${at}: 목록이어야 함`)
    if (tr.length !== ko.length) errors.push(`${at}: 항목 수 ${tr.length} (원문 ${ko.length})`)
    ko.forEach((v, i) => compareShape(v, tr[i], `${at}[${i}]`, errors, warns, leaves))
    return
  }
  if (ko && typeof ko === "object") {
    if (!tr || typeof tr !== "object" || Array.isArray(tr)) return errors.push(`${at}: 묶음(객체)이어야 함`)
    for (const k of Object.keys(ko)) {
      if (k.startsWith("_")) continue
      if (FREE_LISTS.has(k)) {
        // 검색어: 개수 자유, 없어도 됨
        if (tr[k] !== undefined && !(Array.isArray(tr[k]) && tr[k].every((x) => typeof x === "string"))) errors.push(`${at}.${k}: 글자 목록이어야 함`)
        else for (const [i, x] of (tr[k] ?? []).entries()) leaves.push([`${at}.${k}[${i}]`, "", x])
        continue
      }
      compareShape(ko[k], tr[k], `${at}.${k}`, errors, warns, leaves)
    }
    for (const k of Object.keys(tr)) if (!(k in ko) && !k.startsWith("_")) warns.push(`${at}.${k}: 원문에 없는 키 (지워도 됨)`)
  }
}

const holders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",")

/** 금지어 (변호사 광고 규정): 오류 */
const BANNED = {
  en: /\b(specialists?|specializ\w*|specialis\w*|experts?|expertise|the best|best lawyers?|top[- ]rated|number one|no\.\s?1|#1|win rates?|success rates?|guarantee\w*|free of charge|for free|free consultation|seocho|former (judges?|prosecutors?))\b/i,
  zh: /专业|专家|最好|最佳|最强|第一|胜诉率|成功率|保证|保障结果|免费|瑞草|前官/,
  vi: /chuyên gia|chuyên nghiệp|tốt nhất|hàng đầu|số 1|số một|tỷ lệ thắng|tỉ lệ thắng|cam kết kết quả|bảo đảm kết quả|đảm bảo kết quả|miễn phí|seocho/i,
  ru: /специалист|эксперт|лучш|номер один|№\s?1|процент (выигр|побед)|гарант|бесплатн|сочхо|сочо/i,
  mn: /мэргэжлийн|мэргэжилтэн|шилдэг|хамгийн сайн|номер нэг|№\s?1|ялах хувь|баталгаат|үнэгүй|сочо/i,
}

/** 화면 문구(ui)에만: 전화 안내·상담 언어 약속·신청서 (외국어 사이트는 메신저 문의만) */
const UI_BANNED = {
  en: /\b(call us|phone|telephone|hotline|tel\.|in your (own )?language|we speak|english[- ]speaking|application form)\b/i,
  zh: /电话|致电|热线|中文咨询|会说中文|用中文|申请表/,
  vi: /điện thoại|gọi cho|đường dây nóng|hotline|bằng tiếng việt|nói tiếng việt|đơn đăng ký/i,
  ru: /телефон|позвон|горяч\w+ лини|на русском|говорим по-русски|бланк заявлени/i,
  mn: /утас|утсаар|залга|монгол хэлээр|өргөдлийн маягт/i,
}

const PHONE = /(\+?82[\s.-]?\(?0?\)?\d{1,2}[\s.-]?\d{3,4}[\s.-]?\d{4})|(\b0\d{1,2}[\s.-]\d{3,4}[\s.-]\d{4}\b)|(\b1[5-9]\d{2}-\d{4}\b)/

/** 괄호 밖에 한글이 남았는지 (괄호 안 한국어 용어 병기는 괜찮음) */
const hangulOutside = (s) => /[가-힣]/.test(s.replace(/\([^()]*\)/g, ""))

/** 숫자 (만·억·원 단위 금액은 언어마다 숫자가 달라지므로 뺌) */
const numbers = (s) =>
  s
    .replace(/[\d,.]+\s*(억|만|천)\s*(원)?/g, " ")
    .replace(/[\d,]+\s*원/g, " ")
    .match(/\d+(?:\.\d+)?/g) ?? []

function checkLeaves(lang, kind, leaves, errors, warns) {
  for (const [at, ko, tr] of leaves) {
    const where = at
    if (holders(ko) !== holders(tr)) errors.push(`${where}: 자리표시자가 원문과 다름 (원문 {${holders(ko)}} / 번역 {${holders(tr)}})`)
    if (BANNED[lang]?.test(tr)) errors.push(`${where}: 금지어 "${tr.match(BANNED[lang])[0]}"`)
    if (PHONE.test(tr)) errors.push(`${where}: 전화번호`)
    if (kind === "ui" && UI_BANNED[lang]?.test(tr)) errors.push(`${where}: 외국어 화면에 쓰지 않는 말 "${tr.match(UI_BANNED[lang])[0]}" (전화·상담 언어 약속·신청서)`)
    if ((tr.match(/%/g) ?? []).length > (ko.match(/%/g) ?? []).length) errors.push(`${where}: 원문에 없는 퍼센트`)
    if (kind !== "num" && hangulOutside(tr)) warns.push(`${where}: 한글이 남아 있음 (괄호 안 병기만 허용)`)
    if (kind === "crimes") {
      const want = numbers(ko)
      const have = new Set(numbers(tr).map(Number))
      const lost = [...new Set(want.map(Number))].filter((n) => !have.has(n))
      if (lost.length) warns.push(`${where}: 원문 숫자가 안 보임 (${lost.join(", ")})`)
    }
  }
}

/** 금액·기간 표기 파일: 표기 방식에 따라 필요한 키 */
function checkNum(lang, tr, errors) {
  const at = `${lang}/num-format.json`
  if (!tr || typeof tr !== "object") return errors.push(`${at}: 내용 없음`)
  for (const k of ["locale", "decimal", "group"]) if (typeof tr[k] !== "string" || (k === "locale" && !tr[k])) errors.push(`${at}.${k}: 없음`)
  const m = tr.money ?? {}
  const need = m.system === "million" ? ["small", "million", "billion"] : m.system === "man" ? ["small", "man", "eok", "eokMan"] : null
  if (!need) errors.push(`${at}.money.system: "million" 또는 "man"`)
  for (const k of need ?? []) if (typeof m[k] !== "string" || !m[k].includes("{n}") && k !== "eokMan") errors.push(`${at}.money.${k}: {n} 이 든 문장이어야 함`)
  if (m.system === "man" && !(typeof m.eokMan === "string" && m.eokMan.includes("{eok}") && m.eokMan.includes("{man}"))) errors.push(`${at}.money.eokMan: {eok}·{man} 이 든 문장이어야 함`)
  const p = tr.period ?? {}
  for (const k of ["year", "month", "day"]) if (!p[k] || typeof p[k].other !== "string" || !p[k].other.includes("{n}")) errors.push(`${at}.period.${k}.other: {n} 이 든 문장이어야 함`)
  if (typeof p.sep !== "string") errors.push(`${at}.period.sep: 없음`)
}

/** 글자 수 (번역 분량) */
function countChars(v) {
  if (typeof v === "string") return v.length
  if (Array.isArray(v)) return v.reduce((n, x) => n + countChars(x), 0)
  if (v && typeof v === "object") return Object.entries(v).reduce((n, [k, x]) => n + (k.startsWith("_") ? 0 : countChars(x)), 0)
  return 0
}

/* ---------- 실행 ---------- */

const errors = []
const warns = []
const fresh = extract(errors)

if (process.argv.includes("--write-ko")) {
  write(path.join(HERE, "ko", "prosecution-crimes.json"), fresh.crimes)
  write(path.join(HERE, "ko", "sentencing-groups.json"), fresh.groups)
  // 고른 죄명들의 묶음·법률 이름을 화면 문구의 groups·laws 에 맞춰 둠 (있는 것은 그대로, 없는 것만 더함)
  const uiFile = path.join(HERE, "ko", "prosecution-ui.json")
  const ui = read(uiFile)
  const all = loadProsecution()
  const groups = { ...(ui.groups ?? {}) }
  const laws = { ...(ui.laws ?? {}) }
  for (const id of Object.keys(fresh.crimes)) {
    const c = all.get(id)
    const g = c.group.trim() || "기타"
    if (!(g in groups)) groups[g] = g
    const name = lawNameOf(c)
    if (name && !(name in laws)) laws[name] = name
  }
  ui.groups = groups
  ui.laws = laws
  write(uiFile, ui)
  console.log(`원문을 다시 뽑았습니다: 죄명 ${Object.keys(fresh.crimes).length}개, 범죄군 ${Object.keys(fresh.groups).length}개`)
}

/** lib/tools/prosecution.ts 의 lawNameOf·tidyLawName 과 같게 */
function lawNameOf(c) {
  const tidy = (s) => s.replace(/ㆍ/g, "·").replace(/\s+/g, " ").trim()
  if (typeof c.lawName === "string" && tidy(c.lawName)) return tidy(c.lawName)
  const m = String(c.law ?? "").trim().match(/^(.+?)(?=\s*(?:제\s*\d|\(|,|\/|$))/)
  return tidy(m?.[1] ?? "") || "기타"
}

const ko = {}
for (const f of Object.keys(FILES)) {
  const p = path.join(HERE, "ko", f)
  if (!existsSync(p)) {
    errors.push(`ko/${f}: 원문 파일 없음`)
    continue
  }
  ko[f] = read(p)
}

// 원문이 원본 데이터와 같은지 (원본이 바뀌었으면 --write-ko 로 다시 뽑고 번역도 고쳐야 함)
if (ko["prosecution-crimes.json"] && JSON.stringify(ko["prosecution-crimes.json"]) !== JSON.stringify(fresh.crimes))
  errors.push("ko/prosecution-crimes.json: 원본 데이터(content/tools/prosecution)와 다릅니다. --write-ko 로 다시 뽑은 뒤 바뀐 곳의 번역을 고치세요.")
if (ko["sentencing-groups.json"] && JSON.stringify(ko["sentencing-groups.json"]) !== JSON.stringify(fresh.groups))
  errors.push("ko/sentencing-groups.json: 원본 데이터(content/tools/sentencing)와 다릅니다. --write-ko 로 다시 뽑은 뒤 바뀐 곳의 번역을 고치세요.")

const report = []
for (const lang of LANGS) {
  const dir = path.join(HERE, lang)
  for (const [f, kind] of Object.entries(FILES)) {
    const p = path.join(dir, f)
    if (!existsSync(p)) {
      report.push(`${lang}/${f}: 없음`)
      continue
    }
    let tr
    try {
      tr = read(p)
    } catch (e) {
      errors.push(`${lang}/${f}: JSON 오류 ${e.message}`)
      continue
    }
    const before = errors.length
    if (kind === "num") {
      checkNum(lang, tr, errors)
      const leaves = []
      for (const k of ["small", "million", "billion", "man", "eok", "eokMan"]) if (typeof tr.money?.[k] === "string") leaves.push([`${lang}/${f}.money.${k}`, tr.money[k], tr.money[k]])
      checkLeaves(lang, kind, leaves, errors, warns)
    } else if (ko[f]) {
      const leaves = []
      compareShape(ko[f], tr, `${lang}/${f}`, errors, warns, leaves)
      checkLeaves(lang, kind, leaves, errors, warns)
    }
    report.push(`${lang}/${f}: ${errors.length === before ? "통과" : `오류 ${errors.length - before}개`}`)
  }
}

console.log("원문 글자 수 (번역 분량)")
for (const f of Object.keys(FILES)) if (ko[f]) console.log(`  ko/${f}: ${countChars(ko[f]).toLocaleString("en")}자`)
console.log(`  고른 죄명 ${Object.keys(fresh.crimes).length}개, 범죄군 ${Object.keys(fresh.groups).length}개`)
console.log("언어별")
for (const r of report) console.log(`  ${r}`)
if (warns.length) {
  console.log(`\n경고 ${warns.length}개`)
  for (const w of warns.slice(0, 200)) console.log(`  ${w}`)
  if (warns.length > 200) console.log(`  … ${warns.length - 200}개 더`)
}
if (errors.length) {
  console.log(`\n오류 ${errors.length}개`)
  for (const e of errors.slice(0, 300)) console.log(`  ${e}`)
  if (errors.length > 300) console.log(`  … ${errors.length - 300}개 더`)
  process.exit(1)
}
console.log("\n오류 없음")
