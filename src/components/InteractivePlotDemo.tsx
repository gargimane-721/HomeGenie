import React, { useState, useMemo } from 'react';
import { Sliders, CheckCircle, ArrowRight, Eye, Layers, Sun, Moon, Sunset, Maximize2, Users, Sparkles, Building2 } from 'lucide-react';

interface InteractivePlotDemoProps {
  onCustomizeFullPlan: (config: {
    width: number;
    length: number;
    bedrooms: number;
    floors: number;
    budget: number;
  }) => void;
}

export const InteractivePlotDemo: React.FC<InteractivePlotDemoProps> = ({ onCustomizeFullPlan }) => {
  const [width, setWidth] = useState<number>(30);
  const [length, setLength] = useState<number>(50);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [floors, setFloors] = useState<number>(2);
  const [budgetLakhs, setBudgetLakhs] = useState<number>(35);

  // View Mode: 'split' | 'cad' | '3d'
  const [displayMode, setDisplayMode] = useState<'split' | 'cad' | '3d'>('split');
  // Lighting Ambiance for 3D View
  const [lightingMood, setLightingMood] = useState<'day' | 'sunset' | 'night'>('day');
  // Detail Overlay Toggle
  const [showCallouts, setShowCallouts] = useState<boolean>(true);

  const plotArea = width * length;
  const builtUpPerFloor = Math.round(plotArea * 0.78);
  const totalBuiltUp = builtUpPerFloor * floors;

  const estimatedCostLakhs = useMemo(() => {
    const baseRatePerSqFt = 2050;
    const calculated = (totalBuiltUp * baseRatePerSqFt) / 100000;
    return parseFloat(calculated.toFixed(2));
  }, [totalBuiltUp]);

  const spaceEfficiency = useMemo(() => {
    const ratio = Math.min(width, length) / Math.max(width, length);
    const score = Math.round(84 + ratio * 8 + (bedrooms <= 3 ? 3 : 0));
    return Math.min(96, Math.max(82, score));
  }, [width, length, bedrooms]);

  const budgetCompatibility = useMemo(() => {
    const diff = budgetLakhs - estimatedCostLakhs;
    if (diff >= 0) return 96;
    if (diff > -5) return 88;
    if (diff > -10) return 74;
    return 60;
  }, [budgetLakhs, estimatedCostLakhs]);

  const vastuCompatibility = useMemo(() => {
    return 87 + (width >= 30 ? 2 : 0) + (bedrooms === 3 ? 2 : 0);
  }, [width, bedrooms]);

  // Completed 3D Exterior images for different configurations
  const completedHouseImages = {
    1: {
      title: 'Single-Storey Contemporary Bungalow',
      subtitle: 'Finished with manicured front lawn, teak entrance porch, and covered parking',
      url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      elevationHeight: "12' 6\" Single Slab",
      features: ['Wide Front Veranda', 'Landscaped Pathway', 'Living Room Picture Windows'],
      peopleDescription: 'Family and adult scale figures (5\'8") at the front entryway for spatial reference',
    },
    2: {
      title: 'G+1 Modern Duplex Villa',
      subtitle: 'Finished with glass balcony balustrades, upper cantilever master suite & LED lighting',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      elevationHeight: "23' 6\" Two Floors",
      features: ['Toughened Glass Balcony', 'Double-Height Living Glazing', 'Covered Portico with Vehicle'],
      peopleDescription: 'Adults walking along the front driveway and entrance stairs showing true ceiling height',
    },
    3: {
      title: 'G+2 Luxury Triplex Residence',
      subtitle: 'Finished with rooftop pergola garden, multi-tier balconies and vertical architectural fins',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      elevationHeight: "34' 0\" Three Floors",
      features: ['Terrace Lounge & Greenery', 'Multi-Floor Glass Louvers', 'Ground Stilt Parking'],
      peopleDescription: 'Pedestrian and family scale indicators standing near the front gate and porch',
    },
  };

  const currentHouse3D = completedHouseImages[floors as 1 | 2 | 3] || completedHouseImages[2];

  return (
    <div className="relative rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 lg:p-12 shadow-sm text-gray-900">
      {/* Top Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-gray-900 font-mono text-xs font-bold uppercase tracking-widest">
            <Sliders className="h-4 w-4 text-gray-900" />
            <span>Interactive Real-Time Simulation</span>
          </div>
          <h3 className="font-heading mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Live CAD & Completed 3D House Visualization
          </h3>
          <p className="mt-2 text-sm text-gray-900 font-medium max-w-2xl">
            Slide parameters to watch the 2D CAD floor plan update alongside a realistic 3D image of how your house will look upon completion with people for real-life human scale.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 font-mono text-xs text-gray-900">
            Plot Area: <strong className="text-gray-900 font-bold">{plotArea} sq.ft</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 font-mono text-xs text-gray-900">
            Built-Up: <strong className="text-gray-900 font-bold">{totalBuiltUp} sq.ft</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Controls Column */}
        <div className="space-y-5 lg:col-span-4">
          {/* Width */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-900">Plot Width</span>
              <span className="font-mono font-bold text-gray-900">{width} ft</span>
            </div>
            <input
              type="range"
              min={20}
              max={60}
              step={2}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-gray-900 cursor-pointer h-2 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-gray-900 font-bold">
              <span>20 ft (Narrow)</span>
              <span>40 ft (Standard)</span>
              <span>60 ft (Wide)</span>
            </div>
          </div>

          {/* Length */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-900">Plot Length (Depth)</span>
              <span className="font-mono font-bold text-gray-900">{length} ft</span>
            </div>
            <input
              type="range"
              min={30}
              max={80}
              step={5}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-gray-900 cursor-pointer h-2 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-gray-900 font-bold">
              <span>30 ft</span>
              <span>50 ft</span>
              <span>80 ft (Deep)</span>
            </div>
          </div>

          {/* Bedrooms & Floors row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1.5">Bedrooms</label>
              <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                {[1, 2, 3, 4].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBedrooms(b)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                      bedrooms === b ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-900 hover:text-black'
                    }`}
                  >
                    {b}BHK
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1.5">Floors Structure</label>
              <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                {[
                  { label: 'Ground', count: 1 },
                  { label: 'G+1', count: 2 },
                  { label: 'G+2', count: 3 },
                ].map((f) => (
                  <button
                    key={f.count}
                    onClick={() => setFloors(f.count)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                      floors === f.count ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-900 hover:text-black'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-900">Target Construction Budget</span>
              <span className="font-mono font-bold text-gray-900">₹{budgetLakhs} Lakh</span>
            </div>
            <input
              type="range"
              min={15}
              max={90}
              step={2.5}
              value={budgetLakhs}
              onChange={(e) => setBudgetLakhs(Number(e.target.value))}
              className="w-full accent-gray-900 cursor-pointer h-2 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-gray-900 font-bold font-mono">
              <span>₹15 Lakh</span>
              <span>₹35 Lakh</span>
              <span>₹90 Lakh</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={() =>
              onCustomizeFullPlan({
                width,
                length,
                bedrooms,
                floors,
                budget: budgetLakhs * 100000,
              })
            }
            className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-white shadow-sm transition-all"
            id="demo-open-cad-btn"
          >
            <span>Open in Full 2D CAD & 3D Studio</span>
            <ArrowRight className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Live CAD Floor Plan & 3D Completed House Column */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6 lg:col-span-8 shadow-sm">
          {/* Top Row: Feasibility Scores & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white p-1 shadow-sm">
              <button
                onClick={() => setDisplayMode('split')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  displayMode === 'split'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                title="View 2D Blueprint & 3D Completed Render Side-by-Side"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Side-by-Side (2D + 3D)</span>
              </button>

              <button
                onClick={() => setDisplayMode('cad')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  displayMode === 'cad'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                title="View Full 2D Parametric CAD"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>2D CAD Plan</span>
              </button>

              <button
                onClick={() => setDisplayMode('3d')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  displayMode === '3d'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                title="View 3D Completed House Image"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>3D Completed House</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm">
                Efficiency: <strong className="text-gray-900">{spaceEfficiency}%</strong>
              </span>
              <span className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm">
                Vastu: <strong className="text-gray-900">{vastuCompatibility}%</strong>
              </span>
              <span className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm">
                Est: <strong className="text-gray-900">₹{estimatedCostLakhs}L</strong>
              </span>
            </div>
          </div>

          {/* Visualization Stage */}
          <div className="my-4">
            {/* SPLIT VIEW (2D CAD beside 3D COMPLETED HOUSE) */}
            {displayMode === 'split' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: 2D Parametric CAD Generation */}
                <div className="relative flex flex-col rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live 2D CAD Blueprint
                    </span>
                    <span className="font-mono text-[11px] text-gray-600">Scale: 1:50</span>
                  </div>

                  <div className="p-3 flex items-center justify-center min-h-[220px]">
                    <svg viewBox="0 0 320 200" className="w-full max-h-[200px] select-none">
                      {/* Outer plot footprint */}
                      <rect x="20" y="15" width="280" height="170" fill="#F9FAFB" stroke="#111827" strokeWidth="1.5" rx="3" />
                      {/* Setback line */}
                      <rect x="30" y="25" width="260" height="150" fill="none" stroke="#6B7280" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

                      {/* Living Area */}
                      <rect x="35" y="30" width="130" height="75" fill="#F3F4F6" stroke="#111827" strokeWidth="1" />
                      <text x="100" y="65" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Living & Foyer</text>
                      <text x="100" y="77" textAnchor="middle" fill="#111827" fontSize="7" fontWeight="bold">{Math.round(builtUpPerFloor * 0.35)} sq.ft</text>

                      {/* Kitchen / Dining */}
                      <rect x="170" y="30" width="120" height="75" fill="#E5E7EB" stroke="#111827" strokeWidth="1" />
                      <text x="230" y="65" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Kitchen & Dining (SE)</text>
                      <text x="230" y="77" textAnchor="middle" fill="#111827" fontSize="7" fontWeight="bold">{Math.round(builtUpPerFloor * 0.28)} sq.ft</text>

                      {/* Master Bedroom */}
                      <rect x="35" y="110" width="110" height="65" fill="#E5E7EB" stroke="#111827" strokeWidth="1" />
                      <text x="90" y="142" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Master Suite (SW)</text>
                      <text x="90" y="154" textAnchor="middle" fill="#111827" fontSize="7" fontWeight="bold">{Math.round(builtUpPerFloor * 0.22)} sq.ft</text>

                      {/* Bath / Utility */}
                      <rect x="150" y="110" width="60" height="65" fill="#F3F4F6" stroke="#111827" strokeWidth="1" />
                      <text x="180" y="145" textAnchor="middle" fill="#111827" fontSize="8" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Bath</text>

                      {/* Staircase Core */}
                      <rect x="215" y="110" width="75" height="65" fill="#E5E7EB" stroke="#111827" strokeWidth="1" />
                      <text x="252" y="145" textAnchor="middle" fill="#111827" fontSize="8" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Stairs / Upper</text>
                    </svg>
                  </div>
                  <div className="border-t border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-700 flex justify-between font-medium">
                    <span>Ground Footprint: {builtUpPerFloor} sq.ft</span>
                    <span className="text-gray-900 font-bold">{bedrooms} BHK Layout</span>
                  </div>
                </div>

                {/* Right: 3D Completed House Image with People for Scale */}
                <div className="relative flex flex-col rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-gray-900" />
                      3D Completed House (Exterior & People)
                    </span>
                    <span className="rounded bg-gray-900 text-white px-2 py-0.5 text-[10px] font-bold">
                      {floors === 1 ? 'Ground Floor' : floors === 2 ? 'G+1 Duplex' : 'G+2 Triplex'}
                    </span>
                  </div>

                  <div className="relative h-[220px] w-full overflow-hidden bg-gray-900 group">
                    <img
                      src={currentHouse3D.url}
                      alt={currentHouse3D.title}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
                        lightingMood === 'sunset' ? 'sepia-[0.35] brightness-95' : lightingMood === 'night' ? 'brightness-75 contrast-125' : 'brightness-100'
                      }`}
                    />

                    {/* Gradient Overlay for Readable Badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                    {/* Scale Reference Badge (People / Human Scale) */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm border border-white/20">
                      <Users className="h-3 w-3 text-emerald-400" />
                      <span>Clear Human Scale (5'8" Figure View)</span>
                    </div>

                    {/* Lighting Mood Quick Switcher */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-black/70 p-0.5 backdrop-blur-sm border border-white/20">
                      <button
                        onClick={() => setLightingMood('day')}
                        className={`p-1 rounded text-white ${lightingMood === 'day' ? 'bg-white/30 text-amber-300' : 'hover:bg-white/10'}`}
                        title="Sunny Daylight"
                      >
                        <Sun className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setLightingMood('sunset')}
                        className={`p-1 rounded text-white ${lightingMood === 'sunset' ? 'bg-white/30 text-orange-300' : 'hover:bg-white/10'}`}
                        title="Sunset Golden Hour"
                      >
                        <Sunset className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setLightingMood('night')}
                        className={`p-1 rounded text-white ${lightingMood === 'night' ? 'bg-white/30 text-blue-300' : 'hover:bg-white/10'}`}
                        title="Night Illumination"
                      >
                        <Moon className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Bottom Features Description */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{currentHouse3D.title}</span>
                        <span className="text-[11px] font-mono text-gray-300">{currentHouse3D.elevationHeight}</span>
                      </div>
                      <p className="text-[10px] text-gray-200 line-clamp-1 mt-0.5 font-medium">
                        {currentHouse3D.peopleDescription}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-700 flex justify-between font-medium">
                    <span>Finished Elevation • Full Exterior View</span>
                    <span className="text-gray-900 font-bold">Turnkey Look</span>
                  </div>
                </div>
              </div>
            )}

            {/* FULL 2D CAD BLUEPRINT MODE */}
            {displayMode === 'cad' && (
              <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-white border border-gray-200 p-6 min-h-[260px]">
                <svg viewBox="0 0 320 200" className="w-full max-h-[240px] select-none">
                  <rect x="20" y="15" width="280" height="170" fill="#F9FAFB" stroke="#111827" strokeWidth="1.5" rx="3" />
                  <rect x="30" y="25" width="260" height="150" fill="none" stroke="#6B7280" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

                  <rect x="35" y="30" width="130" height="75" fill="#F3F4F6" stroke="#111827" strokeWidth="1" />
                  <text x="100" y="65" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Living & Foyer</text>
                  <text x="100" y="79" textAnchor="middle" fill="#111827" fontSize="8" fontWeight="bold">{Math.round(builtUpPerFloor * 0.35)} sq.ft</text>

                  <rect x="170" y="30" width="120" height="75" fill="#E5E7EB" stroke="#111827" strokeWidth="1" />
                  <text x="230" y="65" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Kitchen & Dining (SE)</text>
                  <text x="230" y="79" textAnchor="middle" fill="#111827" fontSize="8" fontWeight="bold">{Math.round(builtUpPerFloor * 0.28)} sq.ft</text>

                  <rect x="35" y="110" width="110" height="65" fill="#E5E7EB" stroke="#111827" strokeWidth="1" />
                  <text x="90" y="142" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Master Suite (SW)</text>
                  <text x="90" y="156" textAnchor="middle" fill="#111827" fontSize="8" fontWeight="bold">{Math.round(builtUpPerFloor * 0.22)} sq.ft</text>

                  <rect x="150" y="110" width="60" height="65" fill="#F3F4F6" stroke="#111827" strokeWidth="1" />
                  <text x="180" y="145" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Bath</text>

                  <rect x="215" y="110" width="75" height="65" fill="#E5E7EB" stroke="#111827" strokeWidth="1" />
                  <text x="252" y="145" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">Stairs / Upper</text>
                </svg>
              </div>
            )}

            {/* FULL 3D COMPLETED HOUSE MODE */}
            {displayMode === '3d' && (
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-900 group">
                <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden">
                  <img
                    src={currentHouse3D.url}
                    alt={currentHouse3D.title}
                    referrerPolicy="no-referrer"
                    className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
                      lightingMood === 'sunset' ? 'sepia-[0.35] brightness-95' : lightingMood === 'night' ? 'brightness-75 contrast-125' : 'brightness-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

                  {/* Top Bar inside 3D image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/20 shadow-sm">
                        <Users className="h-4 w-4 text-emerald-400" />
                        <span>Realistic Human Scale & People View</span>
                      </span>
                      <span className="rounded-lg bg-gray-900/90 text-white px-2.5 py-1.5 text-xs font-bold border border-white/20">
                        {floors === 1 ? '1 Storey (Ground)' : floors === 2 ? '2 Storey (G+1)' : '3 Storey (G+2)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-lg bg-black/80 p-1 backdrop-blur-md border border-white/20">
                      <button
                        onClick={() => setLightingMood('day')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all text-white ${
                          lightingMood === 'day' ? 'bg-white/30 text-amber-300' : 'hover:bg-white/10'
                        }`}
                      >
                        <Sun className="h-3.5 w-3.5" />
                        <span>Day</span>
                      </button>
                      <button
                        onClick={() => setLightingMood('sunset')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all text-white ${
                          lightingMood === 'sunset' ? 'bg-white/30 text-orange-300' : 'hover:bg-white/10'
                        }`}
                      >
                        <Sunset className="h-3.5 w-3.5" />
                        <span>Sunset</span>
                      </button>
                      <button
                        onClick={() => setLightingMood('night')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all text-white ${
                          lightingMood === 'night' ? 'bg-white/30 text-blue-300' : 'hover:bg-white/10'
                        }`}
                      >
                        <Moon className="h-3.5 w-3.5" />
                        <span>Night</span>
                      </button>
                    </div>
                  </div>

                  {/* Hotspot callouts */}
                  {showCallouts && (
                    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentHouse3D.features.map((feat, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-bold text-gray-900 shadow-md">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-lg font-bold">{currentHouse3D.title}</h4>
                      <span className="font-mono text-sm font-bold text-emerald-400">{currentHouse3D.elevationHeight}</span>
                    </div>
                    <p className="text-xs text-gray-200 mt-1 font-medium">{currentHouse3D.subtitle}</p>
                    <p className="text-[11px] text-emerald-300 mt-1 font-bold">
                      🧑‍🤝‍🧑 {currentHouse3D.peopleDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick summary strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-900 border-t border-gray-200 pt-3 font-medium">
            <span className="flex items-center gap-2 text-gray-900 font-bold">
              <CheckCircle className="h-4 w-4 text-gray-900" />
              <span>{width}×{length} ft ({plotArea} sq.ft) • {bedrooms}BHK {floors > 1 ? `G+${floors - 1}` : 'Ground'} • Completed 3D Exterior Synced</span>
            </span>
            <span className="font-mono text-gray-900 font-bold">
              Est: ₹{estimatedCostLakhs}L (₹2,050/sq.ft)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
