import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import { AppShell } from "./components/layout/AppShell";
import { AdminShell } from "./components/layout/AdminShell";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { OnboardingPage } from "./pages/auth/OnboardingPage";
import { OwnerDashboard } from "./pages/owner/OwnerDashboard";
import { SalespersonDashboard } from "./pages/salesperson/SalespersonDashboard";
import { InboxPage } from "./pages/owner/InboxPage";
import { LeadsPage } from "./pages/owner/LeadsPage";
import { TeachAiPage } from "./pages/owner/TeachAiPage";
import { TeamPage } from "./pages/owner/TeamPage";
import { FollowUpsPage } from "./pages/owner/FollowUpsPage";
import { CampaignsPage } from "./pages/owner/CampaignsPage";
import { SettingsPage } from "./pages/owner/SettingsPage";

// Admin platform pages
import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { AdminOrganizationsPage } from "./pages/admin/AdminOrganizationsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminCampaignsPage } from "./pages/admin/AdminCampaignsPage";
import { AdminActivityPage } from "./pages/admin/AdminActivityPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RootRedirect = () => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const onboardingDone =
    localStorage.getItem("conversly_onboarding_completed") === "true" ||
    localStorage.getItem("conversly_qr_connected_v2") === "true";

  if (!onboardingDone) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Navigate
      to={role === "salesperson" ? "/my-dashboard" : "/dashboard"}
      replace
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
              {/* Root */}
              <Route path="/" element={<RootRedirect />} />

              {/* Auth & Onboarding */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Customer Workspace (AppShell) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <OwnerDashboard />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-dashboard"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <SalespersonDashboard />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inbox"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <InboxPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <LeadsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teach-ai"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <TeachAiPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <TeamPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/follow-ups"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <FollowUpsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <CampaignsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <SettingsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />

              {/* Platform Admin Operations (AdminShell) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminShell>
                      <AdminOverviewPage />
                    </AdminShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/organizations"
                element={
                  <ProtectedRoute>
                    <AdminShell>
                      <AdminOrganizationsPage />
                    </AdminShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminShell>
                      <AdminUsersPage />
                    </AdminShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/campaigns"
                element={
                  <ProtectedRoute>
                    <AdminShell>
                      <AdminCampaignsPage />
                    </AdminShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/activity"
                element={
                  <ProtectedRoute>
                    <AdminShell>
                      <AdminActivityPage />
                    </AdminShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminShell>
                      <AdminSettingsPage />
                    </AdminShell>
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;