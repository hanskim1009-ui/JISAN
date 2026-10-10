"use client"

import { parseWon, wonInKorean } from "@/lib/tools/family/format"
import { fracOver, fracText, type Fraction } from "@/lib/tools/family/fraction"

export const inputCls =
  "w-full min-w-0 rounded-xl border border-[#D5DAE1] bg-white px-4 py-3 text-[0.9375rem] text-jisan-ink outline-none placeholder:text-jisan-ink/35 focus:border-jisan-ink"

/** 금액 입력칸: 쉼표를 넣어 보여 주고, 아래에 "4억 2,500만 원"처럼 읽어 줌 */
export function MoneyField({
  id,
  label,
  help,
  value,
  onChange,
  placeholder = "0",
}: {
  id: string
  label: string
  help?: React.ReactNode
  value: number
  onChange: (n: number) => void
  placeholder?: string
}) {
  const helpId = `${id}-help`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[0.9375rem] font-semibold text-jisan-ink">
        {label}
      </label>
      {help && (
        <p id={helpId} className="mt-1 text-sm leading-relaxed text-[#6B717B]">
          {help}
        </p>
      )}
      <div className="mt-2.5 flex items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value ? value.toLocaleString("ko-KR") : ""}
          onChange={(e) => onChange(parseWon(e.target.value))}
          placeholder={placeholder}
          aria-describedby={help ? helpId : undefined}
          className={`${inputCls} text-right tabular-nums`}
        />
        <span className="shrink-0 text-[0.9375rem] text-[#4A505A]">원</span>
      </div>
      {value > 0 && <p className="mt-1 text-right text-xs text-[#8A9099]">{wonInKorean(value)}</p>}
    </div>
  )
}

/** − 숫자 + 로 사람 수를 고르는 칸 */
export function Stepper({
  label,
  value,
  min = 0,
  max = 20,
  onChange,
  unit = "명",
}: {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
  unit?: string
}) {
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-[#D5DAE1] bg-white text-lg leading-none text-jisan-ink hover:border-jisan-ink disabled:opacity-35 disabled:hover:border-[#D5DAE1]"
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label} 줄이기`}>
        −
      </button>
      <span className="min-w-[3rem] text-center text-[0.9375rem] font-semibold tabular-nums text-jisan-ink" aria-live="polite">
        {value}
        {unit}
      </span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label} 늘리기`}>
        +
      </button>
    </div>
  )
}

/** 둘 중 하나 고르기 (있음/없음 등) */
export function Choice<T extends string>({
  name,
  value,
  options,
  onChange,
  label,
}: {
  name: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <label key={o.value} className="max-w-full cursor-pointer">
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
          <span className="block rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-sm text-[#4A505A] transition-colors peer-checked:border-jisan-ink peer-checked:bg-jisan-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-accent/40 hover:border-jisan-ink">
            {o.label}
          </span>
        </label>
      ))}
    </div>
  )
}

/** 분수 표기: 같은 분모 꼴(3/9)을 크게, 약분한 꼴(1/3)이 다르면 옆에 */
export function FractionText({ f, denom }: { f: Fraction; denom: bigint }) {
  const over = fracOver(f, denom)
  const simple = fracText(f)
  return (
    <span className="tabular-nums">
      {over}
      {over !== simple && <span className="ml-1 text-xs text-[#8A9099]">(={simple})</span>}
    </span>
  )
}

/** 계산기 안의 소제목 상자 */
export function Panel({ title, children, desc }: { title: string; desc?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-[#D5DAE1] bg-white p-5 md:p-6">
      <h2 className="text-lg font-bold text-jisan-ink">{title}</h2>
      {desc && <p className="mt-1 text-sm leading-relaxed text-[#6B717B]">{desc}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** 결과 아래 "이렇게 계산했습니다" 목록 */
export function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-4 space-y-2 text-[0.9375rem] leading-relaxed text-[#4A505A]">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF1F5] text-xs font-bold text-jisan-ink">{i + 1}</span>
          <span className="min-w-0">{it}</span>
        </li>
      ))}
    </ol>
  )
}

/** 용어 풀이 */
export function Terms({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-8 grid gap-x-6 gap-y-3 rounded-xl border border-[#E9ECF0] px-5 py-4 text-sm leading-relaxed sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="font-semibold text-jisan-ink">{k}</dt>
          <dd className="mt-0.5 text-[#4A505A]">{v}</dd>
        </div>
      ))}
    </dl>
  )
}
