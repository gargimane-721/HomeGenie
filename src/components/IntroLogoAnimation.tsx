import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Cpu, Layers } from 'lucide-react';

interface IntroLogoAnimationProps {
  onComplete: () => void;
}

export const IntroLogoAnimation: React.FC<IntroLogoAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'drawing' | 'tagline' | 'ready' | 'exit'>('drawing');

  useEffect(() => {
    // Stage 1: Drafting linework (0 - 1000ms)
    const stageTimer1 = setTimeout(() => {
      setStage('tagline');
    }, 1100);

    // Stage 2: Ready & glowing (2200ms)
    const stageTimer2 = setTimeout(() => {
      setStage('ready');
    }, 2200);

    // Stage 3: Smooth exit (3200ms)
    const stageTimer3 = setTimeout(() => {
      setStage('exit');
    }, 3200);

    // Stage 4: Trigger onComplete callback (3700ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3700);

    // Progress counter
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 55);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'exit' ? (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1E293B] text-gray-200 overflow-hidden select-none"
          id="intro-animation-screen"
        >
          {/* Subtle Architectural Blueprint Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #94A3B8 1px, transparent 1px),
                linear-gradient(to bottom, #94A3B8 1px, transparent 1px)
              `,
              backgroundSize: '36px 36px',
            }}
          />

          {/* Radial Center Spotlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/30 via-slate-900/60 to-slate-950/90 pointer-events-none" />

          {/* Floating Subtle Drafting Coordinates */}
          <div className="absolute top-6 left-6 font-mono text-[10px] text-gray-500 uppercase tracking-widest flex flex-col gap-1">
            <span>SYS.VER // 2.4.0</span>
            <span>INITIALIZING ARCHITECTURAL KERNEL</span>
          </div>

          {/* Skip Button */}
          <button
            onClick={onComplete}
            className="absolute top-6 right-6 z-20 flex items-center gap-2 rounded-full border border-gray-600/70 bg-gray-800/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-all shadow-sm"
            id="btn-skip-intro"
          >
            <span>Skip Intro</span>
            <span className="text-[10px] text-gray-500 font-mono">[ESC]</span>
          </button>

          {/* Central Logo & Animation Canvas */}
          <div className="relative z-10 flex flex-col items-center px-4 max-w-2xl text-center">
            
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6 flex items-center justify-center"
            >
              {/* Dynamic Ambient Glow around Logo */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-10 rounded-full bg-slate-400/20 blur-3xl pointer-events-none"
              />

              {/* Exact HomeGenie Vector Animation matching uploaded emblem */}
              <svg
                viewBox="0 0 420 160"
                className="w-[280px] sm:w-[380px] md:w-[440px] h-auto overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 1. Compass Outer Circle */}
                <motion.circle
                  cx="85"
                  cy="80"
                  r="45"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, rotate: -90 }}
                  animate={{ pathLength: 1, rotate: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />

                {/* 2. Concentric Inner Circle */}
                <motion.circle
                  cx="85"
                  cy="80"
                  r="37"
                  stroke="#64748B"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
                />

                {/* 3. Diagonal Compass Ray Ticks (NE, SE, SW, NW) */}
                <motion.line
                  x1="117" y1="48" x2="128" y2="37"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
                <motion.line
                  x1="117" y1="112" x2="128" y2="123"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                />
                <motion.line
                  x1="53" y1="112" x2="42" y2="123"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
                <motion.line
                  x1="53" y1="48" x2="42" y2="37"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                />

                {/* 4. North Pointer (Top Tall Needle) */}
                <motion.polygon
                  points="85,14 93,56 85,50"
                  fill="#94A3B8"
                  opacity={0.35}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ transformOrigin: '85px 80px' }}
                />
                <motion.polygon
                  points="85,14 77,56 85,50"
                  fill="#CBD5E1"
                  opacity={0.7}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ transformOrigin: '85px 80px' }}
                />
                <motion.polyline
                  points="77,56 85,14 93,56"
                  stroke="#CBD5E1"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                />
                <motion.line
                  x1="85" y1="14" x2="85" y2="52"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />

                {/* 5. South Pointer (Bottom Tall Needle) */}
                <motion.polygon
                  points="85,146 93,104 85,110"
                  fill="#CBD5E1"
                  opacity={0.7}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{ transformOrigin: '85px 80px' }}
                />
                <motion.polygon
                  points="85,146 77,104 85,110"
                  fill="#94A3B8"
                  opacity={0.35}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{ transformOrigin: '85px 80px' }}
                />
                <motion.polyline
                  points="77,104 85,146 93,104"
                  stroke="#CBD5E1"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                />
                <motion.line
                  x1="85" y1="108" x2="85" y2="146"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />

                {/* 6. West Pointer (Left Needle) */}
                <motion.polyline
                  points="56,73 20,80 56,87"
                  stroke="#CBD5E1"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                />
                <motion.polygon
                  points="20,80 56,73 50,80"
                  fill="#CBD5E1"
                  opacity={0.6}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                />
                <motion.polygon
                  points="20,80 56,87 50,80"
                  fill="#94A3B8"
                  opacity={0.35}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                />

                {/* 7. Gable Roof House Profile */}
                <motion.path
                  d="M60 86 L85 61 L115 86"
                  stroke="#E2E8F0"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                />
                {/* Horizontal Drafting Step from roof */}
                <motion.path
                  d="M85 61 L154 74 L154 67"
                  stroke="#94A3B8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />

                {/* 8. Wordmark "homegenie" */}
                <motion.text
                  x="56"
                  y="88"
                  fill="#CBD5E1"
                  fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                  fontWeight="600"
                  fontSize="42"
                  letterSpacing="-0.03em"
                  dominantBaseline="middle"
                  initial={{ opacity: 0, x: 45 }}
                  animate={{ opacity: 1, x: 56 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                >
                  homegenie
                </motion.text>
              </svg>
            </motion.div>

            {/* Tagline Announcement - as requested */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: stage !== 'drawing' ? 1 : 0, y: stage !== 'drawing' ? 0 : 15 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {/* Tagline text: "Home Genie AI powered architectural and smart home engine" */}
              <div className="flex flex-col items-center">
                <p className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-white/95 leading-snug">
                  Home Genie
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="h-px w-6 bg-slate-500/80"></span>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-300">
                    AI powered architectural and smart home engine
                  </p>
                  <span className="h-px w-6 bg-slate-500/80"></span>
                </div>
              </div>

              {/* Core Engine Capability Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-2 pt-2"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-sm">
                  <Layers className="h-3 w-3 text-slate-400" />
                  Parametric 2D CAD
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-sm">
                  <Compass className="h-3 w-3 text-slate-400" />
                  8-Zone Vastu Engine
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-sm">
                  <Cpu className="h-3 w-3 text-slate-400" />
                  Smart Home Automation
                </span>
              </motion.div>
            </motion.div>

            {/* Architectural Loading Bar */}
            <div className="mt-10 w-48 sm:w-64">
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-slate-400 via-gray-200 to-slate-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 tracking-wider">
                <span>ARCH.LOAD</span>
                <span>{progress}%</span>
              </div>
            </div>

          </div>

          {/* Bottom Footer Info */}
          <div className="absolute bottom-6 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            CAD DRAFT ENGINE // READY
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
