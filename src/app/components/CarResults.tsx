// "use client";

// import { useState, useRef } from "react";
// import { Car } from "@/lib/types";

// type Props = {
//   results: Car[];
// };

// function getGearboxLabel(code: number) {
//   return code === 0 ? "МТ" : code === 1 ? "АТ" : "—";
// }

// function getPriceDiff(price: number, marketPrice: number) {
//   const diff = price - marketPrice;
//   return {
//     value: diff,
//     formatted: `${diff > 0 ? "+" : ""}${diff.toLocaleString()}$`,
//     color: diff > 0 ? "text-red-600" : "text-green-600",
//   };
// }

// function formatDate(isoDate: string) {
//   const date = new Date(isoDate);
//   return date.toLocaleDateString("ru-RU", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// }

// export default function CarResults({ results }: Props) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [inputPage, setInputPage] = useState("");
//   const itemsPerPage = 20;
//   const totalPages = Math.ceil(results.length / itemsPerPage);
//   const listRef = useRef<HTMLDivElement>(null); // 👈 Реф на список

//   const sortedResults = [...results].sort((a, b) => {
//     return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
//   });

//   const paginatedResults = sortedResults.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const goToPage = (page: number) => {
//     const p = Math.min(Math.max(1, page), totalPages);
//     setCurrentPage(p);
//     setInputPage("");
//     listRef.current?.scrollIntoView({ behavior: "smooth" }); // 👈 Прокрутка к списку
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6">
//       <div ref={listRef} className="grid gap-4">
//         {paginatedResults.map((car) => {
//           const diff = getPriceDiff(car.price, car.marketPrice);
//           return (
//             <div
//               key={car.id}
//               className="border rounded-xl flex flex-col sm:flex-row overflow-hidden shadow-sm hover:shadow-md transition"
//             >
//               <div className="w-90 sm:w-50 h-auto flex-shrink-0">
//                 <img
//                   src={car.image}
//                   alt={car.title}
//                   className="width=full height=full object-cover"
//                   loading="lazy"
//                 />
//               </div>

//               <div className="p-4 flex-1 grid gap-1">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="font-semibold text-lg">
//                       🚘
//                       <a
//                         href={car.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="hover:underline"
//                       >
//                         {car.title}
//                       </a>
//                     </h3>
//                     <p className="text-sm text-white">
//                       {car.year} • {car.mileage.toLocaleString()} км •{" "}
//                       {getGearboxLabel(car.gearbox)} • {car.engineVolume} •{" "}
//                       {car.fuel}
//                     </p>
//                     <p className="text-sm text-white">{car.city}</p>
//                     <p className="text-sm text-gray-200">
//                       Днів у продажу: {car.daysInSale}
//                     </p>
//                   </div>
//                   <div className="text-right min-w-[120px]">
//                     <p className="font-bold text-lg">
//                       {car.price.toLocaleString()}$
//                     </p>
//                     <p className={`text-sm ${diff.color}`}>{diff.formatted}</p>
//                     <div className="mt-1">
//                       <span className="inline-block text-xs px-2 py-1 rounded bg-gray-200 text-green-900">
//                         Обновлено:
//                         <br />
//                         {formatDate(car.lastUpdate)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-200 mt-2 max-h-20 overflow-hidden text-ellipsis line-clamp-3">
//                   {car.description}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Пагинация */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
//           {/* Навигация */}
//           <div className="flex items-center space-x-1">
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
//             >
//               ←
//             </button>

//             <button
//               onClick={() => goToPage(1)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === 1
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-800"
//               }`}
//             >
//               1
//             </button>

//             {currentPage > 3 && <span className="px-2 text-gray-500">…</span>}

//             {currentPage > 1 && currentPage < totalPages && (
//               <button
//                 className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
//                 disabled
//               >
//                 {currentPage}
//               </button>
//             )}

//             {currentPage < totalPages - 2 && (
//               <span className="px-2 text-gray-500">…</span>
//             )}

//             {totalPages > 1 && (
//               <button
//                 onClick={() => goToPage(totalPages)}
//                 className={`px-3 py-1 rounded ${
//                   currentPage === totalPages
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-800"
//                 }`}
//               >
//                 {totalPages}
//               </button>
//             )}

//             <button
//               onClick={() => goToPage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
//             >
//               →
//             </button>
//           </div>

//           {/* Поле для ввода номера страницы */}
//           <div className="flex items-center space-x-2">
//             <label className="text-sm text-gray-300">
//               Перейти на сторінку:
//             </label>
//             <input
//               type="number"
//               min="1"
//               max={totalPages}
//               value={inputPage}
//               onChange={(e) => setInputPage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   const page = parseInt(inputPage);
//                   if (!isNaN(page)) goToPage(page);
//                 }
//               }}
//               className="w-16 px-2 py-1 rounded border border-gray-400 bg-gray-800 text-white"
//               placeholder="№"
//             />
//             <button
//               onClick={() => {
//                 const page = parseInt(inputPage);
//                 if (!isNaN(page)) goToPage(page);
//               }}
//               className="px-3 py-1 bg-blue-600 text-white rounded"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
  // const [periodFilter, setPeriodFilter] = useState("all");
  const itemsPerPage = 20;
  const listRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(results.length / itemsPerPage);
  // const now = new Date();

  // const getThresholdDate = (filter: string) => {
  //   const date = new Date();
  //   switch (filter) {
  //     case "1h":
  //       date.setHours(now.getHours() - 1);
  //       break;
  //     case "3h":
  //       date.setHours(now.getHours() - 3);
  //       break;
  //     case "1d":
  //       date.setDate(now.getDate() - 1);
  //       break;
  //     case "3d":
  //       date.setDate(now.getDate() - 3);
  //       break;
  //     case "1w":
  //       date.setDate(now.getDate() - 7);
  //       break;
  //     case "1m":
  //       date.setMonth(now.getMonth() - 1);
  //       break;
  //   }
  //   return date;
  // };

  // const filteredResults =
  //   periodFilter === "all"
  //     ? results
  //     : results.filter((car) => {
  //         const updateDate = new Date(car.lastUpdate);
  //         return updateDate >= getThresholdDate(periodFilter);
  //       });
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
      fetch(`/api/cars?sellerId=${selectedSellerId}`)
        .then((res) => res.json())
        .then((data) => {
          setSellerCars(data);
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
      {/* Фильтр по периоду */}
      {/* <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "Усі", value: "all" },
          { label: "1 год", value: "1h" },
          { label: "3 год", value: "3h" },
          { label: "1 доба", value: "1d" },
          { label: "3 доби", value: "3d" },
          { label: "Тиждень", value: "1w" },
          { label: "Місяць", value: "1m" },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => {
              setPeriodFilter(value);
              setCurrentPage(1); // сбросить на первую страницу
            }}
            className={`px-3 py-1 rounded ${
              periodFilter === value
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div> */}

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
                {/* <div className="mt-1">
                  <span className="inline-block text-xs px-2 py-1 rounded bg-gray-200 text-green-900">
                    Обновлено:
                    <br />
                    {formatDate(car.lastUpdate)}
                  </span>
                </div> */}
                <div className="mt-1">
                  <span className="inline-block text-xs px-2 py-1 rounded bg-gray-200 text-green-900">
                    Обновлено:
                    <br />
                    {formatDate(car.lastUpdate)}
                  </span>
                  <br />
                  <button
                    onClick={() => setSelectedSellerId(car.sellerId!)}
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
              <h2 className="text-xl font-bold">
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
              <ul className="grid gap-3">
                {sellerCars.map((car) => (
                  <li key={car.id} className="border rounded p-3">
                    <a
                      href={car.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {car.title}
                    </a>
                    <p className="text-sm text-gray-600">
                      {car.year} • {car.mileage.toLocaleString()} км •{" "}
                      {getGearboxLabel(car.gearbox)} •{" "}
                      {car.price.toLocaleString()}$
                    </p>
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
