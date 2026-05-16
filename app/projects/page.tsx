// /projects/page.tsx
"use client";

import { getProjects } from "@/lib/api/projects";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, errorMessage } = useUser();

  console.log("⑨ProjectsPage - User:", user);
  console.log("⑪ProjectsPage - isLoading:", isLoading);
  console.log("⑫ProjectsPage - Error:", errorMessage);

  useEffect(() => {
    if (isLoading) return;

    // 認証されていない場合、ログインページにリダイレクト
    if (!isAuthenticated) {
      console.log("⑭ProjectsPage - Not authenticated, redirecting...");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // プロジェクトデータを取得
  const {
    data,
    error,
    isLoading: projectLoading,
  } = useSWR(
    isAuthenticated ? "/api/projects" : null, // リクエストURL
    getProjects, // データ取得のための関数
  );

  if (isLoading) {
    console.log("⑬ProjectsPage - Loading...");
    return <div>読み込み中...</div>;
  }

  if (!user) return null;

  // プロジェクトデータが読み込み中の時
  if (projectLoading) {
    console.log("⑮ProjectsPage - Loading projects...");
    return <div>プロジェクト読み込み中...</div>;
  }

  // プロジェクトデータ取得中にエラーが発生した場合
  if (error) {
    console.error("⑯ProjectsPage - Error fetching projects:", error);
    return <div>プロジェクトの取得に失敗しました。</div>;
  }

  return (
    <div>
      <h1>プロジェクト一覧</h1>
      {/* プロジェクトデータを表示 */}
      {data?.data?.length ? (
        <ul>
          {data.data.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      ) : (
        <p>プロジェクトがありません</p>
      )}
    </div>
  );
}
