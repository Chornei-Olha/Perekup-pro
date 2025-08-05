import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🗑️ Удаляем фильтр, тело запроса:", body);

    if (!body?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Отсутствует поле id в запросе" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const res = await fetch(
      "http://erlang.perekup-pro.com.ua/api/v1/updates/filters/delete",
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
      console.error(`❌ Ошибка удаления от API: ${res.status} - ${errorText}`);
      return new NextResponse(
        JSON.stringify({
          error: `Ошибка удаления от API: ${res.status}`,
          details: errorText,
        }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    if (res.status === 204) {
      console.log("✅ Фильтр успешно удалён, 204 No Content");
      return new NextResponse(null, { status: 204 });
    }

    const contentType = res.headers.get("content-type") || "";
    const isJSON = contentType.includes("application/json");

    const data = isJSON ? await res.json() : await res.text();

    return new NextResponse(isJSON ? JSON.stringify(data) : data, {
      status: res.status,
      headers: { "Content-Type": isJSON ? "application/json" : "text/plain" },
    });
  } catch (error) {
    console.error("❌ Ошибка при удалении фильтра:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Ошибка при удалении фильтра",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
