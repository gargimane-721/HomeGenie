import React from 'react';
import { Compass, ShieldCheck, AlertCircle } from 'lucide-react';
import { HomeGenieLogo } from './HomeGenieLogo';

interface FooterProps {
  onNavigate: (view: 'home' | 'dashboard' | 'workspace' | 'materials' | 'wizard') => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onReplayIntro }) => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white text-gray-900">
      {/* Important Legal Disclaimer Banner */}
      <div className="border-b border-gray-200 bg-gray-50 py-4">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 sm:px-8 lg:px-12 text-xs leading-relaxed text-gray-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
          <p>
            <strong className="text-gray-900 font-bold">Architectural & Statutory Advisory:</strong> HomeGenie provides
            intelligent conceptual architectural designs, spatial optimizations, Vastu guidelines, and reference cost
            estimates. All generated floor plans, 3D models, structural envelopes, and financial projections are
            conceptual aids and do not substitute for certified blueprints prepared by a licensed architect, structural
            engineer, or approvals from local municipal planning authorities before ground excavation.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-1 rounded-lg bg-gray-100 border border-gray-300">
                <HomeGenieLogo variant="icon" size={30} color="#4B5563" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 font-heading">HomeGenie</span>
            </div>
            <p className="text-xs uppercase tracking-wider text-gray-900 font-bold">
              AI-Powered Architectural & Smart Home Engine
            </p>
            <p className="text-xs leading-relaxed text-gray-700 max-w-sm font-medium">
              The intelligent AI-driven residential house-planning, CAD drafting, Vastu Shastra analysis, budget intelligence, and smart home automation platform for modern homeowners and architects.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-900 font-mono font-semibold">
              <ShieldCheck className="h-4 w-4 text-gray-900" />
              <span>Parametric Bylaws • Vastu 8-Zone Engine • Three.js 3D CAD</span>
            </div>
          </div>

          {/* Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-gray-900 font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors">
                  Overview & Demo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-black transition-colors">
                  Create House Plan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('workspace')} className="hover:text-black transition-colors">
                  CAD Studio & 3D
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-black transition-colors">
                  Project Portfolio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Intelligence</h4>
            <ul className="space-y-2.5 text-xs text-gray-900 font-medium">
              <li>
                <button onClick={() => onNavigate('materials')} className="hover:text-black transition-colors">
                  Materials Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('workspace')} className="hover:text-black transition-colors">
                  Vastu Shastra Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('materials')} className="hover:text-black transition-colors">
                  Cost Estimation Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('workspace')} className="hover:text-black transition-colors">
                  Room Schedules
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Specifications</h4>
            <ul className="space-y-2.5 text-xs text-gray-900 font-medium">
              <li className="hover:text-black transition-colors">AutoCAD DXF Compatibility</li>
              <li className="hover:text-black transition-colors">Scalable SVG Vectors</li>
              <li className="hover:text-black transition-colors">IS 456 Bylaw Compliance</li>
              <li className="hover:text-black transition-colors">BOQ Financial Feasibility</li>
              {onReplayIntro && (
                <li>
                  <button onClick={onReplayIntro} className="text-gray-900 hover:text-black transition-colors flex items-center gap-1 font-semibold underline underline-offset-2">
                    ▶ Play Start Intro Animation
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row text-xs uppercase tracking-widest text-gray-900 font-bold">
          <span>Draft Engine v2.4.0 • System Ready</span>
          <span>Conceptual Planning Only • Consulting Architect Required</span>
          <span>© {new Date().getFullYear()} HomeGenie AI</span>
        </div>
      </div>
    </footer>
  );
};
