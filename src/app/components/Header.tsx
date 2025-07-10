"use client";

import { Mail, MapPin, Phone, Instagram } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/v1/logout", {
      method: "POST",
      credentials: "include",
    });
    setUserPhone(null);
    router.replace("/login");
  };

  const hideLogout = pathname === "/login" || pathname === "/subscription";

  useEffect(() => {
    async function fetchUser() {
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
          setUserPhone(data.user_phone || null);
        } else {
          setUserPhone(null);
        }
      } catch {
        setUserPhone(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="relative pt-4 px-4 sm:px-16">
      <div className="flex flex-col md:flex-row justify-between items-start sm:items-center">
        {/* Logo */}
        <div className="flex flex-col mb-[25px] sm:mb-0">
          <Link href="/">
            <h1 className="font-['Inter'] font-bold text-3xl sm:text-5xl text-white">
              PEREKUP-PRO
            </h1>
            <p className="font-['Inter'] text-sm text-gray-400">
              Сервис для профессионалов автобизнеса
            </p>
          </Link>
        </div>

        {/* Contact info + Logout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
          {" "}
          <a
            href="https://www.instagram.com/karl_cars/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:underline"
          >
            <Instagram className="h-5 w-5 mr-2" />
            <span className="font-['Open_Sans'] font-light text-sm text-white">
              @karl_cars
            </span>
          </a>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="font-['Open_Sans'] font-light text-sm text-white">
              Украина
            </span>
          </div>
          <a
            href="mailto:pekekuppro7@gmail.com"
            className="flex items-center hover:underline"
          >
            <Mail className="h-5 w-5 mr-2" />
            <span className="font-['Open_Sans'] font-light text-sm text-white">
              perekuppro7@gmail.com
            </span>
          </a>
          <a
            href="tel:+380500441132"
            className="flex items-center hover:underline"
          >
            <Phone className="h-5 w-5 mr-2" />
            <span className="font-['Open_Sans'] font-light text-sm text-white">
              +38 (050) 044-11-32
            </span>
          </a>
          {pathname !== "/subscription" && (
            <button
              onClick={() => router.push("/subscription")}
              disabled={!userPhone || loading}
              className={`px-4 py-2 rounded text-sm ${
                userPhone && !loading
                  ? "bg-[#9D0D14] hover:bg-red-700 text-white cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
              title={
                !userPhone
                  ? "Авторизуйтесь, чтобы выбрать тариф"
                  : loading
                  ? "Загрузка..."
                  : undefined
              }
            >
              Выбрать тариф
            </button>
          )}
          {/* Logout button */}
          {!hideLogout && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              Выйти
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
