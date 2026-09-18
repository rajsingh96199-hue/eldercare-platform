import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSeniorMode } from '../contexts/SeniorModeContext';
import { CaregiverCard } from '../components/CaregiverCard';
import { Service, CaregiverProfile } from '../types';
import api from '../services/api';
import {
  Heart,
  ShieldCheck,
  Stethoscope,
  Activity,
  HeartHandshake,
  ShieldPlus,
  Star,
  Users,
  Clock,
  Award,
  ArrowRight,
  PhoneCall,
  Search,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  CalendarCheck,
  FileCheck,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user, isFamily } = useAuth();
  const { isSeniorMode, toggleSeniorMode } = useSeniorMode();
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [featuredCaregivers, setFeaturedCaregivers] = useState<CaregiverProfile[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, caregiversRes] = await Promise.all([
          api.get('/services'),
          api.get('/caregivers?isVerified=true'),
        ]);
        if (servicesRes.data.success) setServices(servicesRes.data.data);
        if (caregiversRes.data.success) setFeaturedCaregivers(caregiversRes.data.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedService) params.append('service', selectedService);
    if (selectedCity) params.append('city', selectedCity);
    navigate(`/caregivers?${params.toString()}`);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return Stethoscope;
      case 'Activity':
        return Activity;
      case 'ShieldPlus':
        return ShieldPlus;
      default:
        return HeartHandshake;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-slate-50 to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>100% Verified & Background-Checked Home Healthcare</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Dignified, Compassionate <br className="hidden sm:inline" />
                <span className="text-teal-600">Elderly Nursing</span> & In-Home Care
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Connecting aging parents and families with certified nurses, physiotherapists, and dedicated attendants. Real-time daily health vitals tracking, personalized care notes, and complete peace of mind.
              </p>

              {/* Quick Search Widget */}
              <form
                onSubmit={handleSearch}
                className="bg-white p-3.5 sm:p-4 rounded-3xl shadow-xl border border-slate-200/80 flex flex-col sm:flex-row gap-3 max-w-2xl"
              >
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Select Care Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  >
                    <option value="">All Caregiver Specializations</option>
                    <option value="Nursing Care">Skilled Nursing Care</option>
                    <option value="Elderly Attendant">Elderly Care Attendant</option>
                    <option value="Physiotherapy">Geriatric Physiotherapy</option>
                    <option value="Post-Hospital Care">Post-Hospital Recovery</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Location / City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  >
                    <option value="">All Service Areas</option>
                    <option value="New York">New York (Manhattan/Brooklyn)</option>
                    <option value="Queens">Queens</option>
                    <option value="Midtown">Midtown</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="sm:self-end px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/30 transition-all active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>

              {/* Trust Metrics Pill */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-extrabold">24/7 Verified</div>
                    <div className="text-slate-500 text-[10px]">Medical License Checks</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-extrabold">4.9 / 5 Rating</div>
                    <div className="text-slate-500 text-[10px]">Over 1,200+ Family Reviews</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-extrabold">Daily Vitals Log</div>
                    <div className="text-slate-500 text-[10px]">Instant Family App Alerts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                  alt="Compassionate nurse helping senior"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Floating Real-time Vitals Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-900">Active Care Session</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      Nurse Sarah, RN
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[10px] text-slate-500 font-medium">Blood Pressure</div>
                      <div className="text-xs font-extrabold text-slate-900">124/82</div>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[10px] text-slate-500 font-medium">Blood Sugar</div>
                      <div className="text-xs font-extrabold text-slate-900">108 mg/dL</div>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[10px] text-slate-500 font-medium">SpO2</div>
                      <div className="text-xs font-extrabold text-emerald-600">99%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Senior Accessibility Mode Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Senior-Friendly Accessibility Mode</h3>
              <p className="text-xs sm:text-sm text-teal-200 mt-1 max-w-xl">
                Designed specifically for elderly users and families: high-contrast text, oversized touch buttons, simple navigation, and text-to-speech audio reader.
              </p>
            </div>
          </div>

          <button
            onClick={toggleSeniorMode}
            className={`px-6 py-3.5 rounded-2xl text-sm font-extrabold transition-all shadow-lg flex-shrink-0 ${
              isSeniorMode
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-white text-teal-900 hover:bg-teal-50'
            }`}
          >
            {isSeniorMode ? '✓ Senior Mode is ON' : 'Turn On Senior Mode'}
          </button>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold tracking-wider uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Specialized Care Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Comprehensive Healthcare at Your Doorstep
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            From licensed clinical nursing and medication administration to daily companionship and post-surgical rehab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv) => {
            const Icon = getServiceIcon(srv.icon);
            let features: string[] = [];
            try {
              features = typeof srv.features === 'string' ? JSON.parse(srv.features) : srv.features || [];
            } catch (e) {
              features = [];
            }

            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-extrabold text-xl text-slate-900 mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{srv.shortDesc}</p>

                  <div className="space-y-1.5 mb-6">
                    {features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">From</span>
                    <div className="text-base font-black text-slate-900">
                      ${srv.baseHourlyRate}
                      <span className="text-xs font-medium text-slate-500">/hr</span>
                    </div>
                  </div>

                  <Link
                    to={`/caregivers?service=${encodeURIComponent(srv.title)}`}
                    className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-teal-600 text-slate-700 group-hover:text-white transition-all shadow-xs"
                    title={`Browse ${srv.title} caregivers`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-wider uppercase text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
              How ElderCare Works for Your Family
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative p-6 bg-slate-800/60 rounded-3xl border border-slate-700/60">
              <div className="text-3xl font-black text-teal-400 mb-3">01</div>
              <h4 className="text-lg font-bold text-white mb-2">Create Patient Profile</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Add your aging parent or relative's medical history, mobility status, medication checklist, and physician contacts.
              </p>
            </div>

            <div className="relative p-6 bg-slate-800/60 rounded-3xl border border-slate-700/60">
              <div className="text-3xl font-black text-teal-400 mb-3">02</div>
              <h4 className="text-lg font-bold text-white mb-2">Select Verified Caregiver</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter through state-licensed nurses, physiotherapists, and attendants by ratings, experience, languages, and hourly pricing.
              </p>
            </div>

            <div className="relative p-6 bg-slate-800/60 rounded-3xl border border-slate-700/60">
              <div className="text-3xl font-black text-teal-400 mb-3">03</div>
              <h4 className="text-lg font-bold text-white mb-2">Live Visit Tracking</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Track caregiver arrival on your dashboard from "On The Way" to "Arrived" and "In Progress" in real time.
              </p>
            </div>

            <div className="relative p-6 bg-slate-800/60 rounded-3xl border border-slate-700/60">
              <div className="text-3xl font-black text-teal-400 mb-3">04</div>
              <h4 className="text-lg font-bold text-white mb-2">Daily Vitals & Notes</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive instant clinical notes, blood pressure logs, and medication alerts recorded directly by the visiting nurse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Caregivers */}
      {featuredCaregivers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Top Rated Personnel
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                Featured Verified Caregivers
              </h2>
            </div>

            <Link
              to="/caregivers"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 group"
            >
              <span>View All Caregivers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCaregivers.map((cg) => (
              <CaregiverCard key={cg.id} caregiver={cg} />
            ))}
          </div>
        </section>
      )}

      {/* Trust & Safety Verification Standards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-50/80 rounded-3xl p-8 sm:p-12 border border-teal-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Our 5-Layer Safety & Verification Process
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We never compromise on safety. Every nurse and attendant on ElderCare undergoes rigorous multi-step credentialing before accepting their first home visit.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-extrabold text-teal-800 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  State License Verification
                </div>
                <p className="text-xs text-slate-500">
                  Cross-checked with state medical boards for active RN, LPN, and DPT licenses.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-extrabold text-teal-800 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  National Criminal Background
                </div>
                <p className="text-xs text-slate-500">
                  Comprehensive 7-year multi-state criminal record and sex offender registry screenings.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-extrabold text-teal-800 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Identity & Right-to-Work
                </div>
                <p className="text-xs text-slate-500">
                  Govt Real ID, passport biometric authentication and SSN verification.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-extrabold text-teal-800 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  CPR & BLS Life Support
                </div>
                <p className="text-xs text-slate-500">
                  Mandatory active Basic Life Support and CPR emergency readiness certification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Everything you need to know about booking elderly home nursing on ElderCare
          </p>
        </div>

        <div className="space-y-4">
          <details className="bg-white rounded-2xl border border-slate-200 p-5 group open:shadow-md transition-all">
            <summary className="font-bold text-sm text-slate-900 cursor-pointer flex items-center justify-between">
              <span>Is ElderCare an emergency ambulance or hospital dispatch service?</span>
              <span className="text-teal-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
              No. ElderCare is designed for scheduled in-home nursing, physical therapy, and daily caregiving assistance. For life-threatening emergencies, call 911 or visit your closest emergency department immediately.
            </p>
          </details>

          <details className="bg-white rounded-2xl border border-slate-200 p-5 group open:shadow-md transition-all">
            <summary className="font-bold text-sm text-slate-900 cursor-pointer flex items-center justify-between">
              <span>Can I book hourly, daily, or long-term nursing assistance?</span>
              <span className="text-teal-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
              Yes! We support flexible hourly visits (e.g. 4-hour wound dressings or physical therapy sessions), full-day 8-12 hour attendant shifts, as well as recurring long-term care plans.
            </p>
          </details>

          <details className="bg-white rounded-2xl border border-slate-200 p-5 group open:shadow-md transition-all">
            <summary className="font-bold text-sm text-slate-900 cursor-pointer flex items-center justify-between">
              <span>How do family members stay updated on health vitals?</span>
              <span className="text-teal-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
              Visiting caregivers record vitals (blood pressure, blood sugar, oxygen levels, pulse) and notes regarding medications administered directly onto the patient portal after each visit. Family members receive real-time notifications.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
