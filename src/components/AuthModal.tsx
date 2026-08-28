import React, { useState } from 'react';
import { Compass, Mail, Lock, User, Sparkles, X, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('arjun.mehta@example.com');
  const [password, setPassword] = useState<string>('password123');
  const [name, setName] = useState<string>('Arjun Mehta');
  const [city, setCity] = useState<string>('Bengaluru, Karnataka');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await api.register({ name, email, phone, city, password });
        if (res.error) {
          setError(res.error);
        } else {
          onSuccess(res.user);
          onClose();
        }
      } else {
        const res = await api.login({ email, password });
        if (res.error) {
          setError(res.error);
        } else {
          onSuccess(res.user);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await api.login({ email: 'arjun.mehta@example.com' });
      onSuccess(res.user);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl p-6 sm:p-8 text-gray-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 border border-gray-300 text-gray-900">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-900">
              {isRegister ? 'Create HomeGenie Account' : 'Welcome to HomeGenie'}
            </h3>
            <p className="text-xs text-gray-900 font-medium">
              {isRegister ? 'Start designing your architectural house plan' : 'Sign in to access your CAD projects'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <>
              <div>
                <label className="text-xs font-bold text-[#283618] uppercase tracking-wider block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1E2915]/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Mehta"
                    className="w-full rounded-lg border border-[#E7DDCA] bg-[#F3ECE0] pl-9 pr-4 py-2 text-xs text-[#1E2915] focus:border-[#283618] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#283618] uppercase tracking-wider block mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full rounded-lg border border-[#E7DDCA] bg-[#F3ECE0] px-3 py-2 text-xs text-[#1E2915] focus:border-[#283618] focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#283618] uppercase tracking-wider block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full rounded-lg border border-[#E7DDCA] bg-[#F3ECE0] px-3 py-2 text-xs text-[#1E2915] focus:border-[#283618] focus:outline-none font-medium"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-[#283618] uppercase tracking-wider block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1E2915]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-[#E7DDCA] bg-[#F3ECE0] pl-9 pr-4 py-2 text-xs text-[#1E2915] focus:border-[#283618] focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#283618] uppercase tracking-wider block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1E2915]/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E7DDCA] bg-[#F3ECE0] pl-9 pr-4 py-2 text-xs text-[#1E2915] focus:border-[#283618] focus:outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#283618] hover:bg-[#1E2915] py-2.5 text-xs font-bold uppercase tracking-wider text-[#FAF7F0] shadow-sm disabled:opacity-50 transition-colors"
          >
            <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Quick Sign-in */}
        <div className="mt-4 pt-4 border-t border-[#E7DDCA]">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#283618]/30 bg-[#283618]/10 py-2 text-xs font-bold text-[#1E2915] hover:bg-[#283618]/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#283618]" />
            <span>One-Click Demo Sign-in (Arjun Mehta)</span>
          </button>
        </div>

        {/* Toggle between Login and Register */}
        <div className="mt-4 text-center text-xs text-[#1E2915]/70 font-medium">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsRegister(false)}
                className="text-[#283618] font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setIsRegister(true)}
                className="text-[#283618] font-bold hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
