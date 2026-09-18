import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Heart,
  ShieldCheck,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Users,
  Calendar,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, fastDemoLogin, isFamily, isCaregiver, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSwitch = async (role: 'family' | 'caregiver' | 'admin') => {
    await fastDemoLogin(role);
    setShowDemoMenu(false);
    if (role === 'admin') navigate('/admin');
    else if (role === 'caregiver') navigate('/caregiver/dashboard');
    else navigate('/dashboard');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                Elder<span className="text-teal-600">Care</span>
              </span>
              <span className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
                Home Nursing & Assistance
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-teal-700 bg-teal-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/services"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/services') ? 'text-teal-700 bg-teal-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Services
            </Link>

            <Link
              to="/caregivers"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/caregivers') ? 'text-teal-700 bg-teal-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Find Caregivers
            </Link>

            {/* Role specific quick links */}
            {user && (
              <>
                {isFamily && (
                  <>
                    <Link
                      to="/patients"
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        isActive('/patients') ? 'text-teal-700 bg-teal-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Elderly Profiles
                    </Link>
                    <Link
                      to="/bookings"
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        isActive('/bookings') ? 'text-teal-700 bg-teal-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/dashboard"
                      className={`px-3.5 py-2 rounded-xl text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100`}
                    >
                      Dashboard
                    </Link>
                  </>
                )}

                {isCaregiver && (
                  <Link
                    to="/caregiver/dashboard"
                    className="px-3.5 py-2 rounded-xl text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100"
                  >
                    Caregiver Portal
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3.5 py-2 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                  >
                    Admin Console
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Fast Demo Account Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors shadow-xs"
                title="Switch demo role without typing passwords"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Quick Demo Logins
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('family')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-teal-50 text-sm font-medium text-slate-800 flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-teal-700">Family User</div>
                      <div className="text-xs text-slate-500">Robert Jenkins (Bookings & Parents)</div>
                    </div>
                    {isFamily && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('caregiver')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-teal-50 text-sm font-medium text-slate-800 flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-teal-700">Verified Nurse</div>
                      <div className="text-xs text-slate-500">Sarah Jenkins, RN (Vitals & Care)</div>
                    </div>
                    {isCaregiver && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-sm font-medium text-slate-800 flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-indigo-700">Platform Admin</div>
                      <div className="text-xs text-slate-500">Dr. Vance (Verifications & Analytics)</div>
                    </div>
                    {isAdmin && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-teal-600 hover:text-teal-800 font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-slate-400 text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link) navigate(n.link);
                              setShowNotifications(false);
                            }}
                            className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                              n.isRead ? 'hover:bg-slate-50 opacity-75' : 'bg-teal-50/50 hover:bg-teal-50'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${n.isRead ? 'bg-slate-300' : 'bg-teal-600'}`} />
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-900">{n.title}</div>
                                <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden md:inline">
                    {user.fullName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-extrabold uppercase">
                    {user.role}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      user.fullName.charAt(0)
                    )}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {isFamily && (
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-teal-600" />
                          Family Dashboard
                        </Link>
                      )}
                      {isCaregiver && (
                        <Link
                          to="/caregiver/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-teal-600" />
                          Caregiver Dashboard
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-md shadow-teal-600/20 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-teal-50"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-teal-50"
          >
            Services
          </Link>
          <Link
            to="/caregivers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-teal-50"
          >
            Find Caregivers
          </Link>
          {user && (
            <>
              <Link
                to="/patients"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-teal-50"
              >
                Elderly Profiles
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 hover:bg-teal-50"
              >
                My Bookings
              </Link>
              {isCaregiver && (
                <Link
                  to="/caregiver/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-bold text-teal-700 bg-teal-50"
                >
                  Caregiver Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-bold text-indigo-700 bg-indigo-50"
                >
                  Admin Console
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};
