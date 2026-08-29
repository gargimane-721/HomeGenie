import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  Cpu,
  Wrench,
  Zap,
  Sparkles,
  Camera,
  Building,
  RefreshCw,
} from 'lucide-react';
import { Home } from '../types';
import { api } from '../services/api';
import { HomeDashboard } from '../components/smart-home/HomeDashboard';
import { AppliancesManager } from '../components/smart-home/AppliancesManager';
import { MaintenanceTracker } from '../components/smart-home/MaintenanceTracker';
import { EnergyMonitor } from '../components/smart-home/EnergyMonitor';
import { HomeGenieChatDrawer } from '../components/smart-home/HomeGenieChatDrawer';
import { VisionScanModal } from '../components/smart-home/VisionScanModal';

interface SmartHomePageProps {
  onStartNewPlan?: () => void;
}

export const SmartHomePage: React.FC<SmartHomePageProps> = () => {
  const [homes, setHomes] = useState<Home[]>([]);
  const [currentHome, setCurrentHome] = useState<Home | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appliances' | 'maintenance' | 'energy'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const [isVisionScanOpen, setIsVisionScanOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  useEffect(() => {
    loadHomes();
  }, []);

  const loadHomes = async () => {
    setIsLoading(true);
    try {
      const homeList = await api.getHomes();
      setHomes(homeList || []);
      if (homeList && homeList.length > 0) {
        setCurrentHome(homeList[0]);
      }
    } catch (err) {
      console.error('Failed to load homes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-24">
      {/* Top Header & Residence Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-gray-200 pb-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-gray-900 text-xs font-bold uppercase tracking-widest">
            <Cpu className="h-4 w-4 text-gray-900" />
            <span>Smart Home Operations & Maintenance Hub</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Smart Home Operations
          </h1>
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal pt-1">
            Manage connected appliances, track warranties, streamline preventive servicing schedules, and maximize solar energy efficiency.
          </p>
        </div>

        {/* Right Property Selector & Primary Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Property:
            </span>
            <select
              value={currentHome?.id || ''}
              onChange={(e) => {
                const selected = homes.find((h) => h.id === e.target.value);
                if (selected) setCurrentHome(selected);
              }}
              className="bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer pr-2"
            >
              {homes.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city || 'Residence'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsVisionScanOpen(true)}
            className="flex items-center gap-2.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm hover:shadow transition-all"
          >
            <Camera className="h-4 w-4 text-gray-900" />
            <span>AI Photo Scan</span>
          </button>

          <button
            onClick={() => setIsChatDrawerOpen(true)}
            className="flex items-center gap-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-gray-200" />
            <span>Ask Home Genie</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs matching Website pill styling */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-black shadow-xs'
          }`}
        >
          <HomeIcon className="w-4 h-4" />
          <span>Home Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('appliances')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
            activeTab === 'appliances'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-black shadow-xs'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Appliances & Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
            activeTab === 'maintenance'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-black shadow-xs'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance & Servicing</span>
        </button>

        <button
          onClick={() => setActiveTab('energy')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
            activeTab === 'energy'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-black shadow-xs'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Energy & Solar</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'dashboard' && (
        <HomeDashboard
          currentHome={currentHome}
          onNavigateTab={(tab) => setActiveTab(tab as any)}
          onOpenVisionScan={() => setIsVisionScanOpen(true)}
          onOpenAddAppliance={() => setActiveTab('appliances')}
          onOpenAddMaintenance={() => setActiveTab('maintenance')}
          onOpenAssistantChat={() => setIsChatDrawerOpen(true)}
        />
      )}

      {activeTab === 'appliances' && (
        <AppliancesManager
          currentHome={currentHome}
          onOpenVisionScan={() => setIsVisionScanOpen(true)}
        />
      )}

      {activeTab === 'maintenance' && (
        <MaintenanceTracker
          currentHome={currentHome}
          onOpenAssistantChat={() => setIsChatDrawerOpen(true)}
        />
      )}

      {activeTab === 'energy' && (
        <EnergyMonitor
          currentHome={currentHome}
          onOpenAssistantChat={() => setIsChatDrawerOpen(true)}
        />
      )}

      {/* Floating Assistant Trigger for quick access */}
      <button
        onClick={() => setIsChatDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest shadow-2xl border border-gray-700 hover:scale-105 transition active:scale-95 group"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-12 transition">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span>Ask Home Genie</span>
      </button>

      {/* AI Assistant Chat Drawer */}
      <HomeGenieChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        currentHome={currentHome}
      />

      {/* AI Vision Photo Scanner Modal */}
      <VisionScanModal
        isOpen={isVisionScanOpen}
        onClose={() => setIsVisionScanOpen(false)}
        currentHome={currentHome}
        onApplianceCreated={() => {
          loadHomes();
        }}
      />
    </div>
  );
};
