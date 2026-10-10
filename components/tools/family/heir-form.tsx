"use client"

import type { HeirInput } from "@/lib/tools/family/inheritance"
import { Choice, Panel, Stepper } from "./fields"

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

/** 화면 입력 → 계산에 넘길 상속인 목록 */
export function toHeirs(s: HeirFormState): HeirInput[] {
  const out: HeirInput[] = []
  if (s.spouse) out.push({ id: "spouse", name: "배우자", role: "spouse" })
  const branches = (list: Branch[], role: "descendant" | "sibling", label: string, kidLabel: string) =>
    list.forEach((b, i) => {
      const id = `${role}-${i + 1}`
      const name = `${label} ${i + 1}`
      out.push({ id, name, role, deceased: b.deceased })
      if (!b.deceased) return
      if (b.spouse) out.push({ id: `${id}-sp`, name: `${name}의 배우자`, role: "substitutedSpouse", group: id })
      for (let k = 0; k < b.kids; k++) out.push({ id: `${id}-k${k + 1}`, name: `${name}의 ${kidLabel} ${k + 1}`, role: "substituted", group: id })
    })
  branches(s.children, "descendant", "자녀", "자녀")
  for (let i = 0; i < s.ascendants; i++) out.push({ id: `asc-${i + 1}`, name: `직계존속 ${i + 1}`, role: "ascendant" })
  branches(s.siblings, "sibling", "형제자매", "자녀(조카)")
  for (let i = 0; i < s.collaterals; i++) out.push({ id: `col-${i + 1}`, name: `방계혈족 ${i + 1}`, role: "collateral" })
  return out
}

/** 순위에 따라 필요한 칸만 보여 줌: 자녀가 있으면 부모·형제자매는 상속인이 아님 */
export function HeirForm({ value: s, onChange, idPrefix }: { value: HeirFormState; onChange: (s: HeirFormState) => void; idPrefix: string }) {
  const set = (patch: Partial<HeirFormState>) => onChange({ ...s, ...patch })
  const hasDesc = s.children.some(live)
  const hasAsc = !hasDesc && s.ascendants > 0
  const showSiblings = !hasDesc && !hasAsc && !s.spouse
  const showCollaterals = showSiblings && !s.siblings.some(live)

  return (
    <Panel title="상속인" desc="돌아가신 분(피상속인)을 기준으로, 돌아가신 날 살아 있던 가족을 입력하세요.">
      <div className="space-y-7">
        <div>
          <p className="text-[0.9375rem] font-semibold text-jisan-ink">배우자</p>
          <p className="mt-1 text-sm text-[#6B717B]">혼인신고를 한 배우자만 해당합니다. 이혼한 배우자나 사실혼 배우자는 상속인이 아닙니다.</p>
          <div className="mt-2.5">
            <Choice
              name={`${idPrefix}-spouse`}
              label="배우자"
              value={s.spouse ? "y" : "n"}
              onChange={(v) => set({ spouse: v === "y" })}
              options={[
                { value: "y", label: "있음" },
                { value: "n", label: "없음" },
              ]}
            />
          </div>
        </div>

        <BranchList
          idPrefix={`${idPrefix}-child`}
          title="자녀"
          desc="입양한 자녀, 혼인 밖에서 태어나 인지된 자녀도 같습니다. 돌아가시기 전에 먼저 사망한 자녀가 있으면 '먼저 사망'을 고르고 그 자녀의 자녀·배우자를 넣으세요."
          label="자녀"
          kidLabel="그 자녀의 자녀(손자녀)"
          list={s.children}
          onChange={(children) => set({ children })}
        />

        {hasDesc ? (
          <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">
            자녀(또는 대신 받는 손자녀)가 있으면 부모·형제자매는 상속인이 되지 않습니다.
          </p>
        ) : (
          <div>
            <p className="text-[0.9375rem] font-semibold text-jisan-ink">직계존속 (부모·조부모)</p>
            <p className="mt-1 text-sm text-[#6B717B]">
              자녀가 없을 때 상속인이 됩니다. 가장 가까운 촌수만 셉니다. 부모 중 한 분이라도 살아 계시면 부모만, 두 분 모두 안 계시면 조부모를 넣으세요.
            </p>
            <div className="mt-2.5">
              <Stepper label="직계존속 수" value={s.ascendants} max={4} onChange={(ascendants) => set({ ascendants })} />
            </div>
          </div>
        )}

        {!hasDesc && hasAsc && (
          <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">부모(직계존속)가 있으면 형제자매는 상속인이 되지 않습니다.</p>
        )}
        {!hasDesc && !hasAsc && s.spouse && (
          <p className="rounded-xl bg-[#F4F5F7] px-4 py-3 text-sm text-[#4A505A]">
            자녀와 부모가 없으면 배우자가 혼자 상속합니다. 형제자매는 상속인이 되지 않습니다.
          </p>
        )}

        {showSiblings && (
          <BranchList
            idPrefix={`${idPrefix}-sib`}
            title="형제자매"
            desc="자녀·부모·배우자가 모두 없을 때 상속인이 됩니다. 먼저 사망한 형제자매가 있으면 그 사람의 자녀(조카)·배우자가 대신 받습니다."
            label="형제자매"
            kidLabel="그 형제자매의 자녀(조카)"
            list={s.siblings}
            onChange={(siblings) => set({ siblings })}
          />
        )}

        {showCollaterals && (
          <div>
            <p className="text-[0.9375rem] font-semibold text-jisan-ink">4촌 이내 방계혈족</p>
            <p className="mt-1 text-sm text-[#6B717B]">
              위의 사람이 아무도 없을 때 상속인이 됩니다. 삼촌·고모·이모(3촌), 사촌(4촌)처럼 같은 조상에서 갈라져 나온 친족 가운데 가장 가까운 촌수의 사람 수를 넣으세요.
            </p>
            <div className="mt-2.5">
              <Stepper label="방계혈족 수" value={s.collaterals} max={20} onChange={(collaterals) => set({ collaterals })} />
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
}: {
  idPrefix: string
  title: string
  desc: string
  label: string
  kidLabel: string
  list: Branch[]
  onChange: (list: Branch[]) => void
}) {
  const update = (key: number, patch: Partial<Branch>) => onChange(list.map((b) => (b.key === key ? { ...b, ...patch } : b)))
  return (
    <div>
      <p className="text-[0.9375rem] font-semibold text-jisan-ink">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#6B717B]">{desc}</p>
      <ul className="mt-3 space-y-2.5">
        {list.map((b, i) => (
          <li key={b.key} className="rounded-xl border border-[#E9ECF0] bg-[#FAFBFC] p-3.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="min-w-[4.5rem] text-[0.9375rem] font-semibold text-jisan-ink">
                {label} {i + 1}
              </span>
              <Choice
                name={`${idPrefix}-${b.key}`}
                label={`${label} ${i + 1} 상태`}
                value={b.deceased ? "d" : "a"}
                onChange={(v) => update(b.key, { deceased: v === "d" })}
                options={[
                  { value: "a", label: "살아 있음" },
                  { value: "d", label: "먼저 사망" },
                ]}
              />
              <button
                type="button"
                onClick={() => onChange(list.filter((x) => x.key !== b.key))}
                className="ml-auto text-sm text-[#6B717B] underline underline-offset-2 hover:text-jisan-ink"
              >
                빼기
              </button>
            </div>
            {b.deceased && (
              <div className="mt-3 space-y-3 border-t border-[#E9ECF0] pt-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-[#4A505A]">{kidLabel}</span>
                  <Stepper label={`${label} ${i + 1}의 자녀 수`} value={b.kids} max={10} onChange={(kids) => update(b.key, { kids })} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-[#4A505A]">그 사람의 배우자</span>
                  <Choice
                    name={`${idPrefix}-${b.key}-sp`}
                    label={`${label} ${i + 1}의 배우자`}
                    value={b.spouse ? "y" : "n"}
                    onChange={(v) => update(b.key, { spouse: v === "y" })}
                    options={[
                      { value: "y", label: "있음" },
                      { value: "n", label: "없음" },
                    ]}
                  />
                </div>
                {!live(b) && <p className="text-sm text-[#8A6A1F]">대신 받을 사람이 없으면 이 몫은 다른 상속인에게 돌아갑니다.</p>}
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...list, newBranch(list)])}
        disabled={list.length >= 15}
        className="mt-3 rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-jisan-ink hover:border-jisan-ink disabled:opacity-40"
      >
        + {label} 추가
      </button>
    </div>
  )
}
