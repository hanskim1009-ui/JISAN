import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { foreignAlternates } from "@/components/site-pages/meta"
import type { Lang } from "@/lib/langs"
import { L, T } from "@/lib/i18n/t"

/** 개인정보처리방침 · 면책공고 · 이메일무단수집거부 (한국어 문구가 원문, 외국어는 번역) */
type Block = { head?: string; body: string }
type Doc = { path: string; title: string; blocks: Block[] }

export type LegalKind = "privacy" | "disclaimer" | "email-refuse"

const DOCS: Record<LegalKind, Doc> = {
  privacy: {
    path: "/privacy",
    title: "개인정보처리방침",
    blocks: [
      { body: "{topic} 개인정보 보호법에 따라 이용자의 개인정보를 보호하고 관련 고충을 빠르게 처리하기 위해 다음과 같이 개인정보처리방침을 정합니다." },
      { head: "1. 처리 목적", body: "상담 신청 접수, 신청인 확인, 상담 회신과 사건 의뢰 여부 검토를 위해 개인정보를 처리합니다. 이 목적 밖으로는 쓰지 않습니다." },
      {
        head: "2. 처리하는 항목",
        body: "필수: 이름, 연락처(전화번호 또는 메신저 ID), 상담 내용. 선택: 사건 분야, 진행 단계, 걱정되는 점. 자동 수집: 상담을 신청한 페이지 주소, 그리고 웹사이트 운영·보안을 위해 서버에 남는 접속 기록(IP 주소, 브라우저 종류, 접속 일시).",
      },
      { head: "3. 민감정보", body: "상담 내용에 범죄경력, 건강, 가족관계 같은 민감정보가 들어갈 수 있습니다. 이 정보는 별도 동의를 받아 상담에 필요한 범위에서만 처리합니다." },
      { head: "4. 보유 기간", body: "상담 목적을 이루면 지체 없이 파기합니다. 사건 의뢰로 이어진 경우에는 사건 처리에 필요한 기간과 관련 법령이 보존하도록 정한 기간 동안 보관합니다." },
      { head: "5. 파기 절차와 방법", body: "보유 기간이 지나거나 목적을 이룬 정보는 지체 없이 파기합니다. 전자 파일은 되살릴 수 없는 방법으로 지우고, 종이 문서는 분쇄하거나 소각합니다." },
      { head: "6. 제3자 제공", body: "이용자의 동의 없이 제3자에게 제공하지 않습니다. 다만 법령에 특별한 규정이 있거나 수사기관이 법령에 따른 절차로 요구하는 경우는 예외입니다." },
      {
        head: "7. 처리 위탁과 국외 이전",
        body: "웹사이트 운영과 상담 신청 처리를 위해 다음 업체에 개인정보 처리를 맡기며, 이 과정에서 개인정보가 국외로 이전됩니다. 이전은 상담을 신청할 때 네트워크로 전송하는 방식으로 이루어지고, 보유 기간은 4와 같습니다.",
      },
      { body: "① Supabase Inc.(미국) - 상담 신청 정보 저장(데이터베이스). 저장 위치: 일본(도쿄) 클라우드 서버. 이전 항목: 2의 상담 신청 항목" },
      { body: "② Formspree, Inc.(미국) - 상담 신청 내용을 사무소 이메일로 전달. 이전 항목: 2의 상담 신청 항목" },
      { body: "③ 텔레그램(Telegram) - 새 상담 신청을 사무소 담당자 메신저로 알림. 이전 항목: 이름, 연락처, 상담 내용" },
      { body: "④ Vercel Inc.(미국) - 웹사이트 호스팅. 이전 항목: 접속 기록" },
      { body: "국외 이전을 원하지 않으면 홈페이지로 신청하지 않고 {contact}로 상담을 신청할 수 있습니다. 이 경우에도 상담을 받는 데 불이익은 없습니다." },
      {
        head: "8. 자동 수집 장치(쿠키·방문 분석)",
        body: "방문 통계를 내고 웹사이트를 고치는 데 쓰기 위해 구글 애널리틱스, 네이버 애널리틱스(쿠키 사용)와 Vercel 웹 분석(쿠키 없이 익명 통계)을 쓸 수 있습니다. 이름이나 연락처처럼 개인을 알아볼 수 있는 정보는 담지 않습니다. 쿠키 저장은 브라우저 설정에서 거부할 수 있고, 거부해도 웹사이트 이용에는 지장이 없습니다.",
      },
      { head: "9. 이용자의 권리", body: "이용자는 언제든지 자신의 개인정보를 열람하거나 정정·삭제·처리정지를 요구할 수 있고, 동의를 철회할 수 있습니다. {contact}로 요청하면 지체 없이 조치합니다." },
      { head: "10. 안전성 확보 조치", body: "관리자 계정과 권한을 나누어 관리하고, 데이터베이스 접근을 통제하며, 모든 전송 구간을 암호화(HTTPS)합니다." },
      { head: "11. 개인정보 보호책임자와 문의", body: "개인정보 보호책임자: 김한솔 변호사. 개인정보 관련 문의·고충은 {contact}로 연락해 주세요." },
      {
        head: "12. 권익 침해 구제",
        body: "개인정보 침해에 대한 신고나 상담은 개인정보침해신고센터(국번 없이 118), 개인정보분쟁조정위원회(1833-6972), 경찰청 사이버수사국(국번 없이 182)에 할 수 있습니다.",
      },
      { head: "13. 시행일", body: "이 개인정보처리방침은 2026년 10월 10일부터 적용합니다. 내용이 바뀌면 이 페이지에 알립니다." },
    ],
  },
  disclaimer: {
    path: "/disclaimer",
    title: "면책공고",
    blocks: [
      { body: "본 웹사이트에 게시된 내용은 일반적인 법률 정보 제공 목적으로 작성되었으며, 구체적인 사건에 대한 법률 자문이나 의뢰인-변호사 관계의 성립을 전제로 하지 않습니다." },
      { body: "본 웹사이트의 정보만을 근거로 한 의사결정은 권장되지 않으며, 실제 사건에 대한 상담은 변호사와의 직접 상담을 통해 이루어져야 합니다." },
      { body: "{topic} 본 웹사이트의 정보 오류나 이로 인한 결과에 대해 책임을 지지 않습니다." },
    ],
  },
  "email-refuse": {
    path: "/email-refuse",
    title: "이메일무단수집거부",
    blocks: [
      { body: "본 웹사이트에 게시된 이메일 주소는 전자우편주소 수집 프로그램이나 그 밖의 기술적 장치를 사용하여 무단으로 수집되는 것을 거부합니다." },
      { body: "이를 위반 시 정보통신망법에 의해 형사 처벌됩니다." },
    ],
  },
}

export const LEGAL_STRINGS = [...Object.values(DOCS).flatMap((d) => [d.title, ...d.blocks.flatMap((b) => (b.head ? [b.head, b.body] : [b.body]))]), "이 웹사이트의 메신저 문의"]

export function legalMetadata(lang: Lang, kind: LegalKind): Metadata {
  return { title: T(lang)(DOCS[kind].title), alternates: foreignAlternates(lang, DOCS[kind].path) }
}

export function LegalPage({ lang, kind }: { lang: Lang; kind: LegalKind }) {
  const t = T(lang)
  const doc = DOCS[kind]
  const topic = lang === "ko" ? siteConfig.nameTopic : t(siteConfig.name)
  /** 문의처: 한국어는 대표 전화, 외국어 사이트는 전화 없이 메신저 문의 */
  const contact = lang === "ko" ? `대표 전화(${siteConfig.phone})` : t("이 웹사이트의 메신저 문의")
  return (
    <main className="min-h-screen">
      <div className="pt-12 md:pt-16 px-6 md:px-12 lg:px-20 pb-20">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-8">{t(doc.title)}</h1>
        <div className="max-w-2xl text-sm text-muted-foreground leading-relaxed space-y-6">
          {doc.blocks.map((b) => (
            <p key={b.body}>
              {b.head && (
                <>
                  <strong className="text-foreground">{t(b.head)}</strong>
                  <br />
                </>
              )}
              {t(b.body, { topic, contact })}
            </p>
          ))}
        </div>
        <Link href={L(lang, "/")} className="inline-block mt-10 text-sm text-primary hover:underline">
          {t("← 홈으로")}
        </Link>
      </div>
    </main>
  )
}
