"use client";

import {
  createTaskComment,
  deleteTaskComment,
  getTaskComments,
  updateTaskComment,
} from "@/lib/api/taskComments";
import { useState } from "react";
import useSWR from "swr";

type TaskCommentsProps = {
  taskId: number;
};

export default function TaskComments({ taskId }: TaskCommentsProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    taskId ? `/api/tasks/${taskId}/comments` : null,
    () => getTaskComments(taskId),
  );

  const comments = data?.data ?? [];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) return;

    try {
      setIsSubmitting(true);

      await createTaskComment(taskId, {
        content: content.trim(),
      });

      setContent("");
      mutate();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("このコメントを削除しますか？")) return;

    try {
      setDeletingId(commentId);

      await deleteTaskComment(commentId);

      mutate();
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (commentId: number, currentContent: string) => {
    setEditingId(commentId);
    setEditingContent(currentContent);
  };

  const handleUpdate = async (commentId: number) => {
    if (!editingContent.trim()) return;

    try {
      setUpdatingId(commentId);

      await updateTaskComment(commentId, {
        content: editingContent.trim(),
      });

      setEditingId(null);
      setEditingContent("");
      mutate();
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500">コメントを読み込み中...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-500">コメントの取得に失敗しました。</p>
    );
  }

  return (
    <section className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">コメント</h3>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="コメントを入力"
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          rows={3}
        />

        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex w-full items-center justify-center whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "投稿中..." : "投稿"}
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">まだコメントはありません。</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-md border border-gray-100 bg-gray-50 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  {comment.user?.name ?? "不明なユーザー"}
                </span>

                <div className="flex items-center gap-2">
                  <div className="text-right text-xs text-gray-400">
                    <p>
                      作成:{" "}
                      {new Date(comment.created_at).toLocaleString("ja-JP")}
                    </p>

                    {comment.created_at !== comment.updated_at && (
                      <p>
                        更新:{" "}
                        {new Date(comment.updated_at).toLocaleString("ja-JP")}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => startEdit(comment.id, comment.content)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    編集
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="text-xs text-red-500 hover:underline disabled:text-gray-400"
                  >
                    {deletingId === comment.id ? "削除中..." : "削除"}
                  </button>
                </div>
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                    rows={3}
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(comment.id)}
                      disabled={
                        updatingId === comment.id || !editingContent.trim()
                      }
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white disabled:bg-gray-300"
                    >
                      {updatingId === comment.id ? "更新中..." : "保存"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditingContent("");
                      }}
                      className="rounded-md border border-gray-300 px-3 py-1 text-xs"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm text-gray-700">
                  {comment.content}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
