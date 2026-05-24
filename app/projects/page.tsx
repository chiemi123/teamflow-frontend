// /projects/page.tsx
"use client";

import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { getProjects } from "@/lib/api/projects";
import { useUser } from "@/lib/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import ProjectCard from "./components/ProjectCard";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (isLoading) return;

    // 認証されていない場合、ログインページにリダイレクト
    if (!isAuthenticated) {
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
    return <Loading message="認証情報を確認中..." />;
  }

  if (!user) return null;

  // プロジェクトデータが読み込み中の時
  if (projectLoading) {
    return <Loading message="プロジェクト読み込み中..." />;
  }

  const projects = data?.data ?? [];

  // プロジェクトデータ取得中にエラーが発生した場合
  if (error) {
    return <ErrorState message="プロジェクトの取得に失敗しました。" />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">プロジェクト一覧</h1>

        {user?.can_create_project && (
          <Link
            href="/projects/create"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            新規作成
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState message="プロジェクトがありません" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
