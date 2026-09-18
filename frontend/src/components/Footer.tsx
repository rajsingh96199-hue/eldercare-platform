import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Phone, Mail, MapPin, AlertTriangle, Award, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Safety & Trust Header */}
      <div className="bg-teal-950/60 border-b border-teal-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-base">ElderCare Trust & Safety Guarantee</div>
              <div className="text-xs text-teal-200">100% Background-Checked, State Licensed & Identity-Verified Personnel</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Police Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Certified Nurses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Insurance Protected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Elder<span className="text-teal-400">Care</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              ElderCare is a technology-enabled home healthcare assistance platform providing dignified, verified, and compassionate clinical care for aging parents and seniors.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+1 (800) 555-ELDER</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@eldercare.com</span>
              </div>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">
                  Skilled Nursing Care
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">
                  Elderly Care Attendant
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">
                  Geriatric Physiotherapy
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">
                  Post-Hospital Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/caregivers" className="hover:text-teal-400 transition-colors">
                  Find a Caregiver
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-400 transition-colors">
                  Join as Caregiver / Nurse
                </Link>
              </li>
              <li>
                <Link to="/complaints" className="hover:text-teal-400 transition-colors">
                  Dispute Resolution Center
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-teal-400 transition-colors">
                  Safety Protocols
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Legal & Privacy</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/legal" className="hover:text-teal-400 transition-colors">
                  Non-Emergency Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-teal-400 transition-colors">
                  Patient Health Privacy (HIPAA)
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-teal-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-teal-400 transition-colors">
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ElderCare Health Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 text-amber-400/90 font-medium text-[11px] bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-900/50">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Emergency Notice: In case of immediate medical crisis, call 911 directly.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
