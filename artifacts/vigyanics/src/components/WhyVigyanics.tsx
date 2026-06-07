import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { label: "Project-based learning", us: true, them: false },
  { label: "Personalized mentorship", us: true, them: false },
  { label: "ATL curriculum alignment", us: true, them: false },
  { label: "Future-ready curriculum", us: true, them: false },
  { label: "Innovation culture", us: true, them: false },
  { label: "Competition support", us: true, them: false },
  { label: "Real hardware & software", us: true, them: false },
  { label: "Outcome-based assessment", us: true, them: false },
];

const badges = [
  { label: "Project-Based", color: "#00D4FF" },
  { label: "ATL Aligned", color: "#00C896" },
  { label: "Competition Ready", color: "#8B5CF6" },
  { label: "Future-Ready", color: "#F59E0B" },
  { label: "Mentor-Led", color: "#EF4444" },
  { label: "Research Oriented", color: "#00D4FF" },
];

export default function WhyVigyanics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-vigyanics-blue to-slate-900" />
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse">
              <polygon points="28,2 54,16 54,44 28,58 2,44 2,16" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5" />
              <polygon points="28,52 54,66 54,94 28,108 2,94 2,66" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-vigyanics-cyan/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/10">
            The Difference
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-4 mb-6">
            Why Choose <span className="text-vigyanics-cyan">Vigyanics</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Not all STEM programs are built equal. Here's what makes Vigyanics different.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Comparison table */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-white/10"
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
          >
            <div className="grid grid-cols-3 px-6 py-4 border-b border-white/10">
              <span className="text-sm font-semibold text-gray-400 col-span-1">Feature</span>
              <span className="text-sm font-bold text-vigyanics-cyan text-center">Vigyanics</span>
              <span className="text-sm font-semibold text-gray-500 text-center">Others</span>
            </div>
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.07 }}
                className="grid grid-cols-3 px-6 py-3.5 border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                <span className="text-sm text-gray-300 col-span-1 flex items-center">{f.label}</span>
                <div className="flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-vigyanics-green/20 border border-vigyanics-green/40 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-vigyanics-green" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {badges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.08 }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold cursor-default transition-all duration-200"
                  style={{
                    background: `${badge.color}15`,
                    border: `1.5px solid ${badge.color}40`,
                    color: badge.color,
                    boxShadow: `0 4px 20px ${badge.color}20`
                  }}
                >
                  {badge.label}
                </motion.div>
              ))}
            </div>

            <div className="rounded-2xl p-8 border border-vigyanics-cyan/20 text-center" style={{ background: "rgba(0,212,255,0.05)", backdropFilter: "blur(12px)" }}>
              <div className="text-5xl font-display font-bold text-vigyanics-cyan mb-2">98%</div>
              <p className="text-gray-300 text-sm">of students say Vigyanics made learning feel exciting for the first time</p>
            </div>
            <div className="rounded-2xl p-8 border border-vigyanics-green/20 text-center" style={{ background: "rgba(0,200,150,0.05)", backdropFilter: "blur(12px)" }}>
              <div className="text-5xl font-display font-bold text-vigyanics-green mb-2">3x</div>
              <p className="text-gray-300 text-sm">more project completions compared to traditional STEM programs</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
