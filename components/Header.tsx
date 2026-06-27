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
    <header className="bg-gray-800 px-4 py-4 text-white sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/projects" className="text-lg font-bold">
          TeamFlow
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <nav className="flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className={`rounded px-4 py-2 font-medium ${
                pathname.startsWith("/projects")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              プロジェクト
            </Link>

            <Link
              href="/tasks"
              className={`rounded px-4 py-2 font-medium ${
                pathname.startsWith("/tasks")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              タスク
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-4">
            {user?.name && <span>👤 {user.name}</span>}

            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 font-medium hover:bg-red-600"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
