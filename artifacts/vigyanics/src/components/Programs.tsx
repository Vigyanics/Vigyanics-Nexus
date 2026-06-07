import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Cpu, Bot, Brain, FlaskConical, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: FlaskConical,
    title: "STEM Foundations",
    tag: "Classes 5–8",
    description: "Hands-on experiments with electronics, physics, chemistry, and biology. Students build circuits, conduct experiments, and present findings — no theory-only lessons.",
    highlights: ["Circuit building", "Physics experiments", "Chemistry labs", "Scientific method"],
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.3)",
    gradient: "from-[#00D4FF]/10 to-[#0B1F3A]/5",
    border: "border-[#00D4FF]/20",
  },
  {
    icon: Bot,
    title: "Robotics",
    tag: "All Levels",
    description: "Design, build, program, and compete with real robots. From simple line followers to autonomous systems — students experience engineering from concept to competition.",
    highlights: ["Line follower bots", "Autonomous navigation", "Sensor integration", "Competition prep"],
    color: "#00C896",
    glow: "rgba(0,200,150,0.3)",
    gradient: "from-[#00C896]/10 to-[#0B1F3A]/5",
    border: "border-[#00C896]/20",
  },
  {
    icon: Brain,
    title: "AI & Future Tech",
    tag: "Classes 8–12",
    description: "Dive into machine learning, computer vision, and neural networks. Students build real AI models and learn the technologies shaping the next decade.",
    highlights: ["Machine learning", "Computer vision", "Neural networks", "Python & TensorFlow"],
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.3)",
    gradient: "from-[#8B5CF6]/10 to-[#0B1F3A]/5",
    border: "border-[#8B5CF6]/20",
  },
  {
    icon: Cpu,
    title: "Innovation Labs",
    tag: "ATL & Schools",
    description: "Full ATL lab setup, project incubation, teacher training, and innovation culture development. Transform your school into a hub of student-led invention.",
    highlights: ["ATL setup & management", "Project incubation", "Teacher upskilling", "Showcase events"],
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.3)",
    gradient: "from-[#F59E0B]/10 to-[#0B1F3A]/5",
    border: "border-[#F59E0B]/20",
  },
];

export default function Programs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="programs" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-vigyanics-blue" />
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M10 30 H 50 M 30 10 V 50" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" fill="none" />
              <circle cx="30" cy="30" r="3" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" />
              <circle cx="10" cy="30" r="1.5" fill="rgba(0,212,255,0.4)" />
              <circle cx="50" cy="30" r="1.5" fill="rgba(0,212,255,0.4)" />
              <circle cx="30" cy="10" r="1.5" fill="rgba(0,212,255,0.4)" />
              <circle cx="30" cy="50" r="1.5" fill="rgba(0,212,255,0.4)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-vigyanics-cyan/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/10">
            What We Teach
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-4 mb-6">
            Programs Built for
            <br />
            <span className="text-vigyanics-cyan">Tomorrow's Makers</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Each program is structured around real projects, real tools, and real outcomes — not worksheets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((prog, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative group rounded-2xl p-8 border ${prog.border} bg-gradient-to-br ${prog.gradient} backdrop-blur-sm overflow-hidden cursor-default`}
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl"
                style={{ boxShadow: `inset 0 0 60px ${prog.glow}` }}
              />

              {/* Icon */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${prog.color}20`, border: `1.5px solid ${prog.color}50` }}
                >
                  <prog.icon className="w-7 h-7" style={{ color: prog.color }} />
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: `${prog.color}15`, color: prog.color, border: `1px solid ${prog.color}30` }}
                >
                  {prog.tag}
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-white mb-3">{prog.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">{prog.description}</p>

              <ul className="space-y-2 mb-8">
                {prog.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: prog.color }} />
                    {h}
                  </li>
                ))}
              </ul>

              <button
                className="flex items-center gap-2 text-sm font-semibold group/btn transition-all duration-200"
                style={{ color: prog.color }}
                data-testid={`button-learn-more-${prog.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
