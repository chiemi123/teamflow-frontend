//app/projects/create/page.tsx
"use client";

import Loading from "@/components/ui/Loading";
import { isApiError } from "@/lib/api/errors";
import { createProject } from "@/lib/api/projects";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ProjectCreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");

    try {
      await createProject({ name, description });
      router.push("/projects");
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 403) {
          setSubmitError("権限がありません");
        } else if (err.status === 422) {
          setSubmitError("入力内容を確認してください");
        } else {
          setSubmitError(err.message || "プロジェクト作成に失敗しました");
        }
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("プロジェクト作成に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="プロジェクト作成中..." />;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">プロジェクト作成</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        {submitError && <p className="text-red-500">{submitError}</p>}

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
