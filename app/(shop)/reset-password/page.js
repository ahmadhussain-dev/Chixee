import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import ResetForm from "@/components/auth/ResetForm";

export const metadata = { title: "Choose a new password", alternates: { canonical: "/reset-password" }, robots: { index: false } };

export default function Page() {
  return (
    <AuthCard title="Choose a new password" subtitle="Set a new password for your Chixee account.">
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthCard>
  );
}
