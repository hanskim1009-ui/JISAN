"use client"

/** 체크 항목 하나 */
export type CheckItem = { key: string; label: string; desc?: string; badge?: string }

/** 세로로 쌓는 체크 목록 (양형인자, 집행유예 참작사유) */
export function CheckList({ items, checked, onToggle }: { items: CheckItem[]; checked: ReadonlySet<string>; onToggle: (key: string) => void }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => (
        <li key={it.key}>
          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#E3E6EB] bg-white px-3.5 py-2.5 text-sm transition-colors hover:border-jisan-ink/40 has-[:checked]:border-jisan-blue has-[:checked]:bg-jisan-blue/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
            <input
              type="checkbox"
              checked={checked.has(it.key)}
              onChange={() => onToggle(it.key)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#C9CFD8] accent-jisan-blue"
            />
            <span className="min-w-0 leading-relaxed [overflow-wrap:anywhere]">
              <span className="text-jisan-ink">{it.label}</span>
              {it.badge && (
                <span className="ml-1.5 inline-block rounded-full bg-brand-accent/10 px-2 py-px align-[0.1em] text-[0.6875rem] font-semibold text-brand-accent">{it.badge}</span>
              )}
              {it.desc && <span className="mt-0.5 block text-xs text-[#6B717B]">{it.desc}</span>}
            </span>
          </label>
        </li>
      ))}
    </ul>
  )
}

/** 작은 제목 + 목록. 항목이 없으면 그리지 않음 */
export function CheckGroup({
  title,
  items,
  checked,
  onToggle,
}: {
  title: string
  items: CheckItem[]
  checked: ReadonlySet<string>
  onToggle: (key: string) => void
}) {
  if (items.length === 0) return null
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-semibold text-[#6B717B]">{title}</p>
      <CheckList items={items} checked={checked} onToggle={onToggle} />
    </div>
  )
}
