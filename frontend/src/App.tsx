import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SeniorModeProvider } from './contexts/SeniorModeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { EmergencyBanner } from './components/EmergencyBanner';
import { SeniorModeControls } from './components/SeniorModeControls';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ServicesPage } from './pages/ServicesPage';
import { CaregiverDirectory } from './pages/CaregiverDirectory';
import { CaregiverDetail } from './pages/CaregiverDetail';
import { BookingWizard } from './pages/BookingWizard';
import { BookingsList } from './pages/BookingsList';
import { BookingDetail } from './pages/BookingDetail';
import { UserDashboard } from './pages/UserDashboard';
import { PatientManagement } from './pages/PatientManagement';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { TermsPrivacy } from './pages/TermsPrivacy';

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-teal-700 font-bold">Loading ElderCare...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'CAREGIVER') return <Navigate to="/caregiver/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SeniorModeProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
              {/* Top Emergency Disclaimer & Hotline */}
              <EmergencyBanner />

              {/* Accessibility Controls Toolbar */}
              <SeniorModeControls />

              {/* Main Navigation Bar */}
              <Navbar />

              {/* Page Viewport */}
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/caregivers" element={<CaregiverDirectory />} />
                  <Route path="/caregivers/:id" element={<CaregiverDetail />} />
                  <Route path="/legal" element={<TermsPrivacy />} />

                  {/* Authenticated routes */}
                  <Route
                    path="/book"
                    element={
                      <ProtectedRoute>
                        <BookingWizard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <ProtectedRoute>
                        <BookingsList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookings/:id"
                    element={
                      <ProtectedRoute>
                        <BookingDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute roles={['FAMILY', 'ADMIN']}>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patients"
                    element={
                      <ProtectedRoute roles={['FAMILY', 'ADMIN']}>
                        <PatientManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patients/:id"
                    element={
                      <ProtectedRoute roles={['FAMILY', 'CAREGIVER', 'ADMIN']}>
                        <PatientManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/caregiver/dashboard"
                    element={
                      <ProtectedRoute roles={['CAREGIVER', 'ADMIN']}>
                        <CaregiverDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute roles={['ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/complaints"
                    element={
                      <ProtectedRoute>
                        <ComplaintsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </SeniorModeProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
