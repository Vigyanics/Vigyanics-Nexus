import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import NeuralBackground from "./NeuralBackground";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60">
        <NeuralBackground />
      </div>
      
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vigyanics-cyan/10 via-transparent to-transparent opacity-60 mix-blend-screen"></div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vigyanics-blue/5 border border-vigyanics-cyan/30 text-vigyanics-blue dark:text-white text-sm font-medium mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(0,212,255,0.15)]"
        >
          <Sparkles className="w-4 h-4 text-vigyanics-cyan" />
          <span>Building the next generation of innovators</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-vigyanics-blue dark:text-white max-w-4xl leading-[1.1] mb-6"
        >
          Where <span className="text-gradient">Curiosity</span><br/> Meets Creation
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 font-medium leading-relaxed"
        >
          Hands-on STEM, Robotics & AI learning. From concepts to real-world projects — not just theory.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-vigyanics-blue hover:bg-vigyanics-blue/90 text-white text-lg font-semibold shadow-[0_8px_30px_rgb(11,31,58,0.2)] hover:shadow-[0_8px_30px_rgb(0,212,255,0.3)] transition-all duration-300 hover:-translate-y-1">
            Book Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-gray-800 text-vigyanics-blue dark:text-white text-lg font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
            Explore Programs
          </Button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sm text-gray-500 font-medium"
      >
        <div className="w-[30px] h-[50px] rounded-full border-2 border-gray-400 flex justify-center p-1">
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
