"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/lib/site-config"
import { trackEvent } from "@/components/analytics"
import { CASE_TYPES, DEFAULT_STAGE_OPTIONS } from "@/lib/practice"
import { SUPABASE_URL, restHeaders } from "@/lib/supabase"
import type { Lang } from "@/lib/langs"
import { LANG_NAME } from "@/lib/langs"
import { extraLangs } from "@/lib/i18n/extra-langs"


/**
 * 개인정보 수집·이용 동의 (개인정보 보호법 제15조) + 민감정보 처리 별도 동의 (제23조).
 * 두 칸 모두 체크해야 신청됨. 체크 값은 알림 메일(Formspree)에 함께 기록됨.
 */
type ConsentText = { title: string; agree: string; more: string; rows: [string, string][]; refuse: string; sensitiveAgree: string; sensitiveBody: string; policy: string }
const CONSENT_TEXT: Record<Lang, ConsentText> = {
  ko: {
    title: "개인정보 수집·이용 동의",
    agree: "[필수] 개인정보 수집·이용에 동의합니다.",
    more: "자세히 보기",
    rows: [
      ["수집 목적", "상담 신청 접수, 신청인 확인 및 상담 회신"],
      ["수집 항목", "이름, 연락처(전화번호 또는 메신저 ID), 상담 내용 / 선택: 사건 분야, 진행 단계, 걱정되는 점"],
      ["보유 기간", "상담 목적 달성 후 지체 없이 파기 (법령에 따라 보존해야 하는 경우 그 기간)"],
    ],
    refuse: "동의를 거부할 수 있습니다. 다만 동의하지 않으면 홈페이지로 상담을 신청할 수 없습니다.",
    sensitiveAgree: "[필수] 민감정보 처리에 동의합니다.",
    sensitiveBody: "상담 내용에 범죄경력, 건강, 가족관계 등 민감한 정보가 들어갈 수 있습니다. 이 정보는 상담에 필요한 범위에서만 처리하며, 위와 같은 기간 동안 보유합니다. 동의를 거부할 수 있으나, 거부하면 홈페이지로 상담을 신청할 수 없습니다.",
    policy: "개인정보처리방침",
  },
  en: {
    title: "Consent to the collection and use of personal information",
    agree: "[Required] I agree to the collection and use of my personal information.",
    more: "Details",
    rows: [
      ["Purpose", "Receiving your consultation request, identifying you and replying to you"],
      ["Items", "Name, contact details (phone number or messenger ID), description of your matter / optional: type of matter, current stage, main concern"],
      ["Retention", "Deleted without delay once the consultation is finished (kept longer only where the law requires)"],
    ],
    refuse: "You may refuse to consent, but without consent you cannot submit a request through this website.",
    sensitiveAgree: "[Required] I agree to the processing of sensitive information.",
    sensitiveBody: "Your description may include sensitive information such as criminal records, health or family relationships. We process it only as far as needed for the consultation and keep it for the same period as above. You may refuse, but without consent you cannot submit a request through this website.",
    policy: "Privacy policy",
  },
  zh: {
    title: "同意收集和使用个人信息",
    agree: "[必选] 我同意收集和使用个人信息。",
    more: "查看详情",
    rows: [
      ["收集目的", "受理咨询申请、确认申请人身份并回复咨询"],
      ["收集项目", "姓名、联系方式（电话号码或聊天软件ID）、咨询内容 / 可选：案件类别、目前阶段、最担心的问题"],
      ["保存期限", "咨询目的达成后立即销毁（法律要求保存的，按该期限保存）"],
    ],
    refuse: "您可以拒绝同意，但不同意将无法通过本网站申请咨询。",
    sensitiveAgree: "[必选] 我同意处理敏感信息。",
    sensitiveBody: "咨询内容可能包含犯罪记录、健康、家庭关系等敏感信息。我们仅在咨询所需范围内处理，并按上述期限保存。您可以拒绝同意，但不同意将无法通过本网站申请咨询。",
    policy: "个人信息处理方针",
  },
  vi: {
    title: "Đồng ý thu thập và sử dụng thông tin cá nhân",
    agree: "[Bắt buộc] Tôi đồng ý cho thu thập và sử dụng thông tin cá nhân.",
    more: "Xem chi tiết",
    rows: [
      ["Mục đích", "Tiếp nhận yêu cầu tư vấn, xác nhận người yêu cầu và trả lời"],
      ["Thông tin thu thập", "Họ tên, thông tin liên lạc (số điện thoại hoặc ID ứng dụng nhắn tin), nội dung cần tư vấn / không bắt buộc: loại vụ việc, giai đoạn hiện tại, điều lo lắng nhất"],
      ["Thời gian lưu giữ", "Hủy ngay sau khi hoàn tất tư vấn (trừ trường hợp pháp luật yêu cầu lưu giữ)"],
    ],
    refuse: "Bạn có quyền không đồng ý, nhưng khi đó bạn không thể gửi yêu cầu tư vấn qua trang web này.",
    sensitiveAgree: "[Bắt buộc] Tôi đồng ý cho xử lý thông tin nhạy cảm.",
    sensitiveBody: "Nội dung tư vấn có thể chứa thông tin nhạy cảm như tiền án, sức khỏe, quan hệ gia đình. Chúng tôi chỉ xử lý trong phạm vi cần thiết cho việc tư vấn và lưu giữ trong thời gian như trên. Bạn có quyền không đồng ý, nhưng khi đó bạn không thể gửi yêu cầu qua trang web này.",
    policy: "Chính sách bảo vệ thông tin cá nhân",
  },
  ru: {
    title: "Согласие на сбор и использование персональных данных",
    agree: "[Обязательно] Я согласен(на) на сбор и использование моих персональных данных.",
    more: "Подробнее",
    rows: [
      ["Цель", "Приём заявки на консультацию, установление личности заявителя и ответ на заявку"],
      ["Данные", "Имя, контакт (номер телефона или ID в мессенджере), описание ситуации / по желанию: вид дела, текущая стадия, что беспокоит больше всего"],
      ["Срок хранения", "Удаляются без промедления после завершения консультации (дольше — только если этого требует закон)"],
    ],
    refuse: "Вы можете отказаться от согласия, но без него отправить заявку через сайт нельзя.",
    sensitiveAgree: "[Обязательно] Я согласен(на) на обработку чувствительных данных.",
    sensitiveBody: "Описание ситуации может содержать чувствительные сведения: о судимости, здоровье, семейных отношениях. Мы обрабатываем их только в объёме, необходимом для консультации, и храним в тот же срок, что указан выше. Вы можете отказаться, но без согласия отправить заявку через сайт нельзя.",
    policy: "Политика обработки персональных данных",
  },
  mn: {
    title: "Хувийн мэдээлэл цуглуулах, ашиглахыг зөвшөөрөх",
    agree: "[Заавал] Хувийн мэдээллээ цуглуулах, ашиглахыг зөвшөөрч байна.",
    more: "Дэлгэрэнгүй",
    rows: [
      ["Зорилго", "Зөвлөгөөний хүсэлт хүлээн авах, хүсэлт гаргагчийг тодорхойлох, хариу өгөх"],
      ["Цуглуулах мэдээлэл", "Нэр, холбоо барих мэдээлэл (утасны дугаар эсвэл мессенжерийн ID), асуудлын тайлбар / сонголтоор: хэргийн төрөл, одоогийн шат, хамгийн их санаа зовж буй зүйл"],
      ["Хадгалах хугацаа", "Зөвлөгөө дууссаны дараа даруй устгана (хуулиар хадгалах шаардлагатай бол тэр хугацаанд)"],
    ],
    refuse: "Та зөвшөөрөхөөс татгалзаж болно. Гэхдээ зөвшөөрөхгүй бол энэ вэбсайтаар зөвлөгөө хүсэх боломжгүй.",
    sensitiveAgree: "[Заавал] Эмзэг мэдээлэл боловсруулахыг зөвшөөрч байна.",
    sensitiveBody: "Асуудлын тайлбарт ял шийтгэл, эрүүл мэнд, гэр бүлийн харилцаа зэрэг эмзэг мэдээлэл орж болно. Бид үүнийг зөвхөн зөвлөгөөнд шаардлагатай хүрээнд боловсруулж, дээрх хугацаанд хадгална. Та татгалзаж болно, гэхдээ зөвшөөрөхгүй бол энэ вэбсайтаар хүсэлт илгээх боломжгүй.",
    policy: "Хувийн мэдээлэл хамгаалах бодлого",
  },
}

/** 동의 칸 두 개 (필수) */
function ConsentBox({ lang, idPrefix }: { lang: Lang; idPrefix: string }) {
  const C = CONSENT_TEXT[lang]
  const box = "mt-0.5 h-4 w-4 shrink-0 rounded border-[#C9CFD8] accent-jisan-blue"
  return (
    <fieldset className="space-y-2.5 rounded-md border border-[#E4E6E9] bg-[#F7F8FA] p-3.5 text-[0.8125rem] leading-relaxed text-jisan-ink/80">
      <legend className="sr-only">{C.title}</legend>
      <label className="flex items-start gap-2.5">
        <input type="checkbox" name="agree_privacy" value="동의" required className={box} id={`${idPrefix}-agree`} />
        <span className="font-semibold text-jisan-ink">{C.agree}</span>
      </label>
      <details className="pl-[1.625rem]">
        <summary className="cursor-pointer text-xs text-jisan-ink/60 underline underline-offset-2">{C.more}</summary>
        <dl className="mt-2 space-y-1.5 text-xs">
          {C.rows.map(([k, v]) => (
            <div key={k}>
              <dt className="inline font-semibold">{k}: </dt>
              <dd className="inline">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-1.5 text-xs">{C.refuse}</p>
      </details>
      <label className="flex items-start gap-2.5">
        <input type="checkbox" name="agree_sensitive" value="동의" required className={box} id={`${idPrefix}-agree-sensitive`} />
        <span className="font-semibold text-jisan-ink">{C.sensitiveAgree}</span>
      </label>
      <details className="pl-[1.625rem]">
        <summary className="cursor-pointer text-xs text-jisan-ink/60 underline underline-offset-2">{C.more}</summary>
        <p className="mt-2 text-xs">{C.sensitiveBody}</p>
      </details>
      <a href={lang === "ko" ? "/privacy" : `/${lang}/privacy`} target="_blank" rel="noopener noreferrer" className="inline-block pl-[1.625rem] text-xs text-jisan-blue underline underline-offset-2">
        {C.policy}
      </a>
    </fieldset>
  )
}

/** 상담 폼 문구 (한국어 · 영어 · 중국어 간체) */
const BASE_FORM_TEXT = {
  ko: {
    ok: "접수되었습니다. 확인 후 연락드리겠습니다.",
    fail: (p: string) => `전송에 실패했습니다. 전화(${p}) 또는 카카오톡으로 문의해 주세요.`,
    name: "이름 *", namePh: "홍길동", phone: "연락처 *", phonePh: "010-0000-0000",
    caseType: "어떤 일인가요?", pick: "선택해 주세요", stage: "지금 어느 단계인가요?",
    concern: "가장 걱정되는 점", concernPh: "예: 회사에 알려질까 걱정됩니다",
    message: "상담 내용 *", messagePh: "사건 개요를 간단히 작성해 주시면, 확인 후 연락드리겠습니다.",
    sending: "전송 중...", submit: "상담 신청", privacy: "상담 내용은 변호사의 비밀유지 의무로 보호됩니다.",
    lang: "",
  },
  en: {
    ok: "Received. We will review it and contact you.",
    fail: (p: string) => `Sending failed. Please call ${p} or message us on KakaoTalk.`,
    name: "Name *", namePh: "Your name", phone: "Phone or messenger ID *", phonePh: "+82 10-0000-0000 / messenger ID",
    caseType: "What is it about?", pick: "Please choose", stage: "Where are you now?",
    concern: "Your biggest concern", concernPh: "e.g. I'm worried about my visa",
    message: "Your situation *", messagePh: "Briefly describe what happened. We will review it and contact you.",
    sending: "Sending...", submit: "Request a consultation", privacy: "What you tell us is protected by the lawyer's duty of confidentiality.",
    lang: "English",
  },
  zh: {
    ok: "已收到。我们确认后会与您联系。",
    fail: (p: string) => `发送失败。请致电 ${p} 或通过 KakaoTalk 联系我们。`,
    name: "姓名 *", namePh: "您的姓名", phone: "电话或微信号 *", phonePh: "+82 10-0000-0000 / 微信号",
    caseType: "咨询什么问题？", pick: "请选择", stage: "目前处于哪个阶段？",
    concern: "最担心的事", concernPh: "例：担心影响签证",
    message: "咨询内容 *", messagePh: "请简单写下发生了什么，我们确认后会与您联系。",
    sending: "发送中...", submit: "申请咨询", privacy: "咨询内容受律师保密义务保护。",
    lang: "中文",
  },
} as const

type FormText = { [K in keyof (typeof BASE_FORM_TEXT)["en"]]: K extends "fail" ? (p: string) => string : string }
const FORM_TEXT: Record<Lang, FormText> = {
  ...BASE_FORM_TEXT,
  vi: { ...extraLangs.vi.formText, lang: LANG_NAME.vi },
  ru: { ...extraLangs.ru.formText, lang: LANG_NAME.ru },
  mn: { ...extraLangs.mn.formText, lang: LANG_NAME.mn },
}

type ConsultFormProps = {
  /** 한 페이지에 폼이 둘 이상일 때 id 충돌 방지 */
  idPrefix?: string
  /** 센터 사이트: 사건 유형을 고정하고 선택칸을 숨김 */
  fixedCaseType?: string
  /** 접수 메일 제목에 붙는 출처 (예: "형사센터") */
  source?: string
  stageOptions?: string[]
  /** 메인 상담 페이지: 첫 화면에서 고른 분야를 미리 선택 (/consult?type=가사) */
  defaultCaseType?: string
  /** 첫 화면용 짧은 폼: 상담 내용·걱정되는 점 생략 */
  compact?: boolean
  /** 폼 언어 (외국어 페이지) */
  lang?: Lang
  /** 사건 유형 선택지 (없으면 한국어 기본 목록) */
  caseTypes?: readonly string[]
}

export function ConsultForm({
  idPrefix = "consult",
  fixedCaseType,
  source,
  stageOptions = DEFAULT_STAGE_OPTIONS,
  defaultCaseType,
  compact = false,
  lang = "ko",
  caseTypes = CASE_TYPES,
}: ConsultFormProps) {
  const F = FORM_TEXT[lang]
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [caseType, setCaseType] = useState(fixedCaseType ?? defaultCaseType ?? "")
  const id = (name: string) => `${idPrefix}-${name}`

  /** 상담 신청을 홈페이지 DB(관리 화면 '상담 신청')에 저장 */
  const saveToDb = async (fd: FormData) => {
    const v = (k: string) => {
      const x = fd.get(k)
      return typeof x === "string" && x.trim() ? x.trim() : null
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/consultations`, {
      method: "POST",
      headers: { ...restHeaders(), Prefer: "return=minimal" },
      body: JSON.stringify({
        name: v("name"),
        phone: v("phone"),
        case_type: v("caseType"),
        stage: v("stage"),
        concern: v("concern"),
        message: lang !== "ko" ? `[${F.lang}] ${v("message") ?? ""}` : v("message"),
        source: source ?? null,
        page: typeof window !== "undefined" ? window.location.pathname : null,
      }),
    })
    return res.ok
  }

  /** 담당자 메일 알림 (Formspree) */
  const sendMail = async (fd: FormData) => {
    if (siteConfig.formspreeFormId === "YOUR_FORM_ID") return false
    const res = await fetch(`https://formspree.io/f/${siteConfig.formspreeFormId}`, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
    })
    return res.ok
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    // 자동 입력 프로그램이 채우는 숨은 칸: 채워져 있으면 접수한 것처럼 보이고 저장하지 않음
    if (formData.get("website")) {
      setStatus("success")
      form.reset()
      return
    }
    formData.delete("website")
    formData.append("_subject", `[${siteConfig.name}] 상담 신청${source ? ` - ${source}` : ""}`)

    setStatus("submitting")
    // DB 저장과 메일 알림을 함께 보내고, 둘 중 하나라도 되면 접수된 것으로 봅니다
    const [db, mail] = await Promise.allSettled([saveToDb(formData), sendMail(formData)])
    const ok = (r: PromiseSettledResult<boolean>) => r.status === "fulfilled" && r.value
    if (ok(db) || ok(mail)) {
      setStatus("success")
      trackEvent("generate_lead", { case_type: caseType })
      form.reset()
      setCaseType(fixedCaseType ?? "")
    } else {
      setStatus("error")
    }
  }

  const statusLine =
    status === "success" ? (
      <p className="text-sm text-green-700" role="status">{F.ok}</p>
    ) : status === "error" ? (
      <p className="text-sm text-destructive" role="alert">
        {F.fail(siteConfig.phone)}
      </p>
    ) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className={`grid grid-cols-1 gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className="space-y-2">
          <Label htmlFor={id("name")} className="text-sm">{F.name}</Label>
          <Input id={id("name")} name="name" required placeholder={F.namePh} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id("phone")} className="text-sm">{F.phone}</Label>
          <Input id={id("phone")} name="phone" type={lang === "ko" ? "tel" : "text"} required placeholder={F.phonePh} autoComplete="tel" />
        </div>
      </div>

      {fixedCaseType ? (
        <input type="hidden" name="caseType" value={fixedCaseType} />
      ) : (
        <div className="space-y-2">
          <Label htmlFor={id("caseType")} className="text-sm">{F.caseType}</Label>
          <select
            id={id("caseType")}
            name="caseType"
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">{F.pick}</option>
            {caseTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium leading-none mb-2">{F.stage}</legend>
        <div className="flex flex-wrap gap-2">
          {stageOptions.map((opt, i) => (
            <label
              key={opt}
              htmlFor={id(`stage-${i}`)}
              className="cursor-pointer rounded-full border border-input px-3 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:border-foreground/40 has-[:checked]:border-jisan-blue has-[:checked]:bg-jisan-blue/5 has-[:checked]:font-semibold has-[:checked]:text-jisan-blue has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
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
            <Label htmlFor={id("concern")} className="text-sm">{F.concern}</Label>
            <Input id={id("concern")} name="concern" placeholder={F.concernPh} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={id("message")} className="text-sm">{F.message}</Label>
            <Textarea
              id={id("message")}
              name="message"
              required
              placeholder={F.messagePh}
              rows={4}
            />
          </div>
        </>
      )}

      <ConsentBox lang={lang} idPrefix={idPrefix} />
      {statusLine}
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className={`h-12 rounded-md bg-jisan-blue px-8 text-[0.9375rem] font-semibold text-white hover:bg-jisan-blue/90 ${compact ? "w-full" : "w-full sm:w-auto"}`}
        >
          {status === "submitting" ? F.sending : F.submit}
        </Button>
        <p className="text-xs text-muted-foreground">{F.privacy}</p>
      </div>
    </form>
  )
}
