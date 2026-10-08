"use client"

import { useEffect, useState } from "react"
import { sb, btnCls, inputCls, type ConsultRow, type Me } from "@/components/admin/shared"

const STATUS: Record<ConsultRow["status"], [string, string]> = {
  new: ["새 신청", "bg-red-100 text-red-700"],
  contacted: ["연락함", "bg-amber-100 text-amber-800"],
  done: ["끝남", "bg-[#EEF0F3] text-jisan-ink/60"],
}

const when = (s: string) =>
  new Date(s).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })

/** 상담 신청 목록: 최근 것부터, 상태·메모 관리 */
export function ConsultList({ me }: { me: Me }) {
  const [rows, setRows] = useState<ConsultRow[] | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [only, setOnly] = useState<"open" | "all">("open")

  const load = () =>
    sb()
      .from("consultations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300)
      .then(({ data }) => setRows((data as ConsultRow[]) ?? []))

  useEffect(() => {
    load()
  }, [])

  const update = async (id: string, patch: Partial<ConsultRow>) => {
    await sb().from("consultations").update({ ...patch, handled_by: me.id }).eq("id", id)
    setRows((r) => r?.map((x) => (x.id === id ? { ...x, ...patch } : x)) ?? null)
  }

  const shown = (rows ?? []).filter((r) => only === "all" || r.status !== "done")

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button onClick={() => setOnly("open")} className={`${btnCls} ${only === "open" ? "bg-jisan-ink text-white" : "border border-[#D5DAE1] bg-white"}`}>
          처리 중 {(rows ?? []).filter((r) => r.status !== "done").length}
        </button>
        <button onClick={() => setOnly("all")} className={`${btnCls} ${only === "all" ? "bg-jisan-ink text-white" : "border border-[#D5DAE1] bg-white"}`}>
          전체
        </button>
        <button onClick={load} className={`${btnCls} ml-auto border border-[#D5DAE1] bg-white`}>
          새로고침
        </button>
      </div>
      {rows === null ? (
        <p className="text-sm text-jisan-ink/60">불러오는 중…</p>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-jisan-ink/60">상담 신청이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-[#E2E6ED] overflow-hidden rounded-2xl bg-white">
          {shown.map((r) => (
            <li key={r.id}>
              <button onClick={() => setOpen(open === r.id ? null : r.id)} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-5 py-4 text-left hover:bg-[#F7F8FA]">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[r.status][1]}`}>{STATUS[r.status][0]}</span>
                <span className="font-semibold">{r.name}</span>
                <span className="text-sm tabular-nums">{r.phone}</span>
                <span className="text-xs text-jisan-ink/50">
                  {[r.case_type, r.source].filter(Boolean).join(" · ")}
                </span>
                <span className="ml-auto text-xs tabular-nums text-jisan-ink/50">{when(r.created_at)}</span>
              </button>
              {open === r.id && (
                <div className="space-y-3 border-t border-[#E2E6ED] bg-[#FAFBFC] px-5 py-4 text-[0.9375rem]">
                  <p>
                    <a href={`tel:${r.phone}`} className="font-semibold text-[#1F4E8C] underline underline-offset-4">
                      {r.phone} 전화 걸기
                    </a>
                  </p>
                  {r.stage && <p><span className="text-jisan-ink/50">단계 </span>{r.stage}</p>}
                  {r.concern && <p><span className="text-jisan-ink/50">걱정되는 점 </span>{r.concern}</p>}
                  {r.message && <p className="whitespace-pre-line">{r.message}</p>}
                  {r.page && <p className="text-xs text-jisan-ink/50">신청한 페이지: {r.page}</p>}
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(STATUS) as ConsultRow["status"][]).map((s) => (
                      <button key={s} onClick={() => update(r.id, { status: s })} className={`${btnCls} ${r.status === s ? "bg-jisan-ink text-white" : "border border-[#D5DAE1] bg-white"}`}>
                        {STATUS[s][0]}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className={inputCls}
                    rows={2}
                    placeholder="메모 (누가 언제 연락했는지 등)"
                    defaultValue={r.memo ?? ""}
                    onBlur={(e) => e.target.value !== (r.memo ?? "") && update(r.id, { memo: e.target.value })}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
