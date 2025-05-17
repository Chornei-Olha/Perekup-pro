"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RequireSessionProps = {
  children: React.ReactNode;
  redirectIfUnauthenticated?: string; // по умолчанию /login
  redirectIfInactive?: string; // по умолчанию /subscription
};

export default function RequireSession({
  children,
  redirectIfUnauthenticated = "/login",
  redirectIfInactive = "/subscription",
}: RequireSessionProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/v1/user/info", {
          method: "POST",
          credentials: "include",
        });

        if (res.status === 403) {
          router.replace(redirectIfUnauthenticated);
          return;
        }

        if (res.status === 200) {
          const data = await res.json();

          if (data.session_status !== "confirmed") {
            router.replace(redirectIfUnauthenticated);
            return;
          }

          if (!data.subscription?.is_active) {
            router.replace(redirectIfInactive);
            return;
          }

          setChecking(false); // всё хорошо, отображаем children
        }
      } catch (err) {
        console.error("Ошибка при проверке сессии", err);
        router.replace(redirectIfUnauthenticated);
      }
    };

    checkSession();
  }, [router, redirectIfUnauthenticated, redirectIfInactive]);

  if (checking) {
    return (
      <div className="text-white text-center py-10 text-xl">Загрузка...</div>
    );
  }

  return <>{children}</>;
}
