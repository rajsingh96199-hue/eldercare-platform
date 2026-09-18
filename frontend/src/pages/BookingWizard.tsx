import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Patient, Service, CaregiverProfile } from '../types';
import { PatientModal } from '../components/PatientModal';
import api from '../services/api';
import {
  Heart,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Plus,
} from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const preselectedCaregiverId = searchParams.get('caregiverId') || '';
  const preselectedServiceId = searchParams.get('serviceId') || '';

  const [step, setStep] = useState(1);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>([]);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId);
  const [selectedCaregiverUserId, setSelectedCaregiverUserId] = useState(preselectedCaregiverId);
  const [bookingType, setBookingType] = useState<'HOURLY' | 'DAILY'>('HOURLY');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [totalHours, setTotalHours] = useState(4);
  const [serviceAddress, setServiceAddress] = useState(user?.address || '742 Evergreen Terrace, Apt 4B');
  const [city, setCity] = useState(user?.city || 'New York');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [patientsRes, servicesRes, caregiversRes] = await Promise.all([
        api.get('/patients'),
        api.get('/services'),
        api.get('/caregivers?isVerified=true'),
      ]);

      if (patientsRes.data.success) {
        setPatients(patientsRes.data.data);
        if (patientsRes.data.data.length > 0 && !selectedPatientId) {
          setSelectedPatientId(patientsRes.data.data[0].id);
        }
      }
      if (servicesRes.data.success) {
        setServices(servicesRes.data.data);
        if (servicesRes.data.data.length > 0 && !selectedServiceId) {
          setSelectedServiceId(servicesRes.data.data[0].id);
        }
      }
      if (caregiversRes.data.success) {
        setCaregivers(caregiversRes.data.data);
        if (caregiversRes.data.data.length > 0 && !selectedCaregiverUserId) {
          const match = caregiversRes.data.data.find((c: any) => c.userId === preselectedCaregiverId || c.id === preselectedCaregiverId);
          setSelectedCaregiverUserId(match ? match.userId : caregiversRes.data.data[0].userId);
        }
      }
    } catch (err) {
      console.error('Failed to load booking prerequisites:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Selected caregiver & service details for pricing calculation
  const selectedCaregiver = caregivers.find((c) => c.userId === selectedCaregiverUserId || c.id === selectedCaregiverUserId);
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const hourlyRate = selectedCaregiver?.hourlyRate || selectedService?.baseHourlyRate || 35;
  const subtotal = totalHours * hourlyRate;
  const platformFee = Math.round(subtotal * 0.1 * 100) / 100;
  const totalAmount = Math.round((subtotal + platformFee) * 100) / 100;

  const handleConfirmBooking = async () => {
    if (!selectedPatientId || !selectedCaregiverUserId || !selectedServiceId || !startDate || !serviceAddress) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const res = await api.post('/bookings', {
        caregiverUserId: selectedCaregiver?.userId || selectedCaregiverUserId,
        patientId: selectedPatientId,
        serviceId: selectedServiceId,
        bookingType,
        startDate: new Date(startDate).toISOString(),
        startTime,
        totalHours: Number(totalHours),
        serviceAddress,
        city,
        specialInstructions,
      });

      if (res.data.success) {
        navigate(`/bookings/${res.data.data.id}?created=true`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Step {step} of 4
        </span>
        <h1 className="text-3xl font-black text-slate-900">Book In-Home Elderly Care</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select elderly patient, clinical service, verified caregiver, and scheduled shift
        </p>
      </div>

      {/* Progress Bar */}
      <div className="grid grid-cols-4 gap-2">
        {['Patient Info', 'Service & Caregiver', 'Date & Shift', 'Review & Book'].map((title, i) => (
          <div key={i} className="space-y-1.5 text-center">
            <div
              className={`h-2 rounded-full transition-all ${
                step >= i + 1 ? 'bg-teal-600' : 'bg-slate-200'
              }`}
            />
            <span className={`text-[11px] font-bold ${step === i + 1 ? 'text-teal-900' : 'text-slate-400'}`}>
              {title}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
          {error}
        </div>
      )}

      {/* Wizard Steps */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
        {/* STEP 1: SELECT PATIENT */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">1. Who is this care session for?</h3>
                <p className="text-xs text-slate-500">Select an existing elderly family member profile or add a new one.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowPatientModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Senior</span>
              </button>
            </div>

            {patients.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
                <Users className="w-10 h-10 text-teal-600 mx-auto" />
                <h4 className="font-bold text-slate-900">No Patient Profiles Found</h4>
                <p className="text-xs text-slate-500">Please create a profile for your elderly parent or relative to proceed.</p>
                <button
                  type="button"
                  onClick={() => setShowPatientModal(true)}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md"
                >
                  Create Patient Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patients.map((p) => {
                  const isSelected = selectedPatientId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-100'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-extrabold text-slate-900 text-base">{p.fullName}</div>
                          <div className="text-xs text-teal-700 font-semibold">{p.relationship} • {p.age} yrs old • {p.gender}</div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
                      </div>

                      <div className="mt-3 text-xs text-slate-600 space-y-1">
                        <div><strong className="text-slate-800">Mobility:</strong> {p.mobilityLevel}</div>
                        {p.medicalConditions && (
                          <div className="line-clamp-1"><strong className="text-slate-800">Conditions:</strong> {p.medicalConditions}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!selectedPatientId}
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <span>Continue to Service & Caregiver</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SERVICE & CAREGIVER */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">2. Select Care Service & Caregiver</h3>
              <p className="text-xs text-slate-500">Pick the required healthcare discipline and assign a certified caregiver.</p>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Care Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {services.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-3.5 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-100'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="font-extrabold text-slate-900 text-sm">{srv.title}</div>
                      <div className="text-xs font-bold text-teal-700 mt-1">${srv.baseHourlyRate}/hr</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Caregiver Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Verified Caregiver
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                {caregivers.map((cg) => {
                  const isSelected = selectedCaregiverUserId === (cg.userId || cg.id);
                  return (
                    <div
                      key={cg.id}
                      onClick={() => setSelectedCaregiverUserId(cg.userId || cg.id)}
                      className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-100'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={cg.user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 text-xs truncate flex items-center gap-1">
                          <span>{cg.user?.fullName}</span>
                          {cg.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />}
                        </div>
                        <div className="text-[11px] text-teal-700 truncate">{cg.title}</div>
                        <div className="text-[10px] text-slate-500 font-bold">${cg.hourlyRate}/hr • ★ {cg.ratingAvg.toFixed(1)}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE & DURATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">3. Select Date, Time & Duration</h3>
              <p className="text-xs text-slate-500">Choose when the caregiver should arrive and duration of service.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Start Time Slot</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                >
                  <option value="08:00 AM">08:00 AM (Early Morning)</option>
                  <option value="09:00 AM">09:00 AM (Morning Shift)</option>
                  <option value="11:00 AM">11:00 AM (Mid-Day)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon Shift)</option>
                  <option value="05:00 PM">05:00 PM (Evening Shift)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Booking Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setBookingType('HOURLY'); setTotalHours(4); }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                      bookingType === 'HOURLY'
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Hourly Session
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBookingType('DAILY'); setTotalHours(8); }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                      bookingType === 'DAILY'
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Full Day (8 hrs)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Care Hours</label>
                <select
                  value={totalHours}
                  onChange={(e) => setTotalHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                >
                  <option value="2">2 Hours ($ {2 * hourlyRate})</option>
                  <option value="4">4 Hours ($ {4 * hourlyRate})</option>
                  <option value="6">6 Hours ($ {6 * hourlyRate})</option>
                  <option value="8">8 Hours (Full Shift - ${8 * hourlyRate})</option>
                  <option value="12">12 Hours (Extended Shift - ${12 * hourlyRate})</option>
                </select>
              </div>
            </div>

            {/* Address & Instructions */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Street Address</label>
                  <input
                    type="text"
                    required
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                    placeholder="742 Evergreen Terrace, Apt 4B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Area</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Special Medical or Entry Instructions</label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Ring Apt 4B buzzer, morning medication schedule is at 9:30 AM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <span>Review Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">4. Review & Confirm Booking</h3>
              <p className="text-xs text-slate-500">Please review care details before submitting your booking request.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm pb-1 border-b border-slate-200">Patient & Practitioner</div>
                <div><strong>Patient:</strong> {selectedPatient?.fullName} ({selectedPatient?.relationship})</div>
                <div><strong>Caregiver:</strong> {selectedCaregiver?.user?.fullName} ({selectedCaregiver?.title})</div>
                <div><strong>Service:</strong> {selectedService?.title}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm pb-1 border-b border-slate-200">Schedule & Location</div>
                <div><strong>Date & Time:</strong> {new Date(startDate).toLocaleDateString()} at {startTime}</div>
                <div><strong>Duration:</strong> {totalHours} Hours ({bookingType})</div>
                <div><strong>Address:</strong> {serviceAddress}, {city}</div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-teal-50/70 p-5 rounded-3xl border border-teal-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Caregiver Fee ({totalHours} hrs × ${hourlyRate}/hr)</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Platform Trust & Safety Fee (10%)</span>
                <span className="font-bold">${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 text-base font-black pt-2 border-t border-teal-200">
                <span>Total Amount</span>
                <span className="text-teal-900">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xl shadow-teal-600/20 transition-all disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm & Request Booking'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showPatientModal && (
        <PatientModal
          onClose={() => setShowPatientModal(false)}
          onSuccess={() => {
            setShowPatientModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};
