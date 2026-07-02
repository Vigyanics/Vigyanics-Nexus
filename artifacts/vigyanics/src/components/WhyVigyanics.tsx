import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Hammer, Compass, Lightbulb, Package, School } from "lucide-react";

const reasons = [
  {
    icon: Hammer,
    title: "Learn by Building",
    description: "Students learn concepts better through hands-on experimentation and real-world project building — not just reading or listening.",
    color: "#00D4FF",
  },
  {
    icon: Compass,
    title: "Guidance Beyond Kits",
    description: "We provide mentorship, troubleshooting and support throughout the entire learning and building journey — not just the kit delivery.",
    color: "#00C896",
  },
  {
    icon: Lightbulb,
    title: "Practical Innovation",
    description: "Focus on creativity, experimentation and execution instead of only theoretical learning. Every session ends with something built.",
    color: "#8B5CF6",
  },
  {
    icon: Package,
    title: "Components + Learning Ecosystem",
    description: "Access electronics components, DIY kits and educational support together under one ecosystem — no need to juggle multiple vendors.",
    color: "#F59E0B",
  },
  {
    icon: School,
    title: "Support for Schools & Innovation Labs",
    description: "Programs, workshops and innovation support fully aligned with ATL and modern STEM learning initiatives for every school level.",
    color: "#EF4444",
  },
];

const badges = [
  { label: "Project-Based", color: "#00D4FF" },
  { label: "ATL Aligned", color: "#00C896" },
  { label: "Competition Ready", color: "#8B5CF6" },
  { label: "Future-Ready", color: "#F59E0B" },
  { label: "Mentor-Led", color: "#EF4444" },
  { label: "NEP Vision", color: "#00D4FF" },
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
            Why <span className="text-vigyanics-cyan">Vigyanics?</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Not all STEM programs are built equal. Here's what makes Vigyanics different from everything else.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Reason cards */}
          <div className="space-y-4">
            {reasons.map((r, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 group cursor-default transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)" }}
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${r.color}20`, border: `1.5px solid ${r.color}40` }}
                >
                  <r.icon className="w-5 h-5" style={{ color: r.color }} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-base mb-1">{r.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{r.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Badges + stats */}
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
                    boxShadow: `0 4px 20px ${badge.color}20`,
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
