import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Читаем тело запроса (если надо — у тебя сейчас пустой объект)
    const body = await req.json();

    // Отправляем запрос к реальному API, проксируем куки
    const res = await fetch(
      "https://erlang.perekup-pro.com.ua/api/v1/updates/filters",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify(body || {}), // передаем тело запроса, например {}
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return new NextResponse(
        JSON.stringify({
          error: `Ошибка от API: ${res.status}`,
          details: errorText,
        }),
        { status: res.status }
      );
    }

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const contentType = res.headers.get("Content-Type") || "";
    const isJSON = contentType.includes("application/json");
    const responseData = isJSON ? await res.json() : await res.text();

    return new NextResponse(
      isJSON ? JSON.stringify(responseData) : responseData,
      {
        status: res.status,
        headers: {
          "Content-Type": isJSON ? "application/json" : "text/plain",
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Ошибка при получении фильтров",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
