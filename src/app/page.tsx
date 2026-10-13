import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { MultiUseSection } from "@/components/MultiUseSection";
import { OfferCard } from "@/components/OfferCard";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FAQSection } from "@/components/FAQSection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <BeforeAfterSection />
        <BenefitsSection />
        <MultiUseSection />
        <OfferCard />
        <HowItWorksSection />
        <ReviewsSection />
        <FAQSection />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
