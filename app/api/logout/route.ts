import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 👇 Laravelにログアウト依頼
  if (token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("Laravel logout failed:", res.status);
    }
  }

  // 👇 Cookie削除
  cookieStore.delete("token");

  return Response.json({ message: "ログアウトしました" });
}
