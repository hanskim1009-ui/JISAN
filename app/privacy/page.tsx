import Link from "next/link"
import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "개인정보처리방침",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 px-6 md:px-12 lg:px-20 pb-20">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-8">
          개인정보처리방침
        </h1>
        <div className="max-w-2xl text-sm text-muted-foreground leading-relaxed space-y-6">
          <p>법률사무소 지산은 개인정보 보호법에 따라 이용자의 개인정보 보호 및 권익을 보장하고 있습니다.</p>
          <p>
            <strong className="text-foreground">1. 수집하는 개인정보 항목</strong>
            <br />
            상담 신청 시 이름, 연락처, 상담 내용 등 필요한 최소한의 정보를 수집합니다.
          </p>
          <p>
            <strong className="text-foreground">2. 개인정보의 보유 및 이용 기간</strong>
            <br />
            상담 목적 달성 후 지체 없이 파기합니다. 다만, 관련 법령에 따라 보존해야 하는 경우 해당 기간 동안 보관합니다.
          </p>
          <p>
            <strong className="text-foreground">3. 개인정보의 제3자 제공</strong>
            <br />
            이용자의 동의 없이 제3자에게 제공하지 않습니다.
          </p>
          <p>
            상세 내용은 사무소로 문의해 주시기 바랍니다.
          </p>
        </div>
        <Link href="/" className="inline-block mt-10 text-sm text-primary hover:underline">
          ← 홈으로
        </Link>
      </div>
    </main>
  )
}
