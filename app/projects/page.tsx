"use client";

import { apiFetch } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

type Project = {
  id: number;
  name: string;
};

type ProjectResponse = {
  data: Project[];
};

export default function ProjectsPage() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR<ProjectResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
    apiFetch,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    if (error && (error as any).status === 401) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isLoading) return <p>読み込み中...</p>;

  if (error && (error as any).status === 401) {
    return null;
  }

  if (error) {
    console.error(error);
    return <p>エラー発生</p>;
  }

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  return (
    <div>
      <h1>プロジェクト一覧</h1>
      <button onClick={handleLogout}>ログアウト</button>
      <ul>
        {data?.data.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
