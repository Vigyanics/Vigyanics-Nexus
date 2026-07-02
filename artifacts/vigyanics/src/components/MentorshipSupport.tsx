import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Wrench, Cpu, Bot, Lightbulb, Zap, ArrowRight, MessageCircle } from "lucide-react";

const supportAreas = [
  { icon: Compass, label: "Project Guidance", desc: "Step-by-step direction for your project idea", color: "#00D4FF" },
  { icon: Wrench, label: "Troubleshooting", desc: "Debug circuits, code and mechanical issues", color: "#00C896" },
  { icon: Cpu, label: "Electronics Understanding", desc: "Learn how components and circuits actually work", color: "#8B5CF6" },
  { icon: Bot, label: "Robotics Assistance", desc: "Help with motors, sensors, control and movement", color: "#F59E0B" },
  { icon: Lightbulb, label: "Innovation Mentoring", desc: "Refine your idea into a working prototype", color: "#EF4444" },
  { icon: Zap, label: "Execution Support", desc: "Support to get from concept to finished model", color: "#00D4FF" },
];

export default function MentorshipSupport() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0B1F3A 0%, #0d2444 50%, #0B1F3A 100%)" }} />
      {/* Circuit pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mentor-circuit" width="70" height="70" patternUnits="userSpaceOnUse">
              <path d="M0 35 H30 M40 35 H70 M35 0 V30 M35 40 V70" stroke="rgba(0,212,255,0.5)" strokeWidth="0.6" fill="none" />
              <circle cx="35" cy="35" r="4" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="0.8" />
              <circle cx="0" cy="35" r="2" fill="rgba(0,200,150,0.5)" />
              <circle cx="70" cy="35" r="2" fill="rgba(0,200,150,0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mentor-circuit)" />
        </svg>
      </div>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07), transparent)" }} />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/10">
            Expert Support
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-4 mb-6 leading-tight">
            Got Stuck?{" "}
            <span className="text-vigyanics-cyan">We Help You</span>
            <br />Build Further.
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From understanding components to troubleshooting projects, our experts help students and makers through every stage of the journey.
          </p>
        </motion.div>

        {/* Support areas grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {supportAreas.map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.09 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="flex items-start gap-4 p-6 rounded-2xl border border-white/8 group cursor-default transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)" }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${area.color}20`, border: `1.5px solid ${area.color}40` }}
              >
                <area.icon className="w-5 h-5" style={{ color: area.color }} />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base mb-1">{area.label}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{area.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="https://wa.me/919999999999?text=Hi! I need help with my STEM/Robotics project."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-vigyanics-cyan text-vigyanics-blue font-bold text-base shadow-[0_8px_30px_rgba(0,212,255,0.35)] hover:shadow-[0_12px_40px_rgba(0,212,255,0.5)] transition-all duration-300"
            data-testid="button-get-guidance"
          >
            <MessageCircle className="w-5 h-5" /> Get Guidance
          </motion.a>
          <motion.a
            href="#programs"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
          >
            Explore Programs <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
