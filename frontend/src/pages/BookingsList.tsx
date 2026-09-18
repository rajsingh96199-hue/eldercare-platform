import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Booking } from '../types';
import api from '../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Star,
  Plus,
  RefreshCw,
  Filter,
} from 'lucide-react';

export const BookingsList: React.FC = () => {
  const { user, isCaregiver } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return ['PENDING', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status);
    if (statusFilter === 'COMPLETED') return b.status === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return ['CANCELLED', 'REJECTED', 'DISPUTED'].includes(b.status);
    return true;
  });

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isCaregiver ? 'Caregiver Shift Schedule' : 'My Care Bookings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track scheduled visits, past care sessions, clinical logs, and practitioner ratings
          </p>
        </div>

        {!isCaregiver && (
          <Link
            to="/book"
            className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Service</span>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'ALL', label: `All (${bookings.length})` },
          { id: 'ACTIVE', label: `Active / Upcoming (${bookings.filter((b) => ['PENDING', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)).length})` },
          { id: 'COMPLETED', label: `Completed (${bookings.filter((b) => b.status === 'COMPLETED').length})` },
          { id: 'CANCELLED', label: `Cancelled / Disputes (${bookings.filter((b) => ['CANCELLED', 'REJECTED', 'DISPUTED'].includes(b.status)).length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft max-w-lg mx-auto space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Bookings Found</h3>
          <p className="text-xs text-slate-500">
            {statusFilter === 'ALL'
              ? 'You have not booked any healthcare assistance services yet.'
              : `No bookings found in ${statusFilter.toLowerCase()} status.`}
          </p>
          {!isCaregiver && (
            <Link
              to="/caregivers"
              className="inline-block px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
            >
              Find a Verified Caregiver
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    (isCaregiver ? b.familyUser?.avatar : b.caregiverUser?.avatar) ||
                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'
                  }
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 flex-shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">{b.service?.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase">
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    Patient: <strong className="text-slate-900">{b.patient?.fullName}</strong> ({b.patient?.relationship}) • Caregiver: <strong>{b.caregiverUser?.fullName}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {new Date(b.startDate).toLocaleDateString()} at {b.startTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.totalHours} Hours ({b.bookingType})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end lg:self-center">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Fee</div>
                  <div className="text-lg font-black text-slate-900">${b.totalAmount.toFixed(2)}</div>
                </div>

                <Link
                  to={`/bookings/${b.id}`}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <span>Track & View</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
