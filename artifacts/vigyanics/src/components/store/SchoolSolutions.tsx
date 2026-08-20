import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { School, Trophy, Bot, Zap, ArrowRight, CheckCircle, Users, Phone } from "lucide-react";

const packages = [
  {
    icon: School,
    label: "ATL Lab Starter",
    price: "₹24,999",
    color: "#00C896",
    desc: "Complete Atal Tinkering Lab setup for 30 students. NITI Aayog compliant documentation support included.",
    features: ["30 student kits", "1-year mentorship", "NITI Aayog reporting", "Teacher training"],
  },
  {
    icon: Bot,
    label: "Robotics Classroom Bundle",
    price: "₹12,999",
    color: "#00D4FF",
    desc: "Everything needed for a school robotics program. Supports one class of 25 students with competition prep.",
    features: ["25 student kits", "Competition prep guide", "Curriculum mapped", "Ongoing support"],
  },
  {
    icon: Trophy,
    label: "Competition Training Pack",
    price: "₹8,499",
    color: "#8B5CF6",
    desc: "Prepare students for SIH, WRO, ATL Marathon and state-level competitions. Includes coaching sessions.",
    features: ["Team of 10 kits", "3 coaching sessions", "Mock competitions", "Award-winning curriculum"],
  },
  {
    icon: Zap,
    label: "Innovation Lab Infrastructure",
    price: "Custom",
    color: "#F59E0B",
    desc: "Full innovation lab design and setup for schools and universities. Customized to budget and space.",
    features: ["Space planning", "Equipment procurement", "Staff training", "Annual maintenance"],
  },
];

export default function SchoolSolutions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#0B1F3A" }} ref={ref} id="school-solutions">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="ss-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 0 0 60" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ss-grid)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,200,150,0.1), transparent)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent)" }} />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-vigyanics-green/30 bg-vigyanics-green/10 text-vigyanics-green text-sm font-semibold mb-4">
            <Users className="w-4 h-4" /> For Schools & Institutions
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Equip Every{" "}
            <span className="text-vigyanics-cyan">Classroom</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            From single classrooms to full ATL Lab setups — we have curated packages for every school's budget and vision.
          </p>
        </motion.div>

        {/* Package cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {packages.map((pkg, idx) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative rounded-3xl p-6 border flex flex-col overflow-hidden transition-all duration-300"
                style={{ background: `${pkg.color}08`, borderColor: `${pkg.color}25` }}
              >
                {/* Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl" style={{ background: `${pkg.color}15` }} />

                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${pkg.color}20`, border: `1.5px solid ${pkg.color}40` }}
                >
                  <Icon className="w-6 h-6" style={{ color: pkg.color }} />
                </div>

                <h3 className="font-display font-bold text-white text-base mb-1">{pkg.label}</h3>
                <p className="font-display font-bold text-2xl mb-3" style={{ color: pkg.color }}>{pkg.price}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{pkg.desc}</p>

                <ul className="space-y-2 mb-5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: pkg.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: `${pkg.color}20`, color: pkg.color, border: `1px solid ${pkg.color}40` }}
                  data-testid={`school-pkg-${pkg.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {pkg.price === "Custom" ? "Get a Quote" : "Order Now"}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Bulk CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-7 rounded-3xl border border-vigyanics-cyan/20 bg-vigyanics-cyan/5 backdrop-blur-sm"
        >
          <div>
            <h3 className="font-display font-bold text-white text-xl mb-1">Need a bulk order or custom solution?</h3>
            <p className="text-gray-400 text-sm">We work directly with schools, districts, and government bodies. Contact us for custom pricing.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <motion.a
              href="https://wa.me/917303562190?text=Hi! I'd like to inquire about bulk/school orders from the Vigyanics Store."
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-vigyanics-green text-vigyanics-blue font-bold text-sm shadow-lg"
            >
              <Phone className="w-4 h-4" /> WhatsApp Us
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors"
            >
              Request Quote <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
