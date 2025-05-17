"use client";

import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubscriptionPage() {
  const router = useRouter();

  // Опрашиваем /api/v1/user/info раз в 5 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/v1/user/info", { method: "POST" });
        if (res.status === 200) {
          const data = await res.json();
          if (data.subscription?.is_active === true) {
            clearInterval(interval);
            router.push("/search");
          }
        }
      } catch (e) {
        console.error("Ошибка при опросе user/info", e);
      }
    }, 5000);

    return () => clearInterval(interval); // очистка при размонтировании
  }, [router]);

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#8B0000] to-black text-white">
      <Header />
      <section className="max-w-6xl mx-auto py-4 px-4">
        {/* Pricing Cards */}
        <div className="grid  grid-cols-1 sm:grid-cols-3 gap-6 mb-12 mt-10 sm:mt-20">
          {[
            {
              price: "250 грн",
              duration: "неделя",
              description:
                "подходит для тех кто занимается автоподбором уведомления на telegram",
            },
            {
              price: "1200 грн",
              duration: "месяц",
              description: "подходит для перекупщиков уведомления на telegram",
            },
            {
              price: "3000 грн",
              duration: "3 месяца",
              description:
                "подходит для автоплощадок и перекупщиков уведомления на telegram",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white text-black p-6 rounded-[30px] text-center flex flex-col items-center justify-between"
            >
              <div>
                <h2 className="font-['Inter'] font-semibold text-[40px] sm:text-[66px]  mb-1 text-[#821810]">
                  {item.price}
                </h2>
                <p className="font-['Inter'] font-extralight text-[28px] sm:text-[48px] text-[#821810] mb-3">
                  {item.duration}
                </p>
                <p className="font-['Inter'] font-medium leading-[34px] text-[18px] sm:text-[29px] text-[#1F0404] mb-3 max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => alert("Пока что просто кнопка")}
                className="font-bold bg-gradient-to-r from-[#821810] to-[#000000] hover:from-[#000000] hover:to-[#821810] text-white px-6 py-2 rounded-[6px] text-[12px] w-[213px] h-[63px]"
              >
                Оплатить
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className="font-['Inter'] font-extralight text-left text-[#EFEFEF] text-[20px] sm:text-[32px]">
          После оплаты пришлите почту или вайбер
        </p>
      </section>
    </main>
  );
}
