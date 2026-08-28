import React, { useState, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Download,
  FileCode,
  Move,
  Grid,
  Layers,
  Sparkles,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Bed,
  Sofa,
  UtensilsCrossed,
  Bath,
  Home,
  Info,
  Car,
  Trees,
  DoorOpen,
  Ruler,
  ChevronRight,
  ListFilter,
} from 'lucide-react';
import { CadRoom, FloorLayout, PlotDetails, CadFurniture } from '../types';

interface CadFloorPlanViewerProps {
  floors: FloorLayout[];
  plot: PlotDetails;
  selectedFloorIndex: number;
  onSelectFloor: (index: number) => void;
  onRoomSelect?: (room: CadRoom) => void;
  selectedRoomId?: string;
  showVastuOverlay?: boolean;
}

// Room category color palette & icons for clean presentation
const ROOM_THEMES: Record<string, { bg: string; fill: string; border: string; text: string; badge: string; icon: any }> = {
  master_bedroom: {
    bg: '#EEF2FF',
    fill: '#F5F7FF',
    border: '#6366F1',
    text: '#312E81',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Bed,
  },
  bedroom: {
    bg: '#F0F9FF',
    fill: '#F8FCFF',
    border: '#0EA5E9',
    text: '#0C4A6E',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Bed,
  },
  living: {
    bg: '#F8FAFC',
    fill: '#FFFFFF',
    border: '#475569',
    text: '#0F172A',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    icon: Sofa,
  },
  dining: {
    bg: '#FFFBEB',
    fill: '#FEFDF5',
    border: '#F59E0B',
    text: '#78350F',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: UtensilsCrossed,
  },
  kitchen: {
    bg: '#FFF7ED',
    fill: '#FFFAF5',
    border: '#F97316',
    text: '#7C2D12',
    badge: 'bg-orange-50 text-orange-800 border-orange-200',
    icon: UtensilsCrossed,
  },
  bathroom: {
    bg: '#F0FDFA',
    fill: '#F7FEFD',
    border: '#14B8A6',
    text: '#134E4A',
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    icon: Bath,
  },
  pooja: {
    bg: '#FEFCE8',
    fill: '#FFFDF0',
    border: '#EAB308',
    text: '#713F12',
    badge: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    icon: Sparkles,
  },
  study: {
    bg: '#ECFDF5',
    fill: '#F6FEF9',
    border: '#10B981',
    text: '#064E3B',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: Home,
  },
  balcony: {
    bg: '#F0FDF4',
    fill: '#F7FEFA',
    border: '#22C55E',
    text: '#14532D',
    badge: 'bg-green-50 text-green-800 border-green-200',
    icon: Trees,
  },
  terrace: {
    bg: '#F0FDF4',
    fill: '#F7FEFA',
    border: '#22C55E',
    text: '#14532D',
    badge: 'bg-green-50 text-green-800 border-green-200',
    icon: Trees,
  },
  parking: {
    bg: '#F1F5F9',
    fill: '#F8FAFC',
    border: '#64748B',
    text: '#1E293B',
    badge: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: Car,
  },
  corridor: {
    bg: '#F8FAFC',
    fill: '#FAFAFA',
    border: '#94A3B8',
    text: '#334155',
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: DoorOpen,
  },
  staircase: {
    bg: '#F8FAFC',
    fill: '#FAFAFA',
    border: '#94A3B8',
    text: '#334155',
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: Layers,
  },
};

export const CadFloorPlanViewer: React.FC<CadFloorPlanViewerProps> = ({
  floors,
  plot,
  selectedFloorIndex,
  onSelectFloor,
  onRoomSelect,
  selectedRoomId,
  showVastuOverlay: initialVastuOverlay = false,
}) => {
  const currentFloor = floors[selectedFloorIndex] || floors[0];

  // Visual Mode: 'presentation' (clean, intuitive) vs 'architectural' (detailed CAD drafting)
  const [viewStyle, setViewStyle] = useState<'presentation' | 'architectural'>('presentation');

  // Canvas Viewport State (Zoom & Pan)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer Visibility Toggles
  const [showColorZones, setShowColorZones] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showFurniture, setShowFurniture] = useState<boolean>(true);
  const [showDoorsWindows, setShowDoorsWindows] = useState<boolean>(true);
  const [showVastuZones, setShowVastuZones] = useState<boolean>(initialVastuOverlay);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showSetbacks, setShowSetbacks] = useState<boolean>(true);

  // Side Room Directory Drawer Toggle
  const [showRoomDirectory, setShowRoomDirectory] = useState<boolean>(true);

  // Selected room for popup details & highlighting
  const [activeRoom, setActiveRoom] = useState<CadRoom | null>(null);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  // Sync initial Vastu overlay
  useEffect(() => {
    setShowVastuZones(initialVastuOverlay);
  }, [initialVastuOverlay]);

  // Sync selectedRoomId if prop changes
  useEffect(() => {
    if (selectedRoomId) {
      const room = currentFloor?.rooms.find((r) => r.id === selectedRoomId);
      if (room) setActiveRoom(room);
    }
  }, [selectedRoomId, currentFloor]);

  // Handle Zoom In/Out
  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(2.5, Math.max(0.6, Number((prev + delta).toFixed(2)))));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Export functions
  const handleExportSvg = () => {
    const svgElement = document.getElementById('cad-svg-main');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HousePlan_${currentFloor.name.replace(/\s+/g, '_')}_CAD.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportDxf = () => {
    let dxf = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;
    
    currentFloor.walls.forEach((wall) => {
      dxf += `0\nLINE\n8\nWALLS\n10\n${wall.x1}\n20\n${wall.y1}\n30\n0.0\n11\n${wall.x2}\n21\n${wall.y2}\n31\n0.0\n`;
    });

    currentFloor.rooms.forEach((room) => {
      dxf += `0\nTEXT\n8\nROOM_LABELS\n10\n${room.x + room.width / 2}\n20\n${room.y + room.height / 2}\n30\n0.0\n40\n1.2\n1\n${room.name} (${room.area} sqft)\n`;
    });

    dxf += `0\nENDSEC\n0\nEOF\n`;

    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HousePlan_${currentFloor.name.replace(/\s+/g, '_')}.dxf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Scale: 1 ft = 14 SVG units for crisp rendering
  const scale = 14;
  const svgWidth = (plot.width + 16) * scale;
  const svgHeight = (plot.length + 16) * scale;

  const offsetX = 8 * scale;
  const offsetY = 8 * scale;

  const handleRoomClick = (room: CadRoom) => {
    setActiveRoom(room);
    if (onRoomSelect) onRoomSelect(room);
  };

  // Floor stats calculations
  const totalFloorArea = useMemo(() => {
    return currentFloor.rooms.reduce((acc, r) => acc + r.area, 0);
  }, [currentFloor]);

  return (
    <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden text-gray-900">
      {/* 1. TOP SPATIAL TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50/80 px-4 py-3 sm:px-6">
        {/* Left: Floor Selector Pills with clear Square Footage */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 hidden sm:inline">
            Floor:
          </span>
          <div className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white p-1 shadow-sm">
            {floors.map((floor, idx) => (
              <button
                key={floor.floorNumber}
                onClick={() => {
                  onSelectFloor(idx);
                  setActiveRoom(null);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedFloorIndex === idx
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
                id={`cad-floor-tab-${idx}`}
              >
                <span>{floor.name}</span>
                <span className={`font-mono text-[11px] ${selectedFloorIndex === idx ? 'text-gray-300' : 'text-gray-500'}`}>
                  ({floor.builtUpArea} sq.ft)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Presentation Mode vs Architectural CAD Mode Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white p-1 shadow-sm">
          <button
            onClick={() => {
              setViewStyle('presentation');
              setShowColorZones(true);
              setShowDimensions(true);
              setShowFurniture(true);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewStyle === 'presentation'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
            title="Clean, easy-to-understand presentation floor plan"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Clean View</span>
          </button>

          <button
            onClick={() => {
              setViewStyle('architectural');
              setShowColorZones(false);
              setShowDimensions(true);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewStyle === 'architectural'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
            title="Detailed Architectural drafting with CAD lines and offsets"
          >
            <Ruler className="h-3.5 w-3.5" />
            <span>CAD Drafting</span>
          </button>
        </div>

        {/* Right: Layer Toggles & Export Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer toggles pill */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white p-1 shadow-sm">
            <button
              onClick={() => setShowFurniture(!showFurniture)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                showFurniture
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title="Toggle Furniture"
            >
              <Sofa className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Furniture</span>
            </button>

            <button
              onClick={() => setShowVastuZones(!showVastuZones)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                showVastuZones
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title="Toggle 8-Zone Vastu Overlay"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Vastu</span>
            </button>

            <button
              onClick={() => setShowColorZones(!showColorZones)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                showColorZones
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title="Toggle Zone Color Codes"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Colors</span>
            </button>

            <button
              onClick={() => setShowRoomDirectory(!showRoomDirectory)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                showRoomDirectory
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title="Toggle Room List Drawer"
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Rooms List</span>
            </button>
          </div>

          {/* Quick Export Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleExportSvg}
              className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-black transition-all shadow-sm"
              title="Export High-Res SVG"
            >
              <Download className="h-3.5 w-3.5 text-gray-700" />
              <span className="hidden lg:inline">SVG</span>
            </button>
            <button
              onClick={handleExportDxf}
              className="flex items-center gap-1 rounded-xl bg-gray-900 hover:bg-black px-3 py-1.5 text-xs font-bold text-white transition-all shadow-sm"
              title="Export AutoCAD DXF"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>DXF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN CAD WORKSPACE WITH INTEGRATED ROOM DIRECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative min-h-[520px]">
        {/* Interactive Floor Plan Stage */}
        <div
          className={`relative ${showRoomDirectory ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} cursor-grab active:cursor-grabbing overflow-hidden bg-slate-50/60 select-none min-h-[480px] lg:min-h-[560px] flex flex-col justify-between`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle millimeter drafting grid */}
          <div className="absolute inset-0 cad-canvas-grid opacity-40 pointer-events-none" />

          {/* Top Left Plot Overview Ribbon */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="rounded-xl border border-gray-300 bg-white/95 px-3 py-1.5 font-mono text-xs font-bold text-gray-900 shadow-sm backdrop-blur-md">
              Plot: {plot.width}' × {plot.length}' ({plot.totalArea} sq.ft)
            </span>
            <span className="rounded-xl border border-gray-300 bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-sm backdrop-blur-md">
              Facing: <strong className="text-gray-900 font-bold">{plot.roadDirection}</strong>
            </span>
            <span className="rounded-xl border border-emerald-300 bg-emerald-50/95 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-sm backdrop-blur-md">
              Carpet: {totalFloorArea} sq.ft ({currentFloor.rooms.length} Rooms)
            </span>
          </div>

          {/* Scaled & Panned SVG Drawing Engine */}
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-75 py-10"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <svg
              id="cad-svg-main"
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="drop-shadow-sm overflow-visible"
            >
              <defs>
                <pattern id="vastu-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(202, 138, 4, 0.2)" strokeWidth="1.5" />
                </pattern>
                <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
                </filter>
              </defs>

              {/* ROADWAY AT NORTH */}
              <g>
                <rect
                  x={offsetX - 2 * scale}
                  y={offsetY - 5.5 * scale}
                  width={plot.width * scale + 4 * scale}
                  height={4 * scale}
                  fill="#F1F5F9"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  rx="6"
                />
                <text
                  x={offsetX + (plot.width * scale) / 2}
                  y={offsetY - 3.2 * scale}
                  textAnchor="middle"
                  fill="#334155"
                  fontSize="12"
                  fontFamily="Helvetica Neue, Arial, sans-serif"
                  fontWeight="bold"
                >
                  ROADWAY ({plot.roadDirection.toUpperCase()} FACING) • MAIN ACCESS
                </text>
              </g>

              {/* PLOT BOUNDARY LINE */}
              <rect
                x={offsetX}
                y={offsetY}
                width={plot.width * scale}
                height={plot.length * scale}
                fill="#FFFFFF"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeDasharray={viewStyle === 'architectural' ? '8 4' : 'none'}
                rx="4"
              />

              {/* SETBACK ENVELOPE (Building Line) */}
              {showSetbacks && plot.setbacks && (
                <rect
                  x={offsetX + plot.setbacks.left * scale}
                  y={offsetY + plot.setbacks.front * scale}
                  width={(plot.width - plot.setbacks.left - plot.setbacks.right) * scale}
                  height={(plot.length - plot.setbacks.front - plot.setbacks.rear) * scale}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}

              {/* VASTU 8-ZONE COMPASS OVERLAY */}
              {showVastuZones && (
                <g opacity="0.95">
                  {[1, 2].map((i) => (
                    <React.Fragment key={i}>
                      <line
                        x1={offsetX + (plot.width * scale * i) / 3}
                        y1={offsetY}
                        x2={offsetX + (plot.width * scale * i) / 3}
                        y2={offsetY + plot.length * scale}
                        stroke="#D97706"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />
                      <line
                        x1={offsetX}
                        y1={offsetY + (plot.length * scale * i) / 3}
                        x2={offsetX + plot.width * scale}
                        y2={offsetY + (plot.length * scale * i) / 3}
                        stroke="#D97706"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />
                    </React.Fragment>
                  ))}

                  <text x={offsetX + (plot.width * scale * 5) / 6} y={offsetY + (plot.length * scale) / 6} textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="bold" fontFamily="Helvetica Neue, Arial, sans-serif">
                    NE • Ishanya (Water/Pooja)
                  </text>
                  <text x={offsetX + (plot.width * scale * 5) / 6} y={offsetY + (plot.length * scale * 5) / 6} textAnchor="middle" fill="#C2410C" fontSize="10" fontWeight="bold" fontFamily="Helvetica Neue, Arial, sans-serif">
                    SE • Agneya (Fire/Kitchen)
                  </text>
                  <text x={offsetX + (plot.width * scale) / 6} y={offsetY + (plot.length * scale * 5) / 6} textAnchor="middle" fill="#9A3412" fontSize="10" fontWeight="bold" fontFamily="Helvetica Neue, Arial, sans-serif">
                    SW • Nairutya (Master Suite)
                  </text>
                  <text x={offsetX + (plot.width * scale) / 6} y={offsetY + (plot.length * scale) / 6} textAnchor="middle" fill="#4B5563" fontSize="10" fontWeight="bold" fontFamily="Helvetica Neue, Arial, sans-serif">
                    NW • Vayavya (Air/Living)
                  </text>
                  <text x={offsetX + (plot.width * scale) / 2} y={offsetY + (plot.length * scale) / 2} textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="Helvetica Neue, Arial, sans-serif">
                    Brahmasthan (Courtyard)
                  </text>
                </g>
              )}

              {/* ROOMS GEOMETRY & INTERIORS */}
              {currentFloor.rooms.map((room) => {
                const rx = offsetX + room.x * scale;
                const ry = offsetY + room.y * scale;
                const rw = room.width * scale;
                const rh = room.height * scale;
                const isSelected = selectedRoomId === room.id || activeRoom?.id === room.id;
                const isHovered = hoveredRoomId === room.id;
                const theme = ROOM_THEMES[room.type] || ROOM_THEMES.living;

                return (
                  <g
                    key={room.id}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredRoomId(room.id)}
                    onMouseLeave={() => setHoveredRoomId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomClick(room);
                    }}
                  >
                    {/* Room Area Fill */}
                    <rect
                      x={rx}
                      y={ry}
                      width={rw}
                      height={rh}
                      fill={showColorZones ? (isSelected ? '#E0E7FF' : isHovered ? '#F1F5F9' : theme.fill) : (isSelected ? '#F1F5F9' : '#FFFFFF')}
                      stroke={isSelected ? '#4F46E5' : isHovered ? '#0F172A' : (viewStyle === 'architectural' ? '#1E293B' : theme.border)}
                      strokeWidth={isSelected ? 3 : isHovered ? 2 : (viewStyle === 'architectural' ? 1.5 : 1.2)}
                      rx="4"
                    />

                    {/* Room Label Badge */}
                    <g transform={`translate(${rx + rw / 2}, ${ry + rh / 2})`}>
                      {/* Clean background badge */}
                      <rect
                        x={-rw * 0.44}
                        y={-18}
                        width={rw * 0.88}
                        height={36}
                        rx="6"
                        fill="#FFFFFF"
                        fillOpacity="0.95"
                        stroke={isSelected ? '#4F46E5' : '#E2E8F0'}
                        strokeWidth="1"
                        filter="url(#card-shadow)"
                      />

                      {/* Room Title */}
                      <text
                        x="0"
                        y="-2"
                        textAnchor="middle"
                        fill="#0F172A"
                        fontSize={Math.min(13, Math.max(10, rw / 16))}
                        fontWeight="bold"
                        fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
                      >
                        {room.name}
                      </text>

                      {/* Dimensions & Area */}
                      <text
                        x="0"
                        y="12"
                        textAnchor="middle"
                        fill="#475569"
                        fontSize={Math.min(10, Math.max(8.5, rw / 20))}
                        fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
                        fontWeight="600"
                      >
                        {room.width}'0" × {room.height}'0" ({room.area} sqft)
                      </text>
                    </g>

                    {/* Furniture silhouettes inside Room */}
                    {showFurniture &&
                      room.furniture?.map((furn) => {
                        const fx = offsetX + furn.x * scale;
                        const fy = offsetY + furn.y * scale;
                        const fw = furn.width * scale;
                        const fh = furn.height * scale;

                        return (
                          <g key={furn.id} transform={`rotate(${furn.rotation || 0}, ${fx + fw / 2}, ${fy + fh / 2})`}>
                            <rect
                              x={fx}
                              y={fy}
                              width={fw}
                              height={fh}
                              fill="#E2E8F0"
                              fillOpacity="0.85"
                              stroke="#64748B"
                              strokeWidth="0.8"
                              rx="3"
                            />
                            <text
                              x={fx + fw / 2}
                              y={fy + fh / 2 + 3}
                              textAnchor="middle"
                              fill="#334155"
                              fontSize="8"
                              fontWeight="bold"
                              fontFamily="Helvetica Neue, Arial, sans-serif"
                              opacity="0.85"
                            >
                              {furn.name.split(' ')[0]}
                            </text>
                          </g>
                        );
                      })}

                    {/* Doors with Swing Arcs */}
                    {showDoorsWindows &&
                      room.doors?.map((door) => {
                        const dx = offsetX + door.x * scale;
                        const dy = offsetY + door.y * scale;
                        const dw = door.width * scale;

                        return (
                          <g key={door.id}>
                            <rect x={dx - dw / 2} y={dy - 2} width={dw} height={4} fill="#334155" rx="1" />
                            <path
                              d={`M ${dx - dw / 2},${dy} A ${dw},${dw} 0 0,1 ${dx + dw / 2},${dy + dw}`}
                              fill="none"
                              stroke="#64748B"
                              strokeWidth="1.2"
                              strokeDasharray="3 2"
                            />
                            <line x1={dx - dw / 2} y1={dy} x2={dx + dw / 2} y2={dy + dw} stroke="#334155" strokeWidth="1.5" />
                          </g>
                        );
                      })}

                    {/* Windows with Glazing Lines */}
                    {showDoorsWindows &&
                      room.windows?.map((win) => {
                        const wx = offsetX + win.x * scale;
                        const wy = offsetY + win.y * scale;
                        const ww = win.width * scale;

                        return (
                          <g key={win.id}>
                            <rect x={wx} y={wy - 3} width={ww} height={6} fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" rx="1" />
                            <line x1={wx + 2} y1={wy} x2={wx + ww - 2} y2={wy} stroke="#0284C7" strokeWidth="1" />
                          </g>
                        );
                      })}
                  </g>
                );
              })}

              {/* WALLS (Architectural Outlines) */}
              {currentFloor.walls.map((wall) => {
                const x1 = offsetX + wall.x1 * scale;
                const y1 = offsetY + wall.y1 * scale;
                const x2 = offsetX + wall.x2 * scale;
                const y2 = offsetY + wall.y2 * scale;
                const strokeW = wall.isExternal ? 3.5 : 2;

                return (
                  <line
                    key={wall.id}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#0F172A"
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* OUTER CAD DIMENSIONS */}
              {showDimensions && (
                <g>
                  {/* Top Width Dimension */}
                  <line x1={offsetX} y1={offsetY - 14} x2={offsetX + plot.width * scale} y2={offsetY - 14} stroke="#475569" strokeWidth="1.2" />
                  <line x1={offsetX} y1={offsetY - 20} x2={offsetX} y2={offsetY - 8} stroke="#475569" strokeWidth="1.2" />
                  <line x1={offsetX + plot.width * scale} y1={offsetY - 20} x2={offsetX + plot.width * scale} y2={offsetY - 8} stroke="#475569" strokeWidth="1.2" />
                  <rect x={offsetX + (plot.width * scale) / 2 - 32} y={offsetY - 25} width="64" height="22" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                  <text x={offsetX + (plot.width * scale) / 2} y={offsetY - 10} textAnchor="middle" fill="#0F172A" fontSize="11" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="bold">
                    {plot.width}'-0" Width
                  </text>

                  {/* Left Length Dimension */}
                  <line x1={offsetX - 14} y1={offsetY} x2={offsetX - 14} y2={offsetY + plot.length * scale} stroke="#475569" strokeWidth="1.2" />
                  <line x1={offsetX - 20} y1={offsetY} x2={offsetX - 8} y2={offsetY} stroke="#475569" strokeWidth="1.2" />
                  <line x1={offsetX - 20} y1={offsetY + plot.length * scale} x2={offsetX - 8} y2={offsetY + plot.length * scale} stroke="#475569" strokeWidth="1.2" />
                  <rect x={offsetX - 48} y={offsetY + (plot.length * scale) / 2 - 11} width="60" height="22" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                  <text x={offsetX - 18} y={offsetY + (plot.length * scale) / 2 + 4} textAnchor="middle" fill="#0F172A" fontSize="11" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="bold">
                    {plot.length}'-0" Depth
                  </text>
                </g>
              )}

              {/* NORTH DIRECTION COMPASS */}
              <g transform={`translate(${offsetX + plot.width * scale + 45}, ${offsetY + 45})`}>
                <circle r="22" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                <path d="M 0,-18 L 6,0 L 0,4 L -6,0 Z" fill="#DC2626" />
                <path d="M 0,18 L 5,0 L 0,-3 L -5,0 Z" fill="#475569" />
                <text x="0" y="-20" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold" fontFamily="Helvetica Neue, Arial, sans-serif">
                  N
                </text>
                <text x="0" y="28" textAnchor="middle" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="Helvetica Neue, Arial, sans-serif">
                  NORTH
                </text>
              </g>
            </svg>
          </div>

          {/* Floating Bottom Control Dock */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            {/* Left: Zoom Controls */}
            <div className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white/95 p-1 shadow-md backdrop-blur-md pointer-events-auto">
              <button
                onClick={() => handleZoom(0.15)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-all"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <span className="font-mono text-xs font-bold text-gray-900 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom(-0.15)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetView}
                className="flex h-8 items-center gap-1 px-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-black transition-all"
                title="Reset View"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fit</span>
              </button>
            </div>

            {/* Right: Helpful mouse interaction hint */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-300 bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-md backdrop-blur-md pointer-events-auto">
              <Move className="h-3.5 w-3.5 text-gray-500" />
              <span>Click any room to inspect • Drag to Pan</span>
            </div>
          </div>
        </div>

        {/* 3. RIGHT EXPANDABLE ROOM DIRECTORY & INSPECTOR PANEL */}
        {showRoomDirectory && (
          <div className="border-t lg:border-t-0 lg:border-l border-gray-200 bg-white p-5 lg:col-span-4 xl:col-span-3 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h4 className="font-heading text-base font-bold text-gray-900">
                    {currentFloor.name} Rooms
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {currentFloor.rooms.length} designated areas • {totalFloorArea} sq.ft carpet
                  </p>
                </div>
                <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900 border border-gray-200">
                  {Math.round((totalFloorArea / (plot.width * plot.length)) * 100)}% Coverage
                </span>
              </div>

              {/* Interactive Room List */}
              <div className="mt-3 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {currentFloor.rooms.map((room) => {
                  const isSelected = selectedRoomId === room.id || activeRoom?.id === room.id;
                  const isHovered = hoveredRoomId === room.id;
                  const theme = ROOM_THEMES[room.type] || ROOM_THEMES.living;
                  const IconComp = theme.icon;

                  return (
                    <div
                      key={room.id}
                      onClick={() => handleRoomClick(room)}
                      onMouseEnter={() => setHoveredRoomId(room.id)}
                      onMouseLeave={() => setHoveredRoomId(null)}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                          : isHovered
                          ? 'border-gray-400 bg-gray-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${theme.badge}`}>
                            <IconComp className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h5 className="font-heading text-xs font-bold text-gray-900">
                              {room.name}
                            </h5>
                            <span className="text-[11px] font-mono text-gray-500">
                              {room.width}'0" × {room.height}'0"
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-xs font-bold text-gray-900 block">
                            {room.area} sq.ft
                          </span>
                          <span className="text-[10px] font-bold text-gray-600">
                            {room.directionZone || 'Zone'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Room Detailed Highlight Card */}
            {activeRoom ? (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Selected Zone
                  </span>
                  <button
                    onClick={() => setActiveRoom(null)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900"
                  >
                    Clear
                  </button>
                </div>
                <h5 className="font-heading text-sm font-bold text-gray-900">
                  {activeRoom.name}
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-white p-2 border border-indigo-100">
                    <span className="text-[10px] text-gray-500 block font-bold">Dimensions</span>
                    <span className="font-mono font-bold text-gray-900">{activeRoom.width}' × {activeRoom.height}'</span>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-indigo-100">
                    <span className="text-[10px] text-gray-500 block font-bold">Vastu Zone</span>
                    <span className="font-bold text-indigo-900">{activeRoom.directionZone || 'Ideal'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-600 font-medium">
                  Click on any room to view full dimensions and architectural details.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
