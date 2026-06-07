import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User, School, FlaskConical, Lightbulb } from "lucide-react";

const audiences = [
  {
    icon: User,
    title: "Students",
    subtitle: "Classes 5–12",
    description: "Build real projects, compete in national events, and discover if engineering or science is your calling — years before college.",
    color: "#00D4FF",
    glow: "rgba(0,212,255,0.25)",
    bullets: ["Project-based curriculum", "Expert mentorship", "Competition prep", "Portfolio building"],
  },
  {
    icon: School,
    title: "Schools",
    subtitle: "CBSE, ICSE & State Boards",
    description: "Elevate your school's STEM profile with world-class infrastructure, trained teachers, and a proven curriculum that delivers outcomes.",
    color: "#00C896",
    glow: "rgba(0,200,150,0.25)",
    bullets: ["ATL lab setup", "Teacher training", "Curriculum support", "Monthly reporting"],
  },
  {
    icon: FlaskConical,
    title: "ATL Labs",
    subtitle: "Atal Tinkering Labs",
    description: "Transform your ATL from a compliance checkbox into a thriving innovation center with active student engagement year-round.",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.25)",
    bullets: ["NITI Aayog alignment", "Activity calendar", "Competition entry", "Documentation support"],
  },
  {
    icon: Lightbulb,
    title: "Innovation Centers",
    subtitle: "Makerspace & Research Labs",
    description: "Design, equip, and run a state-of-the-art innovation center with curated tools and a structured program for year-round engagement.",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.25)",
    bullets: ["Custom lab design", "Equipment curation", "Programming support", "Showcase events"],
  },
];

export default function DesignedFor() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50/20" />
      <div className="absolute inset-0 opacity-25">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-df" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#0B1F3A" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-df)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/5">
            Built For You
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-vigyanics-blue mt-4 mb-6">
            Designed For <span className="text-gradient">Every Stakeholder</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Whether you're a curious student, a visionary principal, or an ATL coordinator — Vigyanics has a path built for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {audiences.map((aud, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="relative group rounded-2xl p-7 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default flex flex-col"
            >
              {/* Bottom gradient bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"
                style={{ background: `linear-gradient(90deg, ${aud.color}, ${aud.color}80)` }}
              />
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${aud.glow}, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${aud.color}15`, border: `1.5px solid ${aud.color}30` }}
              >
                <aud.icon className="w-7 h-7" style={{ color: aud.color }} />
              </div>

              <div className="mb-1">
                <h3 className="text-xl font-display font-bold text-vigyanics-blue">{aud.title}</h3>
                <p className="text-xs font-semibold mt-0.5" style={{ color: aud.color }}>{aud.subtitle}</p>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed my-4 flex-grow">{aud.description}</p>

              <ul className="space-y-2">
                {aud.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: aud.color }} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
