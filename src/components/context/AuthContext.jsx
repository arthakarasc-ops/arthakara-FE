"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, forgotPasswordUser } from "@/lib/api"; // 1. Ditambahkan forgotPasswordUser
import { setAuth, getToken, getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { status, data } = await loginUser({ email, password });

      if (!data) {
        throw new Error("Response tidak valid dari server");
      }

      if (status !== 200) {
        throw new Error(data.error || "Login gagal");
      }

      if (!data.token || !data.user) {
        throw new Error("Data token atau user tidak ditemukan");
      }

      setAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user);

      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const { status, data } = await registerUser(formData);

      if (!data) {
        throw new Error("Response tidak valid dari server");
      }

      if (status !== 201) {
        throw new Error(data.error || "Pendaftaran gagal");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // 2. FUNGSI BARU: Reset Password untuk memanggil API backend
  const resetPassword = async (email) => {
    try {
      const { status, data } = await forgotPasswordUser({ email });

      if (!data) {
        throw new Error("Response tidak valid dari server");
      }

      // Menyesuaikan status code sukses HTTP (biasanya 200 OK)
      if (status !== 200) {
        throw new Error(data.error || "Gagal mengirim link reset password");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        resetPassword, // 3. Didaftarkan ke provider agar bisa dikonsumsi page ForgotPassword
        updateUser,
        logout: handleLogout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);