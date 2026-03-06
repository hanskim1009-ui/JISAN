import { Navigation } from "@/components/navigation"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { Hero } from "@/components/hero"
import { KeywordTags } from "@/components/keyword-tags"
import { AboutSection } from "@/components/about-section"
import { PracticeSection } from "@/components/practice-section"
import { TeamSection } from "@/components/team-section"
import { SuccessCasesSection } from "@/components/success-cases-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { EditorialBreak } from "@/components/editorial-break"
import { ContactSection } from "@/components/contact-section"
import { MapSection } from "@/components/map-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main className="pb-24 md:pb-0">
      <Navigation />
      <FloatingCTA />
      <BackToTop />
      <div id="main-content">
        <Hero />
        <KeywordTags />
        <AboutSection />
        <TeamSection />
        <PracticeSection />
        <SuccessCasesSection />
        <TestimonialsSection />
        <EditorialBreak />
        <ContactSection />
        <MapSection />
        <Footer />
      </div>
    </main>
  )
}

