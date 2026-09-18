import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import api from '../services/api';
import {
  Stethoscope,
  Activity,
  HeartHandshake,
  ShieldPlus,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success) setServices(res.data.data);
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold tracking-wider uppercase text-teal-600 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
          Clinical & Assistance Services
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Personalized Home Healthcare Services
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Certified healthcare professionals providing dignified nursing, daily living assistance, and physical therapy in the comfort of home.
        </p>
      </div>

      {/* Services Detailed List */}
      <div className="space-y-10">
        {services.map((srv, index) => {
          const Icon = getServiceIcon(srv.icon);
          let features: string[] = [];
          try {
            features = typeof srv.features === 'string' ? JSON.parse(srv.features) : srv.features || [];
          } catch (e) {
            features = [];
          }

          const isEven = index % 2 === 0;

          return (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column Info */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{srv.title}</h2>
                    <span className="text-xs font-semibold text-teal-700">Home-Based Clinical Service</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{srv.description}</p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span className="font-semibold">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column Pricing & Action */}
              <div className="lg:col-span-4 bg-teal-50/60 rounded-3xl p-6 border border-teal-100 text-center space-y-5">
                <div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Transparent Rates</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    ${srv.baseHourlyRate}
                    <span className="text-xs font-semibold text-slate-500"> / hour</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">
                    or ${srv.baseDailyRate} / full day
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/caregivers?service=${encodeURIComponent(srv.title)}`}
                    className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all active:scale-95"
                  >
                    <span>Find {srv.title} Caregivers</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/caregivers"
                    className="block text-xs font-semibold text-teal-700 hover:underline py-1"
                  >
                    View certified practitioner profiles
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
