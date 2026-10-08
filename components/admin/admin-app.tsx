"use client"

import { useCallback, useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { sb, btnCls, inputCls, type Me, type Options, type PostRow } from "@/components/admin/shared"
import { PostList } from "@/components/admin/post-list"
import { PostEditor } from "@/components/admin/post-editor"
import { ConsultList } from "@/components/admin/consult-list"
import { AdminUsers } from "@/components/admin/admin-users"

type Tab = "posts" | "consult" | "users" | "account"

export function AdminApp({ options }: { options: Options }) {
  const [session, setSession] = useState<Session | null>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("posts")
  const [editing, setEditing] = useState<PostRow | "new" | null>(null)

  useEffect(() => {
    sb().auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = sb().auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const loadMe = useCallback(async () => {
    if (!session) return setMe(null)
    const { data } = await sb().from("admins").select("user_id,email,name,role").eq("user_id", session.user.id).maybeSingle()
    setMe(data ? { id: data.user_id, email: data.email, name: data.name, role: data.role } : null)
  }, [session])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  if (loading) return <p className="p-10 text-center text-sm text-jisan-ink/60">불러오는 중…</p>
  if (!session) return <Login />
  if (!me)
    return (
      <Shell>
        <p className="text-[0.9375rem]">이 계정은 관리자로 등록되어 있지 않습니다. 다른 관리자에게 초대를 요청해 주세요.</p>
        <button className={`${btnCls} mt-4 border border-[#D5DAE1] bg-white`} onClick={() => sb().auth.signOut()}>
          로그아웃
        </button>
      </Shell>
    )

  const tabs: [Tab, string][] = [
    ["posts", "글"],
    ["consult", "상담 신청"],
    ["users", "관리자"],
    ["account", "내 계정"],
  ]

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-[#E2E6ED] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
          <a href="/" className="font-bold">
            지산 관리
          </a>
          <nav className="flex gap-1">
            {tabs.map(([k, label]) => (
              <button
                key={k}
                onClick={() => {
                  setTab(k)
                  setEditing(null)
                }}
                className={`${btnCls} ${tab === k ? "bg-jisan-ink text-white" : "text-jisan-ink/70 hover:bg-[#EEF0F3]"}`}
              >
                {label}
              </button>
            ))}
          </nav>
          <span className="ml-auto text-xs text-jisan-ink/60">
            {me.name || me.email}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        {tab === "posts" &&
          (editing ? (
            <PostEditor me={me} options={options} post={editing === "new" ? null : editing} onDone={() => setEditing(null)} />
          ) : (
            <PostList me={me} options={options} onNew={() => setEditing("new")} onEdit={(p) => setEditing(p)} />
          ))}
        {tab === "consult" && <ConsultList me={me} />}
        {tab === "users" && <AdminUsers me={me} />}
        {tab === "account" && <Account me={me} />}
      </main>
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-2xl bg-white p-7 shadow-sm">
      <p className="mb-5 text-lg font-bold">지산 홈페이지 관리</p>
      {children}
    </div>
  )
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in")
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [msg, setMsg] = useState("")
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg("")
    if (mode === "in") {
      const { error } = await sb().auth.signInWithPassword({ email: email.trim(), password: pw })
      if (error) setMsg("이메일이나 비밀번호가 맞지 않습니다.")
    } else {
      const { data, error } = await sb().auth.signUp({
        email: email.trim().toLowerCase(),
        password: pw,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      })
      if (error) setMsg(error.message.includes("Database error") ? "초대받지 않은 이메일입니다. 다른 관리자에게 초대를 요청해 주세요." : `가입하지 못했습니다: ${error.message}`)
      else if (!data.session) setMsg("가입했습니다. 메일함에서 확인 메일의 링크를 누른 뒤 로그인해 주세요.")
    }
    setBusy(false)
  }

  return (
    <Shell>
      <form onSubmit={submit} className="space-y-3">
        <input className={inputCls} type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          className={inputCls}
          type="password"
          placeholder={mode === "up" ? "비밀번호 (8자 이상)" : "비밀번호"}
          minLength={mode === "up" ? 8 : undefined}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
        {msg && <p className="text-sm text-red-700">{msg}</p>}
        <button disabled={busy} className={`${btnCls} w-full bg-jisan-ink py-2.5 text-white`}>
          {mode === "in" ? "로그인" : "가입하기"}
        </button>
      </form>
      <button className="mt-4 text-sm text-jisan-ink/60 underline underline-offset-4" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "처음이신가요? 초대받은 이메일로 가입" : "이미 계정이 있으면 로그인"}
      </button>
    </Shell>
  )
}

function Account({ me }: { me: Me }) {
  const [pw, setPw] = useState("")
  const [msg, setMsg] = useState("")
  return (
    <div className="max-w-md space-y-6">
      <div className="rounded-2xl bg-white p-6">
        <p className="font-bold">{me.name || "이름 없음"}</p>
        <p className="text-sm text-jisan-ink/60">{me.email}</p>
      </div>
      <form
        className="space-y-3 rounded-2xl bg-white p-6"
        onSubmit={async (e) => {
          e.preventDefault()
          const { error } = await sb().auth.updateUser({ password: pw })
          setMsg(error ? `바꾸지 못했습니다: ${error.message}` : "비밀번호를 바꿨습니다.")
          setPw("")
        }}
      >
        <p className="font-bold">비밀번호 바꾸기</p>
        <input className={inputCls} type="password" minLength={8} placeholder="새 비밀번호 (8자 이상)" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {msg && <p className="text-sm">{msg}</p>}
        <button className={`${btnCls} bg-jisan-ink text-white`}>바꾸기</button>
      </form>
      <button className={`${btnCls} border border-[#D5DAE1] bg-white`} onClick={() => sb().auth.signOut()}>
        로그아웃
      </button>
    </div>
  )
}
