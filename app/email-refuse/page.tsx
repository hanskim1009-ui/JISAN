import Link from "next/link"
import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "이메일무단수집거부",
}

export default function EmailRefusePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 px-6 md:px-12 lg:px-20 pb-20">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-8">
          이메일무단수집거부
        </h1>
        <div className="max-w-2xl text-sm text-muted-foreground leading-relaxed space-y-6">
          <p>
            본 웹사이트에 게시된 이메일 주소는 전자우편주소 수집 프로그램이나 그 밖의 기술적 장치를 사용하여 무단으로 수집되는 것을 거부합니다.
          </p>
          <p>
            이를 위반 시 정보통신망법에 의해 형사 처벌됩니다.
          </p>
        </div>
        <Link href="/" className="inline-block mt-10 text-sm text-primary hover:underline">
          ← 홈으로
        </Link>
      </div>
    </main>
  )
}
