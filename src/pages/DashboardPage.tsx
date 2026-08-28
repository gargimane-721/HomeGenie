import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Trash2,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Project } from '../types';

interface DashboardPageProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onCreateNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  onOpenProject,
  onCreateNewProject,
  onDeleteProject,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStyle, setFilterStyle] = useState<string>('All');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.plot.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = filterStyle === 'All' || p.style === filterStyle;
    return matchesSearch && matchesStyle;
  });

  const totalBuiltUpArea = projects.reduce(
    (acc, p) => acc + p.floors.reduce((fAcc, f) => fAcc + f.builtUpArea, 0),
    0
  );

  const avgVastu =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.vastuReport?.score || 85), 0) / projects.length
        )
      : 88;

  return (
    <div className="space-y-12 pb-24">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 text-gray-900 text-xs font-bold uppercase tracking-widest">
            <FolderKanban className="h-4 w-4 text-gray-900" />
            <span>Architectural Portfolio & CAD Workspace</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-2">My House Projects</h1>
          <p className="text-sm text-gray-900 mt-2 font-medium">
            Manage your generated floor plans, design iterations, cost models, and Vastu audits.
          </p>
        </div>

        <button
          onClick={onCreateNewProject}
          className="flex items-center gap-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4 text-gray-200" />
          <span>New House Plan</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">Total Designs</span>
          <span className="font-heading text-3xl font-bold text-gray-900 mt-2 block">{projects.length}</span>
          <span className="text-xs text-gray-900 mt-1 block font-medium">Active project models</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">Total Built-Up Area</span>
          <span className="font-heading text-3xl font-bold text-gray-900 mt-2 block">{totalBuiltUpArea} sq.ft</span>
          <span className="text-xs text-gray-900 mt-1 block font-medium">Across all floor stacks</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">Average Vastu Score</span>
          <span className="font-heading text-3xl font-bold text-gray-900 mt-2 block">{avgVastu}%</span>
          <span className="text-xs text-gray-900 mt-1 block font-medium">High cosmic alignment</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">Format Support</span>
          <span className="font-heading text-3xl font-bold text-gray-900 mt-2 block">DXF + 3D</span>
          <span className="text-xs text-gray-900 mt-1 block font-medium">AutoCAD & Three.js</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-900" />
          <input
            type="text"
            placeholder="Search projects by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-xs font-bold text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Modern Villa', 'Traditional Courtyard', 'Minimalist Urban', 'Luxury Duplex'].map((style) => (
            <button
              key={style}
              onClick={() => setFilterStyle(style)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
                filterStyle === style
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center shadow-sm">
          <FolderKanban className="mx-auto h-12 w-12 text-gray-900" />
          <h3 className="font-heading text-xl font-bold text-gray-900 mt-4">No house plans match your search</h3>
          <p className="text-xs text-gray-900 mt-2 font-medium">Try clearing your search query or generate a new house design.</p>
          <button
            onClick={onCreateNewProject}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 text-white" />
            <span>Create New Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const floorCount = project.floors.length;
            const builtUp = project.floors.reduce((acc, f) => acc + f.builtUpArea, 0);
            const totalRooms = project.floors.reduce((acc, f) => acc + f.rooms.length, 0);

            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-900 block">
                        {project.plot.width}×{project.plot.length} FT ({project.plot.width * project.plot.length} SQ.FT)
                      </span>
                      <h3 className="font-heading text-xl font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-black transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-900 border border-gray-300">
                      {project.vastuReport?.score || 85}% Vastu
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-900 mt-2 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-gray-900" />
                    <span>{project.plot.location || 'India'}</span>
                    <span>•</span>
                    <span className="text-gray-900 font-bold">{project.style}</span>
                  </div>

                  {/* Blueprint Mini CAD Grid */}
                  <div className="my-4 rounded-xl border border-gray-200 bg-gray-50 p-3 h-28 flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 blueprint-grid-light opacity-50"></div>
                    <div className="relative z-10 grid grid-cols-3 gap-2 w-full text-center text-[10px]">
                      <div className="rounded-lg bg-white p-1.5 border border-gray-200 shadow-2xs">
                        <span className="text-gray-900 block text-[9px] uppercase font-bold">Floors</span>
                        <strong className="text-gray-900 font-mono text-xs">{floorCount > 1 ? `G+${floorCount - 1}` : 'Ground'}</strong>
                      </div>
                      <div className="rounded-lg bg-white p-1.5 border border-gray-200 shadow-2xs">
                        <span className="text-gray-900 block text-[9px] uppercase font-bold">Built-Up</span>
                        <strong className="text-gray-900 font-mono text-xs">{builtUp} sq.ft</strong>
                      </div>
                      <div className="rounded-lg bg-white p-1.5 border border-gray-200 shadow-2xs">
                        <span className="text-gray-900 block text-[9px] uppercase font-bold">Rooms</span>
                        <strong className="text-gray-900 font-mono text-xs">{totalRooms} Spaces</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-900 border-t border-gray-100 pt-3 font-medium">
                    <span>Est. Civil & Finishes:</span>
                    <span className="font-mono font-bold text-gray-900">
                      ₹{((project.costEstimate?.totalCost || 2500000) / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-4">
                  <button
                    onClick={() => onOpenProject(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors"
                  >
                    <span>Open CAD Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-900 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors shadow-2xs"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
