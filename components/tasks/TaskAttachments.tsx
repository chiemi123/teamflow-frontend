//components/tasks/TaskAttachments.tsx
"use client";

import {
  deleteAttachment,
  getTaskAttachments,
  uploadTaskAttachment,
} from "@/lib/api/attachments";
import { useState } from "react";
import useSWR from "swr";

type TaskAttachmentsProps = {
  taskId: number;
};

export function TaskAttachments({ taskId }: TaskAttachmentsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    taskId ? `/api/tasks/${taskId}/attachments` : null,
    () => getTaskAttachments(taskId),
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await uploadTaskAttachment(taskId, selectedFile);
      setSelectedFile(null);
      await mutate();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: number) => {
    if (!confirm("この添付ファイルを削除しますか？")) return;

    await deleteAttachment(attachmentId);
    await mutate();
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500">添付ファイルを読み込み中...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-500">添付ファイルの取得に失敗しました。</p>
    );
  }

  const attachments = data?.data ?? [];

  return (
    <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">添付ファイル</h2>

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

                  <button
                    type="button"
                    onClick={() => handleDelete(attachment.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
