import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch("http://erlang.perekup-pro.com.ua/api/v1/user/info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body: JSON.stringify(body),
  });

  const response = new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
