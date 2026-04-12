export async function getProjects() {
  const res = await fetch("http://localhost/api/projects", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API取得失敗: ${res.status}`);
  }

  return res.json();
}
