"use client"

import { useMemo } from "react"
import type { ConsultRow } from "@/components/admin/shared"
import { PROGRESS, MET, isOpen, channelOf, detailOf, rate, ymd } from "@/components/admin/consult-common"

type Group = { name: string; n: number; met: number; won: number }

/** 이름별로 신청·상담·수임 수 세기 (많은 순) */
function groupBy(rows: ConsultRow[], key: (r: ConsultRow) => string): Group[] {
  const m = new Map<string, Group>()
  for (const r of rows) {
    const k = key(r)
    const g = m.get(k) ?? { name: k, n: 0, met: 0, won: 0 }
    g.n++
    if (MET.includes(r.progress)) g.met++
    if (r.progress === "retained") g.won++
    m.set(k, g)
  }
  return [...m.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name))
}

const day = (s: string) => ymd(new Date(s))
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d)
}
/** 그 주 월요일 */
const monday = (d: Date) => {
  const x = new Date(d)
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return x
}

/** 기간 길이에 따라 일·주·월 단위로 신청 수 (빈 칸도 0으로) */
function series(rows: ConsultRow[], range: { from?: string; to?: string }) {
  const days = rows.map((r) => day(r.created_at)).sort()
  const start = range.from ?? days[0]
  const end = range.to ?? ymd(new Date())
  if (!start) return { unit: "일", bars: [] as { key: string; label: string; n: number }[] }
  const span = (parse(end).getTime() - parse(start).getTime()) / 86400000 + 1
  const unit = span <= 35 ? "일" : span <= 200 ? "주" : "월"
  const keyOf = (d: Date) => (unit === "일" ? ymd(d) : unit === "주" ? ymd(monday(d)) : ymd(d).slice(0, 7))
  const counts = new Map<string, number>()
  for (const s of days) counts.set(keyOf(parse(s)), (counts.get(keyOf(parse(s))) ?? 0) + 1)
  const bars: { key: string; label: string; n: number }[] = []
  const cur = unit === "주" ? monday(parse(start)) : parse(start)
  if (unit === "월") cur.setDate(1)
  for (let i = 0; cur <= parse(end) && i < 400; i++) {
    const k = keyOf(cur)
    const label = unit === "월" ? `${cur.getFullYear() % 100}.${cur.getMonth() + 1}` : `${cur.getMonth() + 1}/${cur.getDate()}`
    bars.push({ key: k, label, n: counts.get(k) ?? 0 })
    if (unit === "일") cur.setDate(cur.getDate() + 1)
    else if (unit === "주") cur.setDate(cur.getDate() + 7)
    else cur.setMonth(cur.getMonth() + 1)
  }
  return { unit, bars }
}

const card = "rounded-2xl bg-white p-5"

/** 상담 신청 통계: 기간별·단계별·경로별·분야별 */
export function ConsultStats({ rows, range }: { rows: ConsultRow[]; range: { from?: string; to?: string } }) {
  const s = useMemo(() => {
    const won = rows.filter((r) => r.progress === "retained").length
    const met = rows.filter((r) => MET.includes(r.progress)).length
    return {
      won,
      met,
      open: rows.filter(isOpen).length,
      byStep: PROGRESS.map((p) => ({ ...p, n: rows.filter((r) => r.progress === p.key).length })),
      time: series(rows, range),
      channels: groupBy(rows, channelOf),
      details: groupBy(rows, detailOf).slice(0, 20),
      types: groupBy(rows, (r) => r.case_type || "고르지 않음"),
      wonFields: groupBy(
        rows.filter((r) => r.progress === "retained"),
        (r) => r.retained_field || r.case_type || "분야 미기록",
      ),
    }
  }, [rows, range])

  if (!rows.length) return <p className="rounded-2xl bg-white p-8 text-center text-sm text-jisan-ink/60">이 기간에 상담 신청이 없습니다.</p>

  const maxT = Math.max(1, ...s.time.bars.map((b) => b.n))
  const maxStep = Math.max(1, ...s.byStep.map((b) => b.n))
  const every = Math.ceil(s.time.bars.length / 12)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {(
          [
            ["신청", `${rows.length}건`],
            ["처리 중", `${s.open}건`],
            ["수임", `${s.won}건`],
            ["수임률 (전체 대비)", rate(s.won, rows.length)],
            ["수임률 (상담 대비)", rate(s.won, s.met)],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className={card}>
            <p className="text-xs text-jisan-ink/60">{k}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </div>

      <section className={card}>
        <h3 className="mb-4 font-bold">기간별 신청 수 <span className="text-sm font-normal text-jisan-ink/50">({s.time.unit} 단위)</span></h3>
        <div className="overflow-x-auto">
          <div className="flex h-44 min-w-full items-end gap-[3px]" style={{ minWidth: s.time.bars.length * 10 }}>
            {s.time.bars.map((b) => (
              <div key={b.key} className="flex h-full min-w-[7px] flex-1 flex-col justify-end" title={`${b.key} · ${b.n}건`}>
                {s.time.bars.length <= 20 && b.n > 0 && <span className="mb-0.5 text-center text-[0.6875rem] tabular-nums text-jisan-ink/60">{b.n}</span>}
                <div className="rounded-t bg-jisan-ink/80" style={{ height: `${(b.n / maxT) * 100}%`, minHeight: b.n ? 2 : 0 }} />
              </div>
            ))}
          </div>
          <div className="mt-1 flex gap-[3px] border-t border-[#E2E6ED] pt-1" style={{ minWidth: s.time.bars.length * 10 }}>
            {s.time.bars.map((b, i) => (
              <span key={b.key} className="min-w-[7px] flex-1 overflow-visible whitespace-nowrap text-[0.6875rem] tabular-nums text-jisan-ink/50">
                {i % every === 0 ? b.label : ""}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={card}>
        <h3 className="mb-4 font-bold">단계별</h3>
        <ul className="space-y-2">
          {s.byStep.map((b) => (
            <li key={b.key} className="grid grid-cols-[5.5rem_1fr_4.5rem] items-center gap-3 text-sm">
              <span>{b.label}</span>
              <span className="h-4 rounded bg-[#F1F3F6]">
                <span className={`block h-full rounded ${b.bar}`} style={{ width: `${(b.n / maxStep) * 100}%` }} />
              </span>
              <span className="text-right tabular-nums">
                {b.n} <span className="text-xs text-jisan-ink/50">{rate(b.n, rows.length)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <RateTable title="신청 경로별" groups={s.channels} />
      <div className="grid gap-5 lg:grid-cols-2">
        <RateTable title="신청 분야별" groups={s.types} />
        <RateTable title="수임 사건 분야" groups={s.wonFields} countOnly />
      </div>
      <RateTable title="세부 출처 (많은 순 20개)" groups={s.details} />
    </div>
  )
}

function RateTable({ title, groups, countOnly = false }: { title: string; groups: Group[]; countOnly?: boolean }) {
  const max = Math.max(1, ...groups.map((g) => g.n))
  return (
    <section className={card}>
      <h3 className="mb-3 font-bold">{title}</h3>
      {groups.length === 0 ? (
        <p className="text-sm text-jisan-ink/50">없음</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] text-sm">
            <thead>
              <tr className="border-b border-[#E2E6ED] text-left text-xs text-jisan-ink/50">
                <th className="py-2 pr-3 font-medium">이름</th>
                <th className="w-[40%] py-2 pr-3 font-medium">{countOnly ? "건수" : "신청"}</th>
                {!countOnly && (
                  <>
                    <th className="py-2 pr-3 text-right font-medium">상담</th>
                    <th className="py-2 pr-3 text-right font-medium">수임</th>
                    <th className="py-2 pr-3 text-right font-medium">수임률</th>
                    <th className="py-2 text-right font-medium">상담 대비</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.name} className="border-b border-[#F1F3F6] last:border-0">
                  <td className="max-w-[16rem] truncate py-2 pr-3" title={g.name}>
                    {g.name}
                  </td>
                  <td className="py-2 pr-3">
                    <span className="flex items-center gap-2">
                      <span className="h-3 flex-1 rounded bg-[#F1F3F6]">
                        <span className="block h-full rounded bg-jisan-ink/70" style={{ width: `${(g.n / max) * 100}%` }} />
                      </span>
                      <span className="w-8 text-right tabular-nums">{g.n}</span>
                    </span>
                  </td>
                  {!countOnly && (
                    <>
                      <td className="py-2 pr-3 text-right tabular-nums">{g.met}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{g.won}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{rate(g.won, g.n)}</td>
                      <td className="py-2 text-right tabular-nums">{rate(g.won, g.met)}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
