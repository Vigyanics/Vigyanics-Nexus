import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Lightbulb, School, Trophy } from "lucide-react";

const stats = [
  { label: "Students Trained", value: "5000", suffix: "+", icon: Users, color: "text-vigyanics-cyan" },
  { label: "Projects Built", value: "1200", suffix: "+", icon: Lightbulb, color: "text-vigyanics-green" },
  { label: "Schools Supported", value: "80", suffix: "+", icon: School, color: "text-vigyanics-purple" },
  { label: "Competitions", value: "150", suffix: "+", icon: Trophy, color: "text-orange-500" },
];

export default function TrustStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-white/50 dark:bg-black/30 backdrop-blur-sm relative border-y border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center space-y-3"
            >
              <div className={`p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-inner ${stat.color} mb-2`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl md:text-5xl font-display font-bold text-vigyanics-blue dark:text-white">
                  {isInView ? stat.value : "0"}
                </span>
                <span className="text-2xl font-bold text-vigyanics-cyan ml-1">{stat.suffix}</span>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
