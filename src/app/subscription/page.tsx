// "use client";

// import Header from "@/app/components/Header";
// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";

// interface Plan {
//   id: number;
//   price: number;
//   duration: string;
//   duration_description: string;
//   description: string;
//   payment_url: string;
// }

// export default function SubscriptionPage() {
//   const router = useRouter();
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const pollingRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await fetch("/api/v1/plans", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ user_phone: "+380985411740" }), // можно заменить на динамический
//         });

//         if (!res.ok) throw new Error("Ошибка запроса");

//         const data = await res.json();
//         if (!Array.isArray(data)) throw new Error("Неверный формат ответа");

//         setPlans(data);
//       } catch (err) {
//         console.error(err);
//         setError("Не удалось загрузить тарифы");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   useEffect(() => {
//     const checkSubscription = async () => {
//       try {
//         const res = await fetch("/api/v1/user/info", {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({}),
//         });

//         if (res.ok) {
//           const data = await res.json();
//           if (data.subscription?.is_active) {
//             router.push("/search");
//           } else {
//             let attempts = 0;
//             pollingRef.current = setInterval(async () => {
//               attempts++;
//               try {
//                 const pollRes = await fetch("/api/v1/user/info", {
//                   method: "POST",
//                   credentials: "include",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({}),
//                 });

//                 if (pollRes.ok) {
//                   const pollData = await pollRes.json();
//                   if (pollData.subscription?.is_active) {
//                     clearInterval(pollingRef.current!);
//                     router.push("/search");
//                   }
//                 }
//               } catch (err) {
//                 console.error("Ошибка при опросе подписки", err);
//               }

//               if (attempts >= 24) {
//                 clearInterval(pollingRef.current!);
//               }
//             }, 5000);
//           }
//         }
//       } catch (err) {
//         console.error("Ошибка при первичной проверке подписки", err);
//       }
//     };

//     checkSubscription();

//     return () => {
//       if (pollingRef.current) clearInterval(pollingRef.current);
//     };
//   }, []);

"use client";

import Header from "@/app/components/Header";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Plan {
  id: number;
  price: number;
  duration: string;
  duration_description: string;
  description: string;
  payment_url: string;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await fetch("/api/v1/user/info", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (res.ok) {
          const data = await res.json();
          setUserPhone(data.user_phone); // <-- сохраняем номер телефона

          if (data.subscription?.is_active) {
            router.push("/search");
          } else {
            let attempts = 0;
            pollingRef.current = setInterval(async () => {
              attempts++;
              try {
                const pollRes = await fetch("/api/v1/user/info", {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({}),
                });

                if (pollRes.ok) {
                  const pollData = await pollRes.json();
                  if (pollData.subscription?.is_active) {
                    clearInterval(pollingRef.current!);
                    router.push("/search");
                  }
                }
              } catch (err) {
                console.error("Ошибка при опросе подписки", err);
              }

              if (attempts >= 24) {
                clearInterval(pollingRef.current!);
              }
            }, 5000);
          }
        }
      } catch (err) {
        console.error("Ошибка при первичной проверке подписки", err);
      }
    };

    checkSubscription();

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [router]);

  // Загружаем тарифы после того, как получим телефон
  useEffect(() => {
    const fetchPlans = async () => {
      if (!userPhone) return;

      try {
        const res = await fetch("/api/v1/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_phone: userPhone }),
        });

        if (!res.ok) throw new Error("Ошибка запроса");

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Неверный формат ответа");

        setPlans(data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить тарифы");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userPhone]);

  // Остальной код — без изменений

  const handleTryFree = async () => {
    try {
      const res = await fetch("/api/v1/user/info", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.subscription?.is_active === true) {
          router.push("/search");
        } else {
          alert("Пробный период уже использован или недоступен.");
        }
      } else if (res.status === 403) {
        router.replace("/login");
      }
    } catch (err) {
      console.error("Ошибка при проверке подписки", err);
    }
  };

  const handlePayment = (paymentUrl: string) => {
    window.open(paymentUrl, "_blank");

    if (pollingRef.current) clearInterval(pollingRef.current);

    let attempts = 0;
    pollingRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch("/api/v1/user/info", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.subscription?.is_active) {
            clearInterval(pollingRef.current!);
            router.push("/search");
          }
        }
      } catch (err) {
        console.error("Ошибка при опросе подписки", err);
      }

      if (attempts >= 24) {
        clearInterval(pollingRef.current!); // 2 минуты максимум
      }
    }, 5000);
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#8B0000] to-black text-white">
      <Header />
      <section className="max-w-6xl mx-auto py-4 px-4">
        {/* 👉 Кнопка 1 день бесплатно */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleTryFree}
            className="font-bold bg-gradient-to-r from-[#821810] to-[#000000] hover:from-[#000000] hover:to-[#821810] text-white px-6 py-3 rounded-[8px] text-[16px] sm:text-[20px]"
          >
            Попробовать 1 день бесплатно
          </button>
        </div>

        {loading ? (
          <p className="text-center text-xl">Загрузка...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 mt-10 sm:mt-20">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white text-black p-6 rounded-[30px] text-center flex flex-col items-center justify-between"
              >
                <div>
                  <h2 className="font-['Inter'] font-semibold text-[40px] sm:text-[66px] mb-1 text-[#821810]">
                    {plan.price} грн
                  </h2>
                  <p className="font-['Inter'] font-extralight text-[28px] sm:text-[48px] text-[#821810] mb-3">
                    {plan.duration_description}
                  </p>
                  <p className="font-['Inter'] font-medium leading-[34px] text-[18px] sm:text-[29px] text-[#1F0404] mb-3 max-w-xs mx-auto">
                    {plan.description}
                  </p>
                </div>
                <button
                  onClick={() => handlePayment(plan.payment_url)}
                  className="font-bold bg-gradient-to-r from-[#821810] to-[#000000] hover:from-[#000000] hover:to-[#821810] text-white px-6 py-2 rounded-[6px] text-[12px] w-[213px] h-[63px]"
                >
                  Оплатить
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <p className="font-['Inter'] font-extralight text-left text-[#EFEFEF] text-[20px] sm:text-[32px]">
          После оплаты пришлите почту или вайбер
        </p>
      </section>
    </main>
  );
}
