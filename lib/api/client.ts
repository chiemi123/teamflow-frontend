// lib/api/client.ts
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const error: any = new Error("API Error");
    error.status = res.status;
    error.info = data;
    throw error;
  }

  return data;
};
