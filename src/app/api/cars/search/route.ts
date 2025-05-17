import { NextRequest, NextResponse } from "next/server";
import { Car, CarSearchFilters, Brand, Region, Model } from "@/lib/types";

// Функция фильтрации автомобилей
const filterCars = (
  filters: CarSearchFilters,
  cars: Car[],
  regions: Region[],
  brands: Brand[],
  models: Model[]
): Car[] => {
  return cars.filter((car) => {
    // Фильтрация по региону
    if (
      filters.region &&
      car.city !== regions.find((region) => region.id === filters.region)?.name
    )
      return false; // Фильтруем машину, если регион не совпадает

    // Фильтрация по брендам
    if (
      filters.brands &&
      !filters.brands.some((brandId) =>
        brands.find((brand) => String(brand.id) === String(brandId))
      )
    )
      return false;
    // Фильтрация по моделям
    if (
      filters.models &&
      !filters.models.some((modelId) =>
        models.some((model) => model.id === modelId && model.name === car.model)
      )
    )
      return false;

    // Фильтрация по цене
    if (filters.minPrice !== undefined && car.price < Number(filters.minPrice))
      return false;
    if (filters.maxPrice !== undefined && car.price > Number(filters.maxPrice))
      return false;

    // Фильтрация по году
    if (filters.minYear && car.year < filters.minYear) return false;
    if (filters.maxYear && car.year > filters.maxYear) return false;

    // Фильтрация по объему двигателя
    if (filters.minEngineVolume && car.engineVolume < filters.minEngineVolume)
      return false;
    if (filters.maxEngineVolume && car.engineVolume > filters.maxEngineVolume)
      return false;

    // Фильтрация по коробке передач
    if (filters.gearbox && car.gearbox !== filters.gearbox) return false;

    // // Фильтрация по топливу
    // if (filters.fuel && car.fuel !== filters.fuel) return false;

    // Фильтрация по пробегу
    if (filters.minMileage && car.mileage < filters.minMileage) return false;
    if (filters.maxMileage && car.mileage > filters.maxMileage) return false;

    // // Фильтрация по состоянию
    // if (filters.state && car.state !== filters.state) return false;

    return true;
  });
};

// Обработчик POST-запросов
export async function POST(req: NextRequest) {
  try {
    const filters: CarSearchFilters = await req.json(); // Получаем фильтры из запроса
    console.log("Полученные фильтры:", filters); // Логируем фильтры

    // Загружаем данные с сервера
    const regions = await (
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/regions`)
    ).json();
    const brands = await (
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brands`)
    ).json();
    const models = await (
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/`)
    ).json();

    // Получаем данные о машинах с API
    const carsResponse = await fetch(
      "https://perecup-pro.com/api/cars/search.php",
      {
        method: "POST", // убедитесь, что API ожидает именно POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      }
    );

    if (!carsResponse.ok) {
      const errorText = await carsResponse.text(); // выводим, что вернул сервер
      console.error("Ошибка ответа от API:", errorText);
      throw new Error(`Ошибка загрузки автомобилей: ${carsResponse.status}`);
    }

    const cars = await carsResponse.json(); // теперь безопасно парсить

    // Применяем фильтры к автомобилям
    const filteredCars = filterCars(filters, cars, regions, brands, models);

    return NextResponse.json(filteredCars); // Возвращаем отфильтрованные автомобили
  } catch (error) {
    console.error("Ошибка при фильтрации автомобилей:", error);
    return NextResponse.json(
      { error: "Ошибка при фильтрации автомобилей." },
      { status: 500 }
    );
  }
}
