import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  FileCode,
  IndianRupee,
  Layers,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { HeroBlueprintAnimation } from '../components/HeroBlueprintAnimation';
import { InteractivePlotDemo } from '../components/InteractivePlotDemo';

interface HomePageProps {
  onStartNewProject: () => void;
  onExploreProjects: () => void;
  onOpenSampleProject: (id: string) => void;
  onNavigate: (view: 'home' | 'dashboard' | 'workspace' | 'materials' | 'wizard') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartNewProject,
  onExploreProjects,
  onOpenSampleProject,
  onNavigate: _onNavigate,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does HomeGenie calculate floor plans from plot dimensions?',
      a: 'Our parametric engine accounts for statutory setback norms (front, rear, and side yards), floor-space index (FSI/FAR), road width, ground coverage ratios, and maximum permissible built-up areas tailored specifically to Indian municipal town-planning guidelines.',
    },
    {
      q: 'What Vastu Shastra principles are verified in real time?',
      a: 'We evaluate 8 primary compass zones (Ashta Dikpalakas): Main Entrance orientation, Master Bedroom (Nairutya/South-West), Kitchen (Agneya/South-East), Pooja/Prayer Sanctum (Ishanya/North-East), Living Area, Staircase cores, and Brahmasthan (central energy locus).',
    },
    {
      q: 'How accurate are the construction cost estimates?',
      a: 'Estimates are benchmarked against current Indian Tier-1 and Tier-2 city construction rates across Civil construction, Electrical, Plumbing, Flooring, Doors/Windows, Sanitary, Painting, Kitchen, and Furniture packages, categorized into Economy (₹1,600/sqft), Standard (₹2,050/sqft), and Premium (₹2,800/sqft) tiers.',
    },
    {
      q: 'Can I export the floor plans to AutoCAD for my local contractor?',
      a: 'Absolutely! HomeGenie allows you to export high-precision 2D CAD files in industry-standard DXF format with walls and room layers, scalable vector SVGs, and printable PDF design dossiers.',
    },
    {
      q: 'Is HomeGenie a replacement for a licensed architect or structural engineer?',
      a: 'No. HomeGenie produces conceptual architectural designs, spatial optimizations, and budgetary feasibility plans. All structural columns, foundation depths, reinforcement details, and municipal sanction drawings must be certified by a registered local architect and licensed structural engineer before construction begins.',
    },
  ];

  return (
    <div className="flex flex-col space-y-28 sm:space-y-36 md:space-y-44 pb-32">
      {/* SECTION 1: HERO SECTION - SPACIOUS & CLEAN */}
      <section className="relative pt-6 sm:pt-14 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
            {/* Left Hero Copy */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-gray-300/80 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-900 shadow-sm">
                <Sparkles className="h-4 w-4 text-gray-900" />
                <span>Parametric House Planning & Vastu Engine</span>
              </div>

              <h1
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                className="font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-gray-900 leading-[1.12]"
              >
                Design your dream home.{' '}
                <span className="text-gray-900 font-bold">
                  Intelligently.
                </span>
              </h1>

              <p className="text-base leading-relaxed text-gray-900 sm:text-lg max-w-xl font-medium">
                HomeGenie transforms your plot dimensions, family requirements, and construction budget into an
                optimized conceptual house plan — complete with 2D architectural CAD, 8-zone Vastu guidance, itemized cost
                estimates, and interactive 3D visualization.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartNewProject}
                  className="flex items-center gap-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 px-7 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-md active:scale-[0.98] transition-all"
                  id="hero-generate-btn"
                >
                  <Sparkles className="h-4 w-4 text-gray-200" />
                  <span>Generate Your House Plan</span>
                  <ArrowRight className="h-4 w-4 text-gray-200" />
                </button>

                <button
                  onClick={() => onOpenSampleProject('proj_30x50_villa')}
                  className="flex items-center gap-2.5 rounded-xl border border-gray-300 bg-white px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                  id="hero-explore-demo-btn"
                >
                  <Box className="h-4 w-4 text-gray-900" />
                  <span>Open 30×50 Demo Studio</span>
                </button>
              </div>

              {/* Trust & Spec Indicators */}
              <div className="flex flex-wrap items-center gap-8 pt-6 text-xs font-bold text-gray-900 border-t border-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-900" />
                  <span>AutoCAD DXF Export</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-gray-900" />
                  <span>8-Zone Vastu Checker</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-gray-900" />
                  <span>Live Cost Calibration</span>
                </div>
              </div>
            </div>

            {/* Right Hero Live Blueprint Animation Canvas */}
            <div className="lg:col-span-6">
              <HeroBlueprintAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CORE CAPABILITIES GRID - SPACIOUS */}
      <section className="mx-auto max-w-7xl w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-900">
            COMPREHENSIVE RESIDENTIAL SUITE
          </span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl mt-2 leading-tight">
            Everything You Need Before Laying the First Brick
          </h2>
          <p className="text-base text-gray-900 mt-4 leading-relaxed font-medium">
            Eliminate spatial regrets, budget overshoots, and directional doshas with unified architectural intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-2xl border border-gray-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all hover:border-gray-400 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-900 group-hover:scale-105 transition-transform">
              <FileCode className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-900 mt-6">Parametric 2D CAD Plans</h3>
            <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
              Auto-generates exact room coordinate geometry, setback clearances, 9" perimeter walls, 4.5" partitions,
              door swings, and window glazes ready for DXF export.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-gray-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all hover:border-gray-400 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-900 group-hover:scale-105 transition-transform">
              <Compass className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-900 mt-6">8-Zone Vastu Shastra Engine</h3>
            <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
              Maps your rooms into Ishanya (NE prayer), Agneya (SE fire/kitchen), Nairutya (SW master), and Brahmasthan
              with instant compliance scoring and remedies.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border border-gray-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all hover:border-gray-400 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-900 group-hover:scale-105 transition-transform">
              <IndianRupee className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-900 mt-6">Itemized Budget Optimizer</h3>
            <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
              Real-time construction cost breakdowns across Civil, Plumbing, Electrical, Flooring, and Sanitary with
              prioritized value-engineering recommendations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group rounded-2xl border border-gray-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all hover:border-gray-400 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-900 group-hover:scale-105 transition-transform">
              <Box className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-900 mt-6">Interactive 3D Studio</h3>
            <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
              Walk through extruded 3D room volumes, toggle multi-floor exploded views, adjust Day/Sunset/Night
              sunlight angles, and inspect interior spatial feel.
            </p>
          </div>

          {/* Card 5 */}
          <div className="group rounded-2xl border border-gray-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all hover:border-gray-400 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-900 group-hover:scale-105 transition-transform">
              <Layers className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-900 mt-6">Materials & Brands Intelligence</h3>
            <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
              Side-by-side comparison of Kajaria, UltraTech, Jaquar, Asian Paints, and Fenesta across Economy, Standard,
              and Premium architectural tiers.
            </p>
          </div>

          {/* Card 6 */}
          <div className="group rounded-2xl border border-gray-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all hover:border-gray-400 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-900 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-900 mt-6">Conversational AI Plan Editor</h3>
            <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
              Simply type "Make the kitchen 25 sq.ft bigger" or "Reduce civil cost" to have Gemini calculate
              instant architectural and cost adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS (4 STEPS) - SPACIOUS */}
      <section className="mx-auto max-w-7xl w-full">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 sm:p-16 lg:p-20 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-900">WORKFLOW</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl mt-2">
              From Plot to Plan in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Enter Plot & Needs',
                desc: 'Input your plot length, width, road direction, bedrooms, floors, and target budget ceiling.',
              },
              {
                step: '02',
                title: 'AI Generates CAD',
                desc: 'Parametric engine calculates room allocations, column grids, setback lines, and circulation passages.',
              },
              {
                step: '03',
                title: 'Analyze & Refine',
                desc: 'Review the 8-zone Vastu score, inspect the 3D model, and toggle value-engineering budget savings.',
              },
              {
                step: '04',
                title: 'Export & Build',
                desc: 'Download AutoCAD DXF blueprints, PDF design dossiers, and BOQ material specifications for your architect.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative space-y-3">
                <span className="font-heading text-4xl font-bold text-gray-400 block">{item.step}</span>
                <h4 className="font-heading text-lg font-bold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-900 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE PLOT & BUDGET SIMULATION */}
      <section className="mx-auto max-w-7xl w-full">
        <InteractivePlotDemo
          onCustomizeFullPlan={() => {
            onStartNewProject();
          }}
        />
      </section>

      {/* SECTION 5: ARCHITECTURAL STYLE SHOWCASE - SPACIOUS */}
      <section className="mx-auto max-w-7xl w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-900">
            AESTHETIC INSPIRATION
          </span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl mt-2">
            Tailored to Distinctive Architectural Styles
          </h2>
          <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
            Whether you desire geometric minimalist lines, coastal verandas, or traditional Indian courtyards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Modern Geometric Villa',
              desc: 'Double-height glass fenestrations, cantilevered overhangs, and open-plan spatial flow.',
              features: ['Large Floor-to-Ceiling Glazing', 'Linear Clean Edges', 'Hidden Flat Roof Drainage'],
              img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
            },
            {
              title: 'Traditional Indian Courtyard',
              desc: 'Centering a central Brahmasthan courtyard with carved teakwood pillars and natural air cooling.',
              features: ['Thinnai Front Veranda', 'Rainwater Harvesting', 'Sloped Mangalore Clay Tiles'],
              img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=700&q=80',
            },
            {
              title: 'Minimalist Urban Smart Home',
              desc: 'High-density space optimization for compact urban plots with multipurpose modular spaces.',
              features: ['Zero Wasted Corridors', 'Integrated Study Nook', 'Pocket Sliding Doors'],
              img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=80',
            },
          ].map((style, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={style.img}
                  alt={style.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <span className="absolute bottom-4 left-5 font-heading text-lg font-bold text-white">
                  {style.title}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-900 leading-relaxed font-medium">{style.desc}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {style.features.map((f, i) => (
                    <span key={i} className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-900 border border-gray-200">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FEATURED SAMPLE PROJECTS - SPACIOUS */}
      <section className="mx-auto max-w-7xl w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-900">
              EXPLORE PRE-ENGINEERED CAD PLANS
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-1">Featured House Blueprints</h2>
          </div>
          <button
            onClick={onExploreProjects}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-black"
          >
            <span>View All Projects in Dashboard</span>
            <ArrowRight className="h-4 w-4 text-gray-900" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Sample 1: 30x50 Villa */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold uppercase text-gray-900">30×50 FT (1500 SQ.FT)</span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 mt-1">
                    Modern 3BHK G+1 Serene Villa
                  </h3>
                </div>
                <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-bold text-gray-900 border border-gray-300">
                  87% Vastu
                </span>
              </div>
              <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
                Featuring double-height living hall, North-East pooja sanctum, covered car porch, landscaped lawn, and
                grand South-West master suite.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-xl bg-gray-50 p-3 border border-gray-200">
                <span className="text-[10px] text-gray-900 block uppercase font-bold">Built-up</span>
                <span className="font-mono font-bold text-gray-900 text-sm">1,500 sq.ft</span>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 border border-gray-200">
                <span className="text-[10px] text-gray-900 block uppercase font-bold">Est. Cost</span>
                <span className="font-mono font-bold text-gray-900 text-sm">₹33.85L</span>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 border border-gray-200">
                <span className="text-[10px] text-gray-900 block uppercase font-bold">Efficiency</span>
                <span className="font-mono font-bold text-gray-900 text-sm">91% Carpet</span>
              </div>
            </div>

            <button
              onClick={() => onOpenSampleProject('proj_30x50_villa')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-colors"
            >
              <span>Open in 2D CAD & 3D Studio</span>
              <ArrowRight className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Sample 2: 25x40 Smart City Home */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold uppercase text-gray-900">25×40 FT (1000 SQ.FT)</span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 mt-1">
                    Compact 2BHK Urban Smart Home
                  </h3>
                </div>
                <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-bold text-gray-900 border border-gray-300">
                  88% Vastu
                </span>
              </div>
              <p className="text-sm text-gray-900 mt-3 leading-relaxed font-medium">
                Space-optimized single-floor layout tailored for narrow city plots with integrated open kitchen,
                sunlit breakfast nook, and front sitout.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-xl bg-gray-50 p-3 border border-gray-200">
                <span className="text-[10px] text-gray-900 block uppercase font-bold">Built-up</span>
                <span className="font-mono font-bold text-gray-900 text-sm">780 sq.ft</span>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 border border-gray-200">
                <span className="text-[10px] text-gray-900 block uppercase font-bold">Est. Cost</span>
                <span className="font-mono font-bold text-gray-900 text-sm">₹22.80L</span>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 border border-gray-200">
                <span className="text-[10px] text-gray-900 block uppercase font-bold">Efficiency</span>
                <span className="font-mono font-bold text-gray-900 text-sm">93% Carpet</span>
              </div>
            </div>

            <button
              onClick={() => onOpenSampleProject('proj_25x40_urban')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-colors"
            >
              <span>Open in 2D CAD & 3D Studio</span>
              <ArrowRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7: COMPARISON TABLE - SPACIOUS */}
      <section className="mx-auto max-w-7xl w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-900">WHY HOMEGENIE</span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl mt-2">
            The Smarter Way to Plan Your Home
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-gray-200 text-gray-900 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Feature & Feasibility</th>
                <th className="px-6 py-4 text-gray-900 font-bold">HomeGenie AI Studio</th>
                <th className="px-6 py-4 text-gray-900">Traditional Draftsman</th>
                <th className="px-6 py-4 text-gray-900">Generic PDF Templates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-900">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Plot Setbacks & Bylaw Math</td>
                <td className="px-6 py-4 font-bold text-gray-900">✓ Instant & Parametric</td>
                <td className="px-6 py-4 text-gray-900 font-medium">Takes 2-3 Weeks</td>
                <td className="px-6 py-4 text-gray-900 font-medium">✗ Fixed / Mismatched</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">8-Zone Vastu Shastra Audit</td>
                <td className="px-6 py-4 font-bold text-gray-900">✓ Built-in Matrix & Score</td>
                <td className="px-6 py-4 text-gray-900 font-medium">Requires Separate Consultant</td>
                <td className="px-6 py-4 text-gray-900 font-medium">✗ None</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Real-time Budget Sync</td>
                <td className="px-6 py-4 font-bold text-gray-900">✓ Itemized BOQ & Savings</td>
                <td className="px-6 py-4 text-gray-900 font-medium">Rough Guesswork</td>
                <td className="px-6 py-4 text-gray-900 font-medium">✗ Outdated</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">3D Visualization</td>
                <td className="px-6 py-4 font-bold text-gray-900">✓ Interactive Three.js Studio</td>
                <td className="px-6 py-4 text-gray-900 font-medium">Extra ₹15k - ₹35k fee</td>
                <td className="px-6 py-4 text-gray-900 font-medium">✗ Static images</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">AutoCAD DXF Export</td>
                <td className="px-6 py-4 font-bold text-gray-900">✓ Included</td>
                <td className="px-6 py-4 text-gray-900 font-medium">✓ Included</td>
                <td className="px-6 py-4 text-gray-900 font-medium">✗ Paywalled PDF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 8: FAQ ACCORDION - SPACIOUS */}
      <section className="mx-auto max-w-4xl w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-900">FAQ</span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-heading text-base sm:text-lg font-bold text-gray-900 hover:text-black transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="h-5 w-5 text-gray-900" /> : <ChevronDown className="h-5 w-5 text-gray-900" />}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-gray-900 leading-relaxed border-t border-gray-100 pt-4 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: FINAL CALL TO ACTION - SPACIOUS */}
      <section className="mx-auto max-w-7xl w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-10 sm:p-20 text-white shadow-xl text-center border border-gray-800">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-heading text-3xl font-bold sm:text-5xl text-white leading-tight">
              Ready to Visualize Your Perfect Home?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
              Start with your plot dimensions, explore instant 2D CAD floor plans, check Vastu alignment, and optimize your budget in minutes.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={onStartNewProject}
                className="flex items-center gap-3 rounded-2xl bg-white hover:bg-gray-100 px-9 py-4 text-xs font-bold uppercase tracking-widest text-gray-900 shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4 text-gray-900" />
                <span>Launch House Plan Generator</span>
                <ArrowRight className="h-4 w-4 text-gray-900" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
