import React, { useState, useEffect } from 'react';
import {
  Zap,
  Sun,
  TrendingDown,
  Plus,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  X,
} from 'lucide-react';
import { EnergyRecord, Home, Appliance } from '../../types';
import { api } from '../../services/api';

interface EnergyMonitorProps {
  currentHome: Home | null;
  onOpenAssistantChat: () => void;
}

export const EnergyMonitor: React.FC<EnergyMonitorProps> = ({
  currentHome,
  onOpenAssistantChat,
}) => {
  const [energyRecords, setEnergyRecords] = useState<EnergyRecord[]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Reading Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState('');
  const [kwhValue, setKwhValue] = useState<number>(4.5);

  useEffect(() => {
    loadEnergyData();
  }, [currentHome?.id]);

  const loadEnergyData = async () => {
    setLoading(true);
    try {
      const homeId = currentHome?.id;
      const [records, appList] = await Promise.all([
        api.getEnergyRecords(homeId),
        api.getAppliances(homeId),
      ]);
      setEnergyRecords(records || []);
      setAppliances(appList || []);
      if (appList && appList.length > 0) {
        setSelectedAppliance(appList[0].name);
      }
    } catch (err) {
      console.error('Failed to load energy data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHome) return;

    try {
      await api.logEnergyConsumption({
        home_id: currentHome.id,
        energy_consumption: Number(kwhValue),
        appliance_name: selectedAppliance || 'General Appliance',
      });
      setIsAddOpen(false);
      loadEnergyData();
    } catch (err) {
      console.error('Failed to log energy reading:', err);
    }
  };

  const totalTrackedKwh = energyRecords.reduce(
    (acc, r) => acc + (Number(r.energy_consumption) || 0),
    0
  );
  const estimatedMonthlyBillInr = Math.round(totalTrackedKwh * 4 * 7.5); // Approx ₹7.5 / kWh

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900 text-xs font-bold uppercase tracking-widest">
            <Zap className="h-4 w-4 text-gray-900" />
            <span>Power & Solar Efficiency Analytics</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
            Energy & Solar Optimization
          </h2>
          <p className="text-sm text-gray-700 font-normal max-w-2xl leading-relaxed">
            Monitor appliance power draw and align high-load cycles with solar peak generation windows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={onOpenAssistantChat}
            className="flex items-center gap-2.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm transition-all"
          >
            <Sparkles className="h-4 w-4 text-gray-900" />
            <span>AI Tariff Analysis</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-4 w-4 text-gray-200" />
            <span>Log Meter Reading</span>
          </button>
        </div>
      </div>

      {/* Energy Metrics Cards matching website cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
            Tracked Energy (7-Day)
          </span>
          <span className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 block">
            {totalTrackedKwh.toFixed(1)} kWh
          </span>
          <span className="text-xs text-gray-600 block font-normal">
            Across active recorded devices
          </span>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
            Est. Monthly Cost
          </span>
          <span className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 block">
            ₹{estimatedMonthlyBillInr.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-600 block font-normal">
            Based on ₹7.50 / kWh base residential slab
          </span>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
            Solar Shift Potential
          </span>
          <span className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 block">
            ~34% Savings
          </span>
          <span className="text-xs text-gray-600 block font-normal">
            By shifting geyser/washing machine to 11 AM - 3 PM
          </span>
        </div>
      </div>

      {/* Solar Alignment Advice & Logged Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Solar Peak Schedule Recommendation */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
              <div className="p-2.5 bg-gray-100 rounded-2xl border border-gray-200">
                <Sun className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  Solar Peak Generation Windows
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Recommended heavy-load appliance operating schedule
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Optimal 11:30 AM – 3:00 PM
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">
                    Water Heating & Laundry Cycle
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                  Run washing machines, dishwashers, and storage geysers during maximum rooftop solar irradiance to eliminate grid import charges.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    Pre-Cooling 2:00 PM – 4:00 PM
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">
                    Inverter Air Conditioner Pre-Cooling
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                  Pre-cool bedrooms to 24°C on solar power before sunset peak grid tariff hours kick in at 6:00 PM.
                </p>
              </div>
            </div>
          </div>

          {/* Energy History Table */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm space-y-6">
            <div className="pb-5 border-b border-gray-200">
              <h3 className="font-heading text-xl font-bold text-gray-900">
                Recent Consumption Logs
              </h3>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Timestamped records per connected appliance or sub-meter
              </p>
            </div>

            {energyRecords.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-600 font-normal py-6 text-center">
                No energy readings logged yet. Click 'Log Meter Reading' to start tracking.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-900 uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-3.5 pr-4">Date & Time</th>
                      <th className="py-3.5 px-4">Appliance / Source</th>
                      <th className="py-3.5 px-4">Recorded Draw</th>
                      <th className="py-3.5 pl-4">Est. Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {energyRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-4 pr-4 font-mono text-gray-600">
                          {new Date(r.timestamp).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900">{r.appliance_name}</td>
                        <td className="py-4 px-4 font-mono font-bold text-gray-900">{r.energy_consumption} kWh</td>
                        <td className="py-4 pl-4 font-mono text-gray-900 font-bold">
                          ₹{(Number(r.energy_consumption) * 7.5).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Energy Advice */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
              <div className="p-2.5 bg-gray-900 text-white rounded-2xl">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">BEE Star Rating Guidance</h4>
                <p className="text-xs text-gray-600 font-medium mt-0.5">Appliance upgrade analysis</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Upgrading older 3-Star non-inverter air conditioners to 5-Star inverter units reduces annual electricity expenditure by approximately ₹4,200 per unit per year.
            </p>

            <button
              onClick={onOpenAssistantChat}
              className="mt-2 w-full py-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Genie For Tariff Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Log Reading Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-gray-900" />
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  Log Energy Reading
                </h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogReading} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                  Appliance or Circuit
                </label>
                <select
                  value={selectedAppliance}
                  onChange={(e) => setSelectedAppliance(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                >
                  <option value="Main Residence Meter">Main Residence Meter</option>
                  {appliances.map((app) => (
                    <option key={app.id} value={app.name}>
                      {app.name} ({app.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                  Energy Consumption (kWh / Units)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={kwhValue}
                  onChange={(e) => setKwhValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest shadow-sm transition"
                >
                  Log Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
