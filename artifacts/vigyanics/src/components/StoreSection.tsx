import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Cpu, Package, Users, Wrench, BookOpen, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

const points = [
  { icon: Cpu, label: "Arduino, sensors, modules and electronics components", color: "#00D4FF" },
  { icon: Package, label: "Robotics kits and STEM learning kits for all levels", color: "#00C896" },
  { icon: BookOpen, label: "Guidance on how components work — not just what to buy", color: "#8B5CF6" },
  { icon: Wrench, label: "Support for projects and troubleshooting", color: "#F59E0B" },
  { icon: Users, label: "Assistance for beginners, makers and innovators", color: "#EF4444" },
];

export default function StoreSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [, navigate] = useLocation();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white" ref={ref}>
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-store" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#0B1F3A" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-store)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06), transparent)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05), transparent)" }} />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/5">
              Vigyanics Store
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-vigyanics-blue mt-4 mb-4 leading-tight">
              More Than Just
              <br />
              <span className="text-gradient">Electronics Components</span>
            </h2>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Components, kits and practical learning support — all in one ecosystem.
            </p>

            <ul className="space-y-4 mb-10">
              {points.map((p, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${p.color}12`, border: `1.5px solid ${p.color}30` }}
                  >
                    <p.icon className="w-4.5 h-4.5" style={{ color: p.color }} />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{p.label}</span>
                </motion.li>
              ))}
            </ul>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base font-bold text-vigyanics-blue mb-8 pl-1 border-l-4 border-vigyanics-cyan pl-4"
            >
              We Don't Just Sell. We Teach, Guide & Build With You.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/store")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-vigyanics-blue text-white font-bold text-base shadow-[0_8px_30px_rgba(11,31,58,0.25)] hover:shadow-[0_12px_40px_rgba(0,212,255,0.3)] hover:bg-vigyanics-cyan hover:text-vigyanics-blue transition-all duration-300 group"
              data-testid="button-explore-store"
            >
              Explore Store <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Right: Visual grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "Robotics Kits", sublabel: "Build real robots", color: "#00C896", count: "15+" },
              { label: "AI Learning", sublabel: "Vision & NLP kits", color: "#8B5CF6", count: "8+" },
              { label: "Arduino Bundles", sublabel: "500+ components", color: "#00D4FF", count: "12+" },
              { label: "ATL Lab Packs", sublabel: "School solutions", color: "#F59E0B", count: "4+" },
              { label: "Sensor Kits", sublabel: "40+ sensor types", color: "#EF4444", count: "10+" },
              { label: "STEM Projects", sublabel: "DIY science kits", color: "#00D4FF", count: "20+" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="relative p-5 rounded-2xl border bg-white shadow-sm hover:shadow-lg cursor-pointer overflow-hidden transition-shadow duration-300"
                style={{ borderColor: `${item.color}25` }}
                onClick={() => navigate("/store")}
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: `${item.color}10` }} />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${item.color}15`, border: `1.5px solid ${item.color}30` }}
                >
                  <Cpu className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="text-2xl font-display font-bold mb-0.5" style={{ color: item.color }}>{item.count}</div>
                <div className="text-sm font-semibold text-vigyanics-blue leading-tight">{item.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.sublabel}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
