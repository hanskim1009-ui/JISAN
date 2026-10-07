import type { Table } from "@/lib/center-pages"

/** 기준표 (처벌 기준, 절차 비교 등). 모바일에서는 줄마다 카드로 풀어 보여 줍니다 */
export function DataTable({ table, className = "" }: { table: Table; className?: string }) {
  return (
    <div className={className}>
      <ul className="space-y-2.5 md:hidden">
        {table.rows.map((r) => (
          <li key={r.join("|")} className="rounded-xl border border-[#E2E6ED] bg-white p-4">
            <p className="font-semibold leading-snug text-jisan-ink">{r[0]}</p>
            <dl className="mt-2 space-y-1.5 text-sm leading-relaxed">
              {r.slice(1).map((cell, i) => (
                <div key={i} className="flex gap-3">
                  <dt className="w-16 shrink-0 text-xs leading-[1.75] text-jisan-ink/50">{table.columns[i + 1]}</dt>
                  <dd className="min-w-0 text-jisan-ink/85">{cell}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto rounded-xl border border-[#E2E6ED] bg-white md:block">
        <table className="w-full min-w-[35rem] text-left text-sm">
          <thead className="bg-jisan-mist/60 text-xs text-jisan-ink/60">
            <tr>
              {table.columns.map((c) => (
                <th key={c} className="px-4 py-3 font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6ED] text-jisan-ink">
            {table.rows.map((r) => (
              <tr key={r.join("|")}>
                {r.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-4 py-3.5 align-top leading-relaxed ${
                      i === 0 ? "font-semibold" : i === r.length - 1 && r.length > 2 ? "text-jisan-ink/70" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{table.note}</p>}
    </div>
  )
}
