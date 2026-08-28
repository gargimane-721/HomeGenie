import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Sun,
  Moon,
  Sunset,
  Layers,
  Box,
  RotateCcw,
  Sparkles,
  Users,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { CadRoom, FloorLayout, PlotDetails, Project } from '../types';

interface ThreeHouseViewerProps {
  project?: Project;
  floors?: FloorLayout[];
  plot?: PlotDetails;
  selectedFloorIndex?: number;
  onSelectFloor?: (index: number) => void;
  onSelectRoom?: (room: any) => void;
}

export const ThreeHouseViewer: React.FC<ThreeHouseViewerProps> = ({
  project,
  floors: propFloors,
  plot: propPlot,
  selectedFloorIndex = 0,
  onSelectFloor,
  onSelectRoom,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const plot = propPlot || project?.plot || { width: 30, length: 50, roadDirection: 'East' as any, totalArea: 1500 };
  const floors = propFloors || project?.floors || [];

  // 3D Visualizer Controls State
  const [viewMode, setViewMode] = useState<'all' | 'single' | 'exploded' | 'completed'>('all');
  const [lightingPreset, setLightingPreset] = useState<'day' | 'sunset' | 'night'>('day');
  const [showRoof, setShowRoof] = useState<boolean>(false);
  const [showFurniture3D, setShowFurniture3D] = useState<boolean>(true);

  // Internal Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  const floorCount = floors.length || 2;
  const completedHouseImages = {
    1: {
      title: 'Single-Storey Contemporary Bungalow',
      subtitle: 'Finished elevation with manicured front garden, teak entry porch, low-E glazing & parking',
      url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80',
      elevationHeight: "12' 6\" Single Slab",
      features: ['Wide Front Veranda', 'Landscaped Entrance Walkway', 'Living Room Picture Windows', 'Exterior Accent Lighting'],
      peopleDescription: 'Adults and scale figures (5\'8") at the front entryway for spatial reference',
    },
    2: {
      title: 'G+1 Modern Duplex Villa',
      subtitle: 'Finished elevation with toughened glass balcony, upper cantilever master suite & LED lighting',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      elevationHeight: "23' 6\" Two Floors",
      features: ['Toughened Glass Balcony', 'Double-Height Living Glazing', 'Covered Portico with Vehicle', 'Teak Entrance Door'],
      peopleDescription: 'Adult scale figures walking along the front driveway and entrance stairs showing true ceiling height',
    },
    3: {
      title: 'G+2 Luxury Triplex Residence',
      subtitle: 'Finished elevation with rooftop pergola garden, multi-tier balconies and vertical architectural fins',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      elevationHeight: "34' 0\" Three Floors",
      features: ['Terrace Lounge & Greenery', 'Multi-Floor Glass Louvers', 'Ground Stilt Parking', 'Vertical Teak Louvers'],
      peopleDescription: 'Pedestrian and family scale indicators standing near the front gate and porch for clear scale',
    },
  };

  const currentHouse3D = completedHouseImages[floorCount as 1 | 2 | 3] || completedHouseImages[2];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xEFECE7); // Natural Tones warm sand backdrop

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    camera.position.set(plot.width * 1.6, plot.length * 1.4, plot.length * 1.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 10;
    controls.maxDistance = 300;
    controls.target.set(plot.width / 2, 8, plot.length / 2);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd1cdc4, 0.6);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.3);
    dirLight.position.set(40, 80, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 300;
    const d = 60;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 6. Ground & Plot Plane
    const groundGeo = new THREE.PlaneGeometry(plot.width * 4, plot.length * 4);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xdfdad0,
      roughness: 0.9,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(plot.width / 2, -0.1, plot.length / 2);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Plot Boundary Slab
    const plotGeo = new THREE.BoxGeometry(plot.width, 0.4, plot.length);
    const plotMat = new THREE.MeshStandardMaterial({
      color: 0xf5f2ed,
      roughness: 0.8,
    });
    const plotMesh = new THREE.Mesh(plotGeo, plotMat);
    plotMesh.position.set(plot.width / 2, 0.1, plot.length / 2);
    plotMesh.receiveShadow = true;
    scene.add(plotMesh);

    // Plot Boundary Accent Edge
    const edges = new THREE.EdgesGeometry(plotGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x5a5a40, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(plotMesh.position);
    scene.add(wireframe);

    // 7. House Group
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);
    houseGroupRef.current = houseGroup;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [plot.width, plot.length]);

  // Re-build 3D geometry when floors, viewMode, or roof toggles change
  useEffect(() => {
    const houseGroup = houseGroupRef.current;
    if (!houseGroup) return;

    // Clear previous house meshes
    while (houseGroup.children.length > 0) {
      const child = houseGroup.children[0];
      houseGroup.remove(child);
    }

    const wallHeight = 9.5;
    const slabThickness = 0.6;

    floors.forEach((floor, fIdx) => {
      if (viewMode === 'single' && fIdx !== selectedFloorIndex) return;

      const floorYOffset =
        viewMode === 'exploded'
          ? fIdx * (wallHeight + 12)
          : fIdx * (wallHeight + slabThickness);

      const floorGroup = new THREE.Group();
      floorGroup.position.set(0, floorYOffset, 0);

      // Floor Slab
      const slabGeo = new THREE.BoxGeometry(plot.width - 6, slabThickness, plot.length - 8);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0xe4e0d8,
        roughness: 0.7,
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.position.set(plot.width / 2, slabThickness / 2, plot.length / 2);
      slabMesh.receiveShadow = true;
      floorGroup.add(slabMesh);

      // Render Rooms & Floors
      floor.rooms.forEach((room) => {
        const rw = room.width;
        const rh = room.height;
        const rx = room.x + rw / 2;
        const rz = room.y + rh / 2;

        // Room Floor Surface
        const roomFloorGeo = new THREE.PlaneGeometry(rw - 0.2, rh - 0.2);
        const roomFloorMat = new THREE.MeshStandardMaterial({
          color: getRoom3dColor(room.type),
          roughness: 0.5,
          metalness: 0.05,
        });
        const roomFloorMesh = new THREE.Mesh(roomFloorGeo, roomFloorMat);
        roomFloorMesh.rotation.x = -Math.PI / 2;
        roomFloorMesh.position.set(rx, slabThickness + 0.05, rz);
        roomFloorMesh.receiveShadow = true;
        floorGroup.add(roomFloorMesh);

        // Room Furniture 3D representations
        if (showFurniture3D && room.furniture) {
          room.furniture.forEach((furn) => {
            const fw = furn.width;
            const fh = furn.height;
            const fDepth = furn.category === 'sofa' || furn.category === 'bed' ? 2.2 : 2.8;
            const furnGeo = new THREE.BoxGeometry(fw * 0.85, fDepth, fh * 0.85);
            const furnMat = new THREE.MeshStandardMaterial({
              color: 0x5a5a40,
              roughness: 0.6,
            });
            const furnMesh = new THREE.Mesh(furnGeo, furnMat);
            furnMesh.position.set(furn.x + fw / 2, slabThickness + fDepth / 2, furn.y + fh / 2);
            furnMesh.castShadow = true;
            furnMesh.receiveShadow = true;
            floorGroup.add(furnMesh);
          });
        }
      });

      // Render 3D Walls
      floor.walls.forEach((wall) => {
        const dx = wall.x2 - wall.x1;
        const dz = wall.y2 - wall.y1;
        const wallLen = Math.sqrt(dx * dx + dz * dz);
        if (wallLen < 0.5) return;

        const wallGeo = new THREE.BoxGeometry(wall.thickness || 0.7, wallHeight, wallLen);
        const wallMat = new THREE.MeshStandardMaterial({
          color: wall.isExternal ? 0xffffff : 0xf1ece1,
          roughness: 0.85,
        });
        const wallMesh = new THREE.Mesh(wallGeo, wallMat);

        const midX = (wall.x1 + wall.x2) / 2;
        const midZ = (wall.y1 + wall.y2) / 2;
        const angle = Math.atan2(dx, dz);

        wallMesh.position.set(midX, slabThickness + wallHeight / 2, midZ);
        wallMesh.rotation.y = angle;
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        floorGroup.add(wallMesh);
      });

      houseGroup.add(floorGroup);
    });

    // Optional Roof on top
    if (showRoof && floors.length > 0) {
      const topY =
        viewMode === 'exploded'
          ? floors.length * (wallHeight + 12)
          : floors.length * (wallHeight + slabThickness);

      const roofGeo = new THREE.ConeGeometry(plot.width * 0.7, 5, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x5a5a40,
        roughness: 0.6,
      });
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.position.set(plot.width / 2, topY + 2.5, plot.length / 2);
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = true;
      houseGroup.add(roofMesh);
    }
  }, [floors, viewMode, selectedFloorIndex, showRoof, showFurniture3D, plot.width, plot.length]);

  // Handle Lighting presets (Day / Sunset / Night)
  useEffect(() => {
    const scene = sceneRef.current;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;
    if (!scene || !dirLight || !hemiLight) return;

    if (lightingPreset === 'day') {
      scene.background = new THREE.Color(0xEFECE7);
      dirLight.color.setHex(0xfff8ee);
      dirLight.intensity = 1.3;
      dirLight.position.set(40, 80, 50);
      hemiLight.color.setHex(0xffffff);
      hemiLight.groundColor.setHex(0xd1cdc4);
      hemiLight.intensity = 0.6;
    } else if (lightingPreset === 'sunset') {
      scene.background = new THREE.Color(0xd6cbbd);
      dirLight.color.setHex(0xf97316);
      dirLight.intensity = 1.6;
      dirLight.position.set(60, 25, 40);
      hemiLight.color.setHex(0xfb923c);
      hemiLight.groundColor.setHex(0x78350f);
      hemiLight.intensity = 0.5;
    } else if (lightingPreset === 'night') {
      scene.background = new THREE.Color(0x1a1a1a);
      dirLight.color.setHex(0x94a3b8);
      dirLight.intensity = 0.5;
      dirLight.position.set(20, 50, -30);
      hemiLight.color.setHex(0x334155);
      hemiLight.groundColor.setHex(0x0f172a);
      hemiLight.intensity = 0.3;
    }
  }, [lightingPreset]);

  // Helper color function for 3D floors
  function getRoom3dColor(type: string): number {
    switch (type) {
      case 'living':
        return 0xd5cebf;
      case 'dining':
        return 0xc8bfae;
      case 'kitchen':
        return 0xbdb39f;
      case 'bedroom':
      case 'master_bedroom':
        return 0xcec6b7;
      case 'bathroom':
        return 0xa8a192;
      case 'pooja':
        return 0xdfc999;
      case 'balcony':
      case 'terrace':
      case 'garden':
        return 0x94a37f;
      default:
        return 0xd5cebf;
    }
  }

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(plot.width * 1.6, plot.length * 1.4, plot.length * 1.5);
      controlsRef.current.target.set(plot.width / 2, 8, plot.length / 2);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative flex flex-col h-full rounded-xl border border-black/10 bg-[#EFECE7] overflow-hidden shadow-sm">
      {/* Top 3D Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-white/85 px-4 py-2.5 backdrop-blur-md">
        {/* View Mode (All / Single Floor / Exploded / Completed 3D House) */}
        <div className="flex items-center gap-1 rounded-lg border border-black/10 bg-[#F5F2ED] p-1">
          <button
            onClick={() => setViewMode('all')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'all' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            <span>Full 3D Model</span>
          </button>

          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'single' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Floor Cutaway</span>
          </button>

          <button
            onClick={() => setViewMode('exploded')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'exploded' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#E4E0D8]" />
            <span>Exploded View</span>
          </button>

          <button
            onClick={() => setViewMode('completed')}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'completed' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
            }`}
            title="View 3D Finished House with People for Human Scale"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Completed 3D Exterior & People</span>
          </button>
        </div>

        {/* Floor Selection if in Single View mode */}
        {viewMode === 'single' && (
          <div className="flex items-center gap-1 rounded-lg border border-black/10 bg-[#F5F2ED] p-1">
            {floors.map((f, i) => (
              <button
                key={f.floorNumber}
                onClick={() => onSelectFloor && onSelectFloor(i)}
                className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedFloorIndex === i ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
                }`}
              >
                {f.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Lighting & Roof Toggles */}
        <div className="flex items-center gap-2">
          {/* Lighting Presets */}
          <div className="flex items-center gap-1 rounded-lg border border-black/10 bg-[#F5F2ED] p-1">
            <button
              onClick={() => setLightingPreset('day')}
              className={`rounded p-1 text-xs transition-colors ${
                lightingPreset === 'day' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
              }`}
              title="Day Sunlight"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setLightingPreset('sunset')}
              className={`rounded p-1 text-xs transition-colors ${
                lightingPreset === 'sunset' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
              }`}
              title="Golden Sunset"
            >
              <Sunset className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setLightingPreset('night')}
              className={`rounded p-1 text-xs transition-colors ${
                lightingPreset === 'night' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
              }`}
              title="Night Illumination"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>

          {viewMode !== 'completed' && (
            <>
              {/* Roof & Furniture Toggles */}
              <button
                onClick={() => setShowRoof(!showRoof)}
                className={`rounded-lg border border-black/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ${
                  showRoof ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#5A5A40] hover:bg-[#EFECE7]'
                }`}
              >
                Roof {showRoof ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => setShowFurniture3D(!showFurniture3D)}
                className={`rounded-lg border border-black/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ${
                  showFurniture3D ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#5A5A40] hover:bg-[#EFECE7]'
                }`}
              >
                3D Furniture {showFurniture3D ? 'ON' : 'OFF'}
              </button>

              {/* Reset Camera */}
              <button
                onClick={handleResetCamera}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-white text-[#5A5A40] hover:bg-[#EFECE7] hover:text-[#1A1A1A] transition-colors shadow-sm"
                title="Reset 3D Camera"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main View Area: Either Three.js Canvas or Completed 3D Exterior Elevation */}
      {viewMode === 'completed' ? (
        <div className="relative flex-1 w-full min-h-[480px] bg-gray-900 overflow-hidden flex flex-col justify-between p-6">
          <img
            src={currentHouse3D.url}
            alt={currentHouse3D.title}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
              lightingPreset === 'sunset' ? 'sepia-[0.35] brightness-95' : lightingPreset === 'night' ? 'brightness-75 contrast-125' : 'brightness-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

          {/* Top Info Badge */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-xl bg-black/80 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md border border-white/20 shadow-lg">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>True Human Scale (5'8" Adult Reference)</span>
              </span>
              <span className="rounded-xl bg-black/80 px-3 py-2 text-xs font-bold text-gray-200 border border-white/20">
                {floorCount === 1 ? 'Ground Floor Bungalow' : floorCount === 2 ? 'G+1 Duplex Villa' : 'G+2 Multi-Storey Residence'}
              </span>
            </div>

            <span className="rounded-xl bg-emerald-500/90 text-black px-3.5 py-1.5 text-xs font-bold shadow-md">
              100% Architectural Turnkey Preview
            </span>
          </div>

          {/* Features Highlights */}
          <div className="relative z-10 flex flex-wrap gap-2.5 max-w-2xl my-auto">
            {currentHouse3D.features.map((feat, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-md">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{feat}</span>
              </span>
            ))}
          </div>

          {/* Bottom Elevation Summary */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 text-white border-t border-white/20 pt-4 backdrop-blur-sm">
            <div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
                {currentHouse3D.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-200 mt-0.5 max-w-2xl font-medium">
                {currentHouse3D.subtitle}
              </p>
              <p className="text-xs text-emerald-300 font-bold mt-1">
                🧑‍🤝‍🧑 {currentHouse3D.peopleDescription}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm md:text-base font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                Height: {currentHouse3D.elevationHeight}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 3D WebGL Canvas Container */}
          <div ref={mountRef} className="relative flex-1 w-full min-h-[480px] bg-[#EFECE7] cursor-grab active:cursor-grabbing" />

          {/* Bottom Floating Hint Overlay */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-white/90 px-4 py-2 text-xs font-medium text-[#5A5A40] backdrop-blur-md shadow-sm">
            <span className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
              <Sparkles className="h-3.5 w-3.5 text-[#5A5A40]" />
              <span>Real-time Three.js 3D Engine</span>
            </span>
            <span className="text-black/20">•</span>
            <span>Left Click: Orbit / Rotate</span>
            <span className="text-black/20">•</span>
            <span>Right Click: Pan</span>
            <span className="text-black/20">•</span>
            <span>Scroll: Zoom In/Out</span>
          </div>
        </>
      )}
    </div>
  );
};
