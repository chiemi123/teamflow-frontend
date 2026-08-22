// components/tasks/TaskAttachments.tsx
"use client";

import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import {
  deleteAttachment,
  getTaskAttachments,
  uploadTaskAttachment,
} from "@/lib/api/attachments";
import { isApiError } from "@/lib/api/errors";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useState } from "react";
import useSWR from "swr";

type TaskAttachmentsProps = {
  taskId: number;
  readonly?: boolean;
};

export function TaskAttachments({
  taskId,
  readonly = false,
}: TaskAttachmentsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const { handleUnauthorized } = useAuthGuard();

  const { data, error, isLoading, mutate } = useSWR(
    taskId ? `/api/tasks/${taskId}/attachments` : null,
    () => getTaskAttachments(taskId),
  );

  const handleUpload = async () => {
    if (!selectedFile || readonly) return;

    setActionError("");

    try {
      setIsUploading(true);

      await uploadTaskAttachment(taskId, selectedFile);
      setSelectedFile(null);
      await mutate();
    } catch (err: unknown) {
      if (handleUnauthorized(err)) {
        return;
      }

      if (isApiError(err)) {
        if (err.status === 403) {
          setActionError("この操作を行う権限がありません");
        } else if (err.status === 422) {
          setActionError("アップロードするファイルを確認してください");
        } else {
          setActionError(
            err.message || "添付ファイルのアップロードに失敗しました",
          );
        }
      } else if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError("添付ファイルのアップロードに失敗しました");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: number) => {
    if (readonly) return;
    if (!window.confirm("この添付ファイルを削除しますか？")) return;

    setActionError("");

    try {
      setDeletingId(attachmentId);

      await deleteAttachment(attachmentId);
      await mutate();
    } catch (err: unknown) {
      if (handleUnauthorized(err)) {
        return;
      }

      if (isApiError(err)) {
        if (err.status === 403) {
          setActionError("この操作を行う権限がありません");
        } else {
          setActionError(err.message || "添付ファイルの削除に失敗しました");
        }
      } else if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError("添付ファイルの削除に失敗しました");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <Loading message="添付ファイルを読み込み中..." />;
  }

  if (error) {
    return <ErrorState message="添付ファイルの取得に失敗しました。" />;
  }

  const attachments = data?.data ?? [];

  return (
    <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">添付ファイル</h2>
      {actionError && (
        <p className="mt-3 text-sm text-red-500">{actionError}</p>
      )}

      {!readonly && (
        <div className="mt-4 flex flex-col gap-3">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-medium file:hover:bg-gray-200"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="inline-flex w-full items-center justify-center whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isUploading ? "アップロード中..." : "アップロード"}
          </button>
        </div>
      )}

      <div className="mt-4">
        {attachments.length === 0 ? (
          <p className="text-sm text-gray-500">
            添付ファイルはまだありません。
          </p>
        ) : (
          <ul className="space-y-2">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex flex-col gap-3 rounded-md border border-gray-100 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{attachment.file_name}</p>
                  <p className="text-xs text-gray-500">
                    {attachment.user?.name ?? "不明なユーザー"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                  <a
                    href={attachment.download_url}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ダウンロード
                  </a>

                  {!readonly && (
                    <button
                      type="button"
                      onClick={() => handleDelete(attachment.id)}
                      disabled={deletingId === attachment.id}
                      className="text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                    >
                      {deletingId === attachment.id ? "削除中..." : "削除"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
