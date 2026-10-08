import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "관리",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F4F5F7] text-jisan-ink">{children}</div>
}
