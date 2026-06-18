import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in untuk membuka FVN TikTok Affiliate Center dan lanjut ke dashboard."
      footer={<>New to FVN? <Link href="/register" className="font-black text-violet-700 transition hover:text-fuchsia-700">Create account</Link></>}
    >
      <LoginForm googleEnabled={googleEnabled} tiktokEnabled={false} initialError={searchParams?.error} />
    </AuthLayout>
  );
}
