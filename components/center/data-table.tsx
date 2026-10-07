import type { Table } from "@/lib/center-pages"

/** 기준표 (처벌 기준, 절차 비교 등). 좁은 화면에서는 표만 옆으로 밀립니다 */
export function DataTable({ table, className = "" }: { table: Table; className?: string }) {
  return (
    <div className={className}>
      <div className="overflow-x-auto rounded-xl border border-[#E2E6ED] bg-white">
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
