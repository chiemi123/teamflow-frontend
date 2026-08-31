// app/tasks/create/page.tsx
"use client";

import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { isApiError } from "@/lib/api/errors";
import { getOrganizationMembers } from "@/lib/api/organizationMembers";
import { getProjects } from "@/lib/api/projects";
import { createTask } from "@/lib/api/tasks";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";

export default function TaskCreatePage() {
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
    handleUnauthorized,
  } = useAuthGuard();

  const {
    data: projectData,
    error: projectError,
    isLoading: projectLoading,
  } = useSWR(isAuthenticated ? "/api/projects" : null, getProjects);

  const projects = projectData?.data ?? [];

  const {
    data: memberData,
    error: memberError,
    isLoading: memberLoading,
  } = useSWR(
    isAuthenticated ? "/api/organization-members" : null,
    getOrganizationMembers,
  );

  const members = memberData?.data ?? [];

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");

    try {
      await createTask({
        project_id: Number(projectId),
        title,
        description,
        assigned_user_id: assignedUserId ? Number(assignedUserId) : null,
      });

      router.push("/tasks");
    } catch (err: unknown) {
      if (handleUnauthorized(err)) {
        return;
      }

      if (isApiError(err)) {
        if (err.status === 403) {
          setSubmitError("権限がありません");
        } else if (err.status === 422) {
          setSubmitError("入力内容を確認してください");
        } else {
          setSubmitError(err.message || "タスク作成に失敗しました");
        }
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("タスク作成に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <Loading message="認証情報を確認中..." />;
  }

  if (!user) {
    return null;
  }

  if (projectLoading || memberLoading) {
    return <Loading message="タスク作成情報を読み込み中..." />;
  }

  if (projectError) {
    return <ErrorState message="プロジェクト一覧の取得に失敗しました。" />;
  }

  if (memberError) {
    return <ErrorState message="担当者一覧の取得に失敗しました。" />;
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

        <div>
          <label className="block mb-1 font-medium">担当者</label>
          <select
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">担当者なし</option>

            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {submitError && <p className="text-red-500">{submitError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "作成中..." : "作成"}
        </button>
      </form>
    </div>
  );
}
