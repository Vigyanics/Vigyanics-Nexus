import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function NeuralBackground() {
  return (
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-800" />
        </pattern>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-vigyanics-cyan)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-vigyanics-cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <circle cx="50%" cy="50%" r="40%" fill="url(#glow)" className="animate-pulse-glow" />
      
      {/* Animated nodes and connections */}
      <g className="opacity-50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4">
        <path d="M100,100 L300,200 L500,150 L700,300" className="text-vigyanics-cyan animate-pulse" />
        <path d="M200,400 L400,350 L600,450 L800,200" className="text-vigyanics-purple animate-pulse" style={{ animationDelay: "1s" }} />
      </g>
      
      <g fill="currentColor" className="text-vigyanics-blue dark:text-white">
        <circle cx="100" cy="100" r="4" className="animate-float" />
        <circle cx="300" cy="200" r="6" className="animate-float" style={{ animationDelay: "0.5s" }} />
        <circle cx="500" cy="150" r="5" className="animate-float" style={{ animationDelay: "1s" }} />
        <circle cx="700" cy="300" r="7" className="animate-float" style={{ animationDelay: "1.5s" }} />
      </g>
    </svg>
  );
}
