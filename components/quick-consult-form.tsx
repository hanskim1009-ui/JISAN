"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/lib/site-config"

export function QuickConsultForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append("_subject", "[법률사무소 지산] 빠른 상담 신청")

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1">
          <Label htmlFor="quick-name" className="sr-only">
            이름
          </Label>
          <Input
            id="quick-name"
            name="name"
            required
            placeholder="이름"
            className="h-11 bg-background/90 border-background/30 text-foreground placeholder:text-background/50"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="quick-phone" className="sr-only">
            연락처
          </Label>
          <Input
            id="quick-phone"
            name="phone"
            type="tel"
            required
            placeholder="010-0000-0000"
            className="h-11 bg-background/90 border-background/30 text-foreground placeholder:text-background/50"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <input type="hidden" name="message" value="[빠른 상담] Hero 섹션에서 신청" />
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          {status === "submitting" ? "전송 중..." : "빠른 상담 신청"}
        </Button>
        {(status === "success" || status === "error") && (
          <p className={`text-sm ${status === "success" ? "text-background/90" : "text-red-200"}`}>
            {status === "success" ? "접수되었습니다. 확인 후 연락드리겠습니다." : "전송 실패. 전화 또는 카카오톡으로 문의해 주세요."}
          </p>
        )}
      </div>
    </form>
  )
}
