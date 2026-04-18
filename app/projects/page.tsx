"use client";

import { apiFetch } from "@/lib/api/client";
import { useRouter } from "next/navigation";
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
    "/api/projects",
    apiFetch,
  );

  if (error?.message === "unauthorized") {
    router.push("/login");
    return null;
  }

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラー発生</p>;

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
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
