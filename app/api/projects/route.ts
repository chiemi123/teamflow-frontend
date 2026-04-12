export async function GET() {
  try {
    const res = await fetch("http://172.24.0.1/api/projects", {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        Accept: "application/json",
      },
    });

    const text = await res.text();
    console.log("Laravel response:", text);

    const data = JSON.parse(text);

    return Response.json(data);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "API取得失敗" }, { status: 500 });
  }
}
