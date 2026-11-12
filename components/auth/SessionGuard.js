"use client";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

// When the server says the session has ended (refresh token revoked, reused or expired), clear the cookie
// so the site shows the signed-out state everywhere.
export default function SessionGuard() {
  const { data } = useSession();
  useEffect(() => {
    if (data?.error) signOut({ redirect: false });
  }, [data?.error]);
  return null;
}
