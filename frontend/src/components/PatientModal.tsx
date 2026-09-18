import React, { useState } from 'react';
import { X, Users, Heart, AlertCircle, Phone, Stethoscope } from 'lucide-react';
import { Patient } from '../types';
import api from '../services/api';

interface PatientModalProps {
  patient?: Patient | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  patient,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState(patient?.fullName || '');
  const [age, setAge] = useState(patient?.age ? String(patient.age) : '80');
  const [gender, setGender] = useState(patient?.gender || 'Female');
  const [relationship, setRelationship] = useState(patient?.relationship || 'Mother');
  const [medicalConditions, setMedicalConditions] = useState(patient?.medicalConditions || '');
  const [allergies, setAllergies] = useState(patient?.allergies || '');
  const [mobilityLevel, setMobilityLevel] = useState(patient?.mobilityLevel || 'Independent');
  const [dietaryNeeds, setDietaryNeeds] = useState(patient?.dietaryNeeds || '');
  const [emergencyContactName, setEmergencyContactName] = useState(patient?.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(patient?.emergencyContactPhone || '');
  const [doctorName, setDoctorName] = useState(patient?.doctorName || '');
  const [doctorPhone, setDoctorPhone] = useState(patient?.doctorPhone || '');
  const [notes, setNotes] = useState(patient?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !age || !gender || !relationship) {
      setError('Please fill in full name, age, gender, and relationship.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const payload = {
        fullName,
        age: Number(age),
        gender,
        relationship,
        medicalConditions,
        allergies,
        mobilityLevel,
        dietaryNeeds,
        emergencyContactName,
        emergencyContactPhone,
        doctorName,
        doctorPhone,
        notes,
      };

      if (patient) {
        await api.put(`/patients/${patient.id}`, payload);
      } else {
        await api.post('/patients', payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save patient profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {patient ? 'Edit Elderly Profile' : 'Add Elderly Family Member'}
            </h3>
            <p className="text-xs text-slate-500">
              Health details & care instructions for caregivers
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Eleanor Jenkins"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="40"
                  max="125"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Relationship to You <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Mother, Father, Grandparent, Self"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobility Assistance Level
              </label>
              <select
                value={mobilityLevel}
                onChange={(e) => setMobilityLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="Independent">Independent (Walks Unassisted)</option>
                <option value="Needs Cane/Walker">Needs Cane or Walker</option>
                <option value="Wheelchair Bound">Wheelchair Assisted</option>
                <option value="Bedridden">Bedridden (Full Transfer Help)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Medical Conditions & Chronic Diagnoses
            </label>
            <input
              type="text"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="e.g. Hypertension, Post-stroke rehab, Mild Alzheimer's, Osteoarthritis"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Known Drug & Food Allergies
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Sulfa drugs, Latex"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dietary & Nutrition Preferences
              </label>
              <input
                type="text"
                value={dietaryNeeds}
                onChange={(e) => setDietaryNeeds(e.target.value)}
                placeholder="e.g. Low sodium, Diabetic carb-controlled, Pureed"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Emergency Contacts & Primary Doctor
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="e.g. Robert Jenkins (Son)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. Elizabeth Warren (Geriatrician)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Phone</label>
                <input
                  type="text"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  placeholder="+1 (555) 345-9876"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Personal Likes / Comfort Preferences
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Enjoys classical music, prefers morning tea at 8:00 AM, gentle reassurance..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : patient ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
