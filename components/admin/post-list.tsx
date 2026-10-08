"use client"

import { useEffect, useState } from "react"
import { sb, btnCls, KIND_LABEL, STATUS_LABEL, STATUS_STYLE, type Me, type Options, type PostRow, type PostStatus } from "@/components/admin/shared"

type Filter = "all" | "draft" | "published" | "mine"

export function PostList({ me, options, onNew, onEdit }: { me: Me; options: Options; onNew: () => void; onEdit: (p: PostRow) => void }) {
  const [rows, setRows] = useState<PostRow[] | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const [error, setError] = useState("")

  useEffect(() => {
    sb()
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (error) setError(error.message)
        setRows((data as PostRow[]) ?? [])
      })
  }, [])

  const shown = (rows ?? []).filter((p) =>
    filter === "draft" ? p.status !== "published" : filter === "mine" ? p.created_by === me.id : filter === "published" ? p.status === "published" : true,
  )
  const count = (s: PostStatus) => (rows ?? []).filter((p) => p.status === s).length
  const authorName = (p: PostRow) => {
    const slug = typeof p.data.author === "string" ? p.data.author : ""
    return options.lawyers.find((l) => l.slug === slug)?.name ?? (slug || "")
  }

  const filters: [Filter, string][] = [
    ["all", "전체"],
    ["published", `게시됨 ${count("published")}`],
    ["draft", `임시저장 ${(rows ?? []).length - count("published")}`],
    ["mine", "내가 쓴 글"],
  ]

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {filters.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`${btnCls} ${filter === k ? "bg-jisan-ink text-white" : "border border-[#D5DAE1] bg-white"}`}
          >
            {label}
          </button>
        ))}
        <button onClick={onNew} className={`${btnCls} ml-auto bg-[#1F4E8C] text-white`}>
          + 새 글 쓰기
        </button>
      </div>
      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
      {rows === null ? (
        <p className="text-sm text-jisan-ink/60">불러오는 중…</p>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-jisan-ink/60">글이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-[#E2E6ED] overflow-hidden rounded-2xl bg-white">
          {shown.map((p) => (
            <li key={p.id}>
              <button onClick={() => onEdit(p)} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-5 py-4 text-left hover:bg-[#F7F8FA]">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                <span className="text-xs font-semibold text-jisan-ink/50">{KIND_LABEL[p.kind]}</span>
                <span className="min-w-0 flex-1 font-semibold">{p.title}</span>
                <span className="text-xs text-jisan-ink/50">
                  {p.field}
                  {authorName(p) && ` · ${authorName(p)}`} · {p.date}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
