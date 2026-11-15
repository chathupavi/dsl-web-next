import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Transformations from "@/components/sections/Transformations";
import Process from "@/components/sections/Process";
import Reviews from "@/components/sections/Reviews";
import Location from "@/components/sections/Location";


export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Transformations />
        <Process />
        <Reviews />
        <Location />
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