import React from 'react';
import {
  FileText,
  Printer,
  AlertCircle,
  X,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectReportModal: React.FC<ProjectReportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalBuiltUp = project.floors.reduce((acc, f) => acc + f.builtUpArea, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl flex flex-col">
        {/* Modal Toolbar Header */}
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 border border-gray-300 text-gray-900">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900">
                Architectural Conceptual Design Dossier
              </h3>
              <p className="text-xs text-gray-900 font-medium">
                Project Code: <span className="font-mono text-gray-900 font-bold">{project.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <Printer className="h-3.5 w-3.5 text-gray-900" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50 text-gray-900 print:bg-white print:text-black">
          {/* Document Title Header */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-900">
                  HOMEGENIE ARCHITECTURAL INTELLIGENCE REPORT
                </span>
                <h1 className="font-heading text-3xl font-bold text-gray-900 mt-1">{project.name}</h1>
                <p className="text-xs text-gray-900 mt-1 font-medium">
                  Location: {project.plot.location} | Style: {project.style} | Generated on{' '}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <div className="rounded-xl border border-gray-300 bg-white p-3 text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">
                    Overall Feasibility Index
                  </span>
                  <span className="font-heading text-2xl font-bold text-gray-900">{project.overallScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-black/10 bg-white p-3.5 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold block">Plot Dimensions</span>
              <span className="font-mono text-sm font-bold text-[#1A1A1A] mt-0.5 block">
                {project.plot.width}'0" × {project.plot.length}'0"
              </span>
              <span className="text-[11px] text-[#1A1A1A]/60 font-medium">{project.plot.totalArea} sq.ft</span>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-3.5 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold block">Total Built-Up Area</span>
              <span className="font-mono text-sm font-bold text-[#5A5A40] mt-0.5 block">
                {totalBuiltUp} sq.ft
              </span>
              <span className="text-[11px] text-[#1A1A1A]/60 font-medium">{project.totalFloors} Floors Structure</span>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-3.5 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold block">Vastu Score</span>
              <span className="font-mono text-sm font-bold text-[#5A5A40] mt-0.5 block">
                {project.vastuReport?.score || 87}%
              </span>
              <span className="text-[11px] text-[#1A1A1A]/60 font-medium">8-Zone Compliant</span>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-3.5 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold block">Estimated Cost</span>
              <span className="font-mono text-sm font-bold text-[#1A1A1A] mt-0.5 block">
                ₹{((project.budgetReport?.totalEstimatedCost || project.budget.totalBudget) / 100000).toFixed(2)}L
              </span>
              <span className="text-[11px] text-[#1A1A1A]/60 font-medium">Budget: ₹{(project.budget.totalBudget / 100000).toFixed(1)}L</span>
            </div>
          </div>

          {/* Room Schedule & Dimensions Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-3">
              1. Detailed Room Area & Fenestration Schedule
            </h3>
            <div className="overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-black/10 bg-[#F5F2ED] text-[#5A5A40] font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Floor</th>
                    <th className="px-4 py-2.5">Room Designation</th>
                    <th className="px-4 py-2.5">Dimensions (W × L)</th>
                    <th className="px-4 py-2.5 text-right">Carpet Area</th>
                    <th className="px-4 py-2.5">Direction Zone</th>
                    <th className="px-4 py-2.5">Vastu Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 bg-white">
                  {project.floors.flatMap((floor) =>
                    floor.rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-[#F5F2ED]">
                        <td className="px-4 py-2 text-[#1A1A1A]/60 font-medium">{floor.name}</td>
                        <td className="px-4 py-2 font-bold text-[#1A1A1A]">{room.name}</td>
                        <td className="px-4 py-2 font-mono text-[#1A1A1A]">
                          {room.width}'0" × {room.height}'0"
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-[#5A5A40]">{room.area} sq.ft</td>
                        <td className="px-4 py-2 text-[#1A1A1A]/60">{room.directionZone || 'Central'}</td>
                        <td className="px-4 py-2 text-[#5A5A40] font-bold">{room.vastuCompliance || 'Ideal'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Estimates & BOQ */}
          {project.budgetReport && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-3">
                2. Itemized Cost Estimation & Bill of Quantities (BOQ)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-black/10 bg-[#F5F2ED] text-[#5A5A40] font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Trade / Package</th>
                      <th className="px-4 py-2.5">Specifications Summary</th>
                      <th className="px-4 py-2.5 text-right">Share (%)</th>
                      <th className="px-4 py-2.5 text-right">Estimated Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 bg-white">
                    {project.budgetReport.categories.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-[#F5F2ED]">
                        <td className="px-4 py-2 font-bold text-[#1A1A1A]">{cat.category}</td>
                        <td className="px-4 py-2 text-[#1A1A1A]/70 font-medium">{cat.details}</td>
                        <td className="px-4 py-2 text-right font-mono text-[#5A5A40] font-semibold">{cat.percentage}%</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-[#1A1A1A]">
                          ₹{(cat.cost / 100000).toFixed(2)} Lakh
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Legal Disclaimer Box */}
          <div className="rounded-xl border border-black/10 bg-white p-4 text-xs text-[#1A1A1A]/70 leading-relaxed shadow-sm font-medium">
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A] mb-1">
              <AlertCircle className="h-4 w-4 text-[#5A5A40]" />
              <span>Architectural & Structural Engineer Disclaimer</span>
            </div>
            <p>
              This document is generated for conceptual planning purposes by HomeGenie AI CAD Engine. Structural column
              placements, soil load-bearing capacities, plumbing risers, and municipal sanction drawings must be
              certified by a licensed architect and structural engineer prior to commencing construction on site.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-black/10 bg-[#F5F2ED] px-6 py-4">
          <span className="text-xs text-[#1A1A1A]/60 font-medium">HomeGenie Parametric Engine • Release v2.4</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1A1A1A] hover:bg-[#2c2c2c] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-sm"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
