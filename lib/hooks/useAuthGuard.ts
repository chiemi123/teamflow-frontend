// lib/hooks/useAuthGuard.ts
"use client";

import { isApiError } from "@/lib/api/errors";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export const useAuthGuard = () => {
  const router = useRouter();

  const {
    user,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    errorMessage,
    mutate,
  } = useUser();

  useEffect(() => {
    if (isLoading) return;

    if (isUnauthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isUnauthenticated, router]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void mutate().catch(() => undefined);
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [mutate]);

  const handleUnauthorized = useCallback(
    (error: unknown) => {
      if (!isApiError(error) || error.status !== 401) {
        return false;
      }

      void mutate(undefined, { revalidate: false });
      router.replace("/login");

      return true;
    },
    [mutate, router],
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    errorMessage,
    handleUnauthorized,
  };
};
