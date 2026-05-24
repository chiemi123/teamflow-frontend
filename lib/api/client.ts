// lib/api/client.ts

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 環境変数からAPI URLを取得

  if (!apiUrl) {
    console.error("API URL is not defined in the environment variables.");
    return;
  }

  console.log("API URL:", apiUrl); // 環境変数から取得した API URL を確認
  console.log("Fetching URL:", url); // 実際にリクエストする URL を確認

  // CSRF Cookieの取得
  const method = options.method?.toUpperCase() || "GET";

  try {
    // GET以外だけCSRF取得
    if (method !== "GET") {
      console.log("Fetching CSRF cookie...");
      // CSRF Cookieを取得
      await fetch(`${apiUrl}/sanctum/csrf-cookie`, {
        credentials: "include",
      });
    }
  } catch (error) {
    console.error("Failed to fetch CSRF cookie:", error);
    return;
  }

  // Cookieからトークンを取得
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (!token) {
    console.error("XSRF-TOKEN is missing from cookies.");
    return; // トークンがない場合は処理を中止
  }

  console.log("TOKEN:", token); // 確認用

  // ヘッダーを統合（順番重要）
  const headers: HeadersInit = {
    ...(options.headers || {}), // 上書き防止
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-XSRF-TOKEN": decodeURIComponent(token || ""),
  };

  // リクエスト前にログを出力
  console.log("apiUrl:", apiUrl);
  console.log("Request URL:", url);
  console.log("Request Headers:", headers);

  try {
    // 本リクエストを実行
    const fullUrl = url.startsWith("http")
      ? url
      : `${apiUrl.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
    console.log("Full URL:", fullUrl);

    // 実際のリクエストを送信
    const res = await fetch(fullUrl, {
      ...options,
      credentials: "include",
      headers,
    });

    console.log("API Response:", res);

    // レスポンスがOKでない場合（エラーが発生している場合）
    if (!res.ok) {
      const errorMessage = await res.text(); // 非JSONエラーメッセージを取得
      console.error("API Error:", errorMessage); // エラーメッセージを表示
      throw new Error("API request failed"); // エラーをスロー
    }

    // 🔹 ここを修正：204 No Content の場合は null を返す
    if (res.status === 204) {
      return null;
    }

    // レスポンスがOKの場合、JSONレスポンスを処理
    const data = await res.json(); // JSONレスポンスを処理

    if (!data || Object.keys(data).length === 0) {
      console.warn("Empty or invalid response data received"); // データが空または不正の場合の警告
    }

    console.log("Response Data:", data);

    return data; // データを返す
  } catch (error) {
    console.error("Request failed:", error); // リクエストが失敗した場合のエラー処理
    throw error; // エラーを再度投げる
  }
};
