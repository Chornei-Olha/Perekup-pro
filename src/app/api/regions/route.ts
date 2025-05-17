import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://perecup-pro.com/api/regions");

    if (!res.ok) {
      throw new Error(
        `Ошибка при запросе регионов: ${res.status} ${res.statusText}`
      );
    }

    const regions = await res.json();

    return NextResponse.json(regions);
  } catch (err) {
    console.error("Ошибка при получении регионов:", err);
    return NextResponse.json(
      { error: "Произошла ошибка при получении регионов." },
      { status: 500 }
    );
  }
}
