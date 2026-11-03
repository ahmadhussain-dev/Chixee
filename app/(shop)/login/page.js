import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Welcome back", alternates: { canonical: "/login" } };

export default function Page() {
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to reorder your favourites faster.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
