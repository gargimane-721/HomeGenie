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
} from 'lucide-react';
import { Direction, VastuReport } from '../types';

interface VastuVisualizerProps {
  vastuReport: VastuReport;
  onApplyImprovements?: () => void;
  onHighlightZone?: (zone: Direction) => void;
}

export const VastuVisualizer: React.FC<VastuVisualizerProps> = ({
  vastuReport,
  onApplyImprovements,
  onHighlightZone,
}) => {
  const [selectedZone, setSelectedZone] = useState<Direction>('North-East');

  const getElementIcon = (element?: string) => {
    switch (element?.toLowerCase()) {
      case 'water':
        return <Droplets className="h-3.5 w-3.5 text-sky-600" />;
      case 'fire':
        return <Flame className="h-3.5 w-3.5 text-orange-600" />;
      case 'air':
        return <Wind className="h-3.5 w-3.5 text-teal-600" />;
      case 'earth':
        return <Mountain className="h-3.5 w-3.5 text-[#5A5A40]" />;
      case 'space / ether':
      default:
        return <Sun className="h-3.5 w-3.5 text-amber-600" />;
    }
  };

  const currentZoneData = vastuReport.zoneDetails.find((z) => z.zone === selectedZone) || vastuReport.zoneDetails[0];

  return (
    <div className="rounded-xl border border-black/10 bg-white/90 p-6 shadow-sm backdrop-blur-md">
      {/* Header with Score */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5A5A40]/10 border border-[#5A5A40]/20 text-[#5A5A40]">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-2xl font-bold text-gray-900">8-Zone Vastu Shastra Analysis</h3>
              <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-bold text-gray-900 border border-gray-300">
                {vastuReport.score >= 85 ? 'Highly Auspicious' : 'Moderately Compliant'}
              </span>
            </div>
            <p className="text-xs text-gray-900 mt-0.5 font-medium">
              Directional cosmic energies, elemental balancing & room alignment matrix
            </p>
          </div>
        </div>

        {/* Big Score Card */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 shadow-sm">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-900 block">Vastu Index</span>
            <span className="font-heading text-2xl font-bold text-gray-900">{vastuReport.score}%</span>
          </div>
          <div className="h-10 w-[1px] bg-black/10" />
          <div className="text-xs text-[#1A1A1A]">
            <div className="flex items-center gap-1 text-[#5A5A40] font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{vastuReport.zoneDetails.filter((z) => z.isCompliant).length} Zones Ideal</span>
            </div>
            <span className="text-[#1A1A1A]/50 text-[10px]">Zero structural doshas</span>
          </div>
        </div>
      </div>

      {/* 8-Zone Grid Matrix */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Visual 3x3 Vastu Mandala Grid */}
        <div className="lg:col-span-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] mb-3">
            Click Any Zone to Inspect Details
          </h4>
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-black/10 bg-[#F5F2ED] p-2 text-center shadow-inner">
            {/* Row 1: NW, North, NE */}
            <ZoneCell
              zone="North-West"
              title="Vayavya (Air)"
              assignedRooms={getRoomsInZone(vastuReport, 'North-West')}
              isSelected={selectedZone === 'North-West'}
              onSelect={() => {
                setSelectedZone('North-West');
                onHighlightZone && onHighlightZone('North-West');
              }}
              colorClass="text-[#5A5A40]"
            />
            <ZoneCell
              zone="North"
              title="Kuber (Water)"
              assignedRooms={getRoomsInZone(vastuReport, 'North')}
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
              assignedRooms={getRoomsInZone(vastuReport, 'North-East')}
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
              title="Varun (Air)"
              assignedRooms={getRoomsInZone(vastuReport, 'West')}
              isSelected={selectedZone === 'West'}
              onSelect={() => {
                setSelectedZone('West');
                onHighlightZone && onHighlightZone('West');
              }}
              colorClass="text-[#5A5A40]"
            />
            <ZoneCell
              zone="Center"
              title="Brahmasthan"
              assignedRooms={getRoomsInZone(vastuReport, 'Center')}
              isSelected={selectedZone === 'Center'}
              onSelect={() => {
                setSelectedZone('Center');
                onHighlightZone && onHighlightZone('Center');
              }}
              colorClass="text-[#1A1A1A] font-bold"
            />
            <ZoneCell
              zone="East"
              title="Indra (Solar)"
              assignedRooms={getRoomsInZone(vastuReport, 'East')}
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
              assignedRooms={getRoomsInZone(vastuReport, 'South-West')}
              isSelected={selectedZone === 'South-West'}
              onSelect={() => {
                setSelectedZone('South-West');
                onHighlightZone && onHighlightZone('South-West');
              }}
              colorClass="text-[#5A5A40] font-bold"
            />
            <ZoneCell
              zone="South"
              title="Yama (Earth)"
              assignedRooms={getRoomsInZone(vastuReport, 'South')}
              isSelected={selectedZone === 'South'}
              onSelect={() => {
                setSelectedZone('South');
                onHighlightZone && onHighlightZone('South');
              }}
              colorClass="text-[#5A5A40]"
            />
            <ZoneCell
              zone="South-East"
              title="Agneya (Fire)"
              assignedRooms={getRoomsInZone(vastuReport, 'South-East')}
              isSelected={selectedZone === 'South-East'}
              onSelect={() => {
                setSelectedZone('South-East');
                onHighlightZone && onHighlightZone('South-East');
              }}
              colorClass="text-rose-700 font-bold"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#1A1A1A]/60">
            <span>North direction aligned to road front</span>
            <span className="font-mono text-[#5A5A40] font-semibold">Click any card to inspect</span>
          </div>
        </div>

        {/* Selected Zone Deep Dive Card */}
        <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-5 lg:col-span-6 shadow-sm">
          {currentZoneData ? (
            <div>
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-lg font-bold text-gray-900">
                      {currentZoneData.zone} Zone
                    </span>
                    <span className="flex items-center gap-1 rounded bg-[#EFECE7] px-2 py-0.5 text-[11px] font-semibold text-[#1A1A1A] border border-black/5">
                      {getElementIcon(currentZoneData.element)}
                      <span>{currentZoneData.element} Element</span>
                    </span>
                  </div>
                  <span className="text-xs text-[#5A5A40] font-semibold">
                    Governing Deity: {getDeityName(currentZoneData.zone)}
                  </span>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    currentZoneData.isCompliant
                      ? 'bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/20'
                      : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                  }`}
                >
                  {currentZoneData.isCompliant ? '100% Ideal' : 'Acceptable'}
                </span>
              </div>

              {/* Current Placed Rooms */}
              <div className="mt-4">
                <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1.5">Currently Placed Rooms:</span>
                {currentZoneData.currentRooms.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {currentZoneData.currentRooms.map((r, i) => (
                      <span key={i} className="rounded-md border border-black/10 bg-[#F5F2ED] px-2.5 py-1 text-xs font-bold text-[#1A1A1A]">
                        ✓ {r}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-[#1A1A1A]/40 italic">Open space / circulation passage</span>
                )}
              </div>

              {/* Best Recommended Uses */}
              <div className="mt-4">
                <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block mb-1.5">Scriptural Best Placements:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentZoneData.idealRooms.map((ideal, i) => (
                    <span key={i} className="rounded-md bg-[#EFECE7] px-2 py-0.5 text-[11px] font-medium text-[#1A1A1A]/80 border border-black/5">
                      {ideal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specific Guidance Note */}
              <div className="mt-4 rounded-lg bg-[#F5F2ED] p-3 text-xs leading-relaxed text-[#1A1A1A] border border-black/5">
                <strong className="text-[#5A5A40]">Architectural Recommendation: </strong>
                {currentZoneData.recommendations || 'Zone is harmoniously configured with elemental balance.'}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#1A1A1A]/60">Select a zone from the matrix.</p>
          )}

          {/* Action CTA */}
          {onApplyImprovements && (
            <div className="mt-5 border-t border-black/10 pt-4 flex items-center justify-between">
              <span className="text-xs text-[#1A1A1A]/60 font-medium">Want to optimize room shifts automatically?</span>
              <button
                onClick={onApplyImprovements}
                className="flex items-center gap-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#2c2c2c] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors"
                id="vastu-apply-btn"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#E4E0D8]" />
                <span>Apply Vastu Optimizations</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ZoneCell({
  zone,
  title,
  assignedRooms,
  isSelected,
  onSelect,
  colorClass,
}: {
  zone: Direction;
  title: string;
  assignedRooms: string[];
  isSelected: boolean;
  onSelect: () => void;
  colorClass: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col justify-between rounded-lg border p-3 text-left transition-all ${
        isSelected
          ? 'border-[#5A5A40] bg-[#5A5A40]/15 shadow-sm'
          : 'border-black/10 bg-white hover:border-[#5A5A40]/40 hover:bg-white'
      }`}
    >
      <div>
        <span className={`font-mono text-xs font-bold block ${colorClass}`}>{zone}</span>
        <span className="text-[10px] text-[#1A1A1A]/60 block">{title}</span>
      </div>
      <div className="mt-2 min-h-[24px]">
        {assignedRooms.length > 0 ? (
          <span className="line-clamp-1 rounded bg-[#EFECE7] px-1.5 py-0.5 text-[10px] font-bold text-[#1A1A1A]">
            {assignedRooms.join(', ')}
          </span>
        ) : (
          <span className="text-[10px] text-[#1A1A1A]/40 italic">Open Core</span>
        )}
      </div>
    </button>
  );
}

function getRoomsInZone(report: VastuReport, zone: Direction): string[] {
  const item = report.zoneDetails.find((z) => z.zone === zone);
  return item ? item.currentRooms : [];
}

function getDeityName(zone: Direction): string {
  switch (zone) {
    case 'North-East':
      return 'Ishanya (Shiva / Divine Energy)';
    case 'East':
      return 'Indra & Surya (Solar Vitality)';
    case 'South-East':
      return 'Agni (Fire & Digestion Energy)';
    case 'South':
      return 'Yama (Stability)';
    case 'South-West':
      return 'Nairutya (Ancestral & Leadership Power)';
    case 'West':
      return 'Varuna (Water & Prosperity)';
    case 'North-West':
      return 'Vayu (Wind & Movement)';
    case 'North':
      return 'Kuber (Treasury & Wealth)';
    case 'Center':
      return 'Brahma (Creation & Vital Core)';
    default:
      return 'Cardinal Zone';
  }
}
