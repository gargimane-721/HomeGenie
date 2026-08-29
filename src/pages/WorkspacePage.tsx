import React, { useState } from 'react';
import {
  FileCode,
  Box,
  Compass,
  IndianRupee,
  Sparkles,
  Layers,
  Download,
  FileText,
  ArrowLeft,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { Project, CadRoom } from '../types';
import { CadFloorPlanViewer } from '../components/CadFloorPlanViewer';
import { ThreeHouseViewer } from '../components/ThreeHouseViewer';
import { VastuVisualizer } from '../components/VastuVisualizer';
import { BudgetBreakdownModal } from '../components/BudgetBreakdownModal';
import { ProjectReportModal } from '../components/ProjectReportModal';
import { AiModificationChat } from '../components/AiModificationChat';
import { MaterialsComparisonView } from '../components/MaterialsComparisonView';
import { analyzeProjectVastu } from '../engine/vastuEngine';
import { api } from '../services/api';

interface WorkspacePageProps {
  project: Project;
  onBackToDashboard: () => void;
  onUpdateProject: (updatedProject: Project) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  project,
  onBackToDashboard,
  onUpdateProject,
}) => {
  // Main Studio View Mode
  const [viewMode, setViewMode] = useState<'cad2d' | '3d' | 'vastu' | 'materials'>('cad2d');
  const [selectedFloorIndex, setSelectedFloorIndex] = useState<number>(0);
  const [selectedRoom, setSelectedRoom] = useState<CadRoom | null>(null);
  const [activeAlternativeId, setActiveAlternativeId] = useState<string>(
    project.alternatives?.[0]?.id || 'alt_standard'
  );

  // Modals
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [showAiChatDrawer, setShowAiChatDrawer] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Switch Design Alternative
  const handleSelectAlternative = async (altId: string) => {
    setActiveAlternativeId(altId);
    try {
      const updated = await api.selectAlternative(project.id, altId);
      onUpdateProject(updated);
    } catch (err) {
      console.error('Failed to switch alternative:', err);
    }
  };

  // Export CAD as DXF file
  const handleExportDxf = async () => {
    setIsExporting(true);
    try {
      const dxfContent = await api.exportDxf(project.id);
      const blob = new Blob([dxfContent], { type: 'application/dxf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_cad.dxf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('DXF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleApplyVastuImprovements = () => {
    if (project.alternatives && project.alternatives.length > 0) {
      const vastuAlt = project.alternatives.find((a) => a.id === 'alt_vastu') || project.alternatives[0];
      handleSelectAlternative(vastuAlt.id);
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-12">
      {/* 1. Main Studio Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm text-gray-900">
        {/* Left Project Title & Info */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToDashboard}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 text-gray-700 hover:text-black hover:bg-gray-100 transition-all shadow-sm"
            title="Back to Projects"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-gray-900 sm:text-2xl">{project.name}</h1>
              <span className="rounded-lg bg-gray-100 px-2.5 py-0.5 text-xs font-mono font-bold text-gray-900 border border-gray-300">
                {project.plot.width}' × {project.plot.length}' ({project.plot.totalArea} sq.ft)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1 font-medium">
              <span>Facing: <strong className="text-gray-900 font-bold">{project.plot.roadDirection}</strong></span>
              <span>•</span>
              <span>{project.style} Style</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {project.vastuReport?.score || 87}% Vastu Score
              </span>
            </div>
          </div>
        </div>

        {/* Center View Mode Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-300 bg-gray-50 p-1 shadow-sm overflow-x-auto">
          <button
            onClick={() => setViewMode('cad2d')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              viewMode === 'cad2d'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-700 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>2D CAD Plan</span>
          </button>

          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-700 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            <span>3D Studio</span>
          </button>

          <button
            onClick={() => setViewMode('vastu')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              viewMode === 'vastu'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-700 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>8-Zone Vastu</span>
          </button>

          <button
            onClick={() => setViewMode('materials')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              viewMode === 'materials'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-700 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Materials</span>
          </button>
        </div>

        {/* Right Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Consultant Drawer Trigger */}
          <button
            onClick={() => setShowAiChatDrawer(!showAiChatDrawer)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-sm ${
              showAiChatDrawer
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>AI Copilot</span>
          </button>

          {/* Budget Breakdown Trigger */}
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-all shadow-sm"
          >
            <IndianRupee className="h-3.5 w-3.5 text-gray-600" />
            <span>
              ₹{((project.budgetReport?.totalEstimatedCost || project.budget.totalBudget) / 100000).toFixed(1)}L
            </span>
          </button>

          {/* Full Report Trigger */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-all shadow-sm"
          >
            <FileText className="h-3.5 w-3.5 text-gray-600" />
            <span>Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. CAD Alternative Schemes Segmented Bar (if available) */}
      {project.alternatives && project.alternatives.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-gray-200 bg-white/90 px-4 py-2.5 shadow-sm text-xs font-medium text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-gray-700" />
              Design Scheme:
            </span>
            <div className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-50 p-1">
              {project.alternatives.map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => handleSelectAlternative(alt.id)}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    activeAlternativeId === alt.id
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-700 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  {alt.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Switch between open-concept, traditional Vastu, or maximized carpet area</span>
          </div>
        </div>
      )}

      {/* 3. Main Studio View Workspace with optional AI Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Canvas View */}
        <div className={`${showAiChatDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          {/* 2D CAD Blueprint Mode */}
          {viewMode === 'cad2d' && (
            <CadFloorPlanViewer
              floors={project.floors}
              plot={project.plot}
              selectedFloorIndex={selectedFloorIndex}
              onSelectFloor={(idx) => setSelectedFloorIndex(idx)}
              onRoomSelect={(room) => setSelectedRoom(room)}
              selectedRoomId={selectedRoom?.id}
            />
          )}

          {/* 3D Architectural Studio Mode */}
          {viewMode === '3d' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <ThreeHouseViewer
                project={project}
                selectedFloorIndex={selectedFloorIndex}
                onSelectRoom={(room) => setSelectedRoom(room)}
              />
            </div>
          )}

          {/* 8-Zone Vastu Shastra Mode */}
          {viewMode === 'vastu' && (
            <VastuVisualizer
              vastuReport={
                project.vastuReport ||
                analyzeProjectVastu(
                  project.floors?.flatMap((f) => f.rooms) || [],
                  project.plot
                )
              }
              onApplyImprovements={handleApplyVastuImprovements}
              onHighlightZone={(zone) => {
                console.log('Highlighted zone:', zone);
              }}
            />
          )}

          {/* Materials & Brands Intelligence Mode */}
          {viewMode === 'materials' && (
            <MaterialsComparisonView
              userTier="Standard"
              onSelectMaterial={(item) => {
                console.log('Selected material:', item);
              }}
            />
          )}
        </div>

        {/* AI Architectural Consultant Side Drawer */}
        {showAiChatDrawer && (
          <div className="lg:col-span-4">
            <AiModificationChat
              project={project}
              onApplyPlanUpdate={(updated) => onUpdateProject(updated)}
            />
          </div>
        )}
      </div>

      {/* Budget Breakdown Modal */}
      {project.budgetReport && (
        <BudgetBreakdownModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          budgetReport={project.budgetReport}
          onApplySavings={(savingsId, applied) => {
            console.log('Toggled savings item:', savingsId, applied);
          }}
        />
      )}

      {/* Full Project Dossier Report Modal */}
      <ProjectReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        project={project}
      />
    </div>
  );
};
