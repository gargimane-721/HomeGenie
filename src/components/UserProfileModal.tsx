import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [name, setName] = useState<string>(user.name);
  const [phone, setPhone] = useState<string>(user.phone || '');
  const [city, setCity] = useState<string>(user.city || '');
  const [unitPreference, setUnitPreference] = useState<'sqft' | 'sqm'>(user.unitPreference || 'sqft');
  const [vastuPreference, setVastuPreference] = useState<'Strict' | 'High' | 'None'>(user.vastuPreference || 'Strict');
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile({
        name,
        phone,
        city,
        unitPreference,
        vastuPreference,
      });
      onUpdateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl p-6 sm:p-8 text-gray-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-300 text-gray-900 font-bold text-lg font-heading">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-900">{user.name}</h3>
            <p className="text-xs text-gray-900 font-medium">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:border-gray-900 focus:outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:border-gray-900 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:border-gray-900 focus:outline-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1">Default Unit</label>
              <select
                value={unitPreference}
                onChange={(e) => setUnitPreference(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:border-gray-900 focus:outline-none font-bold"
              >
                <option value="sqft">Square Feet (sq.ft)</option>
                <option value="sqm">Square Meters (sq.m)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-1">Vastu Priority</label>
              <select
                value={vastuPreference}
                onChange={(e) => setVastuPreference(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:border-gray-900 focus:outline-none font-bold"
              >
                <option value="Strict">Strict (100% Alignment)</option>
                <option value="High">High (Recommended)</option>
                <option value="None">None (Modern Free)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onLogout}
              className="text-xs text-rose-700 hover:underline font-bold uppercase tracking-wider"
            >
              Sign Out
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 hover:bg-black px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Profile Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
