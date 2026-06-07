import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Bot, Cpu, Brain, Zap, Wifi, X } from "lucide-react";

const projects = [
  {
    icon: Bot,
    category: "Robotics",
    title: "Autonomous Line Follower",
    description: "A self-navigating robot that follows complex paths using infrared sensors and PID control — built by Class 8 students in 6 weeks.",
    tech: ["Arduino", "IR Sensors", "PID Control"],
    color: "#00D4FF",
    level: "Intermediate",
  },
  {
    icon: Wifi,
    category: "IoT / Smart Home",
    title: "Smart Home Automation System",
    description: "Voice-controlled home automation with real-time monitoring — controls lights, fans, and security using NodeMCU and a custom Android app.",
    tech: ["NodeMCU", "MQTT", "Android"],
    color: "#00C896",
    level: "Advanced",
  },
  {
    icon: Brain,
    category: "AI Application",
    title: "Face Recognition Attendance",
    description: "An AI-powered attendance system using OpenCV and deep learning — marks student attendance automatically from a classroom camera feed.",
    tech: ["Python", "OpenCV", "TensorFlow"],
    color: "#8B5CF6",
    level: "Advanced",
  },
  {
    icon: Cpu,
    category: "Electronics",
    title: "ECG Heart Monitor",
    description: "A wearable ECG monitor built with precision analog circuits that captures real heart signals and displays them on an OLED screen.",
    tech: ["Op-Amp", "OLED", "Signal Processing"],
    color: "#F59E0B",
    level: "Advanced",
  },
  {
    icon: Zap,
    category: "Energy / Innovation",
    title: "Solar-Powered Water Purifier",
    description: "A solar-powered UV water purification system designed for rural areas — won Regional Innovation Award at Class 10 level.",
    tech: ["Solar Panel", "UV LEDs", "Arduino"],
    color: "#EF4444",
    level: "Beginner",
  },
  {
    icon: Bot,
    category: "Robotics",
    title: "Maze-Solving Robot",
    description: "An autonomous robot that maps and solves any maze using flood-fill algorithm and ultrasonic sensors — national competition finalist.",
    tech: ["Raspberry Pi", "Ultrasonic", "A* Algorithm"],
    color: "#00D4FF",
    level: "Expert",
  },
];

export default function ProjectShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="projects" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0a172e] to-slate-900" />
      <div className="absolute inset-0 opacity-15">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit2" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="80" height="80" fill="none" />
              <path d="M20 0 V20 H60 V60 H80" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" fill="none" />
              <circle cx="20" cy="20" r="2.5" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="0.8" />
              <circle cx="60" cy="60" r="2.5" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit2)" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vigyanics-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/10">
            Student Work
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-4 mb-6">
            Projects That <span className="text-vigyanics-cyan">Inspire</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Real projects built by real students. These aren't demos — they're working systems built from scratch.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.09 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => setActive(idx)}
              className="relative group rounded-2xl p-6 cursor-pointer overflow-hidden border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
              data-testid={`card-project-${idx}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${proj.color}20, transparent 70%)` }}
              />

              <div className="flex items-center justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${proj.color}15`, border: `1.5px solid ${proj.color}30` }}
                >
                  <proj.icon className="w-6 h-6" style={{ color: proj.color }} />
                </div>
                <div className="flex gap-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${proj.color}15`, color: proj.color }}
                  >
                    {proj.category}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-vigyanics-cyan transition-colors duration-200">{proj.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2">{proj.description}</p>

              <div className="flex flex-wrap gap-2">
                {proj.tech.map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                    {t}
                  </span>
                ))}
              </div>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-medium" style={{ color: proj.color }}>
                View details
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative max-w-lg w-full rounded-2xl p-8 border border-white/10 shadow-2xl"
                style={{ background: "#0B1F3A", backdropFilter: "blur(20px)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActive(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  data-testid="button-close-lightbox"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                {(() => {
                  const proj = projects[active];
                  return (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `${proj.color}20`, border: `1.5px solid ${proj.color}40` }}>
                          <proj.icon className="w-7 h-7" style={{ color: proj.color }} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold mb-1" style={{ color: proj.color }}>{proj.category}</div>
                          <h3 className="text-xl font-display font-bold text-white">{proj.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-6">{proj.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {proj.tech.map((t, i) => (
                          <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: `${proj.color}15`, color: proj.color, border: `1px solid ${proj.color}30` }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
