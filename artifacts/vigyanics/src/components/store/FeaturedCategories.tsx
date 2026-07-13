import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FlaskConical, Bot, Brain, Cpu, Wifi, Zap, School, Lightbulb, Trophy, Package } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FlaskConical, Bot, Brain, Cpu, Wifi, Zap, School, Lightbulb, Trophy, Package,
};

export default function FeaturedCategories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { categories, loading } = useCategories();

  // Fallback static categories while loading or if Supabase not yet seeded
  const staticCategories = [
    { slug: "stem-kits", name: "STEM Kits", icon: "FlaskConical", color: "#00D4FF", description: "All-in-one science and technology kits" },
    { slug: "robotics", name: "Robotics Kits", icon: "Bot", color: "#00C896", description: "Build and program real robots" },
    { slug: "ai-learning", name: "AI Learning Kits", icon: "Brain", color: "#8B5CF6", description: "Machine learning & computer vision" },
    { slug: "electronics", name: "Electronics", icon: "Cpu", color: "#F59E0B", description: "Components, modules and tools" },
    { slug: "sensors-iot", name: "Sensors & IoT", icon: "Wifi", color: "#EF4444", description: "Smart sensors and connected devices" },
    { slug: "arduino", name: "Arduino & Microcontrollers", icon: "Zap", color: "#00D4FF", description: "Microcontroller boards" },
    { slug: "school-lab", name: "School Lab Equipment", icon: "School", color: "#00C896", description: "Classroom and innovation lab gear" },
    { slug: "diy-science", name: "DIY Science Projects", icon: "Lightbulb", color: "#8B5CF6", description: "Fun science project kits" },
    { slug: "competition", name: "Competition Kits", icon: "Trophy", color: "#F59E0B", description: "Ready for hackathons and olympiads" },
    { slug: "accessories", name: "Accessories", icon: "Package", color: "#EF4444", description: "Tools, storage and learning materials" },
  ];

  const displayCategories = categories.length > 0
    ? categories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon ?? "Package", color: c.color ?? "#00D4FF", description: c.description ?? "" }))
    : (!loading ? staticCategories : []);

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-vigyanics-blue mb-4">Shop by Category</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Curated kits and components for every stage of the STEM learning journey</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {displayCategories.map((cat, idx) => {
              const Icon = iconMap[cat.icon] ?? Package;
              return (
                <motion.a
                  key={cat.slug}
                  href={`#products-${cat.slug}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex flex-col items-center text-center p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  data-testid={`category-${cat.slug}`}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${cat.color}12, transparent 70%)` }}
                  />

                  {/* Icon container */}
                  <div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${cat.color}15`, border: `1.5px solid ${cat.color}30` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>

                  <span className="font-display font-semibold text-sm text-vigyanics-blue leading-tight">{cat.name}</span>
                  <span className="text-xs text-gray-400 mt-1 leading-tight hidden sm:block">{cat.description}</span>

                  {/* Bottom bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"
                    style={{ background: cat.color, transformOrigin: "center" }}
                  />
                </motion.a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
