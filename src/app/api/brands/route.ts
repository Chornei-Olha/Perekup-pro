import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://backend.perekup-pro.com.ua/api/brands", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Ошибка при запросе брендов: ${res.status} ${res.statusText}`
      );
    }

    const brands = await res.json();

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Ошибка при получении брендов с удаленного API:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных о брендах." },
      { status: 500 }
    );
  }
}
