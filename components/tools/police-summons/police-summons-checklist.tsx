"use client"

import { useEffect, useMemo, useState } from "react"
import type { Lang } from "@/lib/langs"
import {
  DEFAULT_SITUATION,
  QUESTION_OPTIONS,
  STEP_NUMS,
  itemText,
  itemsFor,
  parseSituation,
  situationSummary,
  type Item,
  type PoliceSummonsText,
  type QuestionKey,
  type Situation,
} from "@/lib/tools/police-summons"
import { printChecklist } from "./print"

/** 브라우저 저장 키 (값 형식이 바뀌면 v 를 올림) */
const STORE_KEY = "jisan:tools:police-summons:v1"

type Saved = { s: Situation; done: string[] }

function load(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw) as { s?: unknown; done?: unknown }
    return {
      s: parseSituation(o.s),
      done: Array.isArray(o.done) ? o.done.filter((x): x is string => typeof x === "string") : [],
    }
  } catch {
    return null
  }
}

function save(v: Saved) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(v))
  } catch {
    // 저장이 막혀 있으면(사생활 보호 모드 등) 이번 화면에서만 유지
  }
}

/** 단계 안에서 먼저 챙길 항목을 앞으로 */
function ordered(list: Item[], s: Situation) {
  return [...list].sort((a, b) => Number(!!b.urgent?.(s)) - Number(!!a.urgent?.(s)))
}

/** 경찰 출석요구 체크리스트: 상황 고르기 → 단계별 확인 (체크는 이 브라우저에 저장). 문구는 사전(t)에서 */
export function PoliceSummonsChecklist({ lang, t, brand }: { lang: Lang; t: PoliceSummonsText; brand: string }) {
  const [s, setS] = useState<Situation>(DEFAULT_SITUATION)
  const [done, setDone] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const v = load()
    if (v) {
      setS(v.s)
      setDone(new Set(v.done))
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) save({ s, done: [...done] })
  }, [s, done, loaded])

  const items = useMemo(() => itemsFor(s), [s])
  const total = items.length
  const checked = items.filter((i) => done.has(i.id)).length
  const pct = total ? Math.round((checked / total) * 100) : 0

  const toggle = (id: string) =>
    setDone((d) => {
      const n = new Set(d)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const reset = () => {
    if (window.confirm(t.ui.resetConfirm)) {
      setS(DEFAULT_SITUATION)
      setDone(new Set())
    }
  }

  const set = <K extends keyof Situation>(k: K, v: Situation[K]) => setS((p) => ({ ...p, [k]: v }))
  const suspectSide = s.role === "suspect" || s.role === "unknown"

  return (
    <div className="min-w-0">
      {/* 진행률 */}
      <div className="mb-8 rounded-2xl border border-[#D5DAE1] bg-white px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm text-[#4A505A]">
            <span className="font-bold text-jisan-ink tabular-nums">
              {checked} / {total}
            </span>{" "}
            {t.ui.checked}
          </p>
          <div
            className="h-2 min-w-[6rem] flex-1 overflow-hidden rounded-full bg-[#E3E6EB]"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t.ui.progressLabel}
          >
            <div className="h-full rounded-full bg-brand-accent transition-[width]" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => printChecklist(lang, t, brand, s, items, done)}
              className="rounded-full bg-jisan-ink px-4 py-2 text-sm font-semibold text-white hover:bg-jisan-ink/90"
            >
              {t.ui.print}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-[#4A505A] hover:border-jisan-ink hover:text-jisan-ink"
            >
              {t.ui.reset}
            </button>
          </div>
        </div>
      </div>

      {/* 1단계: 지금 상황 */}
      <section aria-labelledby="ps-step-1">
        <StepHeading n={1} id="ps-step-1" title={t.steps["1"]} />
        <p className="mt-2 text-[0.9375rem] text-[#4A505A]">{t.ui.step1Intro}</p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <Choice q={question(t, "role")} value={s.role} onChange={(v) => set("role", v as Situation["role"])} />
          <Choice q={question(t, "days")} value={s.days} onChange={(v) => set("days", v as Situation["days"])} />
          <Choice q={question(t, "via")} value={s.via} onChange={(v) => set("via", v as Situation["via"])} />
          {suspectSide && <Choice q={question(t, "arrest")} value={s.arrest ? "yes" : "no"} onChange={(v) => set("arrest", v === "yes")} />}
          <Choice q={question(t, "counsel")} value={s.counsel ? "yes" : "no"} onChange={(v) => set("counsel", v === "yes")} />
          <Choice q={question(t, "phone")} value={s.phone ? "yes" : "no"} onChange={(v) => set("phone", v === "yes")} />
        </div>
        <p className="mt-5 rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">{situationSummary(t, s)}</p>
      </section>

      {/* 2~4단계 */}
      {STEP_NUMS.slice(1).map((n) => {
        const st = { n, title: t.steps[String(n) as "2" | "3" | "4"] }
        const list = ordered(
          items.filter((i) => i.step === st.n),
          s,
        )
        const stepDone = list.filter((i) => done.has(i.id)).length
        return (
          <section key={st.n} aria-labelledby={`ps-step-${st.n}`} className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <StepHeading n={st.n} id={`ps-step-${st.n}`} title={st.title} />
              <span className="text-sm tabular-nums text-[#6B717B]">
                {stepDone} / {list.length}
              </span>
            </div>
            <ul className="mt-4 divide-y divide-[#E9ECF0] rounded-2xl border border-[#D5DAE1] bg-white">
              {list.map((it) => (
                <CheckRow key={it.id} item={it} s={s} t={t} checked={done.has(it.id)} onToggle={() => toggle(it.id)} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function StepHeading({ n, id, title }: { n: number; id: string; title: string }) {
  return (
    <h2 id={id} className="flex items-center gap-2.5 text-xl font-bold text-jisan-ink">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-jisan-ink text-sm text-white tabular-nums">{n}</span>
      {title}
    </h2>
  )
}

type Q = { label: string; help?: string; options: readonly { value: string; label: string }[] }

/** 사전 문구 + 선택지 값 순서 → 질문 하나 */
function question(t: PoliceSummonsText, k: QuestionKey): Q {
  const q = t.questions[k] as { label: string; help?: string; options: Record<string, string> }
  return { label: q.label, help: q.help, options: QUESTION_OPTIONS[k].map((value) => ({ value, label: q.options[value] ?? value })) }
}

function Choice({ q, value, onChange }: { q: Q; value: string; onChange: (v: string) => void }) {
  const name = `ps-${q.label}`
  return (
    <fieldset className="min-w-0">
      <legend className="text-[0.9375rem] font-semibold text-jisan-ink">{q.label}</legend>
      {q.help && <p className="mt-1 text-sm text-[#6B717B]">{q.help}</p>}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {q.options.map((o) => (
          <label key={o.value} className="max-w-full cursor-pointer">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="block rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-sm text-[#4A505A] transition-colors [overflow-wrap:anywhere] peer-checked:border-jisan-ink peer-checked:bg-jisan-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-accent/40 hover:border-jisan-ink">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function CheckRow({ item, s, t, checked, onToggle }: { item: Item; s: Situation; t: PoliceSummonsText; checked: boolean; onToggle: () => void }) {
  const id = `ps-item-${item.id}`
  const urgent = item.urgent?.(s)
  const x = itemText(t, item, s)
  return (
    <li className="px-4 py-4 md:px-5">
      <div className="flex gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-[#B9BFC8] accent-jisan-ink"
        />
        <div className="min-w-0">
          <label htmlFor={id} className="cursor-pointer">
            <span className={`text-[0.9375rem] font-semibold [overflow-wrap:anywhere] ${checked ? "text-[#8A9099] line-through decoration-1" : "text-jisan-ink"}`}>
              {x.title}
            </span>
            {urgent && !checked && (
              <span className="ml-2 inline-block rounded-full bg-brand-accent/10 px-2 py-0.5 align-middle text-xs font-semibold text-brand-accent">{t.ui.urgent}</span>
            )}
          </label>
          <p className="mt-1 text-sm leading-relaxed text-[#4A505A]">{x.desc}</p>
          {x.basis && <p className="mt-1 text-xs text-[#8A9099]">{x.basis}</p>}
        </div>
      </div>
    </li>
  )
}
