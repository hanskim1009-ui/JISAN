"use client"

import { useEffect, useState } from "react"
import { CASE_TYPES } from "@/lib/practice"
import { sb, btnCls, inputCls, showId, today, type ConsultNote, type ConsultRow, type Me } from "@/components/admin/shared"
import { PROGRESS, PROGRESS_OF, isOpen, channelOf, adminName, when, ymd, type AdminLite } from "@/components/admin/consult-common"

const full = (s: string) =>
  new Date(s).toLocaleString("ko-KR", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })

const after = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return ymd(d)
}

/** 상담 신청 펼친 화면: 전체 내용 · 단계·담당·다음 연락일 · 메모와 단계 기록 */
export function ConsultDetail({
  me,
  row: r,
  admins,
  update,
}: {
  me: Me
  row: ConsultRow
  admins: AdminLite[]
  update: (r: ConsultRow, patch: Partial<ConsultRow>) => Promise<void>
}) {
  const [notes, setNotes] = useState<ConsultNote[] | null>(null)
  const [text, setText] = useState("")
  const [busy, setBusy] = useState(false)

  // 단계가 바뀌면(progress_at) 기록을 다시 읽음
  useEffect(() => {
    sb()
      .from("consultation_notes")
      .select("*")
      .eq("consultation_id", r.id)
      .order("created_at")
      .then(({ data }) => setNotes((data as ConsultNote[]) ?? []))
  }, [r.id, r.progress_at])

  const addNote = async () => {
    const body = text.trim()
    if (!body) return
    setBusy(true)
    const { data, error } = await sb()
      .from("consultation_notes")
      .insert({ consultation_id: r.id, author: me.id, author_name: me.name || showId(me.email), body })
      .select("*")
      .single()
    setBusy(false)
    if (error || !data) return alert(`메모를 저장하지 못했습니다: ${error?.message ?? ""}`)
    setNotes((n) => [...(n ?? []), data as ConsultNote])
    setText("")
  }

  const removeNote = async (n: ConsultNote) => {
    if (!confirm("이 메모를 지울까요?")) return
    const { error } = await sb().from("consultation_notes").delete().eq("id", n.id)
    if (error) return alert(`지우지 못했습니다: ${error.message}`)
    setNotes((l) => l?.filter((x) => x.id !== n.id) ?? null)
  }

  const fields = r.retained_field && !CASE_TYPES.includes(r.retained_field) ? [r.retained_field, ...CASE_TYPES] : CASE_TYPES
  const label = "w-20 shrink-0 text-jisan-ink/50"

  return (
    <div className="grid gap-6 border-t border-[#E2E6ED] bg-[#FAFBFC] px-5 py-5 text-[0.9375rem] md:grid-cols-2">
      {/* 신청 내용 */}
      <div className="min-w-0 space-y-2">
        <p>
          <a href={`tel:${r.phone}`} className="font-semibold text-[#1F4E8C] underline underline-offset-4">
            {r.phone} 전화 걸기
          </a>
        </p>
        <dl className="space-y-1.5">
          {(
            [
              ["신청 시각", full(r.created_at)],
              ["분야", r.case_type],
              ["사건 진행", r.stage],
              ["걱정되는 점", r.concern],
              ["경로", `${channelOf(r)}${r.source && r.source !== channelOf(r) ? ` (${r.source})` : ""}`],
              ["페이지", r.page],
            ] as [string, string | null][]
          )
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className={label}>{k}</dt>
                <dd className="min-w-0 break-words">{v}</dd>
              </div>
            ))}
        </dl>
        {r.message && <p className="whitespace-pre-line rounded-lg bg-white p-3 leading-relaxed">{r.message}</p>}
        {r.memo && (
          <p className="whitespace-pre-line rounded-lg border border-dashed border-[#D5DAE1] p-3 text-sm text-jisan-ink/70">
            <span className="font-semibold">이전 메모 </span>
            {r.memo}
          </p>
        )}
      </div>

      {/* 처리 */}
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {PROGRESS.map((p) => (
            <button
              key={p.key}
              onClick={() => r.progress !== p.key && update(r, { progress: p.key })}
              className={`${btnCls} px-3 py-1.5 ${r.progress === p.key ? "bg-jisan-ink text-white" : "border border-[#D5DAE1] bg-white"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-jisan-ink/60">담당자</span>
            <select className={inputCls} value={r.assignee ?? ""} onChange={(e) => update(r, { assignee: e.target.value || null })}>
              <option value="">미지정</option>
              {admins.map((a) => (
                <option key={a.user_id} value={a.user_id}>
                  {adminName(a)}
                  {a.user_id === me.id ? " (나)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-jisan-ink/60">다음 연락일</span>
            <input
              type="date"
              className={`${inputCls} ${isOpen(r) && r.next_contact_on && r.next_contact_on < today() ? "border-red-400 text-red-700" : ""}`}
              value={r.next_contact_on ?? ""}
              onChange={(e) => update(r, { next_contact_on: e.target.value || null })}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {(
            [
              ["내일", 1],
              ["3일 뒤", 3],
              ["1주 뒤", 7],
            ] as const
          ).map(([k, n]) => (
            <button key={k} onClick={() => update(r, { next_contact_on: after(n) })} className="rounded-md border border-[#D5DAE1] bg-white px-2 py-1">
              {k}
            </button>
          ))}
          {r.next_contact_on && (
            <button onClick={() => update(r, { next_contact_on: null })} className="rounded-md px-2 py-1 text-jisan-ink/60 underline underline-offset-2">
              연락일 지우기
            </button>
          )}
        </div>
        {r.progress === "retained" && (
          <label className="block text-sm">
            <span className="mb-1 block text-jisan-ink/60">수임 사건 분야</span>
            <select className={inputCls} value={r.retained_field ?? ""} onChange={(e) => update(r, { retained_field: e.target.value || null })}>
              <option value="">고르기</option>
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* 기록 */}
        <div>
          <p className="mb-2 text-sm font-semibold">기록</p>
          <ol className="space-y-2 border-l-2 border-[#E2E6ED] pl-4 text-sm">
            <li>
              <span className="tabular-nums text-jisan-ink/50">{when(r.created_at)}</span> 신청 접수
            </li>
            {notes === null ? (
              <li className="text-jisan-ink/50">불러오는 중…</li>
            ) : (
              notes.map((n) => (
                <li key={n.id} className="group">
                  <span className="tabular-nums text-jisan-ink/50">{when(n.created_at)}</span>{" "}
                  <span className="font-semibold">{n.author_name || "관리자"}</span>{" "}
                  {n.kind === "progress" ? (
                    <span className="text-jisan-ink/70">
                      {PROGRESS_OF[n.from_progress!]?.label ?? n.from_progress} → <b>{PROGRESS_OF[n.to_progress!]?.label ?? n.to_progress}</b>
                      {n.body && ` · ${n.body}`}
                    </span>
                  ) : (
                    <>
                      <span className="whitespace-pre-line">{n.body}</span>
                      {n.author === me.id && (
                        <button onClick={() => removeNote(n)} className="ml-2 text-xs text-jisan-ink/40 underline underline-offset-2 hover:text-red-700">
                          지우기
                        </button>
                      )}
                    </>
                  )}
                </li>
              ))
            )}
          </ol>
          <div className="mt-3 flex gap-2">
            <textarea
              className={inputCls}
              rows={2}
              maxLength={2000}
              placeholder="메모 (통화 내용, 약속한 것 등)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) addNote()
              }}
            />
            <button onClick={addNote} disabled={busy || !text.trim()} className={`${btnCls} shrink-0 self-end bg-jisan-ink text-white`}>
              남기기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
