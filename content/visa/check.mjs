#!/usr/bin/env node
/**
 * 체류자격 안내 JSON 검사 (패키지 없이 node 로 실행)
 *   node content/visa/check.mjs          → 있는 언어 모두
 *   node content/visa/check.mjs en zh    → 고른 언어만
 * 오류(✗)가 있으면 종료 코드 1. 경고(!)는 사람이 확인할 것.
 * 모양 기준은 lib/visa.ts 의 visaDocErrors / visaUiErrors 와 같습니다.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const DIR = path.dirname(fileURLToPath(import.meta.url))
const LANGS = ["ko", "en", "zh", "vi", "ru", "mn"]
const SLUGS = ["e-9", "h-2", "e-7", "d-2", "d-4", "d-10", "f-6", "f-2", "f-4", "f-5", "c-3", "g-1"]
const GROUPS = ["work", "study", "family", "short"]
const CENTERS = ["foreigner", "crime", "family"]
const UI_KEYS = [
  "listTitle", "listLead", "listSeoTitle", "listSeoDescription", "home", "crumb", "about", "impact", "issues", "faq",
  "consultWhen", "related", "laws", "basis", "notice", "readMore", "otherVisas", "ctaTitle", "ctaLead", "ctaButton",
]

/** 광고 규정상 쓰지 않는 말 (외국어는 경고만: 문맥상 괜찮은 경우가 있어 사람이 확인) */
const BANNED = {
  ko: [/전문가/, /(?<!비)전문(?!취업)/, /최고/, /1등/, /승소율/, /결과\s*보장/, /무료/, /서초/, /전관/],
  en: [/\bexpert/i, /\bspeciali[sz]/i, /\bbest\b/i, /\bNo\.\s*1\b/i, /\bnumber one\b/i, /\bguarantee/i, /\bfree of charge\b/i, /\bfree consultation/i, /\bwin rate/i, /\bSeocho/i],
  zh: [/专家/, /专业律师/, /最好/, /最佳/, /第一/, /保证/, /免费/, /胜诉率/, /瑞草/],
  vi: [/chuyên gia/i, /tốt nhất/i, /số 1\b/i, /đảm bảo kết quả/i, /miễn phí/i, /tỷ lệ thắng/i, /Seocho/i],
  ru: [/эксперт/i, /специалист/i, /лучш/i, /№\s*1/, /гарантир/i, /бесплатн/i, /процент выигр/i, /Сочхо/i, /Сочо/i],
  mn: [/мэргэжилтэн/i, /шилдэг/i, /баталгаа/i, /үнэгүй/i, /Сочо/i],
}
/** 외국어판: 전화번호·전화 권유 금지 (메신저로만 문의) */
const PHONE = [/\d{2,3}-\d{3,4}-\d{4}/, /\+82/, /6951/, /tel:/i]

const isStr = (x) => typeof x === "string" && x.trim().length > 0
const isStrArr = (x) => Array.isArray(x) && x.length > 0 && x.every(isStr)
const isItems = (x) => Array.isArray(x) && x.length > 0 && x.every((i) => i && isStr(i.title) && isStr(i.body))

function docErrors(d, slug) {
  const e = []
  if (!d || typeof d !== "object") return ["객체가 아님"]
  if (!isStr(d.code)) e.push("code")
  if (d.slug !== slug) e.push(`slug 가 파일 이름(${slug})과 다름`)
  if (!isStr(d.name)) e.push("name")
  if (!GROUPS.includes(d.group)) e.push("group")
  if (!isStr(d.summary)) e.push("summary")
  if (!d.seo || !isStr(d.seo.title) || !isStr(d.seo.description)) e.push("seo")
  if (!isStrArr(d.about)) e.push("about")
  if (!d.impact || !isStr(d.impact.lead) || !isItems(d.impact.items)) e.push("impact")
  if (!Array.isArray(d.issues) || !d.issues.length || !d.issues.every((i) => isStr(i?.title) && isStrArr(i?.body))) e.push("issues")
  if (!Array.isArray(d.faqs) || !d.faqs.length || !d.faqs.every((f) => isStr(f?.q) && isStr(f?.a))) e.push("faqs")
  if (!isStrArr(d.consultWhen)) e.push("consultWhen")
  if (!Array.isArray(d.related) || !d.related.every((r) => r && CENTERS.includes(r.center))) e.push("related")
  if (!isStrArr(d.laws)) e.push("laws")
  return e
}

function uiErrors(u) {
  if (!u || typeof u !== "object") return ["객체가 아님"]
  const e = []
  if (!u.ui) e.push("ui")
  else {
    for (const k of UI_KEYS) if (!isStr(u.ui[k])) e.push(`ui.${k}`)
    for (const g of GROUPS) if (!isStr(u.ui.groups?.[g])) e.push(`ui.groups.${g}`)
  }
  if (!u.common || !isStr(u.common.title) || !isStr(u.common.lead) || !isItems(u.common.items)) e.push("common")
  return e
}

/** 모든 문자열 (키 경로와 함께) */
function* strings(x, p = "") {
  if (typeof x === "string") yield [p, x]
  else if (Array.isArray(x)) for (let i = 0; i < x.length; i++) yield* strings(x[i], `${p}[${i}]`)
  else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) yield* strings(v, p ? `${p}.${k}` : k)
}

/** 번역본과 한국어 원문의 모양 비교: 개수가 다르면 경고, 바뀌면 안 되는 값은 오류 */
function compare(ko, tr, e, w) {
  for (const k of ["code", "slug", "group"]) if (ko[k] !== tr[k]) e.push(`${k} 는 원문과 같아야 함 (${ko[k]})`)
  if (JSON.stringify(ko.related) !== JSON.stringify(tr.related)) e.push("related 는 원문과 같아야 함")
  const n = (x) => (Array.isArray(x) ? x.length : -1)
  const pairs = [
    ["about", ko.about, tr.about],
    ["impact.items", ko.impact?.items, tr.impact?.items],
    ["issues", ko.issues, tr.issues],
    ["faqs", ko.faqs, tr.faqs],
    ["consultWhen", ko.consultWhen, tr.consultWhen],
    ["laws", ko.laws, tr.laws],
  ]
  for (const [k, a, b] of pairs) if (n(a) !== n(b)) w.push(`${k} 개수가 원문(${n(a)})과 다름(${n(b)})`)
  ko.issues?.forEach((s, i) => {
    if (tr.issues?.[i] && n(s.body) !== n(tr.issues[i].body)) w.push(`issues[${i}].body 개수가 원문과 다름`)
  })
}

const want = process.argv.slice(2)
const langs = (want.length ? want : LANGS).filter((l) => existsSync(path.join(DIR, l)))
let errors = 0
let warnings = 0
const koUi = JSON.parse(readFileSync(path.join(DIR, "ko", "_ui.json"), "utf8"))

for (const lang of langs) {
  const dir = path.join(DIR, lang)
  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort()
  let chars = 0
  for (const f of files) {
    const e = []
    const w = []
    let data
    try {
      data = JSON.parse(readFileSync(path.join(dir, f), "utf8"))
    } catch (err) {
      e.push(`JSON 형식 오류: ${err.message}`)
    }
    if (data) {
      if (f === "_ui.json") {
        e.push(...uiErrors(data))
        if (lang !== "ko") {
          if (data.ui?.ctaPhone) e.push("ui.ctaPhone 은 외국어판에 넣지 않음")
          if (data.common?.items?.length !== koUi.common.items.length) w.push("common.items 개수가 원문과 다름")
        }
      } else {
        const slug = f.replace(/\.json$/, "")
        if (!SLUGS.includes(slug)) e.push(`알 수 없는 파일 이름 (허용: ${SLUGS.join(", ")})`)
        else {
          e.push(...docErrors(data, slug))
          if (lang === "ko") {
            if (data.faqs?.length < 4 || data.faqs?.length > 6) w.push(`faqs 는 4~6개 (지금 ${data.faqs?.length})`)
            if (data.consultWhen?.length < 3 || data.consultWhen?.length > 4) w.push(`consultWhen 은 3~4개 (지금 ${data.consultWhen?.length})`)
          } else if (existsSync(path.join(DIR, "ko", f))) {
            compare(JSON.parse(readFileSync(path.join(DIR, "ko", f), "utf8")), data, e, w)
          } else e.push("한국어 원문(ko)에 없는 자격")
        }
      }
      for (const [p, s] of strings(data)) {
        chars += s.length
        for (const re of BANNED[lang] ?? []) if (re.test(s)) (lang === "ko" ? e : w).push(`광고 규정 단어 ${re} → ${p}`)
        if (lang !== "ko") for (const re of PHONE) if (re.test(s)) e.push(`전화번호·전화 안내 금지 ${re} → ${p}`)
      }
    }
    for (const x of e) console.log(`✗ ${lang}/${f}: ${x}`)
    for (const x of w) console.log(`! ${lang}/${f}: ${x}`)
    errors += e.length
    warnings += w.length
  }
  if (lang !== "ko" && files.length && !files.includes("_ui.json")) {
    console.log(`✗ ${lang}: _ui.json 이 없으면 이 언어의 체류자격 페이지는 하나도 만들어지지 않음`)
    errors++
  }
  console.log(`${lang}: 파일 ${files.length}개, 글자 ${chars.toLocaleString()}자`)
}
console.log(errors ? `오류 ${errors}개, 경고 ${warnings}개` : `통과 (경고 ${warnings}개)`)
process.exit(errors ? 1 : 0)
