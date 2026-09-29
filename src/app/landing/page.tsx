import React from "react";
import {
  Navbar,
  HeroSection,
  ProductPreview,
  CoreFeaturesSection,
  FinalCTASection,
  Footer,
} from "@/components/marketing";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text antialiased selection:bg-primary/25 selection:text-primary">
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <ProductPreview />
        <CoreFeaturesSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
