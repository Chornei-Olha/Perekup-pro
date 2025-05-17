"use client";

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
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid gap-4">
        {results.map((car) => {
          const diff = getPriceDiff(car.price, car.marketPrice);
          return (
            <div
              key={car.id}
              className="border rounded-xl flex flex-col sm:flex-row overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="w-90 sm:w-50 h-auto flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={car.image}
                  alt={car.title}
                  className="    width=full
                  height=full
                  object-cover"
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
                      {getGearboxLabel(car.gearbox)} • {car.fuel}
                    </p>
                    <p className="text-sm text-white">{car.city}</p>
                    <p className="text-sm text-gray-500">
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
                <p className="text-sm text-gray-400 mt-2 max-h-20 overflow-hidden text-ellipsis line-clamp-3">
                  {car.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
