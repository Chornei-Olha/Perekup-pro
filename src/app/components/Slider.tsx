"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { getTopCars } from "@/lib/api";
import { Car } from "@/lib/types";

export default function Top50Slider() {
  const [cars, setCars] = useState<Car[]>([]);
  const [current, setCurrent] = useState(0);
  const itemsPerSlide = 3;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function load() {
      const topCars = await getTopCars();
      setCars(topCars);
    }
    load();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const next = () =>
    setCurrent((prev) =>
      Math.min(prev + 1, cars.length - (isMobile ? 1 : itemsPerSlide))
    );
  const prev = () => setCurrent((prev) => Math.max(prev - 1, 0));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  return (
    <section className="py-10 px-4" {...swipeHandlers}>
      <div className="max-w-7xl mx-auto">
        <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-white text-[30px] sm:text-[50px] mb-6">
          ТОП 50
        </h2>

        <div className="overflow-hidden">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-transform duration-500 ${
              isMobile ? "grid-cols-1" : ""
            }`}
          >
            {cars
              .slice(current, current + (isMobile ? 1 : itemsPerSlide))
              .map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-3xl p-4 flex flex-col items-center shadow-xl relative"
                >
                  <span className="absolute top-2 right-2 bg-[#9f1b1b] text-white text-xs px-2 py-0.5 rounded">
                    топ
                  </span>
                  <div className="w-[240px] h-[140px] flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={car.image}
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-center mt-4">
                    {car.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{car.year}</p>
                  <p className="text-md font-bold text-black mb-4">
                    {car.price.toLocaleString()}$
                  </p>
                  <div className="flex flex-col gap-2 items-center flex-grow">
                    <button
                      className="font-['Inter'] font-bold bg-gradient-to-r from-[#821810] to-[#000000] hover:bg-gradient-to-r hover:from-[#000000] hover:to-[#821810] text-white px-6 py-2 rounded-[6px] text-[12px] w-[180px] h-[45px] mb-3 mt-auto"
                      onClick={() => window.open(car.url, "_blank")}
                    >
                      Подробнее
                    </button>
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                      ⚡
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={prev}
              className="bg-black p-2 rounded-full shadow-md hover:bg-gray-400"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={next}
              className="bg-black p-2 rounded-full shadow-md hover:bg-gray-400"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
