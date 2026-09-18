import React from 'react';
import { AlertTriangle, ShieldCheck, Lock, FileText } from 'lucide-react';

export const TermsPrivacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Legal & Healthcare Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Platform Terms & Healthcare Policies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Safety protocols, patient privacy standards, and non-emergency medical disclaimers
        </p>
      </div>

      {/* Emergency Disclaimer Alert Box */}
      <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 sm:p-8 text-red-950 space-y-3">
        <div className="flex items-center gap-3 text-red-600 font-extrabold text-lg">
          <AlertTriangle className="w-6 h-6" />
          <span>Non-Emergency Medical Disclaimer</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed">
          ElderCare is an in-home assistance and scheduled clinical nursing platform. <strong>ElderCare is not an emergency medical service, 911 dispatch, or acute intensive care unit.</strong> If you or an elderly relative are experiencing acute life-threatening medical conditions (e.g. chest pain, suspected stroke, unresponsiveness, acute severe trauma), you must call <strong>911</strong> or local emergency services immediately.
        </p>
      </div>

      {/* Policies */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-600" />
            <span>1. Patient Data & Medical Privacy (HIPAA Compliance)</span>
          </h3>
          <p>
            ElderCare strictly encrypts and safeguards all patient health identifiers, chronic medical conditions, allergy lists, and clinical care notes logged by registered nurses. Patient health data is only visible to the registered family account and authorized, booked caregivers for the duration of care delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span>2. Caregiver Verification & Licensing Standards</span>
          </h3>
          <p>
            All registered nurses (RNs), physical therapists (DPTs), and certified attendants must submit active board licenses, government identification, and pass national multi-state criminal background screenings prior to receiving the ElderCare Verified Badge and accepting home visits.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>3. Cancellation & Dispute Resolution</span>
          </h3>
          <p>
            Families may cancel scheduled visits with zero penalty up to 24 hours prior to the shift start time. In case of unsatisfactory service, caregiver tardiness, or disputes, tickets may be opened in the Dispute Resolution Center for formal administrative mediation.
          </p>
        </section>
      </div>
    </div>
  );
};
