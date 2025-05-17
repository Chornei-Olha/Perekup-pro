import { Brand, Model, Region, Car, CarSearchFilters } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://perecup-pro.com/api";

export async function getBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${BASE_URL}/brands`);

    if (!res.ok) {
      throw new Error(
        `Ошибка при запросе брендов: ${res.status} ${res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Ошибка при запросе к API для брендов:", error);
    throw error;
  }
}

export async function getRegions(): Promise<Region[]> {
  try {
    const res = await fetch(`${BASE_URL}/regions`);

    if (!res.ok) {
      throw new Error(
        `Ошибка при запросе регионов: ${res.status} ${res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Ошибка при запросе к API для регионов:", error);
    throw error;
  }
}

export async function getModels(brands: number[]): Promise<Model[]> {
  try {
    const res = await fetch(`${BASE_URL}/models/php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brands }),
    });

    if (!res.ok) {
      throw new Error(
        `Ошибка при запросе моделей: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    // Проверяем, что возвращается именно массив
    if (!Array.isArray(data)) {
      console.error("Ожидался массив моделей, получено:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Ошибка при запросе к API для моделей:", error);
    return [];
  }
}

export async function searchCars(filters: CarSearchFilters): Promise<Car[]> {
  try {
    const res = await fetch(`${BASE_URL}/cars/search.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });

    if (!res.ok) {
      throw new Error(
        `Ошибка при поиске автомобилей: ${res.status} ${res.statusText} ${BASE_URL}`
      );
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Ожидался массив автомобилей, получено:", data);
      return []; // безопасно вернуть пустой массив
    }

    return data;
  } catch (error) {
    console.error("Ошибка при запросе к API для поиска автомобилей:", error);
    return []; // безопасно вернуть пустой массив
  }
}

export async function getTopCars(): Promise<Car[]> {
  try {
    const res = await fetch(`${BASE_URL}/cars/top`);

    if (!res.ok) {
      throw new Error(
        `Ошибка при запросе топовых авто: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Ожидался массив автомобилей, получено:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Ошибка при запросе к API для топ авто:", error);
    return [];
  }
}
