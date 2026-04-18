import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    // ❗ 未ログイン対策
    if (!token) {
      return Response.json({ message: "未ログイン" }, { status: 401 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    // ❗ Laravelエラーも拾う
    if (!res.ok) {
      return Response.json(
        { message: "Laravel APIエラー" },
        { status: res.status },
      );
    }

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.error("API error:", error);

    return Response.json({ error: "API取得失敗" }, { status: 500 });
  }
}
