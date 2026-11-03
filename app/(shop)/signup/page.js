import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = { title: "Join Chixee", alternates: { canonical: "/signup" } };

export default function Page() {
  return (
    <AuthCard title="Join Chixee" subtitle="Create an account to save addresses and track orders.">
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthCard>
  );
}
