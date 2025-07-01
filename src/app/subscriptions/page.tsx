"use client";

import { useState } from "react";
import CarFilterForm from "@/app/components/CarFilterForm";
import FilterSubscriptionsTable from "@/app/components/FilterSubscriptionsTable";
import { addNotificationFilter } from "@/lib/api";
import { CarSearchFilters } from "@/lib/types";
import Header from "../components/Header";
import { useRouter } from "next/navigation";

const SubscriptionsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddFilter = async (filters: CarSearchFilters) => {
    try {
      await addNotificationFilter(filters);
      alert("Фільтр успішно додано");
      setRefreshKey((prev) => prev + 1); // оновити таблицю
    } catch (err) {
      console.error("Не вдалося додати фільтр:", err);
      alert("Помилка додавання фільтра");
    }
  };
  const router = useRouter();

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
          onClick={() => router.push("/search")}
          className="font-['Inter'] font-extralight text-[10px] sm:text-[15px] bg-[#9D0D14] hover:bg-red-700 transition px-4 py-2 rounded-[20px] text-white"
        >
          Назад
        </button>
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Управление подписками</h1>

        <div className="bg-transparent p-6 rounded-lg shadow-md">
          <CarFilterForm handleAddFilter={handleAddFilter} />
          <FilterSubscriptionsTable key={refreshKey} />
        </div>
      </div>
    </section>
  );
};

export default SubscriptionsPage;
