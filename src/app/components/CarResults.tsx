"use client";

import { useState, useRef } from "react";
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

export default function CarResults({ results }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const itemsPerPage = 20;
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const listRef = useRef<HTMLDivElement>(null); // 👈 Реф на список

  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
    setInputPage("");
    listRef.current?.scrollIntoView({ behavior: "smooth" }); // 👈 Прокрутка к списку
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div ref={listRef} className="grid gap-4">
        {paginatedResults.map((car) => {
          const diff = getPriceDiff(car.price, car.marketPrice);
          return (
            <div
              key={car.id}
              className="border rounded-xl flex flex-col sm:flex-row overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="w-90 sm:w-50 h-auto flex-shrink-0">
                <img
                  src={car.image}
                  alt={car.title}
                  className="width=full height=full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-4 flex-1 grid gap-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      🚘
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
                      {getGearboxLabel(car.gearbox)} • {car.engineVolume} •{" "}
                      {car.fuel}
                    </p>
                    <p className="text-sm text-white">{car.city}</p>
                    <p className="text-sm text-gray-200">
                      Днів у продажу: {car.daysInSale}
                    </p>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <p className="font-bold text-lg">
                      {car.price.toLocaleString()}$
                    </p>
                    <p className={`text-sm ${diff.color}`}>{diff.formatted}</p>
                    <div className="mt-1">
                      <span className="inline-block text-xs px-2 py-1 rounded bg-green-200 text-green-900">
                        {car.daysInSale}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-200 mt-2 max-h-20 overflow-hidden text-ellipsis line-clamp-3">
                  {car.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
          {/* Навигация */}
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

          {/* Поле для ввода номера страницы */}
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
    </div>
  );
}
