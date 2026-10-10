"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  SENTENCING_UI_KO,
  decideProbation,
  evaluate,
  filterSet,
  probationFactors,
  probationFits,
  rangeShow,
  txOf,
  type Factor,
  type FactorSet,
  type GroupSummary,
  type ProbationFactors,
  type SentCrime,
  type SentencingGroup,
  type SentencingIntl,
  type SentencingUI,
} from "@/lib/tools/sentencing"
import { fmt } from "@/lib/i18n/fmt"
import { filterGroups } from "./search"
import { CheckGroup, type CheckItem } from "./check-list"
import { ResultCard, RulesGuide } from "./result-card"
import { OtherCrimes } from "@/components/tools/prosecution/other-crimes"

/** 범죄군 데이터는 고를 때 정적 주소에서 한 번만 받아 둠 */
const groupCache = new Map<string, Promise<SentencingGroup>>()

function fetchGroup(id: string, base = "/tools/sentencing/data"): Promise<SentencingGroup> {
  const url = `${base}/${encodeURIComponent(id)}`
  let p = groupCache.get(url)
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json() as Promise<SentencingGroup>
    })
    p.catch(() => groupCache.delete(url))
    groupCache.set(url, p)
  }
  return p
}

const toItems = (prefix: string, list: Factor[], u: SentencingUI): CheckItem[] =>
  list.map((f) => ({ key: `${prefix}:${f.id}`, label: f.label, desc: f.desc, badge: f.actWeight ? u.form.actWeight : undefined }))

/** 고른 key 들 중 한쪽(prefix) id 만 */
const idsOf = (picked: ReadonlySet<string>, prefix: string) => [...picked].filter((k) => k.startsWith(`${prefix}:`)).map((k) => k.slice(prefix.length + 1))

const PROB_KEYS: { key: keyof ProbationFactors; title: (u: SentencingUI) => string }[] = [
  { key: "negativeMajor", title: (u) => u.form.probationNegativeMajor },
  { key: "positiveMajor", title: (u) => u.form.probationPositiveMajor },
  { key: "negativeGeneral", title: (u) => u.form.probationNegativeGeneral },
  { key: "positiveGeneral", title: (u) => u.form.probationPositiveGeneral },
]

/** 집행유예 참작사유: key 는 "칸:순번". 다른 세부 범죄 전용 사유는 뺌 (외국어판 데이터는 서버에서 이미 골라 둠) */
function probationItems(pf: ProbationFactors, key: keyof ProbationFactors, crimeName: string, names: string[], intl: boolean): CheckItem[] {
  return (pf[key] ?? []).map((label, i) => ({ key: `${key}:${i}`, label })).filter((it) => intl || probationFits(it.label, crimeName, names))
}

function toggle(set: ReadonlySet<string>, key: string) {
  const next = new Set(set)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  return next
}

/** 양형 계산기: 범죄 찾기 → 유형 → 특별양형인자 → 결과(영역·범위·특별 조정·집행유예). intl 이 있으면 외국어판 */
export function SentencingCalculator({ groups, intl }: { groups: GroupSummary[]; intl?: SentencingIntl }) {
  const u = intl?.ui ?? SENTENCING_UI_KO
  const tx = useMemo(() => txOf(intl), [intl])
  const [query, setQuery] = useState("")
  const [gid, setGid] = useState<string | null>(null)
  const [cid, setCid] = useState<string | null>(null)
  const [group, setGroup] = useState<SentencingGroup | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [typeNo, setTypeNo] = useState<string | undefined>()
  const [special, setSpecial] = useState<ReadonlySet<string>>(new Set())
  const [general, setGeneral] = useState<ReadonlySet<string>>(new Set())
  const [prob, setProb] = useState<ReadonlySet<string>>(new Set())
  const top = useRef<HTMLDivElement>(null)

  // 주소의 ?g=범죄군&c=세부범죄 로 바로 열기
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const g = sp.get("g")
    if (g && groups.some((x) => x.id === g)) {
      setGid(g)
      setCid(sp.get("c"))
    }
  }, [groups])

  // 고른 범죄군 데이터 받기
  useEffect(() => {
    if (!gid) return
    let live = true
    setStatus("loading")
    fetchGroup(gid, intl?.dataBase)
      .then((g) => {
        if (!live) return
        setGroup(g)
        setStatus("idle")
      })
      .catch(() => live && setStatus("error"))
    return () => {
      live = false
    }
  }, [gid, intl?.dataBase])

  const reset = () => {
    setTypeNo(undefined)
    setSpecial(new Set())
    setGeneral(new Set())
    setProb(new Set())
  }

  const pick = (g: string | null, c: string | null, scroll = true) => {
    if (g !== gid) setGroup(null)
    setGid(g)
    setCid(c)
    reset()
    const url = new URL(window.location.href)
    if (g) url.searchParams.set("g", g)
    else url.searchParams.delete("g")
    if (g && c) url.searchParams.set("c", c)
    else url.searchParams.delete("c")
    window.history.replaceState(null, "", url)
    if (scroll) top.current?.scrollIntoView({ block: "start", behavior: "smooth" })
  }

  const list = useMemo(() => filterGroups(groups, query, !!intl), [groups, query, intl])

  const crime: SentCrime | undefined = group && group.id === gid ? (group.crimes.find((c) => c.id === cid) ?? group.crimes[0]) : undefined
  const tNo = typeNo ?? (crime?.types.length === 1 ? crime.types[0].no : undefined)
  const result = crime && tNo ? evaluate(crime, tNo, { aggravating: idsOf(special, "agg"), mitigating: idsOf(special, "mit") }, tx) : null

  const pf = group && crime ? probationFactors(group, crime) : undefined
  const probGroups =
    pf && crime && group ? PROB_KEYS.map((k) => ({ key: k.key, title: k.title(u), items: probationItems(pf, k.key, crime.name, group.crimes.map((c) => c.name), !!intl) })) : []
  const probCount = (key: keyof ProbationFactors) => probGroups.find((g) => g.key === key)?.items.filter((it) => prob.has(it.key)).length ?? 0
  const probation =
    pf && result?.probationOpen
      ? decideProbation(
          {
            positiveMajor: probCount("positiveMajor"),
            negativeMajor: probCount("negativeMajor"),
            positiveGeneral: probCount("positiveGeneral"),
            negativeGeneral: probCount("negativeGeneral"),
          },
          tx,
        )
      : undefined

  if (groups.length === 0) {
    return <p className="rounded-xl bg-[#F4F5F7] px-5 py-4 text-[0.9375rem] text-[#4A505A]">{u.browser.preparing}</p>
  }

  if (!gid) {
    return (
      <div ref={top} className="min-w-0 scroll-mt-24">
        <label className="flex items-center gap-2 rounded-xl border border-[#D5DAE1] bg-white px-4 py-3 focus-within:border-jisan-ink">
          <span className="sr-only">{u.browser.searchLabel}</span>
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-jisan-ink/40" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={u.browser.searchPlaceholder}
            className="w-full min-w-0 bg-transparent text-[0.9375rem] text-jisan-ink outline-none placeholder:text-jisan-ink/40"
          />
        </label>

        {list.length === 0 ? (
          <p className="mt-6 text-sm text-[#4A505A]">{u.browser.noMatch}</p>
        ) : (
          <div className="mt-6 space-y-6">
            {list.map((g) => (
              <section key={g.id}>
                <h2 className="text-sm font-bold text-jisan-ink">
                  {g.name} <span className="font-normal text-[#8A9099]">{g.crimes.length}</span>
                </h2>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {g.crimes.map((c) => (
                    <li key={c.id} className="min-w-0 max-w-full">
                      <button
                        type="button"
                        onClick={() => pick(g.id, c.id)}
                        className="max-w-full rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-left text-sm text-jisan-ink transition-colors [overflow-wrap:anywhere] hover:border-jisan-ink"
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
        {intl && <OtherCrimes text={u.intl.otherCrimes} link={u.intl.otherCrimesLink} href={intl.consultHref} />}
      </div>
    )
  }

  const summary = groups.find((g) => g.id === gid)

  return (
    <div ref={top} className="min-w-0 scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E9ECF0] pb-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#6B717B]">{summary?.name}</p>
          <h2 className="mt-0.5 text-xl font-bold text-jisan-ink [overflow-wrap:anywhere]">{crime?.name ?? summary?.crimes.find((c) => c.id === cid)?.name ?? summary?.name}</h2>
          {crime?.scope && <p className="mt-0.5 text-xs leading-relaxed text-[#8A9099]">{crime.scope}</p>}
        </div>
        <button
          type="button"
          onClick={() => pick(null, null)}
          className="shrink-0 rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-[#4A505A] hover:border-jisan-ink hover:text-jisan-ink"
        >
          {u.form.pickOther}
        </button>
      </div>

      {group && crime && group.crimes.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={fmt(u.form.subCrimes, { group: group.name })}>
          {group.crimes.map((c) => (
            <li key={c.id} className="min-w-0 max-w-full">
              <button
                type="button"
                aria-pressed={c.id === crime.id}
                onClick={() => c.id !== crime.id && pick(group.id, c.id, false)}
                className={`max-w-full rounded-full border px-3.5 py-1.5 text-left text-[0.8125rem] transition-colors [overflow-wrap:anywhere] ${c.id === crime.id ? "border-jisan-ink bg-jisan-ink text-white" : "border-[#D5DAE1] bg-white text-[#4A505A] hover:border-jisan-ink"}`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!crime ? (
        <p className="mt-6 rounded-xl bg-[#F4F5F7] px-5 py-4 text-[0.9375rem] text-[#4A505A]">
          {status === "error" ? u.form.loadError : u.form.loading}
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-8">
              {/* 1. 유형 */}
              <fieldset>
                <legend className="text-[0.9375rem] font-semibold text-jisan-ink">{u.form.typeTitle}</legend>
                <p className="mt-1 text-sm text-[#6B717B]">{u.form.typeDesc}</p>
                <div className="mt-2.5 space-y-1.5">
                  {crime.types.map((t) => (
                    <label
                      key={t.no}
                      className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#E3E6EB] bg-white px-3.5 py-2.5 text-sm transition-colors hover:border-jisan-ink/40 has-[:checked]:border-jisan-blue has-[:checked]:bg-jisan-blue/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
                    >
                      <input
                        type="radio"
                        name="sent-type"
                        value={t.no}
                        checked={tNo === t.no}
                        onChange={() => setTypeNo(t.no)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-jisan-blue"
                      />
                      <span className="min-w-0 leading-relaxed [overflow-wrap:anywhere]">
                        {crime.types.length > 1 && <span className="font-semibold text-jisan-ink">{fmt(u.form.typeNo, { no: t.no })} </span>}
                        <span className="text-jisan-ink">{t.name}</span>
                        {t.desc && <span className="mt-0.5 block text-xs text-[#6B717B]">{t.desc}</span>}
                        <span className="mt-0.5 block text-xs text-[#8A9099]">{fmt(u.form.typeBasic, { range: rangeShow(t.basic, tx) })}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* 2. 특별양형인자 */}
              <section>
                <h3 className="text-[0.9375rem] font-semibold text-jisan-ink">{u.form.specialTitle}</h3>
                <p className="mt-1 text-sm text-[#6B717B]">{u.form.specialDesc}</p>
                <div className="mt-3 space-y-5">
                  <FactorBlock u={u} title={u.form.specialMitigating} prefix="mit" set={filterSet(crime.special.mitigating, tNo)} picked={special} onToggle={(k) => setSpecial((s) => toggle(s, k))} />
                  <FactorBlock u={u} title={u.form.specialAggravating} prefix="agg" set={filterSet(crime.special.aggravating, tNo)} picked={special} onToggle={(k) => setSpecial((s) => toggle(s, k))} />
                </div>
              </section>

              {/* 3. 일반양형인자 (계산에는 안 씀) */}
              <details className="group rounded-xl border border-[#E3E6EB] bg-[#F7F8FA] px-4 py-3">
                <summary className="cursor-pointer list-none text-[0.9375rem] font-semibold text-jisan-ink">
                  {u.form.generalTitle} <span className="font-normal text-[#8A9099] group-open:hidden">{u.form.generalOpen}</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-[#6B717B]">{u.form.generalDesc}</p>
                <div className="mt-3 space-y-5">
                  <FactorBlock u={u} title={u.form.generalMitigating} prefix="mit" set={filterSet(crime.general.mitigating, tNo)} picked={general} onToggle={(k) => setGeneral((s) => toggle(s, k))} />
                  <FactorBlock u={u} title={u.form.generalAggravating} prefix="agg" set={filterSet(crime.general.aggravating, tNo)} picked={general} onToggle={(k) => setGeneral((s) => toggle(s, k))} />
                </div>
              </details>

              {/* 4. 집행유예 참작사유 (하한 3년 이하일 때만) */}
              {result?.probationOpen && pf && (
                <section>
                  <h3 className="text-[0.9375rem] font-semibold text-jisan-ink">{u.form.probationTitle}</h3>
                  <p className="mt-1 text-sm text-[#6B717B]">{u.form.probationDesc}</p>
                  <div className="mt-3 space-y-4">
                    {probGroups.map((g) => (
                      <CheckGroup key={g.key} title={g.title} items={g.items} checked={prob} onToggle={(k) => setProb((s) => toggle(s, k))} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              {result ? (
                <ResultCard
                  result={result}
                  probation={probation}
                  probationPicked={prob.size > 0}
                  generalCount={{ aggravating: idsOf(general, "agg").length, mitigating: idsOf(general, "mit").length }}
                  single={crime.types.length === 1}
                  notes={[...(crime.notes ?? []), ...(group?.notes ?? [])]}
                  intl={intl}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D5DAE1] px-5 py-8 text-center text-[0.9375rem] text-[#6B717B]">{u.form.resultEmpty}</div>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <RulesGuide intl={intl} />
            <Notes u={u} />
          </div>
        </>
      )}
    </div>
  )
}

/** 감경 또는 가중 한쪽: 행위 / 행위자·기타 */
function FactorBlock({
  u,
  title,
  prefix,
  set,
  picked,
  onToggle,
}: {
  u: SentencingUI
  title: string
  prefix: "agg" | "mit"
  set: FactorSet
  picked: ReadonlySet<string>
  onToggle: (key: string) => void
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-bold text-jisan-ink">{title}</p>
      {set.act.length + set.actor.length === 0 ? (
        <p className="mt-1.5 text-sm text-[#8A9099]">{u.form.noFactors}</p>
      ) : (
        <div className="mt-2 space-y-3">
          <CheckGroup title={u.form.act} items={toItems(prefix, set.act, u)} checked={picked} onToggle={onToggle} />
          <CheckGroup title={u.form.actor} items={toItems(prefix, set.actor, u)} checked={picked} onToggle={onToggle} />
        </div>
      )}
    </div>
  )
}

/** 모든 범죄에 공통인 안내 (경합범, 처단형, 적용 제외) */
function Notes({ u }: { u: SentencingUI }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-jisan-ink">{u.notes.title}</p>
      <ul className="mt-3 space-y-2">
        {u.notes.items.map((n) => (
          <li key={n} className="flex gap-2 rounded-xl bg-[#F7F8FA] px-4 py-3 text-sm leading-relaxed text-[#4A505A]">
            <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[#8A9099]" />
            <span className="min-w-0">{n}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
