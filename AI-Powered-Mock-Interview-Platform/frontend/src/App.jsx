import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const InterviewSetupPage = lazy(() => import('./pages/interview/InterviewSetupPage'));
const InterviewPage = lazy(() => import('./pages/interview/InterviewPage'));
const InterviewCompletePage = lazy(() => import('./pages/interview/InterviewCompletePage'));
const HistoryPage = lazy(() => import('./pages/history/HistoryPage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const ReportsListPage = lazy(() => import('./pages/report/ReportsListPage'));
const LeaderboardPage = lazy(() => import('./pages/leaderboard/LeaderboardPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback
const PageLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}
  >
    <div className="flex-col flex-center gap-4">
      <div className="spinner spinner-lg" />
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
        Loading...
      </p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes — with Dashboard Layout (Sidebar) */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/interview/setup" element={<InterviewSetupPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/reports" element={<ReportsListPage />} />
                <Route path="/reports/:id" element={<ReportPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Interview (full screen — no sidebar) */}
              <Route
                path="/interview/:id"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <InterviewPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:id/complete"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <InterviewCompletePage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <DashboardLayout>
                      <AdminPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect old paths */}
              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                boxShadow: 'var(--shadow-lg)',
              },
              success: {
                iconTheme: { primary: '#43E97B', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: 'white' },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
