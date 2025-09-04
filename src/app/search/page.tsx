"use client";

import { useEffect, useState } from "react";
import { searchCars } from "@/lib/api";
import CarResults from "@/app/components/CarResults";
import { CarSearchForm } from "@/app/components/CarSearchForm";
import Top50Slider from "@/app/components/Slider";
import { Car, CarSearchFilters } from "@/lib/types";
import Header from "@/app/components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionInfo } from "@/hooks/useSessionInfo"; // ✅ импорт хука

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const { loading: checkingSession } = useSessionInfo(); // ✅ вызов хука

  const handleSearch = async (filters: CarSearchFilters) => {
    // setLoading(true);
    // const cars = await searchCars(filters);
    // setResults(cars);
    // setLoading(false);

    // обновляем URL, чтобы можно было поделиться ссылкой
    const params = new URLSearchParams(filters as any).toString();
    router.push(`/search?${params}`);
  };

  // 🚀 Загружаем машины, если есть параметры в URL
  useEffect(() => {
    if (!searchParams) return;

    // Превращаем URLSearchParams в объект
    const paramsObj = Object.fromEntries(searchParams.entries());

    // Если параметры пустые, ничего не делаем
    if (Object.keys(paramsObj).length === 0) return;

    // Приводим к нужным типам
    const filters: CarSearchFilters = {
      brands: paramsObj.brands
        ? paramsObj.brands.split(",").map((b) => Number(b))
        : [],
      models: paramsObj.models
        ? paramsObj.models.split(",").map((m) => Number(m))
        : [],
      minPrice: paramsObj.minPrice ? Number(paramsObj.minPrice) : 0,
      maxPrice: paramsObj.maxPrice ? Number(paramsObj.maxPrice) : 999999,
      minYear: paramsObj.minYear ? Number(paramsObj.minYear) : 1900,
      maxYear: paramsObj.maxYear
        ? Number(paramsObj.maxYear)
        : new Date().getFullYear(),
    };

    setLoading(true);

    searchCars(filters)
      .then((cars) => setResults(cars))
      .catch((err) => {
        console.error("Ошибка загрузки:", err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (checkingSession)
    return <p className="text-white p-4">Проверка доступа...</p>; // ✅ прелоадер

  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 1), rgba(109, 1, 21, 1)), url(/images/bg.png)",
      }}
    >
      <Header />
      <div className="flex justify-end pt-4 px-4 sm:px-16">
        <button
          onClick={() => router.push("/subscriptions")}
          className="font-['Inter'] font-extralight text-[10px] sm:text-[15px] bg-[#9D0D14] hover:bg-red-700 transition px-4 py-2 rounded-[20px] text-white"
        >
          Задать фильтры для уведомлений
        </button>
      </div>
      <CarSearchForm onSubmit={handleSearch} />
      <Top50Slider />
      {loading ? (
        <p className="pl-16 pb-16 text-xl">Загрузка...</p>
      ) : (
        <CarResults results={results} />
      )}
    </section>
  );
}
