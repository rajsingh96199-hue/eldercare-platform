import React, { useState, useEffect } from 'react';
import { AdminAnalytics, User, Complaint, CaregiverProfile } from '../types';
import api from '../services/api';
import {
  ShieldCheck,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Calendar,
  Activity,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<CaregiverProfile[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tab switcher
  const [activeTab, setActiveTab] = useState<'analytics' | 'verifications' | 'users' | 'complaints'>('analytics');
  const [userSearch, setUserSearch] = useState('');
  const [resolvingComplaintId, setResolvingComplaintId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [analyticsRes, usersRes, verifsRes, complaintsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/verifications'),
        api.get('/complaints'),
      ]);

      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (verifsRes.data.success) setPendingVerifications(verifsRes.data.data);
      if (complaintsRes.data.success) setComplaints(complaintsRes.data.data);
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReviewVerification = async (caregiverId: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await api.post(`/admin/verifications/${caregiverId}/review`, {
        status,
        notes: status === 'VERIFIED' ? 'State license verified and approved by admin.' : 'Document failed validity check.',
      });
      fetchAdminData();
    } catch (error) {
      alert('Failed to update verification status.');
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      fetchAdminData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to toggle status.');
    }
  };

  const handleResolveComplaint = async (complaintId: string) => {
    if (!resolutionNote.trim()) return;
    try {
      await api.patch(`/complaints/${complaintId}/status`, {
        status: 'RESOLVED',
        adminResolution: resolutionNote,
      });
      setResolvingComplaintId(null);
      setResolutionNote('');
      fetchAdminData();
    } catch (error) {
      alert('Failed to resolve complaint.');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading platform administration analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">ElderCare Operations</span>
          <h1 className="text-2xl sm:text-3xl font-black">Platform Administration Console</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Credential verification, user governance, dispute mediation, and financial reporting
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'analytics', label: 'Platform Analytics & Revenue', icon: TrendingUp },
          { id: 'verifications', label: `Caregiver Verifications (${pendingVerifications.length})`, icon: FileCheck },
          { id: 'users', label: `Users & Roles (${users.length})`, icon: Users },
          { id: 'complaints', label: `Disputes & Tickets (${complaints.filter((c) => c.status === 'OPEN').length} Open)`, icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & METRICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
              <div className="text-xs font-bold text-slate-500 uppercase">Gross Merchandise Value (GMV)</div>
              <div className="text-3xl font-black text-slate-900 mt-1">${analytics.financials.gmv}</div>
              <div className="text-xs text-emerald-600 font-bold mt-1">Total Platform Booking Volume</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
              <div className="text-xs font-bold text-slate-500 uppercase">Platform Revenue (10% Fee)</div>
              <div className="text-3xl font-black text-indigo-600 mt-1">${analytics.financials.platformRevenue}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Completed Booking Take Rate</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
              <div className="text-xs font-bold text-slate-500 uppercase">Total Care Sessions</div>
              <div className="text-3xl font-black text-teal-600 mt-1">{analytics.bookings.total}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{analytics.bookings.active} active shifts right now</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
              <div className="text-xs font-bold text-slate-500 uppercase">Verified Caregivers</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{analytics.users.verifiedCaregivers}</div>
              <div className="text-xs text-amber-600 font-bold mt-1">{analytics.users.pendingVerifications} awaiting review</div>
            </div>
          </div>

          {/* Service Volume Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Service Category Bookings Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.servicesBreakdown.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500">{s.title}</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{s.bookingsCount}</div>
                  <div className="text-[11px] text-teal-700 font-semibold">Total Shifts Placed</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAREGIVER VERIFICATION DESK */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Caregiver Credential & License Desk</h3>
            <span className="text-xs font-semibold text-slate-500">
              Review submitted medical licenses and background checks
            </span>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 text-slate-400 text-xs">
              All caregiver verification submissions are currently up to date.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVerifications.map((cg) => (
                <div
                  key={cg.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={cg.user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'}
                        alt=""
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-100"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 text-base">{cg.user?.fullName}</div>
                        <div className="text-xs text-teal-700 font-semibold">{cg.title} • {cg.yearsExperience} yrs exp</div>
                        <div className="text-[11px] text-slate-500">{cg.user?.email} • {cg.user?.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewVerification(cg.id, 'VERIFIED')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Verify</span>
                      </button>
                      <button
                        onClick={() => handleReviewVerification(cg.id, 'REJECTED')}
                        className="px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>

                  {/* Documents Attached */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Submitted Credentials</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cg.documents?.map((doc) => (
                        <div key={doc.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{doc.name}</div>
                            <div className="text-[10px] text-slate-500">Type: {doc.type} • Status: {doc.status}</div>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-teal-100 text-teal-800 text-[11px] font-bold hover:underline"
                          >
                            Inspect
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER GOVERNANCE */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <div>{u.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : u.role === 'CAREGIVER' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{u.city || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              u.isActive
                                ? 'bg-red-50 hover:bg-red-100 text-red-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {u.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DISPUTE & COMPLAINTS MEDIATION */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Dispute & Complaint Mediation Center</h3>

          {complaints.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 text-slate-400 text-xs">
              No disputes or complaints filed on the platform.
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
                        c.priority === 'URGENT' ? 'bg-red-100 text-red-800' : c.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
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
                      Filed on {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{c.subject}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                      {c.description}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-2">
                      Complainant: <strong>{c.user?.fullName}</strong> ({c.user?.email}) • Against: <strong>{c.againstUser?.fullName || 'N/A'}</strong>
                    </div>
                  </div>

                  {/* Resolution Input */}
                  {c.status !== 'RESOLVED' ? (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <textarea
                        rows={2}
                        value={resolvingComplaintId === c.id ? resolutionNote : ''}
                        onChange={(e) => {
                          setResolvingComplaintId(c.id);
                          setResolutionNote(e.target.value);
                        }}
                        placeholder="Write admin findings & resolution..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleResolveComplaint(c.id)}
                        disabled={!resolutionNote.trim() || resolvingComplaintId !== c.id}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-50"
                      >
                        Issue Resolution & Close Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950 font-medium">
                      <strong>Admin Resolution:</strong> {c.adminResolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
