"use client"

import { useEffect, useId, useState } from "react"
import { Input } from "@/components/ui/input"
import { formatNumber, parseAmount, toISODate } from "@/lib/tools/civil/format"

/** 민사 계산기 공통 입력 부품 */

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-jisan-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs leading-relaxed text-[#6B717B]">{hint}</p>}
    </div>
  )
}

/** 금액 입력: 쓰는 대로 천 단위 쉼표 */
export function MoneyInput({ id, value, onChange, placeholder }: { id?: string; value: number | null; onChange: (v: number | null) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={value === null ? "" : formatNumber(value)}
        onChange={(e) => onChange(parseAmount(e.target.value))}
        className="pr-9 text-right tabular-nums"
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-[#6B717B]">원</span>
    </div>
  )
}

export function DateInput({ id, value, onChange }: { id?: string; value: string; onChange: (v: string) => void }) {
  return <Input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} className="tabular-nums" />
}

export function NumberInput({
  id,
  value,
  onChange,
  min = 1,
  max = 99,
  suffix,
}: {
  id?: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  suffix?: string
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => {
          const n = Math.floor(Number(e.target.value))
          onChange(Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min)
        }}
        className={suffix ? "pr-9 text-right tabular-nums" : "text-right tabular-nums"}
      />
      {suffix && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-[#6B717B]">{suffix}</span>}
    </div>
  )
}

export function Select<T extends string>({ id, value, onChange, children }: { id?: string; value: T; onChange: (v: T) => void; children: React.ReactNode }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
    >
      {children}
    </select>
  )
}

/** 동그란 단추 모양 선택지 (상담 폼과 같은 모양) */
export function Choice<T extends string>({
  name,
  value,
  onChange,
  options,
  label,
}: {
  name: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  label: string
}) {
  const base = useId()
  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="mb-2 text-sm font-semibold text-jisan-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label
            key={o.value}
            htmlFor={`${base}-${i}`}
            className="cursor-pointer rounded-full border border-input px-3.5 py-1.5 text-[0.8125rem] text-[#4A505A] transition-colors hover:border-jisan-ink/40 has-[:checked]:border-jisan-blue has-[:checked]:bg-jisan-blue/5 has-[:checked]:font-semibold has-[:checked]:text-jisan-blue has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <input id={`${base}-${i}`} type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-[#4A505A]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#0C1E36]" />
      <span>{children}</span>
    </label>
  )
}

/** 입력 영역 상자 */
export function FormBox({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 rounded-2xl border border-[#E4E6E9] bg-white p-5 sm:grid-cols-2 md:p-7">{children}</div>
}

/** 결과 영역: 큰 숫자 + 아래 내용 */
export function ResultBox({ label, value, sub, children }: { label: string; value: string; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section aria-live="polite" className="mt-6 rounded-2xl bg-[#F4F5F7] p-5 md:p-7">
      <p className="text-sm text-[#4A505A]">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-[-0.02em] text-jisan-ink tabular-nums md:text-[2.25rem]">{value}</p>
      {sub && <div className="mt-2 text-sm leading-relaxed text-[#4A505A]">{sub}</div>}
      {children && <div className="mt-5">{children}</div>}
    </section>
  )
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-6 rounded-2xl border border-[#E4E6E9] px-5 py-4 text-sm text-[#4A505A]">
      {message}
    </p>
  )
}

/** 표: 가로로 넘치면 표만 옆으로 밀림 */
export function DataTable({ head, rows, foot }: { head: string[]; rows: React.ReactNode[][]; foot?: React.ReactNode[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E4E6E9] bg-white">
      <table className={`w-full text-left text-sm ${head.length > 2 ? "min-w-[32rem]" : ""}`}>
        <thead className="bg-[#F7F8FA] text-[#4A505A]">
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className={`whitespace-nowrap px-4 py-2.5 font-semibold ${i === head.length - 1 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-[#E4E6E9]">
              {r.map((c, ci) => (
                <td key={ci} className={`px-4 py-2.5 tabular-nums text-jisan-ink ${ci === r.length - 1 ? "text-right" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot>
            <tr className="border-t border-jisan-ink/30 font-semibold">
              {foot.map((c, ci) => (
                <td key={ci} className={`px-4 py-2.5 tabular-nums text-jisan-ink ${ci === foot.length - 1 ? "text-right" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

/** 오늘 날짜(이용자 기기 기준). 서버 렌더와 어긋나지 않게 화면에 붙은 뒤 채움 */
export function useToday(): string {
  const [today, setToday] = useState("")
  useEffect(() => {
    const now = new Date()
    setToday(toISODate(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
  }, [])
  return today
}
