// Header.tsx
"use client";

import { apiFetch } from "@/lib/api/client";
import { useUser } from "@/lib/hooks/useUser";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  // useUser フックから認証状態を取得
  const { user, isLoading, isAuthenticated, errorMessage } = useUser();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // ログインページでは Header を表示しない
  if (pathname === "/login") {
    return null; // ログインページでは Header を表示しない
  }

  // ローディング中やエラー時に何も表示しない
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  // エラー時に表示
  if (errorMessage) {
    console.error("Error fetching user data:", errorMessage);
    return <div>エラーが発生しました</div>;
  }

  if (!user) {
    return null;
  }

  // ログアウト処理
  const handleLogout = async () => {
    console.log("⑧Logging out...");

    await apiFetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">TeamFlow</h1>
      <div className="flex items-center gap-6">
        <Link href="/projects">プロジェクト</Link>
        {user?.name && <span>👤 {user?.name}</span>}
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
