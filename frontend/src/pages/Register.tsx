import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, User, ShieldCheck, Mail, Lock, Phone, MapPin } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'FAMILY' | 'CAREGIVER'>('FAMILY');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('New York');
  const [address, setAddress] = useState('');

  // Caregiver extra fields
  const [title, setTitle] = useState('Certified Nursing Assistant (CNA)');
  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState('3');
  const [hourlyRate, setHourlyRate] = useState('30');
  const [documentName, setDocumentName] = useState('State Nursing Board License');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Full name, email, and password are required.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const payload: any = {
        fullName,
        email,
        password,
        role,
        phone,
        city,
        address,
      };

      if (role === 'CAREGIVER') {
        payload.caregiverDetails = {
          title,
          bio: bio || 'Dedicated caregiver providing personalized, high-quality assistance.',
          yearsExperience: Number(yearsExperience),
          hourlyRate: Number(hourlyRate),
          dailyRate: Number(hourlyRate) * 7,
          qualifications: [title],
          specializations: ['Elderly Care', 'Vitals Monitoring'],
          serviceAreas: [city],
          documentName,
        };
      }

      const success = await register(payload);
      if (success) {
        if (role === 'CAREGIVER') navigate('/caregiver/dashboard');
        else navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              Elder<span className="text-teal-600">Care</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900">Join the ElderCare Platform</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your account role to get started
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRole('FAMILY')}
            className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              role === 'FAMILY'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>Family / Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('CAREGIVER')}
            className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              role === 'CAREGIVER'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Caregiver / Nurse</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Robert Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New York"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* If Caregiver role */}
            {role === 'CAREGIVER' && (
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 space-y-3 pt-4 mt-4">
                <div className="text-xs font-extrabold text-teal-900 uppercase tracking-wider">
                  Professional Caregiver Credentials
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Registered Nurse (RN)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Yrs)</label>
                      <input
                        type="number"
                        min="1"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate ($)</label>
                      <input
                        type="number"
                        min="15"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Verification Document Name</label>
                  <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="e.g. State Nursing License #NY-12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 active:scale-95"
            >
              {isLoading ? 'Creating Account...' : `Register as ${role === 'CAREGIVER' ? 'Caregiver' : 'Family Member'}`}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-700 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
