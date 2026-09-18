import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Booking, CaregiverProfile } from '../types';
import { CareNoteModal } from '../components/CareNoteModal';
import api from '../services/api';
import {
  ShieldCheck,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  Car,
  MapPin,
  HeartPulse,
  FileText,
  Upload,
  Calendar,
  Phone,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const CaregiverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCareNoteBooking, setActiveCareNoteBooking] = useState<Booking | null>(null);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [docType, setDocType] = useState('NURSING_LICENSE');
  const [docName, setDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchCaregiverData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/caregivers/me/stats'),
        api.get('/bookings'),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
    } catch (error) {
      console.error('Failed to load caregiver portal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregiverData();
  }, []);

  const handleUpdateBookingStatus = async (bookingId: string, status: string, reason?: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status, reason });
      fetchCaregiverData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Status update failed.');
    }
  };

  const handleToggleAvailability = async () => {
    if (!stats) return;
    try {
      await api.put('/caregivers/me/profile', {
        isAvailable: !stats.isAvailable,
      });
      fetchCaregiverData();
    } catch (error) {
      alert('Failed to update availability.');
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    try {
      setIsUploading(true);
      await api.post('/caregivers/me/documents', {
        type: docType,
        name: docName,
        fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      });
      setShowDocUploadModal(false);
      setDocName('');
      fetchCaregiverData();
    } catch (error) {
      alert('Document upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const activeBookings = bookings.filter((b) =>
    ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading caregiver portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-300"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{user?.fullName}</h1>
              {stats?.isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-extrabold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase">
                  Pending Verification
                </span>
              )}
            </div>
            <p className="text-xs text-teal-200 mt-0.5">
              Caregiver & Nursing Portal • Manage Shifts, Live Status & Vitals Logging
            </p>
          </div>
        </div>

        {/* Availability Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAvailability}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md ${
              stats?.isAvailable
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${stats?.isAvailable ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
            <span>{stats?.isAvailable ? 'Available for Bookings' : 'Set to Busy / Off Shift'}</span>
          </button>

          <button
            onClick={() => setShowDocUploadModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Earned</div>
          <div className="text-3xl font-black text-slate-900 mt-1">${stats?.totalEarnings || 0}</div>
          <div className="text-xs text-emerald-600 font-bold mt-1">Direct Payouts</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold text-slate-500 uppercase">Pending Requests</div>
          <div className="text-3xl font-black text-amber-600 mt-1">{stats?.pendingCount || 0}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Awaiting confirmation</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold text-slate-500 uppercase">Active Shifts</div>
          <div className="text-3xl font-black text-teal-600 mt-1">{stats?.activeCount || 0}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">In progress / scheduled</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold text-slate-500 uppercase">Rating Score</div>
          <div className="text-3xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
            <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
            <span>{(stats?.ratingAvg || 5.0).toFixed(1)}</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">{stats?.ratingCount || 0} reviews</div>
        </div>
      </div>

      {/* Pending Requests Queue */}
      {pendingBookings.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>New Booking Requests Requiring Action ({pendingBookings.length})</span>
          </div>

          <div className="space-y-3">
            {pendingBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{b.service?.title}</div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Patient: <strong className="text-slate-900">{b.patient?.fullName}</strong> ({b.patient?.age} yrs • {b.patient?.mobilityLevel})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {new Date(b.startDate).toLocaleDateString()} at {b.startTime} ({b.totalHours} hrs) • Payout: <strong className="text-emerald-700 font-bold">${b.caregiverPayout}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">Address: {b.serviceAddress}, {b.city}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleUpdateBookingStatus(b.id, 'ACCEPTED')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                  >
                    ✓ Accept Shift
                  </button>
                  <button
                    onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED', 'Caregiver unavailable')}
                    className="px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active & Scheduled Shifts */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-teal-600" />
          <span>Active & Scheduled Care Shifts ({activeBookings.length})</span>
        </h3>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300 text-slate-400 text-xs">
            No active shifts scheduled for today. Make sure your availability status is set to Available!
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 font-mono">#{b.bookingNumber}</span>
                    <span className="px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-extrabold uppercase">
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    Payout: ${b.caregiverPayout}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                  <div>
                    <div className="font-bold text-slate-900">Patient Details</div>
                    <div className="text-slate-800 font-semibold">{b.patient?.fullName} ({b.patient?.relationship})</div>
                    <div className="text-slate-500">{b.patient?.medicalConditions || 'No conditions specified'}</div>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900">Schedule & Shift</div>
                    <div>{new Date(b.startDate).toLocaleDateString()} at {b.startTime}</div>
                    <div className="text-slate-500">{b.totalHours} Hours ({b.bookingType})</div>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900">Service Location</div>
                    <div className="truncate">{b.serviceAddress}, {b.city}</div>
                    <div className="text-teal-700 font-semibold">Family: {b.familyUser?.fullName}</div>
                  </div>
                </div>

                {/* Status Advancement Controls */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={`/bookings/${b.id}`}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    View Full Booking & Patient Profile →
                  </Link>

                  <div className="flex flex-wrap items-center gap-2">
                    {b.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'ON_THE_WAY')}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Mark On The Way</span>
                      </button>
                    )}

                    {b.status === 'ON_THE_WAY' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'ARRIVED')}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Mark Arrived</span>
                      </button>
                    )}

                    {b.status === 'ARRIVED' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'IN_PROGRESS')}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Start Care Shift</span>
                      </button>
                    )}

                    {b.status === 'IN_PROGRESS' && (
                      <>
                        <button
                          onClick={() => setActiveCareNoteBooking(b)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Log Vitals & Notes</span>
                        </button>

                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Complete Shift</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {showDocUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Submit Credential Document</h3>
            <p className="text-xs text-slate-500 mb-4">Upload board license, CPR certificate, or Govt ID for verification review.</p>

            <form onSubmit={handleUploadDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                >
                  <option value="NURSING_LICENSE">State Nursing License (RN / LPN)</option>
                  <option value="PHYSICAL_THERAPY_LICENSE">PT Board License (DPT)</option>
                  <option value="CNA_CERTIFICATE">CNA / HHA Certification</option>
                  <option value="GOVT_ID">Passport / Real ID</option>
                  <option value="CPR_BLS_CERT">CPR & BLS Life Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Name / License #</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. State Nursing License #NY-89421"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDocUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isUploading ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Care Note Modal */}
      {activeCareNoteBooking && (
        <CareNoteModal
          bookingId={activeCareNoteBooking.id}
          patientName={activeCareNoteBooking.patient?.fullName || 'Patient'}
          onClose={() => setActiveCareNoteBooking(null)}
          onSuccess={() => {
            setActiveCareNoteBooking(null);
            fetchCaregiverData();
          }}
        />
      )}
    </div>
  );
};
