import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Lock, Mail, Sparkles, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, fastDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const success = await login(email, password);
      if (success) {
        // Redirect based on stored user role or default dashboard
        const storedUser = JSON.parse(localStorage.getItem('eldercare_user') || '{}');
        if (storedUser.role === 'ADMIN') navigate('/admin');
        else if (storedUser.role === 'CAREGIVER') navigate('/caregiver/dashboard');
        else navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'family' | 'caregiver' | 'admin') => {
    try {
      setIsLoading(true);
      setError('');
      await fastDemoLogin(role);
      if (role === 'admin') navigate('/admin');
      else if (role === 'caregiver') navigate('/caregiver/dashboard');
      else navigate('/dashboard');
    } catch (err: any) {
      setError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              Elder<span className="text-teal-600">Care</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access patient profiles, caregiver notes, and bookings
          </p>
        </div>

        {/* Demo Fast Login Box */}
        <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Instant Demo Logins (1-Click Switch)</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('family')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300/80 text-[11px] font-bold text-slate-800 transition-all shadow-xs flex flex-col items-center text-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Family Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('caregiver')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300/80 text-[11px] font-bold text-slate-800 transition-all shadow-xs flex flex-col items-center text-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Nurse Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300/80 text-[11px] font-bold text-slate-800 transition-all shadow-xs flex flex-col items-center text-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 active:scale-95"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-teal-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
