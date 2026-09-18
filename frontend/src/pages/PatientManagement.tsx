import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Patient, CareNote } from '../types';
import { PatientModal } from '../components/PatientModal';
import { VitalsCard } from '../components/VitalsCard';
import api from '../services/api';
import {
  Users,
  Plus,
  Heart,
  AlertCircle,
  Phone,
  Stethoscope,
  Activity,
  Edit,
  Trash2,
  Calendar,
  RefreshCw,
  HeartPulse,
} from 'lucide-react';

export const PatientManagement: React.FC = () => {
  const { id: paramPatientId } = useParams<{ id?: string }>();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientCareNotes, setPatientCareNotes] = useState<CareNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/patients');
      if (res.data.success) {
        setPatients(res.data.data);
        if (res.data.data.length > 0) {
          const active = paramPatientId
            ? res.data.data.find((p: Patient) => p.id === paramPatientId) || res.data.data[0]
            : res.data.data[0];
          setSelectedPatient(active);
          fetchCareNotes(active.id);
        }
      }
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCareNotes = async (patientId: string) => {
    try {
      const res = await api.get(`/care-notes/patient/${patientId}`);
      if (res.data.success) {
        setPatientCareNotes(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load patient care notes:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [paramPatientId]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    fetchCareNotes(patient.id);
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!window.confirm('Are you sure you want to remove this patient profile?')) return;
    try {
      await api.delete(`/patients/${patientId}`);
      fetchPatients();
    } catch (error) {
      alert('Failed to delete patient profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading elderly health profiles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Elderly Patient Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Medical history, mobility assistance levels, emergency contacts & longitudinal vitals logs
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPatient(null);
            setShowModal(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Elderly Relative</span>
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Elderly Profiles Registered</h3>
          <p className="text-xs text-slate-500">
            Add your elderly parent, grandparent, or relative to safely manage their clinical care requirements.
          </p>
          <button
            onClick={() => {
              setEditingPatient(null);
              setShowModal(true);
            }}
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
          >
            Create First Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: List of Patients */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registered Seniors ({patients.length})
            </h3>
            <div className="space-y-3">
              {patients.map((p) => {
                const isSelected = selectedPatient?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPatient(p)}
                    className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-white shadow-md ring-2 ring-teal-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-black text-slate-900 text-base">{p.fullName}</div>
                        <div className="text-xs text-teal-700 font-bold">{p.relationship} • {p.age} yrs • {p.gender}</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {p.mobilityLevel}
                      </span>
                    </div>

                    {p.medicalConditions && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                        {p.medicalConditions}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Patient Details & Longitudinal Vitals */}
          {selectedPatient && (
            <div className="lg:col-span-8 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedPatient.fullName}</h2>
                    <p className="text-xs font-semibold text-teal-700">
                      {selectedPatient.relationship} • {selectedPatient.age} Years Old • {selectedPatient.gender}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPatient(selectedPatient);
                        setShowModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => handleDeletePatient(selectedPatient.id)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Medical Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-900">Mobility Status</div>
                    <div>{selectedPatient.mobilityLevel}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-900">Dietary Needs</div>
                    <div>{selectedPatient.dietaryNeeds || 'Standard balanced diet'}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
                    <div className="font-bold text-slate-900">Medical Conditions & Chronic Illnesses</div>
                    <div className="text-slate-800 font-medium">{selectedPatient.medicalConditions || 'None specified'}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
                    <div className="font-bold text-slate-900">Known Allergies</div>
                    <div className="text-rose-700 font-bold">{selectedPatient.allergies || 'No known drug/food allergies'}</div>
                  </div>

                  {/* Contacts */}
                  <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
                    <div className="font-bold text-teal-950">Emergency Contact</div>
                    <div>{selectedPatient.emergencyContactName || 'None'} ({selectedPatient.emergencyContactPhone || 'N/A'})</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
                    <div className="font-bold text-teal-950">Primary Physician</div>
                    <div>{selectedPatient.doctorName || 'None'} ({selectedPatient.doctorPhone || 'N/A'})</div>
                  </div>
                </div>

                {selectedPatient.notes && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950">
                    <strong>Personal Comfort Notes:</strong> {selectedPatient.notes}
                  </div>
                )}
              </div>

              {/* Vitals History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-teal-600" />
                    <span>Historical Vitals & Shift Care Notes ({patientCareNotes.length})</span>
                  </h3>
                  <Link
                    to={`/book?patientId=${selectedPatient.id}`}
                    className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    + Book Shift for {selectedPatient.fullName}
                  </Link>
                </div>

                {patientCareNotes.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300 text-slate-400 text-xs">
                    No clinical vitals recorded yet. Caregivers log vitals automatically during active visits.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patientCareNotes.map((note) => (
                      <VitalsCard key={note.id} note={note} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <PatientModal
          patient={editingPatient}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchPatients();
          }}
        />
      )}
    </div>
  );
};
