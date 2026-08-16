// app/login/page.tsx

"use client";

import Loading from "@/components/ui/Loading";
import { apiFetch } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading, mutate } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/projects");
    }
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return <Loading message="認証情報を確認中..." />;
  }

  // handleLogin関数をコンポーネント内で定義
  const handleLogin = async () => {
    setSubmitError("");

    if (!email || !password) {
      setSubmitError("メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      setIsSubmitting(true);

      await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      await mutate();
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 401 || err.status === 422) {
          setSubmitError("メールアドレスまたはパスワードを確認してください");
        } else {
          setSubmitError(err.message || "ログインに失敗しました");
        }
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("ログインに失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">TeamFlow</h1>
          <p className="mt-2 text-sm text-gray-500">
            アカウントにログインしてください
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {submitError && <p className="text-sm text-red-500">{submitError}</p>}

          <button
            id="login-button"
            type="button"
            onClick={handleLogin}
            disabled={isSubmitting}
            className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </div>
      </div>
    </div>
  );
}
