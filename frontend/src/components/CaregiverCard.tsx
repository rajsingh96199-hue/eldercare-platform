import React from 'react';
import { Link } from 'react-router-dom';
import { CaregiverProfile } from '../types';
import { ShieldCheck, Star, Clock, MapPin, Award, ArrowRight } from 'lucide-react';

interface CaregiverCardProps {
  caregiver: CaregiverProfile;
  onBookClick?: (caregiver: CaregiverProfile) => void;
}

export const CaregiverCard: React.FC<CaregiverCardProps> = ({ caregiver, onBookClick }) => {
  let specializations: string[] = [];
  try {
    specializations = typeof caregiver.specializations === 'string'
      ? JSON.parse(caregiver.specializations)
      : caregiver.specializations || [];
  } catch (e) {
    specializations = caregiver.specializations ? caregiver.specializations.split(',') : [];
  }

  let serviceAreas: string[] = [];
  try {
    serviceAreas = typeof caregiver.serviceAreas === 'string'
      ? JSON.parse(caregiver.serviceAreas)
      : caregiver.serviceAreas || [];
  } catch (e) {
    serviceAreas = caregiver.serviceAreas ? caregiver.serviceAreas.split(',') : [];
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {caregiver.isVerified && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-600 to-teal-500 text-white text-[10px] font-extrabold uppercase tracking-wider py-1 px-3.5 rounded-bl-xl shadow-xs flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Caregiver
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={
                caregiver.user?.avatar ||
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
              }
              alt={caregiver.user?.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 group-hover:scale-105 transition-transform"
            />
            {caregiver.isAvailable && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Available Today" />
            )}
          </div>

          <div className="flex-1 pr-16">
            <Link
              to={`/caregivers/${caregiver.id}`}
              className="font-extrabold text-lg text-slate-900 hover:text-teal-600 transition-colors line-clamp-1"
            >
              {caregiver.user?.fullName}
            </Link>
            <p className="text-xs font-semibold text-teal-700 mt-0.5 line-clamp-1">{caregiver.title}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {caregiver.ratingAvg.toFixed(1)}
              </span>
              <span>({caregiver.ratingCount} reviews)</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Award className="w-3 h-3 text-slate-400" />
                {caregiver.yearsExperience} yrs exp
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {caregiver.bio}
        </p>

        {/* Specializations Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {specializations.slice(0, 3).map((spec, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-semibold"
            >
              {spec}
            </span>
          ))}
          {specializations.length > 3 && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-medium">
              +{specializations.length - 3} more
            </span>
          )}
        </div>

        {/* Location */}
        {serviceAreas.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">Serves: {serviceAreas.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Footer / Rates & Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Hourly Rate</div>
          <div className="text-lg font-black text-slate-900">
            ${caregiver.hourlyRate}
            <span className="text-xs font-semibold text-slate-500">/hr</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/caregivers/${caregiver.id}`}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Profile
          </Link>
          <Link
            to={`/book?caregiverId=${caregiver.userId || caregiver.id}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-sm flex items-center gap-1 active:scale-95"
          >
            <span>Book</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
