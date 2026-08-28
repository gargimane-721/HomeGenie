import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, Compass, ShieldCheck, Zap } from 'lucide-react';

export const HeroBlueprintAnimation: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setStep((prev) => (prev >= 6 ? 0 : prev + 1));
    }, 1800);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const stepLabels = [
    'Plot Boundary & Setbacks',
    'RCC Columns & Perimeter Walls',
    'Space & Room Allocation',
    'Doors & Double-Glazed Windows',
    'Ergonomic Furniture Fitting',
    'Architectural CAD Dimensions',
    'AI Optimized & Vastu Certified',
  ];

  return (
    <div className="relative w-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm text-gray-900 overflow-hidden">
      {/* Blueprint Header Bar */}
      <div className="relative z-10 mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-3.5 w-3.5 items-center justify-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-900 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gray-900"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-900">
                LIVE CAD GENERATION
              </span>
              <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-[10px] text-gray-700 border border-gray-200 font-bold">
                SCALE 1:50
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Phase {step + 1}/7: <span className="text-gray-900 font-bold">{stepLabels[step]}</span>
            </p>
          </div>
        </div>

        {/* Step dots & replay button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  setStep(idx);
                  setIsAutoPlaying(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  step === idx ? 'w-6 bg-gray-900' : step > idx ? 'w-2 bg-gray-600' : 'w-2 bg-gray-200'
                }`}
                title={stepLabels[idx]}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setStep(0);
              setIsAutoPlaying(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            title="Replay sequence"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Interactive Blueprint Canvas SVG */}
      <div className="relative z-10 flex items-center justify-center py-3">
        <svg
          viewBox="0 0 540 380"
          className="w-full h-auto max-h-[350px] select-none"
        >
          <defs>
            <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(31, 41, 55, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="540" height="380" fill="url(#hero-grid)" />

          {/* STEP 0: Plot Boundary & Road */}
          {/* North Roadway */}
          <rect x="20" y="8" width="500" height="24" fill="#F3F4F6" stroke="#1F2937" strokeWidth="0.8" strokeDasharray="4 4" rx="3" />
          <text x="270" y="24" textAnchor="middle" fill="#374151" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
            NORTH ROAD ACCESS (30 FT WIDE)
          </text>

          {/* Plot Boundary */}
          <motion.rect
            x="30"
            y="40"
            width="480"
            height="325"
            fill="none"
            stroke="#1F2937"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            rx="4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Compass Rose */}
          <g transform="translate(485, 65)">
            <circle r="16" fill="#FFFFFF" stroke="#1F2937" strokeWidth="1" opacity="0.9" />
            <path d="M 0,-12 L 4,0 L 0,3 L -4,0 Z" fill="#1F2937" />
            <path d="M 0,12 L 3,0 L 0,-2 L -3,0 Z" fill="#6B7280" />
            <text x="0" y="-14" textAnchor="middle" fill="#1F2937" fontSize="8" fontWeight="bold" fontFamily="sans-serif">N</text>
          </g>

          {/* STEP 1: Foundation & Perimeter Walls */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              {/* Outer Building Envelope */}
              <rect x="55" y="70" width="430" height="275" fill="#FAFAFA" stroke="#1F2937" strokeWidth="3" rx="2" />
              {/* Internal Wall partitions */}
              <line x1="280" y1="70" x2="280" y2="240" stroke="#1F2937" strokeWidth="2.5" strokeDasharray="none" />
              <line x1="55" y1="200" x2="485" y2="200" stroke="#1F2937" strokeWidth="2.5" />
              <line x1="190" y1="200" x2="190" y2="345" stroke="#1F2937" strokeWidth="2" />
              <line x1="360" y1="200" x2="360" y2="345" stroke="#1F2937" strokeWidth="2" />
            </motion.g>
          )}

          {/* STEP 2: Room Zones & Fills */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {/* Living Hall */}
              <rect x="58" y="73" width="219" height="124" fill="#F3F4F6" />
              <text x="167" y="125" textAnchor="middle" fill="#111827" fontSize="13" fontWeight="bold" fontFamily="serif" fontStyle="italic">
                Living Hall
              </text>
              <text x="167" y="140" textAnchor="middle" fill="#4B5563" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                18'0" × 14'6" • 260 sq.ft
              </text>

              {/* Dining & Pooja */}
              <rect x="283" y="73" width="200" height="124" fill="#E5E7EB" />
              <text x="383" y="120" textAnchor="middle" fill="#111827" fontSize="13" fontWeight="bold" fontFamily="serif" fontStyle="italic">
                Dining & Kitchen
              </text>
              <text x="383" y="135" textAnchor="middle" fill="#4B5563" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                16'0" × 12'0" • 192 sq.ft
              </text>

              {/* Master Bedroom (SW Zone) */}
              <rect x="58" y="203" width="130" height="139" fill="#E5E7EB" />
              <text x="123" y="265" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="bold" fontFamily="serif" fontStyle="italic">
                Master Suite
              </text>
              <text x="123" y="280" textAnchor="middle" fill="#4B5563" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                14'0" × 12'0"
              </text>

              {/* Attached Bathroom & Wet Core */}
              <rect x="193" y="203" width="85" height="139" fill="#F3F4F6" />
              <text x="235" y="265" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold" fontFamily="serif" fontStyle="italic">
                Bath / Core
              </text>
              <text x="235" y="280" textAnchor="middle" fill="#4B5563" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                6'6" × 8'0"
              </text>

              {/* Guest / Children Room */}
              <rect x="281" y="203" width="77" height="139" fill="#F3F4F6" />
              <text x="319" y="265" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold" fontFamily="serif" fontStyle="italic">
                Bedroom 2
              </text>

              {/* Staircase Core */}
              <rect x="363" y="203" width="120" height="139" fill="#E5E7EB" />
              <text x="423" y="265" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold" fontFamily="serif" fontStyle="italic">
                RCC Stairs
              </text>
            </motion.g>
          )}

          {/* STEP 3: Doors & Windows */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {/* Main Entrance Door Swing */}
              <path d="M 140,70 A 35,35 0 0,1 175,105" fill="none" stroke="#4B5563" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="140" y1="70" x2="175" y2="105" stroke="#1F2937" strokeWidth="2" />
              <rect x="135" y="66" width="45" height="7" fill="#1F2937" rx="1" />

              {/* Master Bedroom Door */}
              <path d="M 120,200 A 25,25 0 0,0 145,225" fill="none" stroke="#4B5563" strokeWidth="1.2" strokeDasharray="2 2" />
              <line x1="120" y1="200" x2="145" y2="225" stroke="#1F2937" strokeWidth="1.5" />

              {/* Windows */}
              <rect x="68" y="66" width="55" height="6" fill="#D1D5DB" stroke="#1F2937" strokeWidth="1" rx="1" />
              <rect x="420" y="66" width="45" height="6" fill="#D1D5DB" stroke="#1F2937" strokeWidth="1" rx="1" />
              <rect x="80" y="342" width="55" height="6" fill="#D1D5DB" stroke="#1F2937" strokeWidth="1" rx="1" />
            </motion.g>
          )}

          {/* STEP 4: Furniture Layout */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <path d="M 75,90 L 125,90 L 125,120 L 105,120 L 105,110 L 75,110 Z" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1" rx="2" />
              <rect x="88" y="125" width="28" height="18" fill="#4B5563" stroke="#1F2937" strokeWidth="0.8" rx="2" />
              <rect x="75" y="188" width="65" height="8" fill="#1F2937" stroke="#1F2937" strokeWidth="0.8" />

              <rect x="345" y="90" width="55" height="32" rx="4" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1" />
              <circle cx="355" cy="84" r="4" fill="#374151" />
              <circle cx="372" cy="84" r="4" fill="#374151" />
              <circle cx="390" cy="84" r="4" fill="#374151" />
              <circle cx="355" cy="128" r="4" fill="#374151" />
              <circle cx="372" cy="128" r="4" fill="#374151" />
              <circle cx="390" cy="128" r="4" fill="#374151" />

              <rect x="75" y="225" width="55" height="60" rx="3" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1" />
              <rect x="80" y="228" width="20" height="12" rx="1" fill="#FFFFFF" />
              <rect x="105" y="228" width="20" height="12" rx="1" fill="#FFFFFF" />
              <rect x="75" y="325" width="55" height="14" fill="#374151" stroke="#1F2937" strokeWidth="0.8" />

              {[215, 230, 245, 260, 275, 290, 305, 320].map((yVal, i) => (
                <line key={i} x1="375" y1={yVal} x2="470" y2={yVal} stroke="#1F2937" strokeWidth="1" strokeDasharray="3 2" />
              ))}
            </motion.g>
          )}

          {/* STEP 5: Precision Dimension Lines */}
          {step >= 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <line x1="55" y1="50" x2="485" y2="50" stroke="#1F2937" strokeWidth="1" />
              <line x1="55" y1="46" x2="55" y2="54" stroke="#1F2937" strokeWidth="1" />
              <line x1="485" y1="46" x2="485" y2="54" stroke="#1F2937" strokeWidth="1" />
              <rect x="245" y="42" width="50" height="16" fill="#FFFFFF" stroke="#1F2937" strokeWidth="1" rx="2" />
              <text x="270" y="54" textAnchor="middle" fill="#111827" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                30'-0"
              </text>

              <line x1="40" y1="70" x2="40" y2="345" stroke="#1F2937" strokeWidth="1" />
              <line x1="36" y1="70" x2="44" y2="70" stroke="#1F2937" strokeWidth="1" />
              <line x1="36" y1="345" x2="44" y2="345" stroke="#1F2937" strokeWidth="1" />
              <rect x="18" y="200" width="44" height="16" fill="#FFFFFF" stroke="#1F2937" strokeWidth="1" rx="2" />
              <text x="40" y="212" textAnchor="middle" fill="#111827" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                50'-0"
              </text>
            </motion.g>
          )}

          {/* STEP 6: AI Optimization & Vastu Seal */}
          {step >= 6 && (
            <motion.g
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <g transform="translate(180, 160)">
                <rect x="0" y="0" width="180" height="42" rx="8" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))" />
                <circle cx="20" cy="21" r="10" fill="#111827" />
                <path d="M 16,21 L 19,24 L 25,18" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <text x="36" y="18" fill="#111827" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  AI OPTIMIZED • 91% EFFICIENCY
                </text>
                <text x="36" y="30" fill="#4B5563" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  Vastu Score: 87% | Est: ₹33.85L
                </text>
              </g>
            </motion.g>
          )}
        </svg>
      </div>

      {/* Feature Badges Footer */}
      <div className="relative z-10 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-4 text-xs">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <ShieldCheck className="h-4 w-4 text-gray-900" />
          <span>Bylaws & Setbacks</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Compass className="h-4 w-4 text-gray-900" />
          <span>8-Zone Vastu Alignment</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Zap className="h-4 w-4 text-gray-900" />
          <span>Wet-Wall Plumbing Stack</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Sparkles className="h-4 w-4 text-gray-900" />
          <span>Real-time Budget Sync</span>
        </div>
      </div>
    </div>
  );
};
