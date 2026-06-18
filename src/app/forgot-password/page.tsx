import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="Masukkan email akun untuk menerima instruksi reset password."
      footer={<Link href="/login" className="font-black text-violet-700 transition hover:text-fuchsia-700">Back to login</Link>}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
