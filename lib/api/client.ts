// lib/api/client.ts

import { ApiError } from "@/lib/api/errors";

const NETWORK_ERROR_MESSAGE =
  "サーバーへ接続できませんでした。ネットワーク接続を確認して、もう一度お試しください。";

const isNetworkError = (error: unknown): error is TypeError => {
  return error instanceof TypeError && error.message === "Failed to fetch";
};

export const apiFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined.");
  }

  const baseUrl = apiUrl.replace(/\/$/, "");

  const method = options.method?.toUpperCase() || "GET";
  const requiresCsrf = !["GET", "HEAD"].includes(method);

  let token: string | undefined;

  if (requiresCsrf) {
    try {
      const csrfResponse = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

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

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(!isFormData
      ? {
          "Content-Type": "application/json",
        }
      : {}),
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(token
      ? {
          "X-XSRF-TOKEN": decodeURIComponent(token),
        }
      : {}),
    ...(options.headers || {}),
  };

  const fullUrl = url.startsWith("http")
    ? url
    : `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const errorMessage = await response.text();

      console.error("API Error:", errorMessage);

      throw new ApiError(
        response.status,
        errorMessage ||
          `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Request failed:", error);

    if (isNetworkError(error)) {
      throw new Error(NETWORK_ERROR_MESSAGE);
    }

    throw error;
  }
};
