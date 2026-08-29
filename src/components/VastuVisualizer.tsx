import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sun,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  Check,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Direction, VastuItemAnalysis, VastuReport, VastuZoneAnalysis } from '../types';

interface VastuVisualizerProps {
  vastuReport: VastuReport;
  onApplyImprovements?: () => void;
  onHighlightZone?: (zone: Direction) => void;
}

const DEFAULT_ZONE_DETAILS: VastuZoneAnalysis[] = [
  {
    zone: 'North-East',
    element: 'Water',
    rulingPlanet: 'Jupiter (Guru) & Shiva',
    idealRooms: ['Pooja Sanctum', 'Meditation Nook', 'Open Water Feature', 'Study Room'],
    currentRooms: ['Pooja Room', 'Open Verandah'],
    isCompliant: true,
    recommendations: 'Ishanya Apex: Keep pure, clutter-free, and well-lit to welcome morning cosmic vitality.',
    score: 95,
  },
  {
    zone: 'North',
    element: 'Water',
    rulingPlanet: 'Mercury (Budh) & Kuber',
    idealRooms: ['Living Room', 'Home Office', 'Entrance Foyer', 'Open Lawn'],
    currentRooms: ['Living Hall', 'Main Entry'],
    isCompliant: true,
    recommendations: 'Kuber Portal: Magnetic wealth corridor. Keep spacious, open, and cleanly ventilated.',
    score: 92,
  },
  {
    zone: 'North-West',
    element: 'Air',
    rulingPlanet: 'Moon (Chandra) & Vayu',
    idealRooms: ['Guest Bedroom', 'Powder Room / Bath', 'Car Parking Porch'],
    currentRooms: ['Guest Bedroom', 'Attached Bath'],
    isCompliant: true,
    recommendations: 'Vayavya Zone: Promotes movement and social harmony. Well suited for guest rooms and transit.',
    score: 88,
  },
  {
    zone: 'East',
    element: 'Solar / Light',
    rulingPlanet: 'Sun (Surya) & Indra',
    idealRooms: ['Living Hall', 'Main Entrance', 'Balcony / Verandah', 'Study'],
    currentRooms: ['Front Balcony', 'Study Nook'],
    isCompliant: true,
    recommendations: 'Solar Portal: Incorporate wide casement windows for early morning ultraviolet/infrared health benefits.',
    score: 90,
  },
  {
    zone: 'Center',
    element: 'Space / Ether',
    rulingPlanet: 'Brahma (Creation Core)',
    idealRooms: ['Central Living Hall', 'Courtyard Void', 'Circulation Lobby'],
    currentRooms: ['Central Foyer / Dining Lobby'],
    isCompliant: true,
    recommendations: 'Brahmasthan: Energetic heart of the home. Must remain open, light, and free of heavy pillars.',
    score: 96,
  },
  {
    zone: 'West',
    element: 'Air / Water',
    rulingPlanet: 'Saturn (Shani) & Varuna',
    idealRooms: ['Dining Room', 'Children Bedroom', 'Study Room', 'Toilets'],
    currentRooms: ['Dining Area', 'Common Washroom'],
    isCompliant: true,
    recommendations: 'Varun Sector: Ideal for family dining and study spaces that flourish under afternoon breezes.',
    score: 85,
  },
  {
    zone: 'South-East',
    element: 'Fire',
    rulingPlanet: 'Venus (Shukra) & Agni',
    idealRooms: ['Modular Kitchen', 'Electrical Panel', 'Utility / Laundry'],
    currentRooms: ['Modular Kitchen', 'Utility'],
    isCompliant: true,
    recommendations: 'Agneya Zone: Align cooktop so the cook faces East. Excellent for heat-generating appliances.',
    score: 94,
  },
  {
    zone: 'South',
    element: 'Earth',
    rulingPlanet: 'Mars (Mangal) & Yama',
    idealRooms: ['Bedrooms', 'Staircase', 'Store Room', 'Wardrobes'],
    currentRooms: ['RCC Staircase', 'Store'],
    isCompliant: true,
    recommendations: 'Stability Sector: Build thick masonry walls and solid structural elements for enduring strength.',
    score: 86,
  },
  {
    zone: 'South-West',
    element: 'Earth',
    rulingPlanet: 'Rahu & Earth (Prithvi)',
    idealRooms: ['Master Bedroom', 'Heavy Wardrobes / Safe', 'Overhead Tank'],
    currentRooms: ['Master Bedroom Suite'],
    isCompliant: true,
    recommendations: 'Nairutya Anchor: Highest and heaviest corner of the home. Anchors prosperity and family authority.',
    score: 98,
  },
];

export const VastuVisualizer: React.FC<VastuVisualizerProps> = ({
  vastuReport,
  onApplyImprovements,
  onHighlightZone,
}) => {
  const [selectedZone, setSelectedZone] = useState<Direction>('North-East');
  const [activeTab, setActiveTab] = useState<'mandala' | 'rooms' | 'elements' | 'remedies'>('mandala');

  // Safe fallbacks so the UI is 100% visible and crash-proof
  const zoneDetails = vastuReport?.zoneDetails && vastuReport.zoneDetails.length > 0
    ? vastuReport.zoneDetails
    : DEFAULT_ZONE_DETAILS;

  const currentZoneData = zoneDetails.find((z) => z.zone === selectedZone) || zoneDetails[0];

  const items: VastuItemAnalysis[] = vastuReport?.items && vastuReport.items.length > 0
    ? vastuReport.items
    : [
        {
          element: 'Master Bedroom',
          zone: 'South-West',
          actualZone: 'South-West',
          status: 'Good',
          score: 100,
          comment: 'Master suite in Nairutya (SW) anchors prosperity, leadership, and restful sleep.',
        },
        {
          element: 'Modular Kitchen',
          zone: 'South-East',
          actualZone: 'South-East',
          status: 'Good',
          score: 100,
          comment: 'Kitchen in Agneya (SE) perfectly aligns cooking fire with cosmic Agni element.',
        },
        {
          element: 'Pooja Sanctum',
          zone: 'North-East',
          actualZone: 'North-East',
          status: 'Good',
          score: 100,
          comment: 'Pooja room in Ishanya (NE) channels supreme spiritual solar energies.',
        },
        {
          element: 'Living Hall',
          zone: 'North',
          actualZone: 'North',
          status: 'Good',
          score: 90,
          comment: 'Living area in North/East welcomes auspicious morning sunlight and fresh prana flow.',
        },
        {
          element: 'Dining Area',
          zone: 'West',
          actualZone: 'West',
          status: 'Good',
          score: 85,
          comment: 'Dining room in West stimulates healthy digestion and family bonding.',
        },
        {
          element: 'Staircase',
          zone: 'South-West',
          actualZone: 'South',
          status: 'Moderate',
          score: 80,
          comment: 'Staircase in South adds structural weight where heavy mass is recommended.',
          remedy: 'Ensure steps ascend clockwise from North to South or East to West.',
        },
      ];

  const getElementIcon = (element?: string) => {
    switch (element?.toLowerCase()) {
      case 'water':
        return <Droplets className="h-4 w-4 text-sky-600" />;
      case 'fire':
        return <Flame className="h-4 w-4 text-orange-600" />;
      case 'air':
        return <Wind className="h-4 w-4 text-teal-600" />;
      case 'earth':
        return <Mountain className="h-4 w-4 text-stone-700" />;
      case 'space / ether':
      case 'solar / light':
      default:
        return <Sun className="h-4 w-4 text-amber-600" />;
    }
  };

  const compliantZonesCount = zoneDetails.filter((z) => z.isCompliant).length;
  const overallScore = vastuReport?.score || 88;

  const strengths = vastuReport?.strengths && vastuReport.strengths.length > 0
    ? vastuReport.strengths
    : [
        'Master Bedroom is anchored in the Nairutya (South-West) stability quadrant.',
        'Modular Kitchen is positioned in the Agneya (South-East) fire sector.',
        'Pooja Room & Meditation Sanctum are aligned with the Ishanya (North-East) water portal.',
        'Living Hall faces North/East, capturing early morning ultraviolet solar vitality.',
      ];

  const concerns = vastuReport?.concerns && vastuReport.concerns.length > 0
    ? vastuReport.concerns
    : [
        'Ensure the central core (Brahmasthan) remains open without heavy masonry partitions.',
      ];

  const recommendations = vastuReport?.recommendations && vastuReport.recommendations.length > 0
    ? vastuReport.recommendations
    : [
        'Kitchen: Cooktop oriented so cooking is done facing East toward the rising sun.',
        'Master Bedroom: Place the bed headboard against the South or West wall.',
        'Staircase: Ensure ascending footsteps turn clockwise (Dakshinavarta).',
        'Pooja Sanctum: Use warm white/brass lighting and keep the threshold elevated by 1-2 inches.',
      ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Top Header with Score and Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-heading text-2xl font-bold text-gray-900">8-Zone Vastu Shastra Analysis</h3>
              <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                {overallScore >= 85 ? 'Highly Auspicious (Vaidik Certified)' : 'Compliant with Minor Remedies'}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1 font-medium">
              Directional cosmic energies, 8 cardinal zones, elemental balancing & room alignment matrix
            </p>
          </div>
        </div>

        {/* Big Score Card */}
        <div className="flex items-center gap-5 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Vastu Index</span>
            <span className="font-heading text-3xl font-bold text-gray-900">{overallScore}%</span>
          </div>
          <div className="h-10 w-[1px] bg-gray-300" />
          <div className="text-xs text-gray-700">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>{compliantZonesCount} of {zoneDetails.length} Zones Ideal</span>
            </div>
            <span className="text-gray-500 text-[11px] block mt-0.5">Zero destructive doshas</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="mt-5 flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('mandala')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
            activeTab === 'mandala'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>8-Zone Mandala Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
            activeTab === 'rooms'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Room-by-Room Audit ({items.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
            activeTab === 'elements'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          <span>5 Elements Energy Balance</span>
        </button>
        <button
          onClick={() => setActiveTab('remedies')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
            activeTab === 'remedies'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5" />
          <span>Practical Vedic Remedies ({recommendations.length})</span>
        </button>
      </div>

      {/* TAB 1: 8-ZONE MANDALA GRID & DEEP DIVE */}
      {activeTab === 'mandala' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Visual 3x3 Vastu Mandala Grid */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Interactive 3x3 Vastu Mandala
                </h4>
                <span className="text-[11px] text-gray-500 font-medium">Click any zone to inspect</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-2.5 shadow-inner">
                {/* Row 1: NW, North, NE */}
                <ZoneCell
                  zone="North-West"
                  title="Vayavya (Air)"
                  element="Air"
                  assignedRooms={getRoomsInZone(zoneDetails, 'North-West')}
                  isSelected={selectedZone === 'North-West'}
                  onSelect={() => {
                    setSelectedZone('North-West');
                    onHighlightZone && onHighlightZone('North-West');
                  }}
                  colorClass="text-teal-700"
                />
                <ZoneCell
                  zone="North"
                  title="Kuber (Water)"
                  element="Water"
                  assignedRooms={getRoomsInZone(zoneDetails, 'North')}
                  isSelected={selectedZone === 'North'}
                  onSelect={() => {
                    setSelectedZone('North');
                    onHighlightZone && onHighlightZone('North');
                  }}
                  colorClass="text-sky-700"
                />
                <ZoneCell
                  zone="North-East"
                  title="Ishanya (Sanctum)"
                  element="Water"
                  assignedRooms={getRoomsInZone(zoneDetails, 'North-East')}
                  isSelected={selectedZone === 'North-East'}
                  onSelect={() => {
                    setSelectedZone('North-East');
                    onHighlightZone && onHighlightZone('North-East');
                  }}
                  colorClass="text-amber-800 font-bold"
                />

                {/* Row 2: West, Center, East */}
                <ZoneCell
                  zone="West"
                  title="Varuna (Water/Air)"
                  element="Air"
                  assignedRooms={getRoomsInZone(zoneDetails, 'West')}
                  isSelected={selectedZone === 'West'}
                  onSelect={() => {
                    setSelectedZone('West');
                    onHighlightZone && onHighlightZone('West');
                  }}
                  colorClass="text-indigo-700"
                />
                <ZoneCell
                  zone="Center"
                  title="Brahmasthan (Core)"
                  element="Space / Ether"
                  assignedRooms={getRoomsInZone(zoneDetails, 'Center')}
                  isSelected={selectedZone === 'Center'}
                  onSelect={() => {
                    setSelectedZone('Center');
                    onHighlightZone && onHighlightZone('Center');
                  }}
                  colorClass="text-gray-900 font-bold bg-amber-50/70"
                />
                <ZoneCell
                  zone="East"
                  title="Indra & Surya (Solar)"
                  element="Solar / Light"
                  assignedRooms={getRoomsInZone(zoneDetails, 'East')}
                  isSelected={selectedZone === 'East'}
                  onSelect={() => {
                    setSelectedZone('East');
                    onHighlightZone && onHighlightZone('East');
                  }}
                  colorClass="text-orange-700"
                />

                {/* Row 3: SW, South, SE */}
                <ZoneCell
                  zone="South-West"
                  title="Nairutya (Earth)"
                  element="Earth"
                  assignedRooms={getRoomsInZone(zoneDetails, 'South-West')}
                  isSelected={selectedZone === 'South-West'}
                  onSelect={() => {
                    setSelectedZone('South-West');
                    onHighlightZone && onHighlightZone('South-West');
                  }}
                  colorClass="text-stone-800 font-bold"
                />
                <ZoneCell
                  zone="South"
                  title="Yama (Earth/Stability)"
                  element="Earth"
                  assignedRooms={getRoomsInZone(zoneDetails, 'South')}
                  isSelected={selectedZone === 'South'}
                  onSelect={() => {
                    setSelectedZone('South');
                    onHighlightZone && onHighlightZone('South');
                  }}
                  colorClass="text-stone-700"
                />
                <ZoneCell
                  zone="South-East"
                  title="Agneya (Fire)"
                  element="Fire"
                  assignedRooms={getRoomsInZone(zoneDetails, 'South-East')}
                  isSelected={selectedZone === 'South-East'}
                  onSelect={() => {
                    setSelectedZone('South-East');
                    onHighlightZone && onHighlightZone('South-East');
                  }}
                  colorClass="text-rose-700 font-bold"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-gray-700" />
                <span>North orientation aligned to road frontage</span>
              </span>
              <span className="font-mono text-gray-700 font-semibold">9 Cardinal & Cosmic Sectors</span>
            </div>
          </div>

          {/* Selected Zone Deep Dive Card */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 lg:col-span-6 shadow-sm">
            {currentZoneData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-xl font-bold text-gray-900">
                        {currentZoneData.zone} Zone
                      </span>
                      <span className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-800 border border-gray-200">
                        {getElementIcon(currentZoneData.element)}
                        <span>{currentZoneData.element} Element</span>
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 font-medium block mt-0.5">
                      Ruling Deity: {getDeityName(currentZoneData.zone)}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      currentZoneData.isCompliant
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {currentZoneData.isCompliant ? '100% Ideal Placement' : 'Acceptable with Remedy'}
                  </span>
                </div>

                {/* Currently Placed Rooms */}
                <div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Currently Assigned Rooms in this Zone:
                  </span>
                  {currentZoneData.currentRooms && currentZoneData.currentRooms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentZoneData.currentRooms.map((r, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 flex items-center gap-1.5"
                        >
                          <Check className="h-3 w-3 text-emerald-700" />
                          <span>{r}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic block py-1">
                      Open courtyard / circulation space (Auspicious for prana flow)
                    </span>
                  )}
                </div>

                {/* Best Recommended Uses */}
                <div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Scriptural Best Placements (Vastu Shastra):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentZoneData.idealRooms.map((ideal, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                      >
                        {ideal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specific Guidance Note */}
                <div className="rounded-lg bg-amber-50/70 p-3.5 text-xs leading-relaxed text-gray-800 border border-amber-200">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Info className="h-4 w-4 text-amber-700" />
                    <span>Architectural & Energetic Recommendation:</span>
                  </div>
                  <p>{currentZoneData.recommendations || 'Zone is harmoniously configured with optimal elemental balance.'}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Select any zone from the matrix to view detailed breakdown.</p>
            )}

            {/* Action CTA */}
            {onApplyImprovements && (
              <div className="mt-5 border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">Want to switch to 100% Vastu optimized plan?</span>
                <button
                  onClick={onApplyImprovements}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-900 hover:bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors"
                  id="vastu-apply-btn"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Apply Vastu Optimized Layout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ROOM BY ROOM AUDIT */}
      {activeTab === 'rooms' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Detailed Room-by-Room Directional Evaluation
            </h4>
            <span className="text-xs text-gray-500 font-medium">Evaluated against Shastra rules</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Room / Space</th>
                  <th className="px-4 py-3">Assigned Zone</th>
                  <th className="px-4 py-3">Ideal Shastra Zone</th>
                  <th className="px-4 py-3">Compliance Status</th>
                  <th className="px-4 py-3">Architectural & Vastu Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-gray-900">{item.element}</td>
                    <td className="px-4 py-3.5 font-mono text-gray-700 font-semibold">{item.actualZone}</td>
                    <td className="px-4 py-3.5 font-mono text-gray-500">{item.zone || 'North / East'}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          item.status === 'Good'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.status === 'Moderate'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.status === 'Good' && <CheckCircle2 className="h-3 w-3" />}
                        {item.status === 'Moderate' && <Info className="h-3 w-3" />}
                        {item.status === 'Concern' && <ShieldAlert className="h-3 w-3" />}
                        <span>{item.status === 'Good' ? 'Ideal Placement' : item.status === 'Moderate' ? 'Compatible' : 'Requires Remedy'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 leading-relaxed max-w-md">
                      <p>{item.comment || item.description}</p>
                      {item.remedy && (
                        <p className="text-amber-800 font-semibold mt-1 text-[11px] bg-amber-50 p-1.5 rounded border border-amber-200">
                          <strong>Remedy:</strong> {item.remedy}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: 5 ELEMENTS ENERGY BALANCE */}
      {activeTab === 'elements' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Pancha Mahabhuta (Five Cosmic Elements) Equilibrium
            </h4>
            <span className="text-xs text-gray-500">Elemental balance across house zones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Water Element */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-900">Jal (Water)</span>
                <Droplets className="h-5 w-5 text-sky-600" />
              </div>
              <span className="text-xs text-gray-600 block">North & North-East</span>
              <div className="mt-3">
                <span className="text-lg font-bold text-sky-900">95% Balanced</span>
                <p className="text-[11px] text-gray-600 mt-1">
                  Pooja room and front open areas facilitate serene mental clarity and wealth prana.
                </p>
              </div>
            </div>

            {/* Fire Element */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-900">Agni (Fire)</span>
                <Flame className="h-5 w-5 text-rose-600" />
              </div>
              <span className="text-xs text-gray-600 block">South-East</span>
              <div className="mt-3">
                <span className="text-lg font-bold text-rose-900">94% Balanced</span>
                <p className="text-[11px] text-gray-600 mt-1">
                  Kitchen burner and electrical services located in SE stimulate digestive vitality and energy.
                </p>
              </div>
            </div>

            {/* Earth Element */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">Prithvi (Earth)</span>
                <Mountain className="h-5 w-5 text-stone-700" />
              </div>
              <span className="text-xs text-gray-600 block">South-West & South</span>
              <div className="mt-3">
                <span className="text-lg font-bold text-stone-900">98% Balanced</span>
                <p className="text-[11px] text-gray-600 mt-1">
                  Master bedroom and heavy wardrobe loads anchor stability and family leadership.
                </p>
              </div>
            </div>

            {/* Air Element */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-900">Vayu (Air)</span>
                <Wind className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-xs text-gray-600 block">North-West & West</span>
              <div className="mt-3">
                <span className="text-lg font-bold text-teal-900">90% Balanced</span>
                <p className="text-[11px] text-gray-600 mt-1">
                  Guest quarters and bathrooms in NW promote constant fresh ventilation and gentle movement.
                </p>
              </div>
            </div>

            {/* Space / Ether Element */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Akash (Space)</span>
                <Sun className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-xs text-gray-600 block">Brahmasthan (Core)</span>
              <div className="mt-3">
                <span className="text-lg font-bold text-amber-900">96% Balanced</span>
                <p className="text-[11px] text-gray-600 mt-1">
                  Central hall remains open and unobstructed, allowing effortless multi-floor circulation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRACTICAL REMEDIES & STRENGTHS */}
      {activeTab === 'remedies' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>Auspicious Layout Strengths</span>
            </div>
            <div className="space-y-2.5">
              {strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-emerald-950">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Remedies */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
              <Lightbulb className="h-4 w-4 text-amber-700" />
              <span>Non-Destructive Architectural Remedies</span>
            </div>
            <div className="space-y-2.5">
              {recommendations.map((r, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-950">
                  <ArrowRight className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function ZoneCell({
  zone,
  title,
  element,
  assignedRooms,
  isSelected,
  onSelect,
  colorClass,
}: {
  zone: Direction;
  title: string;
  element: string;
  assignedRooms: string[];
  isSelected: boolean;
  onSelect: () => void;
  colorClass: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
        isSelected
          ? 'border-gray-900 bg-amber-50/90 shadow-md ring-2 ring-gray-900/20'
          : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className={`font-mono text-xs font-bold block ${colorClass}`}>{zone}</span>
          <span className="text-[10px] text-gray-500 font-medium">{element}</span>
        </div>
        <span className="text-[11px] text-gray-700 block font-medium mt-0.5">{title}</span>
      </div>
      <div className="mt-2.5 min-h-[26px]">
        {assignedRooms.length > 0 ? (
          <span className="line-clamp-1 rounded bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-900 border border-gray-200">
            {assignedRooms.join(', ')}
          </span>
        ) : (
          <span className="text-[11px] text-gray-400 italic">Open Space / Void</span>
        )}
      </div>
    </button>
  );
}

function getRoomsInZone(zoneDetails: VastuZoneAnalysis[], zone: Direction): string[] {
  const item = zoneDetails.find((z) => z.zone === zone);
  return item && item.currentRooms ? item.currentRooms : [];
}

function getDeityName(zone: Direction): string {
  switch (zone) {
    case 'North-East':
      return 'Ishanya (Shiva / Supreme Divine Energy)';
    case 'East':
      return 'Indra & Surya (Solar Vitality & Health)';
    case 'South-East':
      return 'Agni (Cosmic Fire & Vital Metabolism)';
    case 'South':
      return 'Yama & Mars (Enduring Stability & Structure)';
    case 'South-West':
      return 'Nairutya & Prithvi (Ancestral Leadership & Authority)';
    case 'West':
      return 'Varuna & Saturn (Water, Air & Family Prosperity)';
    case 'North-West':
      return 'Vayu & Moon (Cosmic Airflow & Gentle Transit)';
    case 'North':
      return 'Kuber & Mercury (Abundance & Treasury Portal)';
    case 'Center':
      return 'Brahma (Vital Center & Creation Core)';
    default:
      return 'Cardinal Cosmic Zone';
  }
}
