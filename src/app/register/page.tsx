import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Daftarkan akun baru untuk mengakses workflow affiliate FVN."
      footer={<>Already have an account? <Link href="/login" className="font-black text-violet-700 transition hover:text-fuchsia-700">Sign in</Link></>}
    >
      <RegisterForm googleEnabled={googleEnabled} tiktokEnabled={false} />
    </AuthLayout>
  );
}
