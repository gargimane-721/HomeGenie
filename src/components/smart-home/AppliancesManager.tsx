import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Calendar,
  Trash2,
  Edit2,
  Camera,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Building,
  Info,
} from 'lucide-react';
import { Appliance, Home, HomeRoom } from '../../types';
import { api } from '../../services/api';

interface AppliancesManagerProps {
  currentHome: Home | null;
  onOpenVisionScan: () => void;
}

const APPLIANCE_CATEGORIES = [
  'All',
  'HVAC / Air Conditioner',
  'Refrigeration',
  'Laundry',
  'Water Purification',
  'Kitchen / Cooking',
  'Solar & Inverter Backup',
  'Water Heater / Geyser',
  'Smart Lighting & Automation',
];

export const AppliancesManager: React.FC<AppliancesManagerProps> = ({
  currentHome,
  onOpenVisionScan,
}) => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [rooms, setRooms] = useState<HomeRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState('All');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'HVAC / Air Conditioner',
    room_id: '',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: new Date().toISOString().split('T')[0],
    warranty_expiry: '',
    energy_rating: '5-Star',
    power_consumption: 1000,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [currentHome?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const homeId = currentHome?.id;
      const [appList, roomList] = await Promise.all([
        api.getAppliances(homeId),
        homeId ? api.getRooms(homeId) : Promise.resolve([]),
      ]);
      setAppliances(appList || []);
      setRooms(roomList || []);
    } catch (err) {
      console.error('Failed to load appliances:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (applianceToEdit?: Appliance) => {
    if (applianceToEdit) {
      setEditingAppliance(applianceToEdit);
      setFormData({
        name: applianceToEdit.name,
        category: applianceToEdit.category,
        room_id: applianceToEdit.room_id || '',
        brand: applianceToEdit.brand || '',
        model: applianceToEdit.model || '',
        serial_number: applianceToEdit.serial_number || '',
        purchase_date: applianceToEdit.purchase_date || '',
        warranty_expiry: applianceToEdit.warranty_expiry || '',
        energy_rating: applianceToEdit.energy_rating || '5-Star',
        power_consumption: applianceToEdit.power_consumption || 1000,
        notes: applianceToEdit.notes || '',
      });
    } else {
      setEditingAppliance(null);
      setFormData({
        name: '',
        category: 'HVAC / Air Conditioner',
        room_id: rooms[0]?.id || '',
        brand: '',
        model: '',
        serial_number: '',
        purchase_date: new Date().toISOString().split('T')[0],
        warranty_expiry: '',
        energy_rating: '5-Star',
        power_consumption: 1000,
        notes: '',
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveAppliance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !currentHome) return;

    try {
      if (editingAppliance) {
        await api.updateAppliance(editingAppliance.id, {
          ...formData,
          home_id: currentHome.id,
        });
      } else {
        await api.createAppliance({
          ...formData,
          home_id: currentHome.id,
        });
      }
      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save appliance:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this appliance?')) {
      await api.deleteAppliance(id);
      loadData();
    }
  };

  const filteredAppliances = appliances.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.brand && app.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.model && app.model.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || app.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesRoom = selectedRoom === 'All' || app.room_id === selectedRoom;

    return matchesSearch && matchesCategory && matchesRoom;
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900 text-xs font-bold uppercase tracking-widest">
            <Cpu className="h-4 w-4 text-gray-900" />
            <span>Connected Asset Directory</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
            Appliances & Assets
          </h2>
          <p className="text-sm text-gray-700 font-normal max-w-2xl leading-relaxed">
            Track warranties, power specs, serial numbers, and maintenance lifecycle for {currentHome?.name || 'your home'}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={onOpenVisionScan}
            className="flex items-center gap-2.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm transition-all"
          >
            <Camera className="h-4 w-4 text-gray-900" />
            <span>AI Scan Photo</span>
          </button>
          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-4 w-4 text-gray-200" />
            <span>Add Appliance</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with spacious padding */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by brand, name or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 hover:bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 shadow-xs transition"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50/50 hover:bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-900 shadow-xs transition cursor-pointer"
          >
            {APPLIANCE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Room Filter */}
        <div className="relative">
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50/50 hover:bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-900 shadow-xs transition cursor-pointer"
          >
            <option value="All">All Rooms / Zones</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.floor})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appliances Grid */}
      {filteredAppliances.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
          <Cpu className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">
            No Appliances Found
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto font-normal leading-relaxed">
            Try adjusting your search criteria or register a new appliance asset using the Add button or AI Photo Scanner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAppliances.map((app) => {
            const roomObj = rooms.find((r) => r.id === app.room_id);
            return (
              <div
                key={app.id}
                className="bg-white border border-gray-200 rounded-3xl p-7 sm:p-8 hover:border-gray-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                        {app.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-0.5 line-clamp-1">
                        {app.name}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">
                        {app.brand} {app.model && `• ${app.model}`}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
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

                  {/* Room & Specs with clean whitespace */}
                  <div className="mt-6 pt-5 border-t border-gray-100 space-y-3.5 text-xs text-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-700" />
                        Room Location
                      </span>
                      <span className="font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                        {roomObj?.name || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gray-700" />
                        Power & Rating
                      </span>
                      <span className="font-mono font-bold text-gray-900">
                        {app.power_consumption}W • {app.energy_rating}
                      </span>
                    </div>

                    {app.warranty_expiry && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-700" />
                          Warranty Till
                        </span>
                        <span className="font-mono font-bold text-gray-900">
                          {new Date(app.warranty_expiry).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    {app.notes && (
                      <p className="text-xs text-gray-700 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-200 mt-3 font-normal leading-relaxed">
                        "{app.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAddModal(app)}
                      className="p-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition border border-gray-200"
                      title="Edit Appliance"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-2 rounded-xl text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition border border-gray-200"
                      title="Delete Appliance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                    ID: {app.id.slice(0, 7)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Appliance Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-gray-900" />
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  {editingAppliance ? 'Edit Appliance' : 'Register New Appliance'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAppliance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                  Appliance Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom Inverter AC"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  >
                    {APPLIANCE_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Room Location
                  </label>
                  <select
                    value={formData.room_id}
                    onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  >
                    <option value="">Select Room...</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.floor})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Daikin, LG, Havells"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Model Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FTKM50U"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Energy Rating
                  </label>
                  <select
                    value={formData.energy_rating}
                    onChange={(e) => setFormData({ ...formData, energy_rating: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  >
                    <option value="5-Star BEE">5-Star BEE</option>
                    <option value="4-Star BEE">4-Star BEE</option>
                    <option value="3-Star BEE">3-Star BEE</option>
                    <option value="Inverter Dual">Inverter Dual</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Rated Wattage (W)
                  </label>
                  <input
                    type="number"
                    value={formData.power_consumption}
                    onChange={(e) => setFormData({ ...formData, power_consumption: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                    Warranty Expiry
                  </label>
                  <input
                    type="date"
                    value={formData.warranty_expiry}
                    onChange={(e) => setFormData({ ...formData, warranty_expiry: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-900 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">
                  Service Notes / Serial Number
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. SN: LG-9923841, filter replaced by technician on 12 Jan"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  {editingAppliance ? 'Update Asset' : 'Save Appliance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
