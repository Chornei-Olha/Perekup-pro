"use client";

import { useState, useEffect, useRef } from "react";
import { Car } from "@/lib/types";

type Props = {
  results: Car[];
};

function getGearboxLabel(code: number) {
  return code === 0 ? "МТ" : code === 1 ? "АТ" : "—";
}

function getPriceDiff(price: number, marketPrice: number) {
  const diff = price - marketPrice;
  return {
    value: diff,
    formatted: `${diff > 0 ? "+" : ""}${diff.toLocaleString()}$`,
    color: diff > 0 ? "text-red-600" : "text-green-600",
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function CarResults({ results }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const itemsPerPage = 20;
  const listRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const sortedResults = [...results].sort(
    (a, b) =>
      new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
  );

  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
    setInputPage("");
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [sellerCars, setSellerCars] = useState<Car[]>([]);
  const [isLoadingSellerCars, setIsLoadingSellerCars] = useState(false);

  useEffect(() => {
    if (selectedSellerId !== null) {
      setIsLoadingSellerCars(true);
      fetch(`https://perecup-pro.com/api/cars/search.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerId: selectedSellerId,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Ошибка сервера: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Данные по продавцу", selectedSellerId, data);
          setSellerCars(data);
          setIsLoadingSellerCars(false);
        })
        .catch((error) => {
          console.error("Ошибка при загрузке машин продавца", error);
          setSellerCars([]);
          setIsLoadingSellerCars(false);
        });
    }
  }, [selectedSellerId]);

  const closeModal = () => {
    setSelectedSellerId(null);
    setSellerCars([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Список машин */}
      <div ref={listRef} className="grid gap-4">
        {paginatedResults.map((car) => {
          const diff = getPriceDiff(car.price, car.marketPrice);
          return (
            <div
              key={car.id}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition p-4 grid grid-cols-[150px_1fr_120px_2fr] gap-4 items-start sm:flex-row flex-col"
            >
              {/* 1. Фото */}
              <div className="w-[150px] h-[100px] flex-shrink-0">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-full object-cover rounded"
                  loading="lazy"
                />
              </div>

              {/* 2. Заголовок и основные данные */}
              <div>
                <h3 className="font-semibold text-lg">
                  🚘{" "}
                  <a
                    href={car.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {car.title}
                  </a>
                </h3>
                <p className="text-sm text-white">
                  {car.year} • {car.mileage.toLocaleString()} км •{" "}
                  {getGearboxLabel(car.gearbox)} • {car.engineVolume}л •{" "}
                  {car.fuel}
                </p>
                <p className="text-sm text-white">{car.city}</p>
                <p className="text-sm text-gray-200">
                  Днів у продажу: {car.daysInSale}
                </p>
              </div>

              {/* 3. Цена, разница, дата обновления */}
              <div className="text-right min-w-[120px]">
                <p className="font-bold text-lg">
                  {car.price.toLocaleString()}$
                </p>
                <p className={`text-sm ${diff.color}`}>{diff.formatted}</p>

                <div className="mt-1">
                  <span className="inline-block text-xs px-2 py-1 rounded bg-gray-200 text-green-900">
                    Обновлено:
                    <br />
                    {formatDate(car.lastUpdate)}
                  </span>
                  <br />

                  <button
                    onClick={() => {
                      if (car.sellerId != null) {
                        setSelectedSellerId(car.sellerId);
                      } else {
                        console.warn("sellerId отсутствует для машины", car);
                      }
                    }}
                    className="mt-1 text-xs text-blue-500 underline"
                  >
                    Показать все ({car.sellerCarCount})
                  </button>
                </div>
              </div>

              {/* 4. Описание */}
              <div className="text-sm text-gray-200 max-h-20 overflow-hidden text-ellipsis line-clamp-3">
                {car.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              ←
            </button>
            <button
              onClick={() => goToPage(1)}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              1
            </button>
            {currentPage > 3 && <span className="px-2 text-gray-500">…</span>}
            {currentPage > 1 && currentPage < totalPages && (
              <button
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                disabled
              >
                {currentPage}
              </button>
            )}
            {currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-500">…</span>
            )}
            {totalPages > 1 && (
              <button
                onClick={() => goToPage(totalPages)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              →
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">
              Перейти на сторінку:
            </label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const page = parseInt(inputPage);
                  if (!isNaN(page)) goToPage(page);
                }
              }}
              className="w-16 px-2 py-1 rounded border border-gray-400 bg-gray-800 text-white"
              placeholder="№"
            />
            <button
              onClick={() => {
                const page = parseInt(inputPage);
                if (!isNaN(page)) goToPage(page);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {selectedSellerId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold color-black">
                Объявления продавца #{selectedSellerId}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-black text-sm"
              >
                ✕ Закрыть
              </button>
            </div>

            {isLoadingSellerCars ? (
              <p>Загрузка...</p>
            ) : sellerCars.length === 0 ? (
              <p>Объявления не найдены.</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {sellerCars.map((car) => (
                  <li
                    key={car.id}
                    className="border rounded-xl overflow-hidden shadow hover:shadow-md transition"
                  >
                    <a
                      href={car.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        <img
                          src={car.image}
                          alt={car.title}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-blue-700 text-white font-bold px-2 py-1 text-sm rounded">
                          {car.price.toLocaleString()}$
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-base text-black">
                          {car.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {car.year} • {car.mileage.toLocaleString()} км •{" "}
                          {getGearboxLabel(car.gearbox)}
                        </p>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10m2 4H5m6 4H5"
                            />
                          </svg>
                          {formatDate(car.lastUpdate)}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
