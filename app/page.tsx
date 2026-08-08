// app/page.tsx

"use client";

import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, isLoading, errorMessage } = useUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      router.replace("/projects");
      return;
    }

    if (errorMessage) {
      router.replace("/login");
    }
  }, [user, isLoading, errorMessage, router]);

  return null;
}
