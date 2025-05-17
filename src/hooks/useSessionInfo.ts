"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SessionInfo = {
  session_status: "created" | "confirmed";
  subscription: {
    is_active: boolean;
    type: "free" | "paid";
    date_created: string;
    date_expires: string;
  };
  user_id: string;
};

export function useSessionInfo() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/v1/user/info", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (res.status === 403) {
          router.replace("/login"); // не залогинен
          return;
        }

        const data: SessionInfo = await res.json();

        if (data.session_status === "created") {
          router.replace("/login"); // не подтвердил код
          return;
        }

        if (!data.subscription?.is_active) {
          router.replace("/subscribe"); // нет активной подписки
          return;
        }

        // всё ок, доступ разрешён
      } catch (error) {
        console.error("Ошибка проверки сессии:", error);
        router.replace("/login"); // fallback на всякий случай
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  return { loading };
}
