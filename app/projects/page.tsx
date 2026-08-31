// app/projects/page.tsx

"use client";

import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { getProjects } from "@/lib/api/projects";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import Link from "next/link";
import useSWR from "swr";
import ProjectCard from "./components/ProjectCard";

export default function ProjectsPage() {
  const { user, isLoading, isAuthenticated } = useAuthGuard();

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
    return <ErrorState message="プロジェクト一覧の取得に失敗しました。" />;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">プロジェクト一覧</h1>

        {user?.can_create_project && (
          <Link
            href="/projects/create"
            className="inline-flex w-full justify-center rounded bg-green-500 px-4 py-2 text-white sm:w-auto"
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
              tasks_count={project.tasks_count}
              completed_tasks_count={project.completed_tasks_count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
