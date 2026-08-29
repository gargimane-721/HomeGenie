import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  Trash2,
  Filter,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  X,
  Building,
} from 'lucide-react';
import { MaintenanceTask, Home, Appliance } from '../../types';
import { api } from '../../services/api';

interface MaintenanceTrackerProps {
  currentHome: Home | null;
  onOpenAssistantChat: () => void;
}

export const MaintenanceTracker: React.FC<MaintenanceTrackerProps> = ({
  currentHome,
  onOpenAssistantChat,
}) => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    appliance_id: '',
    priority: 'medium' as MaintenanceTask['priority'],
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  useEffect(() => {
    loadTasks();
  }, [currentHome?.id]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const homeId = currentHome?.id;
      const [taskList, appList] = await Promise.all([
        api.getMaintenanceTasks(homeId),
        api.getAppliances(homeId),
      ]);
      setTasks(taskList || []);
      setAppliances(appList || []);
    } catch (err) {
      console.error('Failed to load maintenance tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !currentHome) return;

    try {
      await api.createMaintenanceTask({
        ...formData,
        home_id: currentHome.id,
      });
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        description: '',
        appliance_id: '',
        priority: 'medium',
        due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      });
      loadTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.completeMaintenanceTask(id, currentHome?.id);
      loadTasks();
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this maintenance task?')) {
      await api.deleteMaintenanceTask(id);
      loadTasks();
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && t.status !== 'completed') ||
      (statusFilter === 'completed' && t.status === 'completed');

    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900 text-xs font-bold uppercase tracking-widest">
            <Wrench className="h-4 w-4 text-gray-900" />
            <span>Preventive Maintenance Operations</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
            Servicing & Routine Upkeep
          </h2>
          <p className="text-sm text-gray-700 font-normal max-w-2xl leading-relaxed">
            Schedule filter cleanings, RO membrane replacements, condenser coil audits, and solar panel checkups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={onOpenAssistantChat}
            className="flex items-center gap-2.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm transition-all"
          >
            <Sparkles className="h-4 w-4 text-gray-900" />
            <span>AI Care Advice</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-4 w-4 text-gray-200" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs matching website CSS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-sm">
        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
              statusFilter === 'pending'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Actionable ({tasks.filter((t) => t.status !== 'completed').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
              statusFilter === 'completed'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Completed ({tasks.filter((t) => t.status === 'completed').length})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
              statusFilter === 'all'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Logs ({tasks.length})
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 hidden sm:inline">
            Priority:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50/50 hover:bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-900 shadow-xs transition cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">
            No Maintenance Tasks In This View
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto font-normal leading-relaxed">
            Everything is in order! Click 'New Task' to schedule recurring servicing for any home appliance.
          </p>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {filteredTasks.map((task) => {
            const appObj = appliances.find((a) => a.id === task.appliance_id);
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`p-7 sm:p-8 rounded-3xl border transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  isCompleted
                    ? 'border-gray-200 bg-gray-50/70 opacity-75'
                    : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        task.priority === 'critical' || task.priority === 'high'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : task.priority === 'medium'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      {task.priority} Priority
                    </span>

                    {appObj && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-900 border border-gray-300">
                        {appObj.name}
                      </span>
                    )}

                    {isCompleted && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-lg font-bold text-gray-900 ${
                      isCompleted ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-3xl font-normal">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600 font-medium pt-2">
                    {task.due_date && (
                      <div className="flex items-center gap-2 font-mono font-bold text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-900" />
                        <span>Due: {new Date(task.due_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {task.completed_at && (
                      <div className="flex items-center gap-2 font-mono text-emerald-800 font-bold">
                        <Clock className="w-4 h-4" />
                        <span>Completed on {new Date(task.completed_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  {!isCompleted && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Done</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-3 rounded-2xl text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition border border-gray-200"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-gray-900" />
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  Schedule Maintenance Task
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Clean AC Dust Filter"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                  Related Appliance
                </label>
                <select
                  value={formData.appliance_id}
                  onChange={(e) => setFormData({ ...formData, appliance_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                >
                  <option value="">General Home Maintenance</option>
                  {appliances.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name} ({app.brand || app.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                  Task Instructions / Technician Checklist
                </label>
                <textarea
                  rows={3}
                  placeholder="Instructions for technician or self-servicing checklist..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest shadow-sm transition"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
