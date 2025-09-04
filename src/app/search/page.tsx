"use client";

import { useEffect, useState, Suspense } from "react";
import { searchCars } from "@/lib/api";
import CarResults from "@/app/components/CarResults";
import { CarSearchForm } from "@/app/components/CarSearchForm";
import Top50Slider from "@/app/components/Slider";
import { Car, CarSearchFilters } from "@/lib/types";
import Header from "@/app/components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionInfo } from "@/hooks/useSessionInfo";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters: CarSearchFilters) => {
    const entries: [string, string][] = Object.entries(filters)
      .filter(([, val]) => val !== undefined && val !== null)
      .map(([key, val]) => {
        if (Array.isArray(val)) return [key, val.join(",")];
        return [key, String(val)];
      });

    const params = new URLSearchParams(entries).toString();
    router.push(`/search?${params}`);
  };

  useEffect(() => {
    if (!searchParams) return;

    const paramsObj = Object.fromEntries(searchParams.entries());
    if (Object.keys(paramsObj).length === 0) return;

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

  return (
    <>
      <CarSearchForm onSubmit={handleSearch} />
      <Top50Slider />
      {loading ? (
        <p className="pl-16 pb-16 text-xl">Загрузка...</p>
      ) : (
        <CarResults results={results} />
      )}
    </>
  );
}

export default function HomePage() {
  const { loading: checkingSession } = useSessionInfo();

  if (checkingSession) {
    return <p className="text-white p-4">Проверка доступа...</p>;
  }

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
          onClick={() => location.assign("/subscriptions")}
          className="font-['Inter'] font-extralight text-[10px] sm:text-[15px] bg-[#9D0D14] hover:bg-red-700 transition px-4 py-2 rounded-[20px] text-white"
        >
          Задать фильтры для уведомлений
        </button>
      </div>

      <Suspense fallback={<p className="text-white p-4">Загрузка...</p>}>
        <SearchContent />
      </Suspense>
    </section>
  );
}
