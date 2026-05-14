import { Suspense } from "react";
import GuestRoute from "@/components/auth/GuesRoute";
import Login from "@/components/auth/LoginForm"; 

export default function LoginPage() {
  return (
    <GuestRoute>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Login/>
      </Suspense>
    </GuestRoute>
  );
}