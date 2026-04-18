export const apiFetch = async (url: string) => {
  const res = await fetch(url);

  if (res.status === 401) {
    throw new Error("unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`api error: ${text}`);
  }

  return res.json();
};
