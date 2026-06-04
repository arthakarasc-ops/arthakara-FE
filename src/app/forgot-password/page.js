import { Suspense } from "react";
import GuestRoute from "@/components/auth/GuesRoute";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Lupa Password - Arthakara",
  description: "Reset password akun Arthakara Anda melalui verifikasi email.",
};

export default function ForgotPasswordPage() {
  return (
    <GuestRoute>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </GuestRoute>
  );
}
