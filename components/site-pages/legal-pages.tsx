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
      { body: "{topic} 개인정보 보호법에 따라 이용자의 개인정보 보호 및 권익을 보장하고 있습니다." },
      { head: "1. 수집하는 개인정보 항목", body: "상담 신청 시 이름, 연락처, 상담 내용 등 필요한 최소한의 정보를 수집합니다." },
      { head: "2. 개인정보의 보유 및 이용 기간", body: "상담 목적 달성 후 지체 없이 파기합니다. 다만, 관련 법령에 따라 보존해야 하는 경우 해당 기간 동안 보관합니다." },
      { head: "3. 개인정보의 제3자 제공", body: "이용자의 동의 없이 제3자에게 제공하지 않습니다." },
      { body: "상세 내용은 사무소로 문의해 주시기 바랍니다." },
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

export const LEGAL_STRINGS = Object.values(DOCS).flatMap((d) => [d.title, ...d.blocks.flatMap((b) => (b.head ? [b.head, b.body] : [b.body]))])

export function legalMetadata(lang: Lang, kind: LegalKind): Metadata {
  return { title: T(lang)(DOCS[kind].title), alternates: foreignAlternates(lang, DOCS[kind].path) }
}

export function LegalPage({ lang, kind }: { lang: Lang; kind: LegalKind }) {
  const t = T(lang)
  const doc = DOCS[kind]
  const topic = lang === "ko" ? siteConfig.nameTopic : t(siteConfig.name)
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
              {t(b.body, { topic })}
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
