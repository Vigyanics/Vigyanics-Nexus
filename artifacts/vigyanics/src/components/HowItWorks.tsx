import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Hammer, Star } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Explore & Choose",
    description: "Students discover their interests — whether it's robotics, AI, electronics, or innovation labs. We help them find their path through an assessment and demo session.",
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.3)",
  },
  {
    number: "02",
    icon: Hammer,
    title: "Learn by Building",
    description: "Every concept is taught through a hands-on project. Students work with real components, real software, and real tools — guided by expert mentors at every step.",
    color: "#00C896",
    glow: "rgba(0,200,150,0.3)",
  },
  {
    number: "03",
    icon: Star,
    title: "Create & Showcase",
    description: "Students present their work to peers, schools, and competitions. From science fairs to national robotics championships — we prepare them for the stage.",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.3)",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-vigyanics-cyan/5 via-vigyanics-purple/5 to-vigyanics-green/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/5">
            The Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-vigyanics-blue mt-4 mb-6">
            How Vigyanics <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            A structured path from curiosity to creation — every student moves at their own pace, guided by expert mentors.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-0">
          {/* Connecting line (desktop) */}
          <div className="absolute hidden lg:block top-1/2 left-[16.66%] right-[16.66%] h-px -translate-y-1/2 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              className="h-full origin-left"
              style={{
                background: "linear-gradient(90deg, #00D4FF, #00C896, #8B5CF6)",
                boxShadow: "0 0 12px rgba(0,212,255,0.4)"
              }}
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.2 }}
              className="relative z-10 flex-1 flex flex-col items-center text-center px-6"
            >
              {/* Step number badge */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative mb-8 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${step.color}20, ${step.color}05)`,
                  border: `2px solid ${step.color}40`,
                  boxShadow: `0 8px 32px ${step.glow}`
                }}
              >
                <step.icon className="w-10 h-10" style={{ color: step.color }} />
                <div
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: step.color }}
                >
                  {idx + 1}
                </div>
              </motion.div>

              <h3 className="text-2xl font-display font-bold text-vigyanics-blue mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
