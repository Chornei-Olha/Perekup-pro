import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = await fetch("https://erlang.perekup-pro.com.ua/api/v1/logout", {
    method: "POST",
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  const response = new NextResponse(null, {
    status: res.status,
  });

  // Передаём set-cookie клиенту, чтобы сбросить сессионную куку
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
