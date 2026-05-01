"use client";

import { getMe } from "@/lib/api/user";
import { UserResponse } from "@/types/user";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false); // ログイン状態を管理

  useEffect(() => {
    setMounted(true);
    // ログイン状態のチェック (localStorageやcookie等で管理されている場合)
    const token = localStorage.getItem("token"); // 例としてlocalStorageにトークンがあるか確認
    if (token) {
      setUserIsLoggedIn(true);
    } else {
      setUserIsLoggedIn(false);
    }
  }, []);

  const isLoginPage = pathname === "/login";

  // 👇 マウント後だけSWR動かす
  const { data, error, isLoading, mutate } = useSWR<UserResponse>(
    mounted && !isLoginPage && userIsLoggedIn
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/user` // ログインしていない場合はAPIリクエストを送らない
      : null,
    getMe,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const user = data?.data;

  // ログインしていない場合に自動でログインページにリダイレクト
  useEffect(() => {
    if (mounted && !isLoginPage && error && (error as any).status === 401) {
      router.replace("/login");
    }
  }, [error, isLoginPage, router, mounted]);

  // 👇 SSRとのズレ防止
  if (!mounted) return null;

  if (isLoginPage) return null;
  if (isLoading) return null;

  if (error && (error as any).status === 401) {
    return null;
  }

  if (error) {
    console.error(error);
    return <div>エラーが発生しました</div>;
  }

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    mutate(undefined, false);
    window.location.href = "/login";
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">TeamFlow</h1>

      <div className="flex items-center gap-6">
        <Link href="/projects">プロジェクト</Link>
        {user && <span>👤 {user.name}</span>}{" "}
        {/* ユーザー情報がある場合に名前を表示 */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
