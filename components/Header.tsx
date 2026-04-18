"use client";

import { getMe } from "@/lib/api/user";
import Link from "next/link";
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
  if (isLoading) return null;
  if (error) {
    if ((error as any).status === 401) {
      router.push("/login");
      return null;
    }

    console.error(error);
    return <div>エラーが発生しました</div>;
  }

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
