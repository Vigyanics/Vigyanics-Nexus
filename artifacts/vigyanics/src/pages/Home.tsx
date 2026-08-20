import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueProp from "@/components/ValueProp";
import Programs from "@/components/Programs";
import HowItWorks from "@/components/HowItWorks";
import WhyVigyanics from "@/components/WhyVigyanics";
import ForSchools from "@/components/ForSchools";
import StoreSection from "@/components/StoreSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import MentorshipSupport from "@/components/MentorshipSupport";
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
        <ValueProp />
        <Programs />
        <HowItWorks />
        <WhyVigyanics />
        <ForSchools />
        <StoreSection />
        <ProjectShowcase />
        <MentorshipSupport />
        <DesignedFor />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
