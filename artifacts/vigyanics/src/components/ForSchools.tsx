import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, GraduationCap, BookOpen, Trophy, Wrench, Users, ArrowRight } from "lucide-react";

const offerings = [
  {
    icon: Building2,
    title: "ATL & Innovation Lab Support",
    description: "End-to-end Atal Tinkering Lab setup — from procurement to operations. NITI Aayog compliant documentation and reporting support included.",
    color: "#00D4FF",
  },
  {
    icon: Wrench,
    title: "STEM Workshops & Robotics Programs",
    description: "Structured STEM and robotics workshops for students of all levels. Curriculum-mapped sessions that complement school timetables.",
    color: "#00C896",
  },
  {
    icon: GraduationCap,
    title: "Teacher Enablement & Training",
    description: "Intensive workshops and ongoing upskilling for teachers to confidently facilitate project-based STEM learning — no prior experience needed.",
    color: "#8B5CF6",
  },
  {
    icon: Trophy,
    title: "Science Fair & Exhibition Support",
    description: "Project ideation, mentoring and technical support to help students prepare winning projects for school exhibitions and science fairs.",
    color: "#F59E0B",
  },
  {
    icon: BookOpen,
    title: "Curriculum-Aligned Project Learning",
    description: "Structured project-based learning programs mapped to CBSE, ICSE, and NITI Aayog ATL frameworks with lesson plans and workbooks.",
    color: "#EF4444",
  },
  {
    icon: Users,
    title: "Hands-On Innovation Culture",
    description: "Build a lasting culture of curiosity and making at your school — through maker events, innovation clubs and inter-school competitions.",
    color: "#00D4FF",
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
              Empowering Schools Through
              <span className="text-gradient"> Innovation & STEM Learning</span>
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
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-vigyanics-blue text-white font-semibold text-base shadow-lg hover:bg-vigyanics-cyan hover:text-vigyanics-blue transition-all duration-300 group"
              data-testid="link-school-partnership"
            >
              Partner With Us
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.a>
          </motion.div>

          {/* Right: Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offerings.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-default group"
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${item.color}15`, border: `1.5px solid ${item.color}30` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <h4 className="font-display font-semibold text-vigyanics-blue mb-2 text-sm">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
