import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="relative py-24 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/10 via-white to-[#8B5CF6]/10" />
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-cta" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#0B1F3A" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-cta)" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-vigyanics-cyan/15 via-vigyanics-purple/10 to-vigyanics-green/10 rounded-full blur-3xl" />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 6 + (i % 3) * 4,
            height: 6 + (i % 3) * 4,
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 4) * 15}%`,
            background: i % 3 === 0 ? "#00D4FF" : i % 3 === 1 ? "#8B5CF6" : "#00C896",
            opacity: 0.4,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-6 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/5">
            Ready to Begin?
          </span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-vigyanics-blue mt-4 mb-6 leading-tight max-w-4xl mx-auto">
            Let Your Child Discover the{" "}
            <span className="text-gradient">Scientist Within</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Join Vigyanics and experience a new way of learning — practical, engaging and future-ready. The first session is always free.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="https://wa.me/917303562190?text=Hi%20Vigyanics!%20I%27d%20like%20to%20book%20a%20free%20trial."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-vigyanics-blue text-white font-semibold text-lg shadow-[0_8px_30px_rgba(11,31,58,0.25)] hover:shadow-[0_12px_40px_rgba(0,212,255,0.3)] transition-all duration-300"
              data-testid="button-cta-book-trial"
            >
              Book Free Trial <ArrowRight className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="https://wa.me/917303562190?text=Hi%20Vigyanics!%20I%27d%20like%20to%20know%20more."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold text-lg shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.45)] transition-all duration-300"
              data-testid="button-cta-whatsapp"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </motion.a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500"
          >
            {["Free first session", "No long-term commitment", "Expert mentors", "Trusted by 80+ schools"].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vigyanics-green" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
