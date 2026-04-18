"use client";

import Link from "next/link";
import { getMe } from "@/lib/api/user";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  // 👇 ログイン画面では何もしない
  const { data, error, isLoading } = useSWR(
    isLoginPage ? null : "/api/me",
    getMe,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  if (isLoginPage) return null;

  if (error?.message === "unauthorized") {
    return null;
  }

  if (isLoading) return null;

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">TeamFlow</h1>

      <div className="flex items-center gap-6">
        <Link href="/projects">プロジェクト</Link>
        <span>👤 {data?.name}</span>

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
