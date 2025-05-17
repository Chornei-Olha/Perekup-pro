import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { brands } = await req.json();

    if (!Array.isArray(brands)) {
      return NextResponse.json(
        { error: "Некорректный формат данных: ожидался массив." },
        { status: 400 }
      );
    }

    const res = await fetch("https://perecup-pro.com/api/models/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brands }),
    });

    if (!res.ok) {
      throw new Error(
        `Ошибка при запросе моделей: ${res.status} ${res.statusText}`
      );
    }

    const models = await res.json();

    return NextResponse.json(models);
  } catch (error) {
    console.error("Ошибка при получении моделей с удаленного API:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных о моделях." },
      { status: 500 }
    );
  }
}
