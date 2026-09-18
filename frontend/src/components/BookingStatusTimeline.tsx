import React from 'react';
import { BookingStatus } from '../types';
import {
  CheckCircle2,
  Clock,
  Car,
  MapPin,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface TimelineProps {
  status: BookingStatus;
  cancellationReason?: string | null;
  rejectionReason?: string | null;
}

const steps: Array<{ status: BookingStatus; label: string; icon: React.FC<{ className?: string }> }> = [
  { status: 'PENDING', label: 'Requested', icon: Clock },
  { status: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
  { status: 'ON_THE_WAY', label: 'On The Way', icon: Car },
  { status: 'ARRIVED', label: 'Arrived', icon: MapPin },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: Activity },
  { status: 'COMPLETED', label: 'Completed', icon: CheckCircle },
];

export const BookingStatusTimeline: React.FC<TimelineProps> = ({
  status,
  cancellationReason,
  rejectionReason,
}) => {
  const isTerminated = ['CANCELLED', 'REJECTED', 'DISPUTED'].includes(status);

  if (isTerminated) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-900">
        <div className="flex items-center gap-3">
          {status === 'DISPUTED' ? (
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h4 className="font-bold text-base">
              Booking Status: {status}
            </h4>
            <p className="text-sm text-red-700 mt-0.5">
              {cancellationReason || rejectionReason || 'This booking session was terminated or opened for dispute review.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.status === status);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
        Live Care Tracker
      </h4>

      <div className="relative">
        {/* Connecting progress line */}
        <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-100 -z-0">
          <div
            className="h-full bg-teal-600 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.status}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-110 ring-4 ring-teal-100'
                      : isCompleted
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-2.5 text-xs font-bold ${
                    isCurrent
                      ? 'text-teal-900 font-extrabold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[9px] font-extrabold uppercase animate-pulse">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
