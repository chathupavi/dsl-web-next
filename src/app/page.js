import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        {/*
          Coming next:

          <ServiceTicker />
          <SecondLifeSection />
          <WhyDeluxeSection />
          <SpeedSection />
          <TransformationSection />
          <ProcessSection />
          <MaterialsSection />
          <RestorationSection />
          <TrustSection />
          <ReviewsSection />
          <SendPhotoSection />
          <LocationSection />
          <SocialSection />
          <FinalCTASection />
        */}
      </main>

      <Footer />
    </>
  );
}