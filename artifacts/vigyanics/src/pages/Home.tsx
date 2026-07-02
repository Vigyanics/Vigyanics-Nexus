import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStats from "@/components/TrustStats";
import ValueProp from "@/components/ValueProp";
import Programs from "@/components/Programs";
import HowItWorks from "@/components/HowItWorks";
import WhyVigyanics from "@/components/WhyVigyanics";
import ForSchools from "@/components/ForSchools";
import StoreSection from "@/components/StoreSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import MentorshipSupport from "@/components/MentorshipSupport";
import SuccessStories from "@/components/SuccessStories";
import Testimonials from "@/components/Testimonials";
import DesignedFor from "@/components/DesignedFor";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-mesh font-sans overflow-x-hidden selection:bg-vigyanics-cyan selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustStats />
        <ValueProp />
        <Programs />
        <HowItWorks />
        <WhyVigyanics />
        <ForSchools />
        <StoreSection />
        <ProjectShowcase />
        <MentorshipSupport />
        <SuccessStories />
        <Testimonials />
        <DesignedFor />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
