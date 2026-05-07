"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import GuestRoute from "@/components/auth/GuesRoute";
import SignUp from "@/components/auth/SignupForm";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <GuestRoute>
        <SignUp />
    </GuestRoute>
  );
}