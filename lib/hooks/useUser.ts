// lib/hooks/useUser.ts
"use client";

import { isApiError } from "@/lib/api/errors";
import { getMe } from "@/lib/api/user";
import { UserResponse } from "@/types/user";
import useSWR from "swr";

export const useUser = () => {
  // useSWR を使ってユーザー情報を取得
  const { data, error, isLoading, mutate } = useSWR<UserResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
    getMe,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false, // フォーカス戻ったときに再リクエストしない
    },
  );

  const isUnauthenticated = isApiError(error) && error.status === 401;

  return {
    user: isUnauthenticated ? null : data ? (data.data ?? null) : undefined,
    isLoading,
    isAuthenticated: !!data && !isUnauthenticated,
    errorMessage: error ? "ユーザー情報の取得に失敗しました。" : null,
    mutate,
  };
};
