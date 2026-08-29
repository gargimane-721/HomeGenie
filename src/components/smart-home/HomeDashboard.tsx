import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  Cpu,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  Search,
  ChevronRight,
  Camera,
  Layers,
  Building,
} from 'lucide-react';
import { Home, Appliance, MaintenanceTask, AIRecommendation, HomeDashboardStats } from '../../types';
import { api } from '../../services/api';

interface HomeDashboardProps {
  currentHome: Home | null;
  onNavigateTab: (tab: string) => void;
  onOpenVisionScan: () => void;
  onOpenAddAppliance: () => void;
  onOpenAddMaintenance: () => void;
  onOpenAssistantChat: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentHome,
  onNavigateTab,
  onOpenVisionScan,
  onOpenAddAppliance,
  onOpenAddMaintenance,
  onOpenAssistantChat,
}) => {
  const [stats, setStats] = useState<HomeDashboardStats | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [currentHome?.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const homeId = currentHome?.id;
      const [dashStats, appList, taskList, recList] = await Promise.all([
        api.getDashboardStats(homeId),
        api.getAppliances(homeId),
        api.getMaintenanceTasks(homeId),
        api.getAiRecommendations(homeId),
      ]);
      setStats(dashStats);
      setAppliances(appList || []);
      setTasks(taskList || []);
      setRecommendations(recList || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await api.completeMaintenanceTask(taskId, currentHome?.id);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const expiringAppliances = appliances.filter((a) => a.warranty_status === 'expiring_soon');

  return (
    <div className="space-y-10 sm:space-y-12 animate-fadeIn">
      {/* Metrics Row matching Website Dashboard Metrics with generous spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Metric 1: Total Appliances */}
        <div
          onClick={() => onNavigateTab('appliances')}
          className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm hover:shadow-md hover:border-gray-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
              Connected Assets
            </span>
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition">
              <Cpu className="h-4 w-4 text-gray-900" />
            </div>
          </div>
          <span className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mt-4 block tracking-tight">
            {stats?.totalAppliances || appliances.length}
          </span>
          <span className="text-xs text-gray-600 mt-3 block font-medium">
            Across {currentHome?.rooms?.length || 4} designated zones
          </span>
        </div>

        {/* Metric 2: Pending Maintenance */}
        <div
          onClick={() => onNavigateTab('maintenance')}
          className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm hover:shadow-md hover:border-gray-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
              Maintenance Tasks
            </span>
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition">
              <Wrench className="h-4 w-4 text-gray-900" />
            </div>
          </div>
          <span className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mt-4 block tracking-tight">
            {pendingTasks.length}
          </span>
          <span className="text-xs text-gray-600 mt-3 block font-medium">
            {pendingTasks.length > 0 ? 'Action required soon' : 'All systems serviced'}
          </span>
        </div>

        {/* Metric 3: Active Warranties */}
        <div
          onClick={() => onNavigateTab('appliances')}
          className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm hover:shadow-md hover:border-gray-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
              Active Warranties
            </span>
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition">
              <ShieldCheck className="h-4 w-4 text-gray-900" />
            </div>
          </div>
          <span className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mt-4 block tracking-tight">
            {stats?.activeWarrantiesCount || appliances.filter((a) => a.warranty_status === 'active').length}
          </span>
          <span className="text-xs text-gray-600 mt-3 block font-medium">
            {expiringAppliances.length > 0 ? `${expiringAppliances.length} expiring soon` : 'Full protection active'}
          </span>
        </div>

        {/* Metric 4: Estimated Energy */}
        <div
          onClick={() => onNavigateTab('energy')}
          className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm hover:shadow-md hover:border-gray-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
              Monthly Energy
            </span>
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition">
              <Zap className="h-4 w-4 text-gray-900" />
            </div>
          </div>
          <span className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mt-4 block tracking-tight">
            {stats?.monthlyEstimatedKwh || 124} <span className="text-xl font-normal text-gray-500">kWh</span>
          </span>
          <span className="text-xs text-gray-600 mt-3 block font-medium">
            Est. ₹{Math.round((stats?.monthlyEstimatedKwh || 124) * 7.5)} tariff projection
          </span>
        </div>
      </div>

      {/* Main Dual Grid: Urgent Actions & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
        {/* Left 2 Cols: Upcoming Maintenance & Appliances at a Glance */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">
          {/* Urgent Maintenance Tasks */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-900 text-xs font-bold uppercase tracking-widest">
                  <Wrench className="h-4 w-4 text-gray-900" />
                  <span>Preventive Servicing & Schedules</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-gray-900">
                  Upcoming Maintenance Tasks
                </h2>
              </div>
              <button
                onClick={onOpenAddMaintenance}
                className="self-start sm:self-auto flex items-center gap-2 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-12 px-6 text-center bg-gray-50/70 rounded-2xl border border-gray-200">
                <CheckCircle2 className="w-10 h-10 text-gray-900 mx-auto mb-3" />
                <p className="text-base font-bold text-gray-900">
                  All maintenance schedules are up to date
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium max-w-md mx-auto leading-relaxed">
                  Your home equipment, filters, and mechanical assets are operating in good standing.
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {pendingTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-gray-100/70 hover:border-gray-300 transition-all gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                            task.priority === 'high' || task.priority === 'critical'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : task.priority === 'medium'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-gray-100 text-gray-900 border-gray-300'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                        <h4 className="text-base font-bold text-gray-900">
                          {task.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                        {task.description}
                      </p>
                      {task.due_date && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-bold pt-1 font-mono">
                          <Calendar className="w-4 h-4 text-gray-900" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all shrink-0 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Done</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => onNavigateTab('maintenance')}
                className="text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-black flex items-center gap-1.5 transition"
              >
                <span>View all {tasks.length} maintenance schedules</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Appliances Overview */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-900 text-xs font-bold uppercase tracking-widest">
                  <Cpu className="h-4 w-4 text-gray-900" />
                  <span>Asset Registry</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-gray-900">
                  Appliance Inventory
                </h2>
              </div>
              <button
                onClick={onOpenAddAppliance}
                className="self-start sm:self-auto flex items-center gap-2 rounded-2xl bg-gray-900 hover:bg-gray-800 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Appliance</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {appliances.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                          {app.category}
                        </span>
                        <h4 className="text-base font-bold text-gray-900 line-clamp-1">
                          {app.name}
                        </h4>
                        <p className="text-xs text-gray-600 font-medium">
                          {app.brand || 'Appliance'} • {app.model || 'Standard'}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                          app.warranty_status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : app.warranty_status === 'expiring_soon'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                        }`}
                      >
                        {app.warranty_status === 'active'
                          ? 'Warranty OK'
                          : app.warranty_status === 'expiring_soon'
                          ? 'Expiring'
                          : 'Expired'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-700">
                    <span className="font-mono">Power: {app.power_consumption || 500}W</span>
                    <span className="font-mono font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">{app.energy_rating || '5-Star'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => onNavigateTab('appliances')}
                className="text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-black flex items-center gap-1.5 transition"
              >
                <span>Explore all {appliances.length} connected appliances</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Advisor & Smart Energy */}
        <div className="space-y-8 sm:space-y-10">
          {/* AI Home Genie Advisor Box */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2.5 bg-gray-900 text-white rounded-2xl shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">AI Recommendations</h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">Optimized for {currentHome?.name || 'your home'}</p>
              </div>
            </div>

            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-gray-100/70 hover:border-gray-300 transition-all space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gray-200 text-gray-900 border border-gray-300">
                      {rec.category}
                    </span>
                    <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{rec.title}</h5>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-normal">{rec.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenAssistantChat}
              className="mt-6 w-full py-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2.5 shadow-sm hover:shadow active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-gray-300" />
              <span>Open Genie Assistant</span>
            </button>
          </div>

          {/* Quick Vision Photo Scanner Promo */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 text-gray-900 rounded-2xl border border-gray-300 shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-gray-900">
                  Instant Appliance Vision
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  Snap or upload a photo of your AC, refrigerator, or equipment plate to automatically extract model details and maintenance guides.
                </p>
                <button
                  onClick={onOpenVisionScan}
                  className="pt-2 text-xs font-bold uppercase tracking-wider text-gray-900 hover:underline flex items-center gap-1 transition"
                >
                  <span>Launch Scanner</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
