import React, { useState } from 'react';
import { X, HeartPulse, Activity, Droplet, Wind, Sparkles } from 'lucide-react';
import api from '../services/api';

interface CareNoteModalProps {
  bookingId: string;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CareNoteModal: React.FC<CareNoteModalProps> = ({
  bookingId,
  patientName,
  onClose,
  onSuccess,
}) => {
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [bloodSugar, setBloodSugar] = useState('');
  const [pulseRate, setPulseRate] = useState('74');
  const [temperature, setTemperature] = useState('98.6');
  const [oxygenLevel, setOxygenLevel] = useState('98');
  const [medicationsAdministered, setMedicationsAdministered] = useState('');
  const [dietNotes, setDietNotes] = useState('');
  const [mobilityExercises, setMobilityExercises] = useState('');
  const [moodState, setMoodState] = useState('Cheerful');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please provide care summary notes.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await api.post('/care-notes', {
        bookingId,
        bloodPressure: bloodPressure ? `${bloodPressure} mmHg` : null,
        bloodSugar: bloodSugar ? `${bloodSugar} mg/dL` : null,
        pulseRate: pulseRate ? Number(pulseRate) : null,
        temperature: temperature ? Number(temperature) : null,
        oxygenLevel: oxygenLevel ? Number(oxygenLevel) : null,
        medicationsAdministered,
        dietNotes,
        mobilityExercises,
        moodState,
        notes,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log care note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Record Vitals & Care Note</h3>
            <p className="text-xs text-slate-500">Patient: <span className="font-semibold text-slate-800">{patientName}</span></p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Pressure</label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="e.g. 120/80"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pulse (BPM)</label>
              <input
                type="number"
                value={pulseRate}
                onChange={(e) => setPulseRate(e.target.value)}
                placeholder="e.g. 72"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Sugar</label>
              <input
                type="text"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                placeholder="e.g. 110"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SpO2 Oxygen (%)</label>
              <input
                type="number"
                value={oxygenLevel}
                onChange={(e) => setOxygenLevel(e.target.value)}
                placeholder="e.g. 98"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 98.6"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mood State</label>
              <select
                value={moodState}
                onChange={(e) => setMoodState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="Cheerful">Cheerful & Alert</option>
                <option value="Calm">Calm & Resting</option>
                <option value="Fatigued">Fatigued / Sleepy</option>
                <option value="Confused">Mildly Confused</option>
                <option value="Agitated">Agitated / Discomfort</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Medications Administered</label>
            <input
              type="text"
              value={medicationsAdministered}
              onChange={(e) => setMedicationsAdministered(e.target.value)}
              placeholder="e.g. Lisinopril 10mg given at 9:30 AM with water"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Diet & Hydration Intake</label>
              <input
                type="text"
                value={dietNotes}
                onChange={(e) => setDietNotes(e.target.value)}
                placeholder="e.g. Finished vegetable soup, drank 500ml water"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobility & Exercises</label>
              <input
                type="text"
                value={mobilityExercises}
                onChange={(e) => setMobilityExercises(e.target.value)}
                placeholder="e.g. 20 min walker assistance in hallway"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Caregiver Summary & Observations <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe general patient condition, skin check, mental alertness, therapy response..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
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
              {isSubmitting ? 'Saving...' : 'Save & Share with Family'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
