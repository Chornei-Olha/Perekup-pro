import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch(
      "https://erlang.perekup-pro.com.ua/api/v1/updates/filters",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Проксіюємо cookie від користувача
          cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify(body),
      }
    );

    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const raw = await res.text();
      console.error("❌ Відповідь не JSON:", raw.slice(0, 100));
      return new NextResponse(
        JSON.stringify({ error: "Очікувався JSON від бекенда" }),
        { status: 500 }
      );
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Помилка запиту:", error);
    return new NextResponse(
      JSON.stringify({ error: "Помилка запиту до бекенда" }),
      { status: 500 }
    );
  }
}
