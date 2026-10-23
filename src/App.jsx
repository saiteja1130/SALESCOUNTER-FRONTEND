import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import { AppShell } from "./components/layout/AppShell";
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

const RootRedirect = () => {
  return <Navigate to="/onboarding" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route
                path="/dashboard"
                element={
                  <AppShell>
                    <OwnerDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/my-dashboard"
                element={
                  <AppShell>
                    <SalespersonDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/inbox"
                element={
                  <AppShell>
                    <InboxPage />
                  </AppShell>
                }
              />
              <Route
                path="/leads"
                element={
                  <AppShell>
                    <LeadsPage />
                  </AppShell>
                }
              />
              <Route
                path="/teach-ai"
                element={
                  <AppShell>
                    <TeachAiPage />
                  </AppShell>
                }
              />
              <Route
                path="/team"
                element={
                  <AppShell>
                    <TeamPage />
                  </AppShell>
                }
              />
              <Route
                path="/follow-ups"
                element={
                  <AppShell>
                    <FollowUpsPage />
                  </AppShell>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <AppShell>
                    <CampaignsPage />
                  </AppShell>
                }
              />
              <Route
                path="/settings"
                element={
                  <AppShell>
                    <SettingsPage />
                  </AppShell>
                }
              />
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;