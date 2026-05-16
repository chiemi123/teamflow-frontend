// lib/hooks/useUser.ts
"use client";

import { getMe } from "@/lib/api/user";
import { UserResponse } from "@/types/user";
import useSWR from "swr";

export const useUser = () => {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  // useSWR を使ってユーザー情報を取得
  const { data, error, isLoading, mutate } = useSWR<UserResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
    getMe,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false, // フォーカス戻ったときに再リクエストしない
      //dedupingInterval: 10000,
    },
  );

  console.log("SWR Full URL:", `${process.env.NEXT_PUBLIC_API_URL}/api/user`);
  console.log("useUser SWR - Data:", data);
  console.log("User Info:", data);
  console.log("useUser SWR - Error:", error);
  console.log("useUser SWR - Is Loading:", isLoading);

  return {
    user: data ? (data?.data ?? null) : undefined,
    isLoading,
    isAuthenticated: !!data,
    errorMessage: error ? "ユーザー情報の取得に失敗しました。" : null,
    mutate,
  };
};
