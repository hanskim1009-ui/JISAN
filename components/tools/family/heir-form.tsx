"use client"

import type { HeirInput } from "@/lib/tools/family/inheritance"
import { fmt, type CommonText } from "@/lib/tools/i18n-format"
import type koText from "@/content/tools/i18n/ko/inheritance.json"
import { Choice, Panel, Stepper, stepperOpts } from "./fields"

/** 상속분·유류분 계산기가 같이 쓰는 사전 (content/tools/i18n/{언어}/inheritance.json) */
export type InheritanceText = typeof koText

/** 자녀 한 명(또는 형제자매 한 명): 먼저 사망했으면 그 사람의 자녀·배우자가 대신 받음(대습상속) */
export type Branch = { key: number; deceased: boolean; kids: number; spouse: boolean }

export type HeirFormState = {
  spouse: boolean
  children: Branch[]
  ascendants: number
  siblings: Branch[]
  collaterals: number
}

/** 새 줄 (key 는 목록 안에서만 겹치지 않으면 됨 → 서버·브라우저 첫 화면이 같게 고정값) */
const newBranch = (list: Branch[]): Branch => ({ key: list.reduce((m, b) => Math.max(m, b.key), 0) + 1, deceased: false, kids: 0, spouse: false })

export const initialHeirs = (): HeirFormState => ({
  spouse: true,
  children: [
    { key: 1, deceased: false, kids: 0, spouse: false },
    { key: 2, deceased: false, kids: 0, spouse: false },
  ],
  ascendants: 0,
  siblings: [],
  collaterals: 0,
})

/** 상속받을 수 있는 가지인지 (살아 있거나, 대신 받을 사람이 있음) */
const live = (b: Branch) => !b.deceased || b.kids > 0 || b.spouse

/** 화면 입력 → 계산에 넘길 상속인 목록 (이름은 사전 names 로) */
export function toHeirs(s: HeirFormState, n: InheritanceText["names"]): HeirInput[] {
  const out: HeirInput[] = []
  const item = (label: string, i: number) => fmt(n.item, { label, n: i })
  if (s.spouse) out.push({ id: "spouse", name: n.spouse, role: "spouse" })
  const branches = (list: Branch[], role: "descendant" | "sibling", label: string, kidLabel: string) =>
    list.forEach((b, i) => {
      const id = `${role}-${i + 1}`
      const name = item(label, i + 1)
      out.push({ id, name, role, deceased: b.deceased })
      if (!b.deceased) return
      if (b.spouse) out.push({ id: `${id}-sp`, name: fmt(n.spouseOf, { name }), role: "substitutedSpouse", group: id })
      for (let k = 0; k < b.kids; k++) out.push({ id: `${id}-k${k + 1}`, name: fmt(n.kidOf, { name, kid: kidLabel, n: k + 1 }), role: "substituted", group: id })
    })
  branches(s.children, "descendant", n.child, n.grandchild)
  for (let i = 0; i < s.ascendants; i++) out.push({ id: `asc-${i + 1}`, name: item(n.ascendant, i + 1), role: "ascendant" })
  branches(s.siblings, "sibling", n.sibling, n.nephew)
  for (let i = 0; i < s.collaterals; i++) out.push({ id: `col-${i + 1}`, name: item(n.collateral, i + 1), role: "collateral" })
  return out
}

/** 순위에 따라 필요한 칸만 보여 줌: 자녀가 있으면 부모·형제자매는 상속인이 아님 */
export function HeirForm({
  value: s,
  onChange,
  idPrefix,
  t,
  c,
}: {
  value: HeirFormState
  onChange: (s: HeirFormState) => void
  idPrefix: string
  t: InheritanceText
  c: CommonText
}) {
  const h = t.heirs
  const set = (patch: Partial<HeirFormState>) => onChange({ ...s, ...patch })
  const hasDesc = s.children.some(live)
  const hasAsc = !hasDesc && s.ascendants > 0
  const showSiblings = !hasDesc && !hasAsc && !s.spouse
  const showCollaterals = showSiblings && !s.siblings.some(live)
  const yesNo = [
    { value: "y" as const, label: c.words.have },
    { value: "n" as const, label: c.words.none },
  ]

  return (
    <Panel title={h.title} desc={h.desc}>
      <div className="space-y-7">
        <div>
          <p className="text-[0.9375rem] font-semibold text-jisan-ink">{h.spouse}</p>
          <p className="mt-1 text-sm text-[#6B717B]">{h.spouseHelp}</p>
          <div className="mt-2.5">
            <Choice name={`${idPrefix}-spouse`} label={h.spouse} value={s.spouse ? "y" : "n"} onChange={(v) => set({ spouse: v === "y" })} options={yesNo} />
          </div>
        </div>

        <BranchList
          idPrefix={`${idPrefix}-child`}
          title={h.children}
          desc={h.childrenDesc}
          label={h.child}
          kidLabel={h.childKids}
          list={s.children}
          onChange={(children) => set({ children })}
          t={t}
          c={c}
        />

        {hasDesc ? (
          <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">{h.hasDescNote}</p>
        ) : (
          <div>
            <p className="text-[0.9375rem] font-semibold text-jisan-ink">{h.ascendants}</p>
            <p className="mt-1 text-sm text-[#6B717B]">{h.ascendantsDesc}</p>
            <div className="mt-2.5">
              <Stepper label={h.ascendantsCount} value={s.ascendants} max={4} onChange={(ascendants) => set({ ascendants })} {...stepperOpts(c)} />
            </div>
          </div>
        )}

        {!hasDesc && hasAsc && <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">{h.hasAscNote}</p>}
        {!hasDesc && !hasAsc && s.spouse && <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">{h.spouseOnlyNote}</p>}

        {showSiblings && (
          <BranchList
            idPrefix={`${idPrefix}-sib`}
            title={h.siblings}
            desc={h.siblingsDesc}
            label={h.sibling}
            kidLabel={h.siblingKids}
            list={s.siblings}
            onChange={(siblings) => set({ siblings })}
            t={t}
            c={c}
          />
        )}

        {showCollaterals && (
          <div>
            <p className="text-[0.9375rem] font-semibold text-jisan-ink">{h.collaterals}</p>
            <p className="mt-1 text-sm text-[#6B717B]">{h.collateralsDesc}</p>
            <div className="mt-2.5">
              <Stepper label={h.collateralsCount} value={s.collaterals} max={20} onChange={(collaterals) => set({ collaterals })} {...stepperOpts(c)} />
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}

function BranchList({
  idPrefix,
  title,
  desc,
  label,
  kidLabel,
  list,
  onChange,
  t,
  c,
}: {
  idPrefix: string
  title: string
  desc: string
  label: string
  kidLabel: string
  list: Branch[]
  onChange: (list: Branch[]) => void
  t: InheritanceText
  c: CommonText
}) {
  const h = t.heirs
  const update = (key: number, patch: Partial<Branch>) => onChange(list.map((b) => (b.key === key ? { ...b, ...patch } : b)))
  return (
    <div>
      <p className="text-[0.9375rem] font-semibold text-jisan-ink">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#6B717B]">{desc}</p>
      <ul className="mt-3 space-y-2.5">
        {list.map((b, i) => {
          const item = fmt(h.item, { label, n: i + 1 })
          return (
            <li key={b.key} className="rounded-xl border border-[#E9ECF0] bg-[#FAFBFC] p-3.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="min-w-[4.5rem] text-[0.9375rem] font-semibold text-jisan-ink">{item}</span>
                <Choice
                  name={`${idPrefix}-${b.key}`}
                  label={fmt(h.state, { item })}
                  value={b.deceased ? "d" : "a"}
                  onChange={(v) => update(b.key, { deceased: v === "d" })}
                  options={[
                    { value: "a", label: h.alive },
                    { value: "d", label: h.deceased },
                  ]}
                />
                <button
                  type="button"
                  onClick={() => onChange(list.filter((x) => x.key !== b.key))}
                  className="ml-auto text-sm text-[#6B717B] underline underline-offset-2 hover:text-jisan-ink"
                >
                  {c.words.remove}
                </button>
              </div>
              {b.deceased && (
                <div className="mt-3 space-y-3 border-t border-[#E9ECF0] pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-[#4A505A]">{kidLabel}</span>
                    <Stepper label={fmt(h.kidCount, { item })} value={b.kids} max={10} onChange={(kids) => update(b.key, { kids })} {...stepperOpts(c)} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-[#4A505A]">{h.theirSpouse}</span>
                    <Choice
                      name={`${idPrefix}-${b.key}-sp`}
                      label={fmt(h.spouseOf, { item })}
                      value={b.spouse ? "y" : "n"}
                      onChange={(v) => update(b.key, { spouse: v === "y" })}
                      options={[
                        { value: "y", label: c.words.have },
                        { value: "n", label: c.words.none },
                      ]}
                    />
                  </div>
                  {!live(b) && <p className="text-sm text-[#8A6A1F]">{h.lost}</p>}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...list, newBranch(list)])}
        disabled={list.length >= 15}
        className="mt-3 rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-jisan-ink hover:border-jisan-ink disabled:opacity-40"
      >
        {fmt(h.add, { label })}
      </button>
    </div>
  )
}
