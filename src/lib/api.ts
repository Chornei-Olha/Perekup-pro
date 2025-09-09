"use client";

import { Brand, Model, Region, Car, CarSearchFilters } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://backend.perekup-pro.com.ua/api";

export async function getBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${BASE_URL}/brands/index.php`);

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
    const res = await fetch(`${BASE_URL}/regions/`);

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
    const res = await fetch(`${BASE_URL}/models/index.php`, {
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
    // console.log("Filter -- ", filters);
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

// Получить все подписки
export const getNotificationFilters = async () => {
  const res = await fetch("/api/filters", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}), // якщо тіло пусте
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Помилка запиту на /api/filters:", res.status, text);
    throw new Error("Не вдалося отримати фільтри");
  }

  return await res.json();
};

// Добавить новую подписку
export const addNotificationFilter = async (params: CarSearchFilters) => {
  const res = await fetch("/api/add-filter", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Не вдалося додати фільтр:", errorText);
    throw new Error("Ошибка добавления фильтра");
  }
};

// Удалить фильтр
export const deleteNotificationFilter = async (id: string) => {
  const res = await fetch("/api/delete-filter", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("❌ Ошибка удаления:", error);
    throw new Error("Ошибка удаления фильтра");
  }
};

// Редактировать фильтр (если потребуется)
export const editNotificationFilter = async (
  id: string,
  params: CarSearchFilters
) => {
  console.log("editNotificationFilter called with:", { id, params });

  const res = await fetch("/api/edit-filter", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, params }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("❌ Ошибка редактирования:", error);
    throw new Error("Ошибка редактирования фильтра");
  }
};

// Отримати підписки на розсилку
export const fetchNotificationFilters = async (
  params: Record<string, unknown> = {}
) => {
  console.log("fetchNotificationFilters called with:", params);

  const res = await fetch("/api/updates/filters", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("❌ Ошибка получения фильтров:", error);
    throw new Error("Ошибка получения фильтров");
  }

  const data = await res.json();
  return data;
};
