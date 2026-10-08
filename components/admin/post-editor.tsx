"use client"

import { useMemo, useState } from "react"
import {
  sb,
  btnCls,
  inputCls,
  adWarnings,
  newSlug,
  refreshSite,
  shrinkImage,
  today,
  KIND_LABEL,
  STATUS_LABEL,
  STATUS_STYLE,
  type Me,
  type Options,
  type PostKind,
  type PostRow,
  type PostStatus,
} from "@/components/admin/shared"
import { POST_IMAGE_BUCKET } from "@/lib/supabase"
import { parseBody } from "@/lib/parse-body"

const str = (v: unknown) => (typeof v === "string" ? v : "")
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [])

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {hint && <span className="ml-2 text-xs text-jisan-ink/50">{hint}</span>}
      {children}
    </label>
  )
}

export function PostEditor({ me, options, post, onDone }: { me: Me; options: Options; post: PostRow | null; onDone: () => void }) {
  const approver = me.role === "approver"
  const [kind, setKind] = useState<PostKind>(post?.kind ?? "column")
  const [title, setTitle] = useState(post?.title ?? "")
  const [field, setField] = useState(post?.field ?? options.fields[0])
  const [centers, setCenters] = useState<string[]>(post?.centers ?? [])
  const [date, setDate] = useState(post?.date ?? today())
  const d = post?.data ?? {}
  // 칼럼
  const [summary, setSummary] = useState(str(d.summary))
  const [body, setBody] = useState(str(d.body))
  const [author, setAuthor] = useState(str(d.author) || (kind === "column" ? options.lawyers[0]?.slug ?? "" : ""))
  const [blogPost, setBlogPost] = useState(str(d.blogPost))
  // 감사일기
  const [photos, setPhotos] = useState<string[]>(strs(d.photos))
  // 업무사례
  const [caseType, setCaseType] = useState(str(d.caseType))
  const [clientRole, setClientRole] = useState(str(d.clientRole))
  const [stage, setStage] = useState(str(d.stage))
  const [result, setResult] = useState(str(d.result))
  const [decidedOn, setDecidedOn] = useState(str(d.decidedOn))
  const [issue, setIssue] = useState(str(d.issue))
  const [work, setWork] = useState(str(d.work))
  const [caseLawyers, setCaseLawyers] = useState<string[]>(strs(d.lawyers))
  const [consent, setConsent] = useState(Boolean(d.consent))

  const [note, setNote] = useState(post?.review_note ?? "")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState("")
  const [uploading, setUploading] = useState(false)

  const status: PostStatus = post?.status ?? "draft"
  const locked = !approver && (status === "published" || (post !== null && post.created_by !== me.id))

  const allText = [title, summary, body, issue, work, result].join("\n")
  const warnings = useMemo(() => adWarnings(allText), [allText])
  const preview = useMemo(() => (kind === "column" ? parseBody(body) : []), [kind, body])

  const buildData = () => {
    if (kind === "column") return { summary, body, author, blogPost: blogPost || undefined }
    if (kind === "diary") return { body, photos, author, consent }
    return { caseType, clientRole, stage, result, decidedOn, issue, work, lawyers: caseLawyers, consent }
  }

  const missing = () => {
    if (!title.trim()) return "제목을 써 주세요."
    if (kind === "column" && (!summary.trim() || !body.trim() || !author)) return "요약, 본문, 쓴 변호사를 채워 주세요."
    if (kind === "diary" && (!body.trim() || !consent)) return "본문을 쓰고, 허락·가림 확인에 표시해 주세요."
    if (kind === "case" && (!result.trim() || !issue.trim() || !work.trim() || !consent)) return "결과, 쟁점, 한 일을 채우고 의뢰인 동의 확인에 표시해 주세요."
    return ""
  }

  const save = async (next: PostStatus, extra: { review_note?: string | null } = {}) => {
    if (next !== "draft") {
      const m = missing()
      if (m) return setMsg(m)
    }
    setBusy(true)
    setMsg("")
    const row = {
      kind,
      title: title.trim(),
      field,
      centers: kind === "diary" ? [] : centers,
      date,
      data: buildData(),
      status: next,
      ...(next === "published" ? { published_at: post?.published_at ?? new Date().toISOString(), reviewed_by: me.id, review_note: null } : {}),
      ...extra,
    }
    const res = post
      ? await sb().from("posts").update(row).eq("id", post.id)
      : await sb().from("posts").insert({ ...row, slug: newSlug(kind, date), created_by: me.id })
    setBusy(false)
    if (res.error) return setMsg(`저장하지 못했습니다: ${res.error.message}`)
    if (next === "published" || status === "published") await refreshSite()
    onDone()
  }

  const remove = async () => {
    if (!post || !confirm("이 글을 지울까요? 되돌릴 수 없습니다.")) return
    setBusy(true)
    const { error } = await sb().from("posts").delete().eq("id", post.id)
    setBusy(false)
    if (error) return setMsg(`지우지 못했습니다: ${error.message}`)
    if (status === "published") await refreshSite()
    onDone()
  }

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    const added: string[] = []
    for (const f of Array.from(files)) {
      const blob = await shrinkImage(f)
      const path = `diary/${date}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`
      const { error } = await sb().storage.from(POST_IMAGE_BUCKET).upload(path, blob, { contentType: "image/jpeg" })
      if (error) {
        setMsg(`사진을 올리지 못했습니다: ${error.message}`)
        continue
      }
      added.push(sb().storage.from(POST_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl)
    }
    setPhotos((p) => [...p, ...added])
    setUploading(false)
  }

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onDone} className={`${btnCls} border border-[#D5DAE1] bg-white`}>
          ← 목록
        </button>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>
        {status === "published" && post && (
          <a href={kind === "column" ? `/column/${post.slug}` : kind === "case" ? `/cases/${post.slug}` : "/diary"} target="_blank" className="text-sm underline underline-offset-4">
            사이트에서 보기
          </a>
        )}
      </div>

      {status === "rejected" && post?.review_note && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">반려 사유: {post.review_note}</p>
      )}
      {locked && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          {status === "published" ? "게시된 글은 승인자만 고칠 수 있습니다." : "다른 사람이 쓴 글은 승인자만 고칠 수 있습니다."}
        </p>
      )}

      <fieldset disabled={locked || busy} className="space-y-5 rounded-2xl bg-white p-6">
        {!post && (
          <div className="flex gap-2">
            {(["column", "diary", "case"] as PostKind[]).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setKind(k)}
                className={`${btnCls} ${kind === k ? "bg-jisan-ink text-white" : "border border-[#D5DAE1]"}`}
              >
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>
        )}

        <Field label={kind === "case" ? "의뢰인의 상황 한 줄 (목록 제목)" : kind === "diary" ? "무엇이 왔는지 (예: 귤 한 상자)" : "제목"} hint={kind === "column" ? "의뢰인이 검색하는 말로" : undefined}>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="분야">
            <select className={inputCls} value={field} onChange={(e) => setField(e.target.value)}>
              {options.fields.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label={kind === "case" ? "글 올린 날" : "날짜"}>
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          {kind === "column" && (
            <Field label="쓴 변호사" hint="직원이 초안을 써도 변호사 이름으로 나갑니다">
              <select className={inputCls} value={author} onChange={(e) => setAuthor(e.target.value)}>
                {options.lawyers.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.name} {l.title}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {kind === "diary" && (
            <Field label="적은 사람" hint="예: 직원 이○○">
              <input className={inputCls} value={author} onChange={(e) => setAuthor(e.target.value)} />
            </Field>
          )}
          {kind === "case" && (
            <Field label="처분·판결 시기" hint="예: 2026.09">
              <input className={inputCls} value={decidedOn} onChange={(e) => setDecidedOn(e.target.value)} />
            </Field>
          )}
        </div>

        {kind !== "diary" && (
          <Field label="함께 보여 줄 센터">
            <div className="flex flex-wrap gap-2 pt-1">
              {options.centers.map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => toggle(centers, setCenters, c.slug)}
                  className={`rounded-full border px-3 py-1 text-sm ${centers.includes(c.slug) ? "border-jisan-ink bg-jisan-ink text-white" : "border-[#D5DAE1]"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </Field>
        )}

        {kind === "column" && (
          <>
            <Field label="요약" hint="목록에 보이는 두 문장 안팎">
              <textarea className={inputCls} rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
            </Field>
            <Field label="본문" hint="빈 줄로 문단 나누기 · '## '로 시작하면 소제목 · '- '로 시작하는 줄들은 목록">
              <textarea className={`${inputCls} font-[inherit] leading-relaxed`} rows={18} value={body} onChange={(e) => setBody(e.target.value)} />
            </Field>
            <Field label="같은 글을 올린 네이버 블로그 주소 (있으면)">
              <input className={inputCls} value={blogPost} onChange={(e) => setBlogPost(e.target.value)} />
            </Field>
          </>
        )}

        {kind === "diary" && (
          <>
            <Field label="본문" hint="세 문장 안팎. 결과를 자랑하는 문장은 쓰지 않습니다">
              <textarea className={inputCls} rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
            </Field>
            <div className="space-y-2">
              <p className="text-sm font-semibold">사진 <span className="ml-2 text-xs font-normal text-jisan-ink/50">송장·이름·번호·얼굴은 가린 사진만</span></p>
              <div className="flex flex-wrap gap-3">
                {photos.map((u) => (
                  <div key={u} className="relative h-28 w-28 overflow-hidden rounded-lg bg-[#EEF0F3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setPhotos(photos.filter((x) => x !== u))} className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white">
                      빼기
                    </button>
                  </div>
                ))}
                <label className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#B8BFCA] text-sm text-jisan-ink/60">
                  {uploading ? "올리는 중…" : "+ 사진"}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
                </label>
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
              보내 주신 분께 허락을 받았고, 누구인지 알 수 없게 가렸습니다.
            </label>
          </>
        )}

        {kind === "case" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="죄명·사건 종류" hint="예: 업무상횡령">
                <input className={inputCls} value={caseType} onChange={(e) => setCaseType(e.target.value)} />
              </Field>
              <Field label="의뢰인 지위" hint="피의자·피해자·원고·피고·회사 등">
                <input className={inputCls} value={clientRole} onChange={(e) => setClientRole(e.target.value)} />
              </Field>
              <Field label="단계" hint="수사·1심·항소심·조정 등">
                <input className={inputCls} value={stage} onChange={(e) => setStage(e.target.value)} />
              </Field>
              <Field label="결과" hint="처분·판결명만 (예: 혐의없음, 조정 성립)">
                <input className={inputCls} value={result} onChange={(e) => setResult(e.target.value)} />
              </Field>
            </div>
            <Field label="쟁점">
              <textarea className={inputCls} rows={4} value={issue} onChange={(e) => setIssue(e.target.value)} />
            </Field>
            <Field label="변호사가 한 일">
              <textarea className={inputCls} rows={4} value={work} onChange={(e) => setWork(e.target.value)} />
            </Field>
            <Field label="담당 변호사">
              <div className="flex flex-wrap gap-2 pt-1">
                {options.lawyers.map((l) => (
                  <button
                    type="button"
                    key={l.slug}
                    onClick={() => toggle(caseLawyers, setCaseLawyers, l.slug)}
                    className={`rounded-full border px-3 py-1 text-sm ${caseLawyers.includes(l.slug) ? "border-jisan-ink bg-jisan-ink text-white" : "border-[#D5DAE1]"}`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </Field>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
              의뢰인의 동의를 받았고, 누구인지 알 수 없게 고쳤습니다. 비율·건수·결과 보장 표현은 쓰지 않았습니다.
            </label>
          </>
        )}
      </fieldset>

      {warnings.length > 0 && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          광고 규정상 피해야 할 표현이 있습니다: <b>{warnings.join(", ")}</b> · 꼭 필요한 경우가 아니면 고쳐 주세요.
        </p>
      )}

      {kind === "column" && preview.length > 0 && (
        <details className="rounded-2xl bg-white p-6">
          <summary className="cursor-pointer text-sm font-semibold">본문 미리 보기</summary>
          <div className="mt-4 space-y-4 text-[0.9375rem] leading-relaxed">
            {preview.map((b, i) =>
              b.type === "h2" ? (
                <h3 key={i} className="pt-2 text-lg font-bold">
                  {b.text}
                </h3>
              ) : b.type === "ul" ? (
                <ul key={i} className="list-disc space-y-1 pl-5">
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              ) : (
                <p key={i}>{b.text}</p>
              ),
            )}
          </div>
        </details>
      )}

      {approver && post && status === "pending" && (
        <Field label="반려 사유 (반려할 때)">
          <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="예: 둘째 문단의 '보장' 표현을 고쳐 주세요" />
        </Field>
      )}

      {msg && <p className="text-sm text-red-700">{msg}</p>}

      {!locked && (
        <div className="flex flex-wrap gap-2">
          {/* 저장은 지금 상태를 그대로 둡니다 (반려된 글은 임시저장으로) */}
          <button disabled={busy} onClick={() => save(status === "rejected" ? "draft" : status)} className={`${btnCls} border border-[#D5DAE1] bg-white`}>
            {status === "published" ? "고친 내용 게시" : "저장"}
          </button>
          {status !== "published" && !approver && (
            <button disabled={busy} onClick={() => save("pending")} className={`${btnCls} bg-[#1F4E8C] text-white`}>
              검토 요청
            </button>
          )}
          {approver && status !== "published" && (
            <button disabled={busy} onClick={() => save("published")} className={`${btnCls} bg-emerald-700 text-white`}>
              게시하기
            </button>
          )}
          {approver && post && status === "pending" && (
            <button
              disabled={busy || !note.trim()}
              onClick={() => save("rejected", { review_note: note.trim() })}
              className={`${btnCls} bg-red-700 text-white`}
              title={note.trim() ? "" : "반려 사유를 먼저 써 주세요"}
            >
              반려
            </button>
          )}
          {approver && status === "published" && (
            <button disabled={busy} onClick={() => save("draft")} className={`${btnCls} border border-red-300 bg-white text-red-700`}>
              게시 내리기
            </button>
          )}
          {post && (approver || status !== "published") && (
            <button disabled={busy} onClick={remove} className={`${btnCls} ml-auto text-red-700`}>
              지우기
            </button>
          )}
        </div>
      )}
    </div>
  )
}
