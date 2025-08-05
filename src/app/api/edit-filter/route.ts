import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Валидация
    if (!body.id || !body.params) {
      return new NextResponse(
        JSON.stringify({ error: "Missing id or params" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const res = await fetch(
      "http://erlang.perekup-pro.com.ua/api/v1/updates/filters/edit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return new NextResponse(errorText, { status: res.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Ошибка при редактировании фильтра:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
