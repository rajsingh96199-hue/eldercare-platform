import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert, HeartPulse } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [showSosModal, setShowSosModal] = useState<boolean>(false);

  return (
    <>
      {/* Top Persistent Non-Emergency Notice */}
      <div className="bg-amber-50 border-b border-amber-200 text-amber-950 px-4 py-2 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <span className="font-semibold">Non-Emergency Service Notice:</span>
            <span className="text-amber-800">
              ElderCare provides scheduled home assistance & nursing. For critical or life-threatening medical emergencies, please call emergency services immediately.
            </span>
          </div>

          <button
            onClick={() => setShowSosModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            Emergency SOS Info
          </button>
        </div>
      </div>

      {/* SOS Emergency Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 border-2 border-red-500 relative">
            <button
              onClick={() => setShowSosModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Medical Emergency Guide</h3>
                <p className="text-sm text-slate-600">Immediate Actions for Critical Care</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-6">
              <p className="text-red-950 text-sm font-medium leading-relaxed">
                If the senior is experiencing chest pain, severe shortness of breath, loss of consciousness, sudden stroke symptoms (facial drooping, slurred speech), or uncontrollable bleeding:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <a
                href="tel:911"
                className="flex items-center justify-between p-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-all shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-6 h-6 group-hover:animate-bounce" />
                  <span>Call Emergency (911 / 112)</span>
                </div>
                <span className="text-red-100 text-sm font-normal">Toll Free</span>
              </a>

              <a
                href="tel:18002738255"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-base transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-5 h-5 text-teal-600" />
                  <span>National Senior Health Helpline</span>
                </div>
                <span className="text-slate-500 text-xs">24/7 Support</span>
              </a>
            </div>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                ElderCare caregivers follow mandatory emergency escalation protocols and will alert family members and first responders if sudden acute distress occurs during an active visit.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
