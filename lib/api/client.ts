// lib/api/client.ts

const NETWORK_ERROR_MESSAGE =
  "サーバーへ接続できませんでした。ネットワーク接続を確認して、もう一度お試しください。";

const isNetworkError = (error: unknown): error is TypeError => {
  return error instanceof TypeError && error.message === "Failed to fetch";
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 環境変数からAPI URLを取得

  if (!apiUrl) {
    throw new Error("API URL is not defined.");
  }

  const baseUrl: string = apiUrl;

  // CSRF Cookieの取得
  const method = options.method?.toUpperCase() || "GET";

  const requiresCsrf = !["GET", "HEAD"].includes(method);

  let token: string | undefined;

  if (requiresCsrf) {
    try {
      const csrfResponse = await fetch(
        `${baseUrl.replace(/\/$/, "")}/sanctum/csrf-cookie`,
        {
          credentials: "include",
        },
      );

      if (!csrfResponse.ok) {
        throw new Error(
          `Failed to fetch CSRF cookie: ${csrfResponse.status} ${csrfResponse.statusText}`,
        );
      }
    } catch (error) {
      console.error("Failed to fetch CSRF cookie:", error);

      if (isNetworkError(error)) {
        throw new Error(NETWORK_ERROR_MESSAGE);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Failed to fetch CSRF cookie.");
    }

    token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("XSRF-TOKEN is missing from cookies.");
    }
  }

  const headers: HeadersInit = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(token
      ? {
          "X-XSRF-TOKEN": decodeURIComponent(token),
        }
      : {}),
  };

  const fullUrl = url.startsWith("http")
    ? url
    : `${baseUrl.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const errorMessage = await response.text();

      console.error("API Error:", errorMessage);

      throw new Error(
        errorMessage ||
          `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);

    if (isNetworkError(error)) {
      throw new Error(NETWORK_ERROR_MESSAGE);
    }

    throw error;
  }
};
