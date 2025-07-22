"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("+380");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendCode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/login/send_confirm_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
        credentials: "include",
      });

      if (res.status === 204) {
        setStep("code");
      } else {
        setError("Ошибка при отправке кода");
      }
    } catch {
      setError("Сервер недоступен");
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/login/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
        credentials: "include",
      });

      if (res.status === 204) {
        router.push("/");
      } else {
        setError("Неверный код");
      }
    } catch {
      setError("Ошибка подтверждения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#8B0000] to-black text-white overflow-hidden">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-12 z-10 relative">
        <div className="max-w-md w-full bg-white text-black p-8 rounded-3xl shadow-xl">
          {step === "phone" ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Вход по номеру</h1>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380123456789"
                className="w-full border px-4 py-2 rounded mb-4"
              />
              <button
                onClick={sendCode}
                disabled={loading}
                className="w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded"
              >
                {loading ? "Отправка..." : "Получить код"}
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Введите код из SMS</h1>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-значный код"
                className="w-full border px-4 py-2 rounded mb-4"
              />
              <button
                onClick={confirmCode}
                disabled={loading}
                className="w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded"
              >
                {loading ? "Проверка..." : "Войти"}
              </button>
            </>
          )}

          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </main>

      {/* Изображение справа, прижато к правому краю, центрировано по вертикали, скрыто на мобилках */}
      <div className="hidden md:block fixed top-1/2 right-0 transform -translate-y-1/2 z-0">
        <Image
          src="/images/01-1.png"
          alt="Login side visual"
          width={500}
          height={200}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
