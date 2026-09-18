import React from 'react';
import { CareNote } from '../types';
import { Heart, Activity, Thermometer, Droplet, Wind, Calendar, Smile } from 'lucide-react';

interface VitalsCardProps {
  note: CareNote;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ note }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              {new Date(note.date || note.createdAt).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="text-[11px] text-slate-500">
              Logged by {note.caregiverProfile?.user?.fullName || 'Caregiver'}
            </div>
          </div>
        </div>

        {note.moodState && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Smile className="w-3.5 h-3.5" />
            Mood: {note.moodState}
          </span>
        )}
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        {note.bloodPressure && (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mb-1">
              <Heart className="w-3.5 h-3.5" />
              <span>Blood Pressure</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">{note.bloodPressure}</div>
            <span className="text-[10px] text-slate-600 font-medium">mmHg</span>
          </div>
        )}

        {note.bloodSugar && (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-1">
              <Droplet className="w-3.5 h-3.5" />
              <span>Blood Sugar</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">{note.bloodSugar}</div>
            <span className="text-[10px] text-slate-600 font-medium">Fasting / Random</span>
          </div>
        )}

        {note.pulseRate && (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-teal-600 font-semibold mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Pulse / Heart Rate</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">{note.pulseRate} <span className="text-xs font-normal">bpm</span></div>
            <span className="text-[10px] text-emerald-600 font-bold">Normal Rhythm</span>
          </div>
        )}

        {note.oxygenLevel && (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-1">
              <Wind className="w-3.5 h-3.5" />
              <span>SpO2 Oxygen</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">{note.oxygenLevel}%</div>
            <span className="text-[10px] text-blue-600 font-medium">Target &gt;95%</span>
          </div>
        )}
      </div>

      {/* Clinical Notes & Meds */}
      <div className="space-y-2.5 text-xs text-slate-700 bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
        {note.medicationsAdministered && (
          <div>
            <span className="font-bold text-teal-950">Medications Given: </span>
            <span className="text-slate-800">{note.medicationsAdministered}</span>
          </div>
        )}
        {note.dietNotes && (
          <div>
            <span className="font-bold text-teal-950">Nutrition & Fluids: </span>
            <span className="text-slate-800">{note.dietNotes}</span>
          </div>
        )}
        {note.mobilityExercises && (
          <div>
            <span className="font-bold text-teal-950">Mobility / Physio: </span>
            <span className="text-slate-800">{note.mobilityExercises}</span>
          </div>
        )}
        <div className="pt-2 border-t border-teal-200/50">
          <span className="font-bold text-teal-950">Caregiver Observation Notes: </span>
          <p className="mt-1 text-slate-800 leading-relaxed italic font-serif text-sm">
            "{note.notes}"
          </p>
        </div>
      </div>
    </div>
  );
};
