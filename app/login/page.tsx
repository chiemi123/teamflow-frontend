"use client";

import { useUser } from "@/lib/hooks/useUser";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, mutate } = useUser();
  //const router = useRouter();

  useEffect(() => {
    console.error("user状態", user);

    if (user && typeof user === "object" && "id" in user) {
      console.error("条件一致：/projectsにリダイレクト");
      window.location.href = "/projects"; // userが存在したら/projectsに遷移
    }
  }, [user]);

  // handleLogin関数をコンポーネント内で定義
  const handleLogin = async () => {
    console.log("ログイン処理開始");

    if (!email || !password) {
      console.log("メールアドレスまたはパスワードが未入力です");
      return;
    }

    try {
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("① csrf start");

      const csrfRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`,
        {
          method: "GET",
          credentials: "include", // クッキーを含める
        },
      );

      // CSRFレスポンスステータスを確認
      console.log("CSRFレスポンスステータス:", csrfRes.status);

      if (!csrfRes.ok) {
        console.error("CSRF取得失敗", csrfRes.status);
        return;
      }

      // XSRF-TOKENをクッキーから取得
      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      // XSRF-TOKENが取得できていない場合、ログ出力
      console.log("取得したXSRF-TOKEN:", xsrfToken); // undefinedが出る場合、ここが失敗の原因

      if (!xsrfToken) {
        console.error("XSRF-TOKENがクッキーに設定されていません");
        return;
      }

      console.log("③ login start");

      // ログインリクエスト
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        credentials: "include", // クッキーを含める
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken || ""),
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("④ login response", res.status);

      if (!res.ok) {
        console.error("ログイン失敗", res.status);
        const data = await res.json();
        alert(data.message ?? "ログイン失敗");
        return;
      }

      // ログイン成功後、isAuthenticated を true に設定
      console.log("⑥ success → redirect");
      // 認証状態を更新する
      //setIsAuthenticated(true);
      console.log("⑦ ok");
      await mutate();
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログイン失敗");
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

          <button
            id="login-button"
            type="button"
            onClick={handleLogin}
            className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
}
