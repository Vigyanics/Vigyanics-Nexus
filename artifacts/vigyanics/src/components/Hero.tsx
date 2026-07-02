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
    // First play finished — reveal UI and begin the 0→6s loop
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
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ paddingTop: introComplete ? undefined : 0 }}
    >
      {/* Full-screen video — plays fully once, then loops 0→6s */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/hero-bg.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Dark overlay — only visible after intro */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            key="overlay"
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11,31,58,0.55) 0%, rgba(11,31,58,0.4) 50%, rgba(11,31,58,0.65) 100%)",
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
            className="container relative z-20 px-4 md:px-6 mx-auto flex flex-col items-center text-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(0,212,255,0.2)]"
            >
              <Sparkles className="w-4 h-4 text-vigyanics-cyan" />
              <span>Building the next generation of innovators</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-white max-w-4xl leading-[1.1] mb-6 drop-shadow-lg"
            >
              Turn <span className="text-vigyanics-cyan">Curiosity</span>
              <br /> Into Real Projects
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/80 max-w-2xl mb-4 font-medium leading-relaxed drop-shadow"
            >
              Hands-on STEM, Robotics & Innovation learning with expert guidance, real project building and practical execution support.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
              className="text-base text-vigyanics-cyan font-semibold mb-10 tracking-wide drop-shadow"
            >
              We Don't Just Sell. We Teach, Guide & Build With You.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-vigyanics-cyan hover:bg-vigyanics-cyan/90 text-vigyanics-blue text-lg font-bold shadow-[0_8px_30px_rgba(0,212,255,0.4)] hover:shadow-[0_8px_40px_rgba(0,212,255,0.6)] transition-all duration-300 hover:-translate-y-1 border-none"
              >
                Explore Programs <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white text-lg font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              >
                Visit Store
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator — only after intro */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            key="scroll"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <div className="w-[30px] h-[50px] rounded-full border-2 border-white/40 flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 15, 0] }}
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
