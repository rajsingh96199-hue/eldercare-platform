import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CaregiverProfile } from '../types';
import api from '../services/api';
import {
  ShieldCheck,
  Star,
  Award,
  MapPin,
  Clock,
  Languages,
  CheckCircle2,
  Calendar,
  Heart,
  FileCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const CaregiverDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caregiver, setCaregiver] = useState<CaregiverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/caregivers/${id}`);
        if (res.data.success) {
          setCaregiver(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load caregiver:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCaregiver();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading practitioner profile...</p>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Caregiver Not Found</h2>
        <Link to="/caregivers" className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs">
          Return to Directory
        </Link>
      </div>
    );
  }

  let qualifications: string[] = [];
  try {
    qualifications = typeof caregiver.qualifications === 'string'
      ? JSON.parse(caregiver.qualifications)
      : caregiver.qualifications || [];
  } catch (e) {
    qualifications = [];
  }

  let specializations: string[] = [];
  try {
    specializations = typeof caregiver.specializations === 'string'
      ? JSON.parse(caregiver.specializations)
      : caregiver.specializations || [];
  } catch (e) {
    specializations = [];
  }

  let serviceAreas: string[] = [];
  try {
    serviceAreas = typeof caregiver.serviceAreas === 'string'
      ? JSON.parse(caregiver.serviceAreas)
      : caregiver.serviceAreas || [];
  } catch (e) {
    serviceAreas = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Avatar & Basics */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={
                caregiver.user?.avatar ||
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'
              }
              alt={caregiver.user?.fullName}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-teal-100 shadow-md"
            />
            {caregiver.isAvailable && (
              <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase border-2 border-white shadow-xs">
                Available
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {caregiver.user?.fullName}
              </h1>
              {caregiver.isVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  Verified Healthcare Provider
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-teal-700">{caregiver.title}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {caregiver.ratingAvg.toFixed(1)} ({caregiver.ratingCount} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-slate-400" />
                {caregiver.yearsExperience} Years Clinical Experience
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Languages className="w-4 h-4 text-slate-400" />
                {caregiver.languages}
              </span>
            </div>

            {serviceAreas.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Service Radius: {serviceAreas.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Card & Booking Button */}
        <div className="lg:col-span-4 bg-teal-50/70 p-6 rounded-3xl border border-teal-100 text-center space-y-4">
          <div>
            <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider">Standard Pricing</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              ${caregiver.hourlyRate}
              <span className="text-xs font-semibold text-slate-500"> / hour</span>
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              ${caregiver.dailyRate} for 8-10 hr daily shift
            </div>
          </div>

          <Link
            to={`/book?caregiverId=${caregiver.userId || caregiver.id}`}
            className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition-all active:scale-95"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[10px] text-slate-500">Zero cancellation fees if cancelled &gt; 24h prior</p>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Biography */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
            <h3 className="text-lg font-bold text-slate-900 mb-3">About the Caregiver</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {caregiver.bio}
            </p>
          </div>

          {/* Clinical Qualifications & Licensure */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600" />
              <span>Verified Qualifications & Board Licenses</span>
            </h3>

            <div className="space-y-3">
              {qualifications.map((q, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Reviews List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Verified Patient & Family Reviews ({caregiver.reviewsReceived?.length || 0})
              </h3>
              <div className="flex items-center gap-1 text-sm font-extrabold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{caregiver.ratingAvg.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {caregiver.reviewsReceived && caregiver.reviewsReceived.length > 0 ? (
              <div className="space-y-4">
                {caregiver.reviewsReceived.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                          {rev.user?.fullName?.charAt(0) || 'F'}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.user?.fullName || 'Family Client'}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic font-serif">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No reviews submitted yet.</p>
            )}
          </div>
        </div>

        {/* Right Column Specializations & Badges */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Clinical Specializations
            </h4>
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-100"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>ElderCare Trust Pledge</span>
            </div>
            <h4 className="text-base font-bold">100% Background Screened</h4>
            <p className="text-xs text-teal-200 leading-relaxed">
              This caregiver has passed full multi-jurisdiction criminal checks, license registry verification, and CPR readiness certification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
