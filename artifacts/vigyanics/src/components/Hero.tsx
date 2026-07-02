import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useIntro } from "@/context/IntroContext";

const LOOP_END_SECONDS = 6;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { introComplete, setIntroComplete } = useIntro();
  const isFirstPlay = useRef(true);

  function handleVideoEnd() {
    setIntroComplete(true);
    isFirstPlay.current = false;
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }

  function handleTimeUpdate() {
    if (!isFirstPlay.current && videoRef.current) {
      if (videoRef.current.currentTime >= LOOP_END_SECONDS) {
        videoRef.current.currentTime = 0;
      }
    }
  }

  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        height: "100dvh",
        paddingTop: introComplete ? undefined : 0,
      }}
    >
      {/*
        Video: classic full-cover technique.
        Positioned at center, sized to always fill the viewport in both axes
        regardless of the device's aspect ratio (portrait mobile, landscape tablet, widescreen desktop).
        scale(1.01) prevents sub-pixel hairline gaps on some mobile renderers.
      */}
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onTimeUpdate={handleTimeUpdate}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1.01)",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "cover",
          objectPosition: "center center",
          zIndex: 0,
        }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay — only visible after intro */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            key="overlay"
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11,31,58,0.55) 0%, rgba(11,31,58,0.4) 50%, rgba(11,31,58,0.72) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Hero content — fades in after first loop */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            key="content"
            className="relative z-20 w-full px-5 sm:px-8 md:px-10 mx-auto flex flex-col items-center text-center max-w-5xl"
            style={{
              paddingTop: "max(5rem, env(safe-area-inset-top, 0px) + 5rem)",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(0,212,255,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-vigyanics-cyan flex-shrink-0" />
              <span>Building the next generation of innovators</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
              className="text-[2.4rem] leading-[1.1] sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-white mb-5 sm:mb-6 drop-shadow-lg"
            >
              Turn <span className="text-vigyanics-cyan">Curiosity</span>
              <br /> Into Real Projects
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mb-3 sm:mb-4 font-medium leading-relaxed drop-shadow px-2 sm:px-0"
            >
              Hands-on STEM, Robotics & Innovation learning with expert
              guidance, real project building and practical execution support.
            </motion.p>

            {/* Supporting statement */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
              className="text-sm sm:text-base text-vigyanics-cyan font-semibold mb-8 sm:mb-10 tracking-wide drop-shadow"
            >
              We Don't Just Sell. We Teach, Guide & Build With You.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="h-13 sm:h-14 px-7 sm:px-8 rounded-full bg-vigyanics-cyan hover:bg-vigyanics-cyan/90 text-vigyanics-blue text-base sm:text-lg font-bold shadow-[0_8px_30px_rgba(0,212,255,0.4)] hover:shadow-[0_8px_40px_rgba(0,212,255,0.6)] transition-all duration-300 hover:-translate-y-1 border-none"
              >
                Explore Programs <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 sm:h-14 px-7 sm:px-8 rounded-full border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              >
                Visit Store
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            key="scroll"
            className="absolute z-20 flex flex-col items-center gap-2"
            style={{
              bottom: "max(2rem, env(safe-area-inset-bottom, 0px) + 1.5rem)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <div className="w-[26px] h-[44px] sm:w-[30px] sm:h-[50px] rounded-full border-2 border-white/40 flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-3 bg-vigyanics-cyan rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
