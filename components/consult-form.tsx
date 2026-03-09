"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/lib/site-config"

const CASE_TYPES = [
  { value: "criminal", label: "형사" },
  { value: "corporate", label: "기업" },
  { value: "civil", label: "민사" },
  { value: "construction", label: "건설·부동산" },
  { value: "bankruptcy", label: "회생·파산" },
  { value: "family", label: "가사" },
  { value: "other", label: "기타" },
]

export function ConsultForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

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
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm">이름 *</Label>
          <Input id="name" name="name" required placeholder="홍길동" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm">연락처 *</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="010-0000-0000" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="caseType" className="text-sm">사건 유형</Label>
        <select
          id="caseType"
          name="caseType"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">선택해 주세요</option>
          {CASE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm">상담 내용 *</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="사건 개요를 간단히 작성해 주시면, 확인 후 연락드리겠습니다."
          rows={4}
        />
      </div>
      {status === "success" && (
        <p className="text-base text-green-600 dark:text-green-400">
          접수되었습니다. 확인 후 연락드리겠습니다.
        </p>
      )}
      {status === "error" && (
        <p className="text-base text-destructive">
          전송에 실패했습니다. 전화(02-6951-4097) 또는 카카오톡으로 문의해 주세요.
        </p>
      )}
      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "전송 중..." : "상담 신청"}
      </Button>
    </form>
  )
}
