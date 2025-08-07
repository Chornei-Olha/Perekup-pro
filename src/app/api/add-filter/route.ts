import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📝 Тело запроса:", body);

    const res = await fetch(
      "https://erlang.perekup-pro.com.ua/api/v1/updates/filters/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify({ params: body }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Ошибка от API: ${res.status} - ${errorText}`);
      return new NextResponse(
        JSON.stringify({
          error: `Ошибка от API: ${res.status}`,
          details: errorText,
        }),
        { status: res.status }
      );
    }

    if (res.status === 204) {
      console.log("📦 Ответ от бэка: 204 No Content");
      return new NextResponse(null, { status: 204 });
    }

    const contentType = res.headers.get("Content-Type") || "";
    const isJSON = contentType.includes("application/json");

    const responseData = isJSON ? await res.json() : await res.text();

    console.log("📦 Ответ от бэка (add-filter):", responseData);

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
    console.error("❌ Ошибка при отправке фильтра:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Ошибка при добавлении фильтра",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
