import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FlaskConical, Lightbulb, Puzzle, Rocket, Wrench } from "lucide-react";

const values = [
  {
    icon: FlaskConical,
    title: "Experimentation",
    description: "Students design real experiments, test hypotheses, and discover principles through direct hands-on engagement with materials and tools.",
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.25)",
  },
  {
    icon: Lightbulb,
    title: "Creativity",
    description: "Every session sparks original thinking. Students aren't following instructions — they're inventing solutions to problems they define themselves.",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.25)",
  },
  {
    icon: Puzzle,
    title: "Problem-Solving",
    description: "Real-world challenges that don't have a single right answer. Students learn to break down complexity and iterate rapidly toward solutions.",
    color: "#00C896",
    glow: "rgba(0,200,150,0.25)",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "From idea to prototype to showcase. Students experience the full arc of innovation — from concept to working product in front of an audience.",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    icon: Wrench,
    title: "Practical Learning",
    description: "No rote memorization. Every concept is immediately applied. Students retain knowledge because they built something with it.",
    color: "#EF4444",
    glow: "rgba(239,68,68,0.25)",
  },
];

export default function ValueProp() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30" />
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-vp" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#0B1F3A" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-vp)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-radial from-vigyanics-cyan/8 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-radial from-vigyanics-purple/8 to-transparent blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/5">
            Our Philosophy
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-vigyanics-blue mt-4 mb-6 leading-tight">
            Learning by Doing,<br />
            <span className="text-gradient">Not Memorizing</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            At Vigyanics, the textbook is a starting point — not a destination. Students discover principles by building, breaking, and rebuilding real things.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative group rounded-2xl p-8 bg-white border border-gray-100 shadow-sm cursor-default overflow-hidden ${idx === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
              style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${value.glow}, transparent 70%)` }}
              />
              {/* Icon */}
              <div
                className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${value.color}20, ${value.color}10)`, border: `1.5px solid ${value.color}40` }}
              >
                <value.icon className="w-7 h-7" style={{ color: value.color }} />
              </div>
              {/* Content */}
              <h3 className="relative z-10 text-xl font-display font-bold text-vigyanics-blue mb-3 group-hover:text-vigyanics-blue transition-colors">
                {value.title}
              </h3>
              <p className="relative z-10 text-gray-600 leading-relaxed text-sm">{value.description}</p>

              {/* Corner accent */}
              <div
                className="absolute bottom-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-tl-3xl"
                style={{ background: value.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
