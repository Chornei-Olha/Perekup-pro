import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  const [session, setSession] = useState<SessionInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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
          router.replace("/login");
          return;
        }

        const data: SessionInfo = await res.json();

        if (data.session_status === "created") {
          router.replace("/login");
          return;
        }

        if (!data.subscription?.is_active && pathname !== "/subscription") {
          router.replace("/subscription");
          return;
        }

        setSession(data);
      } catch (error) {
        console.error("Ошибка проверки сессии:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router, pathname]);

  return { session, loading };
}
