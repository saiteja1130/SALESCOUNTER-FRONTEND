import React, { createContext, useContext, useState, useEffect } from "react";
import { SEED_USERS } from "../data/seedData";
const AuthContext = createContext(void 0);
const ROLE_STORAGE_KEY = "conversly_active_role";
const PERMISSION_STORAGE_KEY = "conversly_salesperson_all_leads";
const USER_OVERRIDES_KEY = "conversly_user_overrides_v2";
const LOGGED_OUT_KEY = "conversly_is_logged_out";

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    return saved === "owner" || saved === "salesperson" ? saved : "owner";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(LOGGED_OUT_KEY) !== "true";
  });
  const [salespersonCanViewAllLeads, setSalespersonCanViewAllLeadsState] = useState(() => {
    const saved = localStorage.getItem(PERMISSION_STORAGE_KEY);
    return saved !== null ? saved === "true" : false;
  });
  const [userOverrides, setUserOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_OVERRIDES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(LOGGED_OUT_KEY, "true");
  };

  const login = (newRole = "owner") => {
    setRole(newRole);
    setIsAuthenticated(true);
    localStorage.removeItem(LOGGED_OUT_KEY);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
  };

  const setSalespersonCanViewAllLeads = (val) => {
    setSalespersonCanViewAllLeadsState(val);
    localStorage.setItem(PERMISSION_STORAGE_KEY, String(val));
  };
  const currentUser = React.useMemo(() => {
    const baseUser = role === "owner" ? SEED_USERS.find((u) => u.role === "owner") || SEED_USERS[0] : SEED_USERS.find((u) => u.role === "salesperson") || SEED_USERS[1];
    const overrides = userOverrides[baseUser.id] || {};
    return { ...baseUser, ...overrides };
  }, [role, userOverrides]);
  const updateCurrentUser = (updates) => {
    setUserOverrides((prev) => {
      const next = {
        ...prev,
        [currentUser.id]: {
          ...prev[currentUser.id] || {},
          ...updates
        }
      };
      localStorage.setItem(USER_OVERRIDES_KEY, JSON.stringify(next));
      return next;
    });
  };
  const switchRole = (newRole) => {
    setRole(newRole);
    setIsAuthenticated(true);
    localStorage.removeItem(LOGGED_OUT_KEY);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
  };
  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  }, [role]);
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        role,
        switchRole,
        isAuthenticated,
        login,
        logout,
        isOwner: role === "owner",
        isSalesperson: role === "salesperson",
        isSalesManager: role === "owner",
        isSalesRep: role === "salesperson",
        salespersonCanViewAllLeads,
        setSalespersonCanViewAllLeads,
        availableUsers: SEED_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export {
  AuthProvider,
  useAuth
};