import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Medal, Star, TrendingUp } from "lucide-react";

const stories = [
  {
    icon: Trophy,
    color: "#F59E0B",
    title: "National Robotics Championship",
    student: "Arjun Sharma, Class 10",
    school: "Delhi Public School, Noida",
    outcome: "1st Place — Smart India Junior Hackathon 2024",
    description: "Arjun built a crop monitoring robot using AI vision in just 8 weeks. His project now runs in a real farm in Haryana.",
  },
  {
    icon: Medal,
    color: "#00C896",
    title: "NITI Aayog ATL Marathon",
    student: "Team of 4, Classes 8–10",
    school: "Kendriya Vidyalaya, Bengaluru",
    outcome: "Top 15 Nationally — ATL Marathon 2024",
    description: "A smart waste segregation system using computer vision — the team was mentored by Vigyanics for 3 months before the competition.",
  },
  {
    icon: Star,
    color: "#8B5CF6",
    title: "State Science Exhibition",
    student: "Priya Nair, Class 9",
    school: "St. Thomas School, Kochi",
    outcome: "Gold Medal — Kerala State Science Fair",
    description: "Priya built a solar-powered water purification system that won gold and caught the attention of district collectors.",
  },
  {
    icon: TrendingUp,
    color: "#00D4FF",
    title: "School Transformation",
    student: "Principal Mrs. Gupta",
    school: "Ryan International School, Pune",
    outcome: "ATL score improved from 42% to 94% in one year",
    description: "After partnering with Vigyanics for ATL lab management and teacher training, Ryan International became one of India's top ATL schools.",
  },
];

export default function SuccessStories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="success" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50/20" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-vigyanics-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-vigyanics-cyan/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-vigyanics-cyan mb-4 px-4 py-1.5 rounded-full border border-vigyanics-cyan/30 bg-vigyanics-cyan/5">
            Impact Stories
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-vigyanics-blue mt-4 mb-6">
            Success That <span className="text-gradient">Speaks</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Every award, every achievement, every innovation — built by students who dared to try.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative group rounded-2xl p-8 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-default"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${story.color}, ${story.color}80)` }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 80% 20%, ${story.color}08, transparent 60%)` }}
              />

              <div className="flex items-start gap-4 mb-5">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${story.color}15`, border: `1.5px solid ${story.color}30` }}
                >
                  <story.icon className="w-6 h-6" style={{ color: story.color }} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-vigyanics-blue text-lg leading-tight">{story.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{story.student}</p>
                  <p className="text-xs text-gray-400">{story.school}</p>
                </div>
              </div>

              <div
                className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
                style={{ background: `${story.color}15`, color: story.color, border: `1px solid ${story.color}25` }}
              >
                {story.outcome}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{story.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
