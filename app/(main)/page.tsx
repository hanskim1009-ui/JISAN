import type { Metadata } from "next"
import { HomeHero } from "@/components/main/home-hero"
import { PracticeGrid } from "@/components/main/practice-grid"
import { PeopleSection } from "@/components/main/people-section"
import { AboutSection } from "@/components/about-section"
// 재공개 시 아래 import·컴포넌트 주석 해제 (광고 규정: 익명 처리, 결과 비율·건수 표현 금지)
// import { SuccessCasesSection } from "@/components/success-cases-section"
// import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { MapSection } from "@/components/map-section"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default function Page() {
  return (
    <>
      <HomeHero />
      <PracticeGrid />
      <PeopleSection />
      <AboutSection />
      {/* <SuccessCasesSection /> */}
      {/* <TestimonialsSection /> */}
      <ContactSection />
      <MapSection />
    </>
  )
}
