import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout     from './layouts/AppLayout'
import LoginPage     from './pages/LoginPage'
import SignupPage    from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import LessonsPage   from './pages/LessonsPage'
import CommunityPage from './pages/CommunityPage'
import AICoachPage          from './pages/AICoachPage'
import SettingsPage         from './pages/SettingsPage'
import ForgotPasswordPage   from './pages/ForgotPasswordPage'
import ResetPasswordPage    from './pages/ResetPasswordPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"           element={<PublicRoute><LoginPage          /></PublicRoute>} />
      <Route path="/signup"          element={<PublicRoute><SignupPage         /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      {/* Reset password: must be open — user arrives from email with no session yet */}
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* Protected — share the sidebar layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lessons"   element={<LessonsPage   />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/ai-coach"  element={<AICoachPage   />} />
        <Route path="/settings"  element={<SettingsPage  />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
