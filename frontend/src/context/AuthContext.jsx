import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadUser();
  }, []);

  function updateStorageUsed(delta) {
    setUser(function (prev) {
      if (!prev) return prev;
      return { ...prev, storageUsed: prev.storageUsed + delta };
    });
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  const value = {
    user: user,
    setUser: setUser,
    loading: loading,
    logout: logout,
    refreshUser: loadUser,
    updateStorageUsed: updateStorageUsed,
  };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
