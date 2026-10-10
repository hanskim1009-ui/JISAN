"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { CASE_TYPES } from "@/lib/practice"
import { sb, btnCls, inputCls, today, type ConsultProgress, type ConsultRow, type Me } from "@/components/admin/shared"
import { PROGRESS, PROGRESS_OF, CLOSED, isOpen, overdue, channelOf, adminName, when, ymd, type AdminLite } from "@/components/admin/consult-common"
import { ConsultDetail } from "@/components/admin/consult-detail"
import { ConsultStats } from "@/components/admin/consult-stats"

type Period = "7" | "30" | "90" | "year" | "all" | "custom"
const PERIODS: [Period, string][] = [
  ["7", "최근 7일"],
  ["30", "최근 30일"],
  ["90", "최근 90일"],
  ["year", "올해"],
  ["all", "전체"],
  ["custom", "직접 고르기"],
]
/** 한 번에 불러오는 최대 건수 */
const LIMIT = 3000

/** 기간 → 시작·끝 날짜 (YYYY-MM-DD, 끝 날짜 포함) */
function rangeOf(p: Period, from: string, to: string): { from?: string; to?: string } {
  const d = new Date()
  if (p === "all") return {}
  if (p === "custom") return { from: from || undefined, to: to || undefined }
  if (p === "year") return { from: `${d.getFullYear()}-01-01` }
  d.setDate(d.getDate() - (Number(p) - 1))
  return { from: ymd(d) }
}
const startOf = (s: string) => {
  const [y, m, dd] = s.split("-").map(Number)
  return new Date(y, m - 1, dd)
}

/** 상담 신청 관리: 목록(단계·메모) / 통계 */
export function ConsultList({ me }: { me: Me }) {
  const [view, setView] = useState<"list" | "stats">("list")
  const [period, setPeriod] = useState<Period>("90")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [rows, setRows] = useState<ConsultRow[] | null>(null)
  /** 기간 밖이지만 다음 연락일이 지난 처리 중 건 (목록에만 함께 보임) */
  const [late, setLate] = useState<ConsultRow[]>([])
  const [admins, setAdmins] = useState<AdminLite[]>([])
  const [error, setError] = useState("")
  const range = useMemo(() => rangeOf(period, from, to), [period, from, to])

  const load = useCallback(async () => {
    setError("")
    let q = sb().from("consultations").select("*").order("created_at", { ascending: false }).limit(LIMIT)
    if (range.from) q = q.gte("created_at", startOf(range.from).toISOString())
    if (range.to) {
      const end = startOf(range.to)
      end.setDate(end.getDate() + 1)
      q = q.lt("created_at", end.toISOString())
    }
    const lateQ = sb()
      .from("consultations")
      .select("*")
      .lt("next_contact_on", today())
      .not("progress", "in", `(${CLOSED.join(",")})`)
      .order("next_contact_on")
      .limit(500)
    const [main, lt] = await Promise.all([q, lateQ])
    if (main.error) setError(main.error.message)
    setRows((main.data as ConsultRow[]) ?? [])
    setLate((lt.data as ConsultRow[]) ?? [])
  }, [range])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    sb()
      .from("admins")
      .select("user_id,email,name")
      .order("created_at")
      .then(({ data }) => setAdmins((data as AdminLite[]) ?? []))
  }, [])

  /** 단계·담당자 등 바꾸기. 단계를 바꾸면 DB가 기록을 남기고 status를 맞춤 */
  const update = useCallback(
    async (r: ConsultRow, patch: Partial<ConsultRow>) => {
      const full: Partial<ConsultRow> = { ...patch, handled_by: me.id }
      if (patch.progress && patch.progress !== r.progress) {
        if (!r.assignee && !("assignee" in patch)) full.assignee = me.id
        if (patch.progress === "retained" && !r.retained_field && !("retained_field" in patch))
          full.retained_field = r.case_type && CASE_TYPES.includes(r.case_type) ? r.case_type : null
      }
      const { data, error } = await sb().from("consultations").update(full).eq("id", r.id).select("*").single()
      if (error || !data) {
        alert(`저장하지 못했습니다: ${error?.message ?? ""}`)
        return
      }
      const swap = (list: ConsultRow[]) => list.map((x) => (x.id === r.id ? (data as ConsultRow) : x))
      setRows((l) => (l ? swap(l) : l))
      setLate((l) => swap(l))
    },
    [me.id],
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-[#D5DAE1] bg-white p-0.5">
          {(
            [
              ["list", "목록"],
              ["stats", "통계"],
            ] as const
          ).map(([k, label]) => (
            <button key={k} onClick={() => setView(k)} className={`${btnCls} py-1.5 ${view === k ? "bg-jisan-ink text-white" : "text-jisan-ink/70"}`}>
              {label}
            </button>
          ))}
        </div>
        <select className={`${inputCls} w-auto py-1.5`} value={period} onChange={(e) => setPeriod(e.target.value as Period)} aria-label="기간">
          {PERIODS.map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        {period === "custom" && (
          <span className="flex items-center gap-1 text-sm">
            <input type="date" className={`${inputCls} w-auto py-1.5`} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="시작일" />~
            <input type="date" className={`${inputCls} w-auto py-1.5`} value={to} onChange={(e) => setTo(e.target.value)} aria-label="종료일" />
          </span>
        )}
        <button onClick={load} className={`${btnCls} ml-auto border border-[#D5DAE1] bg-white`}>
          새로고침
        </button>
      </div>
      {error && <p className="mb-3 text-sm text-red-700">불러오지 못했습니다: {error}</p>}
      {rows?.length === LIMIT && <p className="mb-3 text-sm text-amber-800">최근 {LIMIT}건까지만 불러왔습니다. 기간을 좁혀 주세요.</p>}
      {rows === null ? (
        <p className="text-sm text-jisan-ink/60">불러오는 중…</p>
      ) : view === "list" ? (
        <ConsultRows me={me} rows={rows} late={late} admins={admins} update={update} />
      ) : (
        <ConsultStats rows={rows} range={range} />
      )}
    </div>
  )
}

type Tab = "open" | "all" | "late" | ConsultProgress

function ConsultRows({
  me,
  rows,
  late,
  admins,
  update,
}: {
  me: Me
  rows: ConsultRow[]
  late: ConsultRow[]
  admins: AdminLite[]
  update: (r: ConsultRow, patch: Partial<ConsultRow>) => Promise<void>
}) {
  const [tab, setTab] = useState<Tab>("open")
  const [q, setQ] = useState("")
  const [who, setWho] = useState<"all" | "me" | "none">("all")
  const [open, setOpen] = useState<string | null>(null)
  const now = today()
  const byId = useMemo(() => new Map(admins.map((a) => [a.user_id, a])), [admins])

  // 기간 안 신청 + 기간 밖이어도 연락일 지난 건
  const all = useMemo(() => {
    const ids = new Set(rows.map((r) => r.id))
    return [...rows, ...late.filter((r) => !ids.has(r.id))]
  }, [rows, late])

  const filtered = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return all.filter((r) => {
      if (who === "me" && r.assignee !== me.id) return false
      if (who === "none" && r.assignee) return false
      if (!words.length) return true
      const hay = [r.name, r.phone, r.case_type, r.stage, r.concern, r.message, r.source, r.memo].join(" ").toLowerCase()
      const digits = (r.phone ?? "").replace(/\D/g, "")
      return words.every((w) => hay.includes(w) || (/^[\d-]+$/.test(w) && digits.includes(w.replace(/\D/g, ""))))
    })
  }, [all, q, who, me.id])

  const count = (t: Tab) => filtered.filter((r) => match(r, t)).length
  function match(r: ConsultRow, t: Tab) {
    if (t === "all") return true
    if (t === "open") return isOpen(r)
    if (t === "late") return overdue(r, now)
    return r.progress === t
  }

  const shown = filtered
    .filter((r) => match(r, tab))
    .sort((a, b) => {
      // 연락일 지난 건을 맨 위로
      const la = overdue(a, now) ? 0 : 1
      const lb = overdue(b, now) ? 0 : 1
      return la - lb || b.created_at.localeCompare(a.created_at)
    })

  const tabs: [Tab, string][] = [["open", "처리 중"], ["late", "연락일 지남"], ...PROGRESS.map((p) => [p.key, p.label] as [Tab, string]), ["all", "전체"]]

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {tabs.map(([k, label]) => {
          const n = count(k)
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`${btnCls} px-3 py-1.5 ${
                tab === k ? "bg-jisan-ink text-white" : k === "late" && n ? "border border-red-200 bg-red-50 text-red-700" : "border border-[#D5DAE1] bg-white"
              }`}
            >
              {label} <span className="tabular-nums opacity-70">{n}</span>
            </button>
          )
        })}
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        <input className={`${inputCls} max-w-sm flex-1`} placeholder="이름·연락처·내용 검색" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} w-auto`} value={who} onChange={(e) => setWho(e.target.value as typeof who)} aria-label="담당자">
          <option value="all">담당 전체</option>
          <option value="me">내 담당</option>
          <option value="none">담당 미지정</option>
        </select>
      </div>
      {shown.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-jisan-ink/60">해당하는 상담 신청이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-[#E2E6ED] overflow-hidden rounded-2xl bg-white">
          {shown.map((r) => {
            const lateRow = overdue(r, now)
            const p = PROGRESS_OF[r.progress] ?? PROGRESS[0]
            return (
              <li key={r.id} className={lateRow ? "border-l-4 border-red-400 bg-red-50/50" : ""}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3.5 hover:bg-[#F7F8FA]">
                  <select
                    value={r.progress}
                    onChange={(e) => update(r, { progress: e.target.value as ConsultProgress })}
                    className={`cursor-pointer rounded-full border-0 px-2 py-1 text-xs font-semibold outline-none ${p.cls}`}
                    aria-label={`${r.name} 처리 단계`}
                  >
                    {PROGRESS.map((x) => (
                      <option key={x.key} value={x.key}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setOpen(open === r.id ? null : r.id)}
                    aria-expanded={open === r.id}
                    className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left"
                  >
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-sm tabular-nums">{r.phone}</span>
                    <span className="text-xs text-jisan-ink/50">
                      {[r.progress === "retained" ? r.retained_field ?? r.case_type : r.case_type, channelOf(r)].filter(Boolean).join(" · ")}
                    </span>
                    {r.assignee && <span className="rounded bg-[#EEF0F3] px-1.5 py-0.5 text-xs text-jisan-ink/70">{adminName(byId.get(r.assignee)) || "담당"}</span>}
                    {r.next_contact_on && isOpen(r) && (
                      <span className={`text-xs tabular-nums ${lateRow ? "font-semibold text-red-700" : "text-jisan-ink/60"}`}>
                        다음 연락 {r.next_contact_on.slice(5).replace("-", "/")}
                        {lateRow && " 지남"}
                      </span>
                    )}
                    <span className="ml-auto text-xs tabular-nums text-jisan-ink/50">{when(r.created_at)}</span>
                  </button>
                </div>
                {open === r.id && <ConsultDetail me={me} row={r} admins={admins} update={update} />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
