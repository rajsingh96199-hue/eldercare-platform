import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Booking, BookingStatus } from '../types';
import { BookingStatusTimeline } from '../components/BookingStatusTimeline';
import { VitalsCard } from '../components/VitalsCard';
import { CareNoteModal } from '../components/CareNoteModal';
import { ReviewModal } from '../components/ReviewModal';
import { ComplaintModal } from '../components/ComplaintModal';
import api from '../services/api';
import {
  Heart,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Star,
  AlertTriangle,
  HeartPulse,
  Phone,
  CheckCircle2,
  Car,
  CheckCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user, isFamily, isCaregiver, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCareNoteModal, setShowCareNoteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isNewlyCreated = searchParams.get('created') === 'true';

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  const handleUpdateStatus = async (newStatus: BookingStatus, reason?: string) => {
    try {
      setIsUpdatingStatus(true);
      const res = await api.patch(`/bookings/${id}/status`, { status: newStatus, reason });
      if (res.data.success) {
        await fetchBooking();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Status update failed.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading booking details & live status...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Booking Record Not Found</h2>
        <Link to="/bookings" className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs">
          Return to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Newly Created Success Alert */}
      {isNewlyCreated && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Booking placed successfully! Caregiver has been notified to accept your request.</span>
          </div>
          <button
            onClick={() => navigate(window.location.pathname, { replace: true })}
            className="text-xs text-emerald-800 underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-200">
              #{booking.bookingNumber}
            </span>
            <span className="text-xs text-slate-500">
              Placed on {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {booking.service?.title}
          </h1>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            Patient: <strong className="text-slate-900">{booking.patient?.fullName}</strong> ({booking.patient?.relationship})
          </p>
        </div>

        {/* Action Controls for Caregiver or Family */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Caregiver Status Controls */}
          {isCaregiver && booking.caregiverUserId === user?.id && (
            <div className="flex flex-wrap items-center gap-2">
              {booking.status === 'PENDING' && (
                <>
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus('ACCEPTED')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                  >
                    ✓ Accept Booking
                  </button>
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus('REJECTED', 'Schedule conflict')}
                    className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold"
                  >
                    Decline
                  </button>
                </>
              )}

              {booking.status === 'ACCEPTED' && (
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('ON_THE_WAY')}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Car className="w-4 h-4" />
                  <span>Mark On The Way</span>
                </button>
              )}

              {booking.status === 'ON_THE_WAY' && (
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('ARRIVED')}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Mark Arrived</span>
                </button>
              )}

              {booking.status === 'ARRIVED' && (
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>Start Care Session</span>
                </button>
              )}

              {booking.status === 'IN_PROGRESS' && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowCareNoteModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Log Vitals & Notes</span>
                  </button>

                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Shift</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Family Review / Dispute Controls */}
          {isFamily && booking.familyUserId === user?.id && (
            <div className="flex items-center gap-2">
              {booking.status === 'COMPLETED' && !booking.review && (
                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Star className="w-4 h-4" />
                  <span>Rate Caregiver</span>
                </button>
              )}

              {['PENDING', 'ACCEPTED'].includes(booking.status) && (
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('CANCELLED', 'Cancelled by family member')}
                  className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold"
                >
                  Cancel Booking
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowComplaintModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                title="File a dispute or issue"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Dispute</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Timeline Component */}
      <BookingStatusTimeline
        status={booking.status}
        cancellationReason={booking.cancellationReason}
        rejectionReason={booking.rejectionReason}
      />

      {/* Booking Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details & Vitals */}
        <div className="lg:col-span-8 space-y-8">
          {/* Schedule & Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Visit Schedule & Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Date & Start Time</div>
                  <div>{new Date(booking.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {booking.startTime}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <Clock className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Care Duration</div>
                  <div>{booking.totalHours} Hours ({booking.bookingType})</div>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Service Destination</div>
                  <div>{booking.serviceAddress}, {booking.city}</div>
                </div>
              </div>

              {booking.specialInstructions && (
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-teal-950 font-medium">
                  <strong>Special Instructions:</strong> {booking.specialInstructions}
                </div>
              )}
            </div>
          </div>

          {/* Care Notes & Patient Vitals Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-teal-600" />
                <span>Patient Vitals & Clinical Care Notes ({booking.careNotes?.length || 0})</span>
              </h3>
              {isCaregiver && booking.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => setShowCareNoteModal(true)}
                  className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  + Add Vitals Log
                </button>
              )}
            </div>

            {booking.careNotes && booking.careNotes.length > 0 ? (
              <div className="space-y-4">
                {booking.careNotes.map((note) => (
                  <VitalsCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300 text-slate-400 text-xs">
                No clinical vitals or care notes logged yet for this booking.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Practitioner & Patient Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Caregiver Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Healthcare Professional
            </h4>
            <div className="flex items-center gap-3">
              <img
                src={booking.caregiverUser?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-100"
              />
              <div>
                <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <span>{booking.caregiverUser?.fullName}</span>
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                </h5>
                <p className="text-xs text-teal-700 font-semibold">{booking.caregiverUser?.caregiverProfile?.title || 'Care Specialist'}</p>
                {booking.caregiverUser?.phone && (
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{booking.caregiverUser.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Patient Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Elderly Patient Profile
            </h4>
            <div className="text-sm font-extrabold text-slate-900">{booking.patient?.fullName}</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div><strong>Age / Gender:</strong> {booking.patient?.age} yrs • {booking.patient?.gender}</div>
              <div><strong>Mobility:</strong> {booking.patient?.mobilityLevel}</div>
              {booking.patient?.medicalConditions && (
                <div><strong>Conditions:</strong> {booking.patient.medicalConditions}</div>
              )}
              {booking.patient?.emergencyContactPhone && (
                <div className="pt-2 text-teal-800 font-semibold">
                  Emergency: {booking.patient.emergencyContactName} ({booking.patient.emergencyContactPhone})
                </div>
              )}
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="bg-teal-50/70 rounded-3xl p-6 border border-teal-100 space-y-2 text-xs text-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-2">
              Payment Breakdown
            </h4>
            <div className="flex justify-between">
              <span>Rate</span>
              <span className="font-bold">${booking.hourlyRate}/hr</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span className="font-bold">{booking.totalHours} Hours</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span className="font-bold">${booking.platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-teal-200">
              <span>Total Paid</span>
              <span className="text-teal-900">${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCareNoteModal && (
        <CareNoteModal
          bookingId={booking.id}
          patientName={booking.patient?.fullName || 'Patient'}
          onClose={() => setShowCareNoteModal(false)}
          onSuccess={() => {
            setShowCareNoteModal(false);
            fetchBooking();
          }}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          bookingId={booking.id}
          caregiverName={booking.caregiverUser?.fullName || 'Caregiver'}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            fetchBooking();
          }}
        />
      )}

      {showComplaintModal && (
        <ComplaintModal
          bookingId={booking.id}
          bookingNumber={booking.bookingNumber}
          onClose={() => setShowComplaintModal(false)}
          onSuccess={() => {
            setShowComplaintModal(false);
            fetchBooking();
          }}
        />
      )}
    </div>
  );
};
