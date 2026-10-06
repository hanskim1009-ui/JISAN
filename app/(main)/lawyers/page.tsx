import type { Metadata } from "next"
import { TeamSection } from "@/components/team-section"

export const metadata: Metadata = {
  title: "구성원",
  description: "사건을 직접 맡는 변호사들의 경력, 학력, 주요 업무 사례를 소개합니다.",
  alternates: { canonical: "/lawyers" },
}

export default function LawyersPage() {
  return <TeamSection />
}
