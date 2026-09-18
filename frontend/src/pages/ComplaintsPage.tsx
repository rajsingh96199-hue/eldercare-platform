import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Complaint, Booking } from '../types';
import { ComplaintModal } from '../components/ComplaintModal';
import api from '../services/api';
import { AlertTriangle, Plus, ShieldCheck, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [complaintsRes, bookingsRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/bookings'),
      ]);
      if (complaintsRes.data.success) setComplaints(complaintsRes.data.data);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading dispute resolution center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dispute & Incident Resolution Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit service quality concerns, shift disputes, and track administrative investigations
          </p>
        </div>

        {bookings.length > 0 && (
          <button
            onClick={() => {
              setSelectedBooking(bookings[0]);
              setShowModal(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Open New Dispute Ticket</span>
          </button>
        )}
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft max-w-lg mx-auto space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Active Disputes</h3>
          <p className="text-xs text-slate-500">
            All your visits and services are in good standing. If you encounter any issue during a shift, file a ticket here for prompt coordinator assistance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">Ticket #{c.ticketNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    c.priority === 'URGENT' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {c.priority} Priority
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{c.subject}</h3>
                <p className="text-xs text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                  {c.description}
                </p>
              </div>

              {c.adminResolution && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 font-medium">
                  <strong>Care Coordinator Resolution:</strong> {c.adminResolution}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && selectedBooking && (
        <ComplaintModal
          bookingId={selectedBooking.id}
          bookingNumber={selectedBooking.bookingNumber}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};
