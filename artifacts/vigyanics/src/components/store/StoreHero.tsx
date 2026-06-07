import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ShoppingBag, Zap } from "lucide-react";

export default function StoreHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="relative overflow-hidden" style={{ background: "#0B1F3A" }} ref={ref}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-15">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="store-circuit" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M20 0 V20 H60 V60 H80 M0 40 H20 M80 40 H60 M40 0 V20 M40 60 V80" stroke="rgba(0,212,255,0.4)" strokeWidth="0.6" fill="none" />
              <circle cx="20" cy="20" r="3" fill="rgba(0,212,255,0.4)" />
              <circle cx="60" cy="60" r="3" fill="rgba(0,212,255,0.4)" />
              <circle cx="40" cy="20" r="2" fill="rgba(0,200,150,0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#store-circuit)" />
        </svg>
      </div>

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.12), transparent)" }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent)" }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 5 + (i % 3) * 3,
            height: 5 + (i % 3) * 3,
            left: `${8 + i * 16}%`,
            top: `${15 + (i % 3) * 20}%`,
            background: i % 2 === 0 ? "#00D4FF" : "#00C896",
            opacity: 0.4,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/10 text-vigyanics-cyan text-sm font-semibold mb-6"
            >
              <ShoppingBag className="w-4 h-4" />
              Vigyanics Innovation Store
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.05]"
            >
              Build.{" "}
              <span className="text-vigyanics-cyan">Learn.</span>
              <br />
              Innovate.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-lg mb-10 leading-relaxed"
            >
              Discover robotics kits, STEM tools, AI learning systems and innovation products designed for the next generation of creators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#featured-products"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-vigyanics-cyan text-vigyanics-blue font-bold text-base shadow-[0_8px_30px_rgba(0,212,255,0.3)] hover:shadow-[0_12px_40px_rgba(0,212,255,0.45)] transition-all duration-300"
                data-testid="button-shop-now"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#school-solutions"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                data-testid="button-school-solutions"
              >
                School Packs
              </motion.a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              {["Free shipping above ₹999", "1-year warranty", "Expert support", "Easy returns"].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-vigyanics-green flex-shrink-0" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: animated product visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[400px] h-[400px]">
              {/* Central glow */}
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)" }} />

              {/* Orbiting product cards */}
              {[
                { label: "Robotics Kit", color: "#00C896", angle: 0, icon: "🤖" },
                { label: "AI Vision", color: "#8B5CF6", angle: 120, icon: "🧠" },
                { label: "STEM Pack", color: "#00D4FF", angle: 240, icon: "⚡" },
              ].map((item, idx) => {
                const rad = (item.angle * Math.PI) / 180;
                const x = 150 * Math.cos(rad);
                const y = 150 * Math.sin(rad);
                return (
                  <motion.div
                    key={idx}
                    className="absolute w-28 h-28 rounded-2xl flex flex-col items-center justify-center gap-1 text-center border shadow-lg"
                    style={{
                      left: `calc(50% + ${x}px - 56px)`,
                      top: `calc(50% + ${y}px - 56px)`,
                      background: `${item.color}15`,
                      borderColor: `${item.color}40`,
                      backdropFilter: "blur(12px)",
                    }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3 + idx, repeat: Infinity, ease: "easeInOut", delay: idx * 0.8 }}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-semibold text-white">{item.label}</span>
                  </motion.div>
                );
              })}

              {/* Center badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl flex flex-col items-center justify-center border border-vigyanics-cyan/40 bg-vigyanics-cyan/10 backdrop-blur-md">
                <Zap className="w-8 h-8 text-vigyanics-cyan mb-1" />
                <span className="text-xs font-bold text-white text-center leading-tight">100+<br />Products</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
