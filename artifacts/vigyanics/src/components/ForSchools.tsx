import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, GraduationCap, BookOpen, Trophy, Wrench, ArrowRight } from "lucide-react";

const offerings = [
  {
    icon: Building2,
    title: "ATL Lab Setup & Management",
    description: "End-to-end Atal Tinkering Lab setup — from procurement to interior design to operational support. We handle everything so you can focus on students.",
    color: "#00D4FF",
  },
  {
    icon: Wrench,
    title: "Innovation Lab Development",
    description: "Transform empty rooms into world-class innovation labs with curated equipment, tools, and learning stations designed for exploratory STEM learning.",
    color: "#00C896",
  },
  {
    icon: GraduationCap,
    title: "Teacher Training & Upskilling",
    description: "Intensive workshops and ongoing support for teachers to confidently facilitate project-based STEM learning — no prior experience needed.",
    color: "#8B5CF6",
  },
  {
    icon: BookOpen,
    title: "STEM Curriculum Integration",
    description: "Structured curriculum mapped to CBSE, ICSE, and NITI Aayog ATL frameworks. Weekly sessions, lesson plans, and student workbooks included.",
    color: "#F59E0B",
  },
  {
    icon: Trophy,
    title: "Competition Mentoring",
    description: "Prepare students for national and state-level competitions — from science olympiads to robotics championships to Smart India Hackathon.",
    color: "#EF4444",
  },
];

const stats = [
  { value: "80+", label: "Partner Schools" },
  { value: "100%", label: "ATL Compliance" },
  { value: "24/7", label: "Support Access" },
];

export default function ForSchools() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="schools" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-cyan-50/20" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-vigyanics-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-vigyanics-purple/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-schools" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#0B1F3A" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-schools)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Header + stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/5">
              For Schools & ATL Labs
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-vigyanics-blue mt-4 mb-6 leading-tight">
              Transform Your School into an
              <span className="text-gradient"> Innovation Hub</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              Vigyanics partners with schools across India to build world-class STEM infrastructure, train educators, and mentor students from day one. We don't just deliver equipment — we deliver outcomes.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {stats.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="rounded-xl p-4 text-center border border-gray-100 bg-white shadow-sm"
                >
                  <div className="text-3xl font-display font-bold text-vigyanics-blue mb-1">{s.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 text-vigyanics-blue font-semibold text-base group"
              data-testid="link-school-partnership"
            >
              Start a school partnership
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.a>
          </motion.div>

          {/* Right: Feature cards */}
          <div className="space-y-4">
            {offerings.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-default group"
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${item.color}15`, border: `1.5px solid ${item.color}30` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-vigyanics-blue mb-1 text-base">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
