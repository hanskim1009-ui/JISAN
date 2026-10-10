/**
 * 외국어판 계산기의 금액·기간 표기 (구형·양형 공용, 브라우저·서버 공용 순수 함수).
 * 표기 틀은 content/tools/i18n/{lang}/num-format.json 에 있고, 한국어 화면은 이것을 쓰지 않습니다(기존 표기 그대로).
 * 150만원 → en "KRW 1.5 million", zh "150万韩元", vi "1,5 triệu won", ru "1,5 млн вон", mn "1.5 сая вон"
 * 1년 6월 → en "1 year 6 months" (복수형은 Intl.PluralRules 로 one·few·many·other 고름)
 */
import { fmt } from "@/lib/i18n/fmt"

/** 복수형별 문장 ({n} 자리). other 는 꼭 있어야 함 */
export type PluralText = { other: string } & Partial<Record<"zero" | "one" | "two" | "few" | "many", string>>

export type NumFmt = {
  /** Intl 언어 코드 (복수형 규칙용, 예: "en", "ru") */
  locale: string
  /** 소수점 */
  decimal: string
  /** 천 단위 구분 */
  group: string
  money:
    | { system: "million"; small: string; million: string; billion: string }
    | { system: "man"; small: string; man: string; eok: string; eokMan: string }
  period: { year: PluralText; month: PluralText; day: PluralText; sep: string }
}

/** 숫자 → 문자열 (소수 둘째 자리까지, 끝의 0 은 뺌) */
export function formatNumber(n: number, nf: Pick<NumFmt, "decimal" | "group">, maxFrac = 2): string {
  const neg = n < 0
  const fixed = Math.abs(n).toFixed(maxFrac)
  const [int, frac = ""] = fixed.split(".")
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, nf.group)
  const f = frac.replace(/0+$/, "")
  return (neg ? "-" : "") + grouped + (f ? nf.decimal + f : "")
}

const ruleCache = new Map<string, Intl.PluralRules>()

function plural(t: PluralText, n: number, locale: string): string {
  let rules = ruleCache.get(locale)
  if (!rules) {
    try {
      rules = new Intl.PluralRules(locale)
    } catch {
      rules = new Intl.PluralRules("en")
    }
    ruleCache.set(locale, rules)
  }
  const cat = rules.select(n) as keyof PluralText
  return t[cat] ?? t.other
}

/** 원 → 언어별 금액 표기 */
export function formatWonIntl(won: number, nf: NumFmt): string {
  const v = Math.round(won)
  const m = nf.money
  if (m.system === "million") {
    if (v >= 1_000_000_000) return fmt(m.billion, { n: formatNumber(v / 1_000_000_000, nf, 3) })
    if (v >= 1_000_000) return fmt(m.million, { n: formatNumber(v / 1_000_000, nf, 2) })
    return fmt(m.small, { n: formatNumber(v, nf, 0) })
  }
  // 만·억 단위 (중국어 등)
  const eok = Math.floor(v / 100_000_000)
  const man = Math.floor((v % 100_000_000) / 10_000)
  if (eok > 0 && man > 0) return fmt(m.eokMan, { eok: formatNumber(eok, nf, 0), man: formatNumber(man, nf, 0) })
  if (eok > 0) return fmt(m.eok, { n: formatNumber(eok, nf, 0) })
  if (v >= 10_000) return fmt(m.man, { n: formatNumber(v / 10_000, nf, 2) })
  return fmt(m.small, { n: formatNumber(v, nf, 0) })
}

/** 개월 → 언어별 기간 표기 ("1 year 6 months"). 반 달 같은 끝수는 일(30일 기준)로 */
export function formatMonthsIntl(months: number, nf: NumFmt): string {
  const whole = Math.floor(months + 1e-9)
  const days = Math.round((months - whole) * 30)
  const y = Math.floor(whole / 12)
  const mo = whole % 12
  const p = nf.period
  const parts: string[] = []
  if (y > 0) parts.push(fmt(plural(p.year, y, nf.locale), { n: y }))
  if (mo > 0) parts.push(fmt(plural(p.month, mo, nf.locale), { n: mo }))
  if (days > 0) parts.push(fmt(plural(p.day, days, nf.locale), { n: days }))
  return parts.length ? parts.join(p.sep) : fmt(plural(p.month, 0, nf.locale), { n: 0 })
}

/** 표기 틀이 쓸 만한지 (서버에서 사전을 읽을 때 확인) */
export function isNumFmt(x: unknown): x is NumFmt {
  if (!x || typeof x !== "object") return false
  const o = x as NumFmt
  const s = (v: unknown) => typeof v === "string"
  const pl = (v: unknown) => !!v && typeof v === "object" && s((v as PluralText).other)
  if (!s(o.locale) || !o.locale || !s(o.decimal) || !s(o.group)) return false
  const m = o.money as Record<string, unknown> | undefined
  if (!m) return false
  const ok =
    m.system === "million"
      ? s(m.small) && s(m.million) && s(m.billion)
      : m.system === "man"
        ? s(m.small) && s(m.man) && s(m.eok) && s(m.eokMan)
        : false
  const p = o.period
  return ok && !!p && pl(p.year) && pl(p.month) && pl(p.day) && s(p.sep)
}
