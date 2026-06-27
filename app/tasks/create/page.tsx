"use client";

import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { getProjects } from "@/lib/api/projects";
import { createTask } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";

export default function TaskCreatePage() {
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    data: projectData,
    error: projectError,
    isLoading: projectLoading,
  } = useSWR("/api/projects", getProjects);

  const projects = projectData?.data ?? [];

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createTask({
        project_id: Number(projectId),
        title,
        description,
        assigned_user_id: null,
      });

      router.push("/tasks");
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        message?: string;
      };
      if (error?.status === 403) {
        setError("権限がありません");
      } else if (error?.status === 422) {
        setError("入力内容を確認してください");
      } else {
        setError(error?.message || "タスク作成に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  if (projectLoading) {
    return <Loading message="プロジェクト情報を読み込み中..." />;
  }

  if (loading) {
    return <Loading message="タスク作成中..." />;
  }

  if (projectError) {
    return <ErrorState message="プロジェクト情報の取得に失敗しました。" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">タスク作成</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">プロジェクト</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">選択してください</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/*
        TODO(feature/task-assignee-selection):
        組織メンバー一覧API実装後、
        担当者選択(select)として復活予定
        <div>
          <label className="block mb-1 font-medium">担当者ID</label>
          <input
            type="number"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="未入力なら担当者なし"
          />
        </div>
        */}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          作成
        </button>
      </form>
    </div>
  );
}
