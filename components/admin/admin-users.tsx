"use client"

import { useEffect, useState } from "react"
import { sb, btnCls, inputCls, type Me } from "@/components/admin/shared"

type Admin = { user_id: string; email: string; name: string; role: "writer" | "approver" }
type Invite = { email: string; name: string; role: "writer" | "approver" }

const ROLE = { writer: "글쓴이", approver: "승인자" }

/** 승인자 전용: 관리자 초대·권한 바꾸기 */
export function AdminUsers({ me }: { me: Me }) {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<Invite["role"]>("writer")
  const [msg, setMsg] = useState("")

  const load = async () => {
    const [a, i] = await Promise.all([sb().from("admins").select("*").order("created_at"), sb().from("admin_invites").select("*").order("created_at")])
    setAdmins((a.data as Admin[]) ?? [])
    setInvites((i.data as Invite[]) ?? [])
  }
  useEffect(() => {
    load()
  }, [])

  const joined = new Set(admins.map((a) => a.email))

  return (
    <div className="max-w-3xl space-y-8">
      <section className="rounded-2xl bg-white p-6">
        <p className="font-bold">관리자</p>
        <ul className="mt-3 divide-y divide-[#E2E6ED]">
          {admins.map((a) => (
            <li key={a.user_id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="font-semibold">{a.name || "이름 없음"}</span>
              <span className="text-sm text-jisan-ink/60">{a.email}</span>
              <select
                className="ml-auto rounded border border-[#D5DAE1] px-2 py-1 text-sm"
                value={a.role}
                disabled={a.user_id === me.id}
                onChange={async (e) => {
                  await sb().from("admins").update({ role: e.target.value }).eq("user_id", a.user_id)
                  load()
                }}
              >
                <option value="writer">글쓴이</option>
                <option value="approver">승인자</option>
              </select>
              {a.user_id !== me.id && (
                <button
                  className="text-sm text-red-700"
                  onClick={async () => {
                    if (!confirm(`${a.email} 의 관리 권한을 뺄까요?`)) return
                    await sb().from("admins").delete().eq("user_id", a.user_id)
                    await sb().from("admin_invites").delete().eq("email", a.email)
                    load()
                  }}
                >
                  권한 빼기
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-6">
        <p className="font-bold">초대</p>
        <p className="mt-1 text-sm text-jisan-ink/60">초대한 이메일로만 가입할 수 있습니다. 초대받은 분은 /admin 에서 &lsquo;초대받은 이메일로 가입&rsquo;을 누르면 됩니다.</p>
        <form
          className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]"
          onSubmit={async (e) => {
            e.preventDefault()
            const { error } = await sb().from("admin_invites").insert({ email: email.trim().toLowerCase(), name: name.trim(), role })
            setMsg(error ? `초대하지 못했습니다: ${error.message}` : "")
            if (!error) {
              setEmail("")
              setName("")
              load()
            }
          }}
        >
          <input className={inputCls} type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className={inputCls} placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
          <select className={inputCls} value={role} onChange={(e) => setRole(e.target.value as Invite["role"])}>
            <option value="writer">글쓴이</option>
            <option value="approver">승인자</option>
          </select>
          <button className={`${btnCls} bg-jisan-ink text-white`}>초대</button>
        </form>
        {msg && <p className="mt-2 text-sm text-red-700">{msg}</p>}
        <ul className="mt-4 divide-y divide-[#E2E6ED]">
          {invites.map((i) => (
            <li key={i.email} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
              <span>{i.email}</span>
              <span className="text-jisan-ink/60">{i.name}</span>
              <span className="text-jisan-ink/60">{ROLE[i.role]}</span>
              <span className={`ml-auto text-xs ${joined.has(i.email) ? "text-emerald-700" : "text-jisan-ink/50"}`}>{joined.has(i.email) ? "가입함" : "가입 전"}</span>
              {!joined.has(i.email) && (
                <button
                  className="text-xs text-red-700"
                  onClick={async () => {
                    await sb().from("admin_invites").delete().eq("email", i.email)
                    load()
                  }}
                >
                  초대 취소
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
