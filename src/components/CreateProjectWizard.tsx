import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import {
  ArchitecturalStyle,
  Direction,
  PlotDetails,
  Project,
  QualityTier,
} from '../types';
import { api } from '../services/api';

interface CreateProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
  initialConfig?: {
    width?: number;
    length?: number;
    bedrooms?: number;
    floors?: number;
    budget?: number;
  };
}

export const CreateProjectWizard: React.FC<CreateProjectWizardProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  initialConfig,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Form State
  const [projectName, setProjectName] = useState<string>('My Dream Home');

  // Step 1: Plot Details
  const [plotWidth, setPlotWidth] = useState<number>(initialConfig?.width || 30);
  const [plotLength, setPlotLength] = useState<number>(initialConfig?.length || 50);
  const [plotShape, setPlotShape] = useState<PlotDetails['shape']>('Rectangular');
  const [roadDirection, setRoadDirection] = useState<Direction>('North');
  const [locationCity, setLocationCity] = useState<string>('Bengaluru, Karnataka');
  const [setbackFront, setSetbackFront] = useState<number>(5);
  const [setbackRear, setSetbackRear] = useState<number>(3);
  const [setbackSides, setSetbackSides] = useState<number>(3);

  // Step 2: Family & Lifestyle
  const [totalMembers, setTotalMembers] = useState<number>(4);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(1);
  const [elderly, setElderly] = useState<number>(1);
  const [frequentGuests, setFrequentGuests] = useState<boolean>(true);

  // Step 3: Room Requirements
  const [bedrooms, setBedrooms] = useState<number>(initialConfig?.bedrooms || 3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [poojaRoom, setPoojaRoom] = useState<boolean>(true);
  const [studyRoom, setStudyRoom] = useState<boolean>(true);
  const [balconies, setBalconies] = useState<number>(2);
  const [garden, setGarden] = useState<boolean>(true);
  const [parkingBays, setParkingBays] = useState<number>(1);
  const [utilityRoom, setUtilityRoom] = useState<boolean>(true);

  // Step 4: Floors & Structure
  const [totalFloors, setTotalFloors] = useState<number>(initialConfig?.floors || 2);

  // Step 5: Budget & Quality Tier
  const [totalBudget, setTotalBudget] = useState<number>(initialConfig?.budget || 3500000);
  const [tier, setTier] = useState<QualityTier>('Standard');

  // Step 6: Architectural Style
  const [style, setStyle] = useState<ArchitecturalStyle>('Modern');

  // Step 7: Preferences & Vastu
  const [vastuPriority, setVastuPriority] = useState<'Strict' | 'High' | 'Medium' | 'None'>('High');
  const [naturalLighting, setNaturalLighting] = useState<'Maximized' | 'Standard'>('Maximized');
  const [crossVentilation, setCrossVentilation] = useState<'Maximized' | 'Standard'>('Maximized');
  const [accessibilityForElderly, setAccessibilityForElderly] = useState<boolean>(elderly > 0);

  if (!isOpen) return null;

  const totalPlotArea = plotWidth * plotLength;

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newProject = await api.createProject({
        name: projectName || `${plotWidth}x${plotLength} ${style} Villa`,
        plot: {
          width: plotWidth,
          length: plotLength,
          totalArea: totalPlotArea,
          shape: plotShape,
          roadDirection,
          northDirection: roadDirection === 'North' ? 0 : roadDirection === 'East' ? 90 : roadDirection === 'South' ? 180 : 270,
          location: locationCity,
          setbacks: {
            front: setbackFront,
            rear: setbackRear,
            left: setbackSides,
            right: setbackSides,
          },
        },
        family: {
          totalMembers,
          adults,
          children,
          elderly,
          frequentGuests,
        },
        requirements: {
          bedrooms,
          masterBedrooms: 1,
          childrenRooms: children > 0 ? 1 : 0,
          guestRooms: frequentGuests ? 1 : 0,
          bathrooms,
          attachedBaths: Math.min(bathrooms, 2),
          kitchen: true,
          livingRoom: true,
          diningRoom: true,
          studyRoom,
          poojaRoom,
          storeRoom: true,
          utilityRoom,
          balconies,
          terrace: true,
          garden,
          parkingBays,
          servantQuarter: false,
        },
        budget: {
          totalBudget,
        },
        style,
        preferences: {
          vastuPriority,
          naturalLighting,
          crossVentilation,
          privacyLevel: 'High',
          accessibilityForElderly,
          futureExpansionReady: true,
        },
        totalFloors,
      });

      onProjectCreated(newProject);
      onClose();
    } catch (err) {
      console.error('Failed to generate project:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-xl border border-black/10 bg-white text-[#1A1A1A] shadow-2xl flex flex-col">
        {/* Wizard Header */}
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 border border-gray-300 text-gray-900">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-gray-900">House Plan Generator Wizard</h3>
                <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-900 border border-gray-300 uppercase">
                  Step {step} of 7
                </span>
              </div>
              <p className="text-xs text-gray-900 font-medium">Parametric CAD, Vastu Alignment & Budget Calibration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="h-1 w-full bg-gray-200">
          <div
            className="h-full bg-gray-900 transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Wizard Step Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          {/* STEP 1: Plot Details */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="font-heading text-xl font-bold text-gray-900">1. Plot Dimensions & Orientation</h4>
                <p className="text-xs text-gray-900 mt-0.5 font-medium">
                  Enter your exact plot boundary and road direction to establish setbacks and building envelopes.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Modern Serene Villa"
                  className="w-full rounded-lg border border-black/10 bg-[#F5F2ED] px-3.5 py-2 text-xs text-[#1A1A1A] focus:border-[#5A5A40] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">Plot Width (Frontage)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={15}
                      max={120}
                      value={plotWidth}
                      onChange={(e) => setPlotWidth(Number(e.target.value))}
                      className="w-full rounded-lg border border-black/10 bg-[#F5F2ED] px-3.5 py-2 text-xs text-[#1A1A1A] focus:border-[#5A5A40] focus:outline-none font-mono font-bold"
                    />
                    <span className="text-xs text-[#5A5A40] font-mono font-bold">ft</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">Plot Length (Depth)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={20}
                      max={150}
                      value={plotLength}
                      onChange={(e) => setPlotLength(Number(e.target.value))}
                      className="w-full rounded-lg border border-black/10 bg-[#F5F2ED] px-3.5 py-2 text-xs text-[#1A1A1A] focus:border-[#5A5A40] focus:outline-none font-mono font-bold"
                    />
                    <span className="text-xs text-[#5A5A40] font-mono font-bold">ft</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-black/10 bg-[#EFECE7] p-3 text-xs flex items-center justify-between text-[#1A1A1A]">
                <span className="font-medium">Calculated Total Plot Area:</span>
                <span className="font-mono font-bold text-[#5A5A40] text-sm">
                  {totalPlotArea} sq.ft ({(totalPlotArea / 9).toFixed(1)} sq.yd)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">Road Facing Direction</label>
                  <select
                    value={roadDirection}
                    onChange={(e) => setRoadDirection(e.target.value as Direction)}
                    className="w-full rounded-lg border border-black/10 bg-[#F5F2ED] px-3.5 py-2 text-xs text-[#1A1A1A] focus:border-[#5A5A40] focus:outline-none font-medium"
                  >
                    <option value="North">North (Highly Auspicious)</option>
                    <option value="East">East (Solar Morning Light)</option>
                    <option value="South">South (Windward)</option>
                    <option value="West">West (Sunset View)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">Location City</label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="City, State"
                    className="w-full rounded-lg border border-black/10 bg-[#F5F2ED] px-3.5 py-2 text-xs text-[#1A1A1A] focus:border-[#5A5A40] focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Setbacks */}
              <div>
                <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1.5">
                  Municipal Setback Margins (Bylaw Clearances)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-black/10 bg-[#F5F2ED] p-2">
                    <span className="text-[10px] text-[#1A1A1A]/60 block font-bold uppercase">Front Setback</span>
                    <input
                      type="number"
                      value={setbackFront}
                      onChange={(e) => setSetbackFront(Number(e.target.value))}
                      className="w-full bg-transparent font-mono text-xs font-bold text-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div className="rounded-lg border border-black/10 bg-[#F5F2ED] p-2">
                    <span className="text-[10px] text-[#1A1A1A]/60 block font-bold uppercase">Rear Setback</span>
                    <input
                      type="number"
                      value={setbackRear}
                      onChange={(e) => setSetbackRear(Number(e.target.value))}
                      className="w-full bg-transparent font-mono text-xs font-bold text-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div className="rounded-lg border border-black/10 bg-[#F5F2ED] p-2">
                    <span className="text-[10px] text-[#1A1A1A]/60 block font-bold uppercase">Sides Setback</span>
                    <input
                      type="number"
                      value={setbackSides}
                      onChange={(e) => setSetbackSides(Number(e.target.value))}
                      className="w-full bg-transparent font-mono text-xs font-bold text-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Family & Lifestyle */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="font-heading text-xl font-bold text-gray-900">2. Family Composition & Demographics</h4>
                <p className="text-xs text-gray-900 mt-0.5 font-medium">
                  Helps allocate ground-floor bedroom accessibility, private study zones, and entertainment areas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-300 bg-gray-50 p-4">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1">Total Family Members</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={totalMembers}
                    onChange={(e) => setTotalMembers(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none font-mono"
                  />
                </div>

                <div className="rounded-xl border border-gray-300 bg-gray-50 p-4">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1">Elderly / Senior Citizens</label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={elderly}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setElderly(val);
                      if (val > 0) setAccessibilityForElderly(true);
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-300 bg-gray-50 p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={frequentGuests}
                    onChange={(e) => setFrequentGuests(e.target.checked)}
                    className="h-4 w-4 accent-gray-900 rounded"
                  />
                  <span className="text-xs text-gray-900 font-bold">
                    Frequently host overnight guests (Include dedicated guest suite / powder bath)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Rooms & Requirements */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="font-heading text-xl font-bold text-gray-900">3. Rooms & Functional Spaces</h4>
                <p className="text-xs text-gray-900 mt-0.5 font-medium">
                  Select the core room count and auxiliary lifestyle amenities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">Bedrooms Count</label>
                  <div className="flex rounded-lg border border-black/10 bg-[#F5F2ED] p-1">
                    {[1, 2, 3, 4, 5].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBedrooms(b)}
                        className={`flex-1 rounded py-1.5 text-xs font-bold transition-colors ${
                          bedrooms === b ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">Bathrooms Count</label>
                  <div className="flex rounded-lg border border-black/10 bg-[#F5F2ED] p-1">
                    {[1, 2, 3, 4, 5].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBathrooms(b)}
                        className={`flex-1 rounded py-1.5 text-xs font-bold transition-colors ${
                          bathrooms === b ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Features checkboxes */}
              <div className="grid grid-cols-2 gap-3 text-xs text-[#1A1A1A]">
                <label className="flex items-center gap-2.5 rounded-lg border border-black/10 bg-[#F5F2ED] p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={poojaRoom}
                    onChange={(e) => setPoojaRoom(e.target.checked)}
                    className="h-4 w-4 accent-[#1A1A1A] rounded"
                  />
                  <span className="font-medium">Pooja / Prayer Sanctum (NE)</span>
                </label>

                <label className="flex items-center gap-2.5 rounded-lg border border-black/10 bg-[#F5F2ED] p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={studyRoom}
                    onChange={(e) => setStudyRoom(e.target.checked)}
                    className="h-4 w-4 accent-[#1A1A1A] rounded"
                  />
                  <span className="font-medium">Dedicated Work/Study Room</span>
                </label>

                <label className="flex items-center gap-2.5 rounded-lg border border-black/10 bg-[#F5F2ED] p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={garden}
                    onChange={(e) => setGarden(e.target.checked)}
                    className="h-4 w-4 accent-[#1A1A1A] rounded"
                  />
                  <span className="font-medium">Front Landscaped Lawn</span>
                </label>

                <label className="flex items-center gap-2.5 rounded-lg border border-black/10 bg-[#F5F2ED] p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parkingBays > 0}
                    onChange={(e) => setParkingBays(e.target.checked ? 1 : 0)}
                    className="h-4 w-4 accent-[#1A1A1A] rounded"
                  />
                  <span className="font-medium">Covered Car Parking Porch</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Floors & Structure */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="font-heading text-xl font-bold text-gray-900">4. Number of Floors & Vertical Stack</h4>
                <p className="text-xs text-gray-900 mt-0.5 font-medium">
                  Select how many levels you wish to construct on your plot.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { count: 1, title: 'Ground Floor Only', desc: 'Single level compact villa living' },
                  { count: 2, title: 'Ground + 1 Floor (Duplex)', desc: 'Optimal separation of public and private suites' },
                  { count: 3, title: 'Ground + 2 Floors (Triplex)', desc: 'Includes entertainment studio & terrace deck' },
                ].map((f) => (
                  <button
                    key={f.count}
                    type="button"
                    onClick={() => setTotalFloors(f.count)}
                    className={`rounded-xl border p-4 text-left transition-all shadow-sm ${
                      totalFloors === f.count
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-heading text-base font-bold text-gray-900 block">{f.title}</span>
                    <span className="text-xs text-gray-900 mt-1 block leading-relaxed font-medium">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Budget & Quality Tier */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="font-heading text-xl font-bold text-gray-900">5. Target Construction Budget & Tier</h4>
                <p className="text-xs text-gray-900 mt-0.5 font-medium">
                  HomeGenie will engineer materials and room spans to match this budget target.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-900 font-bold">Total Construction Budget</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    ₹{(totalBudget / 100000).toFixed(1)} Lakh
                  </span>
                </div>
                <input
                  type="range"
                  min={1500000}
                  max={9500000}
                  step={250000}
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full accent-gray-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-900 mt-1 font-mono font-bold">
                  <span>₹15 Lakh</span>
                  <span>₹35 Lakh (Typical 3BHK)</span>
                  <span>₹95 Lakh</span>
                </div>
              </div>

              {/* Quality Tiers */}
              <div>
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">Material Quality Tier</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'Economy' as QualityTier, name: 'Economy', rate: '₹1,600/sqft', desc: 'Vitrified tiles, standard UPVC' },
                    { key: 'Standard' as QualityTier, name: 'Standard', rate: '₹2,050/sqft', desc: 'Kajaria tiles, Jaquar bath' },
                    { key: 'Premium' as QualityTier, name: 'Premium', rate: '₹2,800/sqft', desc: 'Italian marble, Kohler fixtures' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTier(t.key)}
                      className={`rounded-xl border p-3.5 text-left transition-all shadow-sm ${
                        tier === t.key
                          ? 'border-gray-900 bg-gray-100'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm font-bold text-gray-900">{t.name}</span>
                        <span className="font-mono text-[10px] font-bold text-gray-900">{t.rate}</span>
                      </div>
                      <span className="text-[11px] text-gray-900 mt-1 block font-medium">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Architectural Style */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="font-heading text-xl font-bold text-gray-900">6. Architectural Style & Aesthetics</h4>
                <p className="text-xs text-gray-900 mt-0.5 font-medium">
                  Determines fenestration, facade glazing, overhangs, and materials palette.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { style: 'Modern' as ArchitecturalStyle, desc: 'Clean geometric lines, large glass facades' },
                  { style: 'Contemporary' as ArchitecturalStyle, desc: 'Dynamic volumetric forms & warm wood cladding' },
                  { style: 'Minimalist' as ArchitecturalStyle, desc: 'Uncluttered spaces, open plan fluidity' },
                  { style: 'Traditional Indian' as ArchitecturalStyle, desc: 'Courtyard ethos, pitched roofs, carved pillars' },
                  { style: 'Kerala / Coastal' as ArchitecturalStyle, desc: 'Sloped Mangalore tiles, rain verandas' },
                  { style: 'Luxury' as ArchitecturalStyle, desc: 'Grand double-height foyer, neo-classical symmetry' },
                ].map((s) => (
                  <button
                    key={s.style}
                    type="button"
                    onClick={() => setStyle(s.style)}
                    className={`rounded-xl border p-3.5 text-left transition-all shadow-sm ${
                      style === s.style
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-heading text-sm font-bold text-gray-900 block">{s.style}</span>
                    <span className="text-[11px] text-gray-900 mt-1 block leading-relaxed font-medium">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Preferences & Vastu */}
          {step === 7 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="font-heading text-xl font-bold text-gray-900">7. Vastu & Environmental Optimization</h4>
                <p className="text-xs text-gray-900 mt-0.5 font-medium">
                  Fine-tune your cosmic directional alignment, daylighting, and ventilation priorities.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1.5">Vastu Shastra Compliance</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'Strict' as const, label: 'Strict (100% Vastu)', sub: 'Zero compromises on directional zones' },
                    { val: 'High' as const, label: 'High (Recommended)', sub: 'Balances Vastu with space efficiency' },
                    { val: 'None' as const, label: 'Modern Functional', sub: 'Prioritizes views and layout flow' },
                  ].map((v) => (
                    <button
                      key={v.val}
                      type="button"
                      onClick={() => setVastuPriority(v.val)}
                      className={`rounded-xl border p-3 text-left transition-all shadow-sm ${
                        vastuPriority === v.val
                          ? 'border-gray-900 bg-gray-100'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-heading text-xs font-bold text-gray-900 block">{v.label}</span>
                      <span className="text-[10px] text-gray-900 block mt-0.5 font-medium">{v.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-gray-900">
                <label className="flex items-center gap-2.5 rounded-lg border border-gray-300 bg-gray-50 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={naturalLighting === 'Maximized'}
                    onChange={(e) => setNaturalLighting(e.target.checked ? 'Maximized' : 'Standard')}
                    className="h-4 w-4 accent-gray-900 rounded"
                  />
                  <span className="font-bold">Maximize Direct Sunlight (North & East Glazing)</span>
                </label>

                <label className="flex items-center gap-2.5 rounded-lg border border-gray-300 bg-gray-50 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crossVentilation === 'Maximized'}
                    onChange={(e) => setCrossVentilation(e.target.checked ? 'Maximized' : 'Standard')}
                    className="h-4 w-4 accent-gray-900 rounded"
                  />
                  <span className="font-bold">Cross-Ventilation Wind Flow Corridors</span>
                </label>
              </div>

              {/* Ready summary */}
              <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 text-xs text-gray-900">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-1 font-heading text-sm">
                  <Sparkles className="h-4 w-4 text-gray-900" />
                  <span>Ready to Synthesize Complete 2D CAD & 3D Model</span>
                </div>
                <p className="text-[11px] text-gray-900 leading-relaxed font-medium">
                  HomeGenie will now generate 4 tailored design alternatives, complete room coordinate geometry, 8-zone
                  Vastu compliance report, and itemized cost estimation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between border-t border-black/10 bg-[#F5F2ED] px-6 py-4">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-[#EFECE7] transition-colors shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#2c2c2c] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-lg bg-[#1A1A1A] hover:bg-[#2c2c2c] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-[#E4E0D8]" />
                  <span>Synthesizing Architectural CAD Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-[#E4E0D8]" />
                  <span>Generate Conceptual House Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
