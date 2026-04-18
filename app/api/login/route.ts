import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    return Response.json({ message: "Laravelエラー" }, { status: 500 });
  }

  const token = data.token;

  if (!token) {
    return Response.json({ message: "ログイン失敗" }, { status: res.status });
  }

  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  return Response.json({ message: "ログイン成功" });
}
