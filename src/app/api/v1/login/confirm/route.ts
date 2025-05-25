import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(
    "https://car.dimzizmistom.com.ua/api/v1/login/confirm",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );

  const response = new NextResponse(null, {
    status: res.status,
  });

  // Проксіруй кукі назад до браузера
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
