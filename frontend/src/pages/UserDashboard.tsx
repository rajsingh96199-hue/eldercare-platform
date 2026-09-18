import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Booking, Patient } from '../types';
import { PatientModal } from '../components/PatientModal';
import api from '../services/api';
import {
  Heart,
  Users,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Activity,
  HeartPulse,
  Star,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [bookingsRes, patientsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/patients'),
      ]);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
      if (patientsRes.data.success) setPatients(patientsRes.data.data);
    } catch (error) {
      console.error('Failed to load user dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeBookings = bookings.filter((b) =>
    ['PENDING', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );

  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading family dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Family Care Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {user?.fullName}!</h1>
          <p className="text-xs sm:text-sm text-teal-100">
            Monitoring health, vitals, and scheduled nursing sessions for your loved ones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/book"
            className="px-5 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Care</span>
          </Link>
          <button
            onClick={() => setShowPatientModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
          >
            + Add Senior Profile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500 uppercase">Active / Upcoming Care</div>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{activeBookings.length}</div>
          <p className="text-xs text-teal-700 font-semibold mt-1">Live tracking active</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500 uppercase">Elderly Family Members</div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{patients.length}</div>
          <p className="text-xs text-slate-500 mt-1">Registered health profiles</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500 uppercase">Completed Care Visits</div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{completedBookings.length}</div>
          <p className="text-xs text-slate-500 mt-1">Verified shift reports on file</p>
        </div>
      </div>

      {/* Active Sessions & Patients Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Bookings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Active & Scheduled Care Sessions</span>
            </h3>
            <Link to="/bookings" className="text-xs font-bold text-teal-700 hover:underline">
              View All
            </Link>
          </div>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300 text-slate-500 text-xs space-y-3">
              <p>No active care sessions currently scheduled.</p>
              <Link to="/caregivers" className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white font-bold">
                Book a Verified Nurse or Attendant
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={b.caregiverUser?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{b.service?.title}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase">
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        For <strong className="text-slate-900">{b.patient?.fullName}</strong> • By {b.caregiverUser?.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(b.startDate).toLocaleDateString()} at {b.startTime} ({b.totalHours} hrs)
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/bookings/${b.id}`}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 self-end sm:self-center"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Past Bookings Summary */}
          {completedBookings.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-slate-900">Recent Completed Visits</h3>
              <div className="space-y-3">
                {completedBookings.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{b.service?.title} for {b.patient?.fullName}</div>
                      <div className="text-slate-500">
                        {new Date(b.startDate).toLocaleDateString()} • Caregiver: {b.caregiverUser?.fullName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.review ? (
                        <span className="text-amber-500 font-bold flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          Rated {b.review.rating}★
                        </span>
                      ) : (
                        <Link
                          to={`/bookings/${b.id}`}
                          className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold"
                        >
                          Leave Review
                        </Link>
                      )}
                      <Link
                        to={`/bookings/${b.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
                      >
                        View Notes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Elderly Patients Quick List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>My Elderly Relatives</span>
              </h3>
              <button
                onClick={() => setShowPatientModal(true)}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {patients.map((p) => (
                <Link
                  key={p.id}
                  to={`/patients/${p.id}`}
                  className="block p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-100 transition-colors"
                >
                  <div className="font-extrabold text-slate-900 text-sm">{p.fullName}</div>
                  <div className="text-xs text-teal-700 font-semibold">
                    {p.relationship} • {p.age} yrs • {p.mobilityLevel}
                  </div>
                  {p.medicalConditions && (
                    <div className="text-[11px] text-slate-500 truncate mt-1">
                      {p.medicalConditions}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <Link
              to="/patients"
              className="block text-center text-xs font-bold text-teal-700 hover:underline pt-2 border-t border-slate-100"
            >
              Manage Full Medical Profiles & Vitals History →
            </Link>
          </div>
        </div>
      </div>

      {showPatientModal && (
        <PatientModal
          onClose={() => setShowPatientModal(false)}
          onSuccess={() => {
            setShowPatientModal(false);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};
