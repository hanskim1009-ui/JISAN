"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/lib/site-config"

export const CASE_TYPES = ["형사", "성범죄", "기업", "민사", "건설·부동산", "회생·파산", "가사", "기타"]

export const DEFAULT_STAGE_OPTIONS = ["상담만 먼저 받고 싶음", "고소·소송 준비 중", "수사·소송 진행 중", "재판 중"]

/** 메인 사이트의 상황 버튼이 폼의 사건 유형을 미리 고를 때 쓰는 이벤트 */
export const CONSULT_PRESET_EVENT = "consult:preset"

export function presetConsult(caseType: string) {
  window.dispatchEvent(new CustomEvent(CONSULT_PRESET_EVENT, { detail: caseType }))
}

type ConsultFormProps = {
  /** 한 페이지에 폼이 둘 이상일 때 id 충돌 방지 */
  idPrefix?: string
  /** 센터 사이트: 사건 유형을 고정하고 선택칸을 숨김 */
  fixedCaseType?: string
  /** 접수 메일 제목에 붙는 출처 (예: "형사센터") */
  source?: string
  stageOptions?: string[]
  /** 첫 화면용 짧은 폼: 상담 내용·걱정되는 점 생략 */
  compact?: boolean
}

export function ConsultForm({
  idPrefix = "consult",
  fixedCaseType,
  source,
  stageOptions = DEFAULT_STAGE_OPTIONS,
  compact = false,
}: ConsultFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [caseType, setCaseType] = useState(fixedCaseType ?? "")
  const id = (name: string) => `${idPrefix}-${name}`

  useEffect(() => {
    if (fixedCaseType) return
    const onPreset = (e: Event) => setCaseType((e as CustomEvent<string>).detail)
    window.addEventListener(CONSULT_PRESET_EVENT, onPreset)
    return () => window.removeEventListener(CONSULT_PRESET_EVENT, onPreset)
  }, [fixedCaseType])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append("_subject", `[${siteConfig.name}] 상담 신청${source ? ` - ${source}` : ""}`)

    if (siteConfig.formspreeFormId === "YOUR_FORM_ID") {
      setStatus("success")
      form.reset()
      return
    }

    setStatus("submitting")
    try {
      const res = await fetch(`https://formspree.io/f/${siteConfig.formspreeFormId}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
      if (res.ok) {
        setStatus("success")
        form.reset()
        setCaseType(fixedCaseType ?? "")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={`grid grid-cols-1 gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className="space-y-2">
          <Label htmlFor={id("name")} className="text-sm">이름 *</Label>
          <Input id={id("name")} name="name" required placeholder="홍길동" autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id("phone")} className="text-sm">연락처 *</Label>
          <Input id={id("phone")} name="phone" type="tel" required placeholder="010-0000-0000" autoComplete="tel" />
        </div>
      </div>

      {fixedCaseType ? (
        <input type="hidden" name="caseType" value={fixedCaseType} />
      ) : (
        <div className="space-y-2">
          <Label htmlFor={id("caseType")} className="text-sm">어떤 일인가요?</Label>
          <select
            id={id("caseType")}
            name="caseType"
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">선택해 주세요</option>
            {CASE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium leading-none mb-2">지금 어느 단계인가요?</legend>
        <div className="flex flex-wrap gap-2">
          {stageOptions.map((opt, i) => (
            <label
              key={opt}
              htmlFor={id(`stage-${i}`)}
              className="cursor-pointer rounded-full border border-input px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/40 has-[:checked]:border-jisan-blue has-[:checked]:bg-jisan-blue/5 has-[:checked]:font-semibold has-[:checked]:text-jisan-blue has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <input id={id(`stage-${i}`)} type="radio" name="stage" value={opt} className="sr-only" />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      {!compact && (
        <>
          <div className="space-y-2">
            <Label htmlFor={id("concern")} className="text-sm">가장 걱정되는 점</Label>
            <Input id={id("concern")} name="concern" placeholder="예: 회사에 알려질까 걱정됩니다" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={id("message")} className="text-sm">상담 내용 *</Label>
            <Textarea
              id={id("message")}
              name="message"
              required
              placeholder="사건 개요를 간단히 작성해 주시면, 확인 후 연락드리겠습니다."
              rows={4}
            />
          </div>
        </>
      )}

      {status === "success" && (
        <p className="text-base text-green-700" role="status">
          접수되었습니다. 확인 후 연락드리겠습니다.
        </p>
      )}
      {status === "error" && (
        <p className="text-base text-destructive" role="alert">
          전송에 실패했습니다. 전화({siteConfig.phone}) 또는 카카오톡으로 문의해 주세요.
        </p>
      )}
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className={`h-12 rounded-md bg-jisan-blue px-8 text-[15px] font-semibold text-white hover:bg-jisan-blue/90 ${compact ? "w-full" : "w-full sm:w-auto"}`}
        >
          {status === "submitting" ? "전송 중..." : "상담 신청"}
        </Button>
        <p className="text-xs text-muted-foreground">상담 내용은 변호사의 비밀유지 의무로 보호됩니다.</p>
      </div>
    </form>
  )
}
