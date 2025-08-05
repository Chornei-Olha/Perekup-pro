import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch("http://erlang.perekup-pro.com.ua/api/v1/plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("Content-Type") || "";
    const isJSON = contentType.includes("application/json");

    if (!isJSON) {
      const text = await res.text();
      console.error("❌ Получен не JSON от бэка:", text.slice(0, 100));
      return new NextResponse(
        JSON.stringify({ error: "Backend не вернул JSON" }),
        { status: 500 }
      );
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Ошибка при запросе к backend:", error);
    return new NextResponse(
      JSON.stringify({ error: "Ошибка при загрузке планов" }),
      { status: 500 }
    );
  }
}
