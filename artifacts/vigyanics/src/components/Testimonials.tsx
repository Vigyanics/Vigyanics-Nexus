import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Mehta",
    role: "Parent",
    location: "Delhi",
    quote: "My son used to dread science. After 3 months at Vigyanics, he built a working robot and presented it at school. The transformation was unbelievable — he now reads robotics books on weekends on his own.",
    stars: 5,
    color: "#00D4FF",
  },
  {
    name: "Ananya Krishnan",
    role: "Student, Class 10",
    location: "Bengaluru",
    quote: "I learned more in one session at Vigyanics than in an entire semester at school. We don't just read about circuits — we build them, break them, fix them. It's addictive.",
    stars: 5,
    color: "#00C896",
  },
  {
    name: "Mrs. Sunita Patel",
    role: "School Principal",
    location: "Ahmedabad",
    quote: "Vigyanics transformed our ATL lab from a room with equipment to a live innovation center. Teacher confidence improved dramatically and students compete at the national level now.",
    stars: 5,
    color: "#8B5CF6",
  },
  {
    name: "Mr. Karthik Nair",
    role: "ATL Coordinator",
    location: "Chennai",
    quote: "We've worked with multiple STEM vendors. None match Vigyanics on curriculum depth, mentor quality, and post-setup support. They're genuinely invested in student outcomes, not just revenue.",
    stars: 5,
    color: "#F59E0B",
  },
  {
    name: "Priya Sharma",
    role: "Parent",
    location: "Mumbai",
    quote: "My daughter competed in her first robotics competition at age 12 — and her team came second in the state. Before Vigyanics, she had never even touched a circuit board.",
    stars: 5,
    color: "#EF4444",
  },
  {
    name: "Aditya Raj",
    role: "Student, Class 12",
    location: "Hyderabad",
    quote: "The AI course changed my life direction. I'm now building a real computer vision project and applying to IIT with a portfolio that most students my age don't have.",
    stars: 5,
    color: "#00D4FF",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const visible = [
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-vigyanics-blue via-slate-900 to-vigyanics-blue" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-vigyanics-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-vigyanics-purple/8 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots-t" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-t)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/10">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-4 mb-6">
            Heard from the <span className="text-vigyanics-cyan">Community</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Parents, students, teachers, principals — everyone has something to say.
          </p>
        </motion.div>

        <div className="relative">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <AnimatePresence>
              {visible.map((t, idx) => (
                <motion.div
                  key={`${current}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  className="relative rounded-2xl p-7 border border-white/10 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
                >
                  <Quote className="w-8 h-8 mb-4 opacity-30" style={{ color: t.color }} />

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" style={{ color: t.color }} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>

                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{t.name}</div>
                      <div className="text-gray-400 text-xs">{t.role} · {t.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    background: i === current ? "#00D4FF" : "rgba(255,255,255,0.3)"
                  }}
                  data-testid={`button-testimonial-dot-${i}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
