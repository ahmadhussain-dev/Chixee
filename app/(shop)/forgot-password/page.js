import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import ForgotForm from "@/components/auth/ForgotForm";

export const metadata = { title: "Forgot password", alternates: { canonical: "/forgot-password" } };

export default function Page() {
  return (
    <AuthCard title="Forgot password" subtitle="Enter your account email and we'll send you a reset link.">
      <Suspense>
        <ForgotForm />
      </Suspense>
    </AuthCard>
  );
}
