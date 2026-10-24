import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "../api/client";

const AuthContext = createContext(undefined);

const ROLE_STORAGE_KEY = "conversly_active_role";
const PERMISSION_STORAGE_KEY = "conversly_salesperson_all_leads";
const USER_OVERRIDES_KEY = "conversly_user_overrides_v2";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [entitlements, setEntitlements] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_STORAGE_KEY) || "owner");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  const salespersonCanViewAllLeads = Boolean(
    user?.canViewAllLeads || role === "owner" || role === "admin"
  );

  const [userOverrides, setUserOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_OVERRIDES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Verify and restore active session from HTTP-only cookie on mount
  const checkAuthSession = useCallback(async () => {
    try {
      setIsInitializing(true);
      const res = await apiClient.get("/auth/me");
      if (res.success && res.user) {
        setUser(res.user);
        setOrganization(res.organization);
        setSubscription(res.subscription);
        setEntitlements(res.entitlements);
        setRole(res.user.role || "owner");
        setIsAuthenticated(true);
        localStorage.setItem(ROLE_STORAGE_KEY, res.user.role || "owner");
      }
    } catch (err) {
      // 401 or network/database error: fallback to logged-out state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    checkAuthSession();
  }, [checkAuthSession]);

  // Login via API with single-login session enforcement
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      if (res.success) {
        setUser(res.user);
        setOrganization(res.organization);
        setSubscription(res.subscription);
        setEntitlements(res.entitlements);
        const resolvedRole = res.user.role || "owner";
        setRole(resolvedRole);
        setIsAuthenticated(true);
        localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
        return res;
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Signup via API
  const signup = async ({ companyName, fullName, email, password }) => {
    setAuthError(null);
    try {
      const res = await apiClient.post("/auth/signup", {
        companyName,
        fullName,
        email,
        password,
      });
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Sign out and invalidate session in database + clear cookie
  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setOrganization(null);
      setSubscription(null);
      setEntitlements(null);
      setIsAuthenticated(false);
      localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  };

  const setSalespersonCanViewAllLeads = (val) => {
    setUser((prev) => (prev ? { ...prev, canViewAllLeads: Boolean(val) } : prev));
  };

  const currentUser = React.useMemo(() => {
    if (!user) return null;
    const overrides = userOverrides[user.id] || {};
    return { ...user, ...overrides };
  }, [user, userOverrides]);

  const updateCurrentUser = (updates) => {
    if (!currentUser) return;
    setUserOverrides((prev) => {
      const next = {
        ...prev,
        [currentUser.id]: {
          ...(prev[currentUser.id] || {}),
          ...updates,
        },
      };
      localStorage.setItem(USER_OVERRIDES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateOrganizationOnboarding = (onboardingData) => {
    setOrganization((prev) => (prev ? { ...prev, onboarding: onboardingData } : prev));
  };

  const updateOrganizationState = (updatedOrg) => {
    setOrganization((prev) => (prev ? { ...prev, ...updatedOrg } : updatedOrg));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user,
        organization,
        subscription,
        entitlements,
        updateCurrentUser,
        updateOrganizationOnboarding,
        updateOrganizationState,
        role,
        isAuthenticated,
        isInitializing,
        authError,
        login,
        signup,
        logout,
        checkAuthSession,
        isOwner: role === "owner",
        isSalesperson: role === "salesperson",
        isSalesManager: role === "owner",
        isSalesRep: role === "salesperson",
        isPlatformAdmin: role === "admin",
        salespersonCanViewAllLeads,
        setSalespersonCanViewAllLeads,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}