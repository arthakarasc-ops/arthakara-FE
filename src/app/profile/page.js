import AuthRoute from "@/components/auth/AuthRoute";
import ProfilePage from "@/components/profile/ProfilePage";

export const metadata = {
  title: "Profil - Arthakara",
  description: "Halaman profil pengguna Arthakara",
};

export default function Profile() {
  return (
    <AuthRoute>
      <ProfilePage />
    </AuthRoute>
  );
}
