"use client";

import { useState } from "react";
import { searchCars } from "@/lib/api";
import CarResults from "@/app/components/CarResults";
import CarSearchForm from "@/app/components/CarSearchForm";
import Top50Slider from "@/app/components/Slider";
import { Car, CarSearchFilters } from "@/lib/types";
import Header from "@/app/components/Header";
// import { useSessionInfo } from "@/hooks/useSessionInfo"; // ✅ импорт хука

export default function HomePage() {
  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  // const { loading: checkingSession } = useSessionInfo(); // ✅ вызов хука

  const handleSearch = async (filters: CarSearchFilters) => {
    setLoading(true);
    const cars = await searchCars(filters);
    setResults(cars);
    setLoading(false);
  };

  // if (checkingSession)
  //   return <p className="text-white p-4">Проверка доступа...</p>; // ✅ прелоадер

  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 1), rgba(109, 1, 21, 1)), url(/images/bg.png)",
      }}
    >
      <Header />
      <CarSearchForm onSubmit={handleSearch} />
      <Top50Slider />
      {loading ? <p>Загрузка...</p> : <CarResults results={results} />}
    </section>
  );
}
