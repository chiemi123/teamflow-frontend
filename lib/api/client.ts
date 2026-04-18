export const apiFetch = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
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
