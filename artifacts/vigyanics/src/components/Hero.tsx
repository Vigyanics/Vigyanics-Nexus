import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Dark gradient overlay so text stays readable */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(11,31,58,0.55) 0%, rgba(11,31,58,0.4) 50%, rgba(11,31,58,0.65) 100%)" }} />

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, rgba(11,31,58,0.15))" }} />

      {/* Content */}
      <div className="container relative z-20 px-4 md:px-6 mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(0,212,255,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-vigyanics-cyan" />
          <span>Building the next generation of innovators</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-white max-w-4xl leading-[1.1] mb-6 drop-shadow-lg"
        >
          Where <span className="text-vigyanics-cyan">Curiosity</span><br /> Meets Creation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 font-medium leading-relaxed drop-shadow"
        >
          Hands-on STEM, Robotics & AI learning. From concepts to real-world projects — not just theory.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-8 rounded-full bg-vigyanics-cyan hover:bg-vigyanics-cyan/90 text-vigyanics-blue text-lg font-bold shadow-[0_8px_30px_rgba(0,212,255,0.4)] hover:shadow-[0_8px_40px_rgba(0,212,255,0.6)] transition-all duration-300 hover:-translate-y-1 border-none"
          >
            Book Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white text-lg font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
          >
            Explore Programs
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div className="w-[30px] h-[50px] rounded-full border-2 border-white/40 flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-vigyanics-cyan rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
