import Link from "next/link"
import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "면책공고",
}

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 px-6 md:px-12 lg:px-20 pb-20">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-8">
          면책공고
        </h1>
        <div className="max-w-2xl text-sm text-muted-foreground leading-relaxed space-y-6">
          <p>
            본 웹사이트에 게시된 내용은 일반적인 법률 정보 제공 목적으로 작성되었으며, 구체적인 사건에 대한 법률 자문이나 의뢰인-변호사 관계의 성립을 전제로 하지 않습니다.
          </p>
          <p>
            본 웹사이트의 정보만을 근거로 한 의사결정은 권장되지 않으며, 실제 사건에 대한 상담은 변호사와의 직접 상담을 통해 이루어져야 합니다.
          </p>
          <p>
            법률사무소 지산은 본 웹사이트의 정보 오류나 이로 인한 결과에 대해 책임을 지지 않습니다.
          </p>
        </div>
        <Link href="/" className="inline-block mt-10 text-sm text-primary hover:underline">
          ← 홈으로
        </Link>
      </div>
    </main>
  )
}
