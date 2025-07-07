"use client";

import { useEffect, useState } from "react";
import {
  getNotificationFilters,
  editNotificationFilter,
  deleteNotificationFilter,
  getBrands,
  getModels,
  getRegions,
} from "@/lib/api";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { CarSearchFilters } from "@/lib/types";
import type { Brand, Model, Region } from "@/lib/types";

interface FilterRow {
  id: string;
  params: CarSearchFilters;
  date_created: string;
  user_id: string;
}

const FilterSubscriptionsTable: React.FC = () => {
  const [filters, setFilters] = useState<FilterRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [filtersRes, brandsRes, modelsRes, regionsRes] =
          await Promise.all([
            getNotificationFilters(),
            getBrands(),
            getModels([]), // получим все модели
            getRegions(),
          ]);

        setFilters(filtersRes);
        setBrands(brandsRes);
        setModels(modelsRes);
        setRegions(regionsRes);
      } catch (error) {
        console.error("Ошибка загрузки фильтров или справочников:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getBrandName = (id: number | string) =>
    brands.find((b) => b.id === Number(id))?.name || `#${id}`;
  const getModelName = (id: number | string) =>
    models.find((m) => m.id === Number(id))?.name || `#${id}`;
  const getRegionName = (id: number | string) =>
    regions.find((r) => r.id === Number(id))?.name || `#${id}`;

  const fetchFilters = async () => {
    try {
      const data = await getNotificationFilters();
      setFilters(data);
    } catch (error) {
      console.error("Помилка завантаження підписок:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const toggleEnabled = async (id: string) => {
    try {
      const filter = filters.find((f) => f.id === id);
      if (!filter) return;

      const updatedParams = {
        ...filter.params,
        enabled: !filter.params.enabled,
      };

      // Обновляем локально
      setFilters((prev) =>
        prev.map((f) => (f.id === id ? { ...f, params: updatedParams } : f))
      );

      // 🔥 Добавляем вызов API
      await editNotificationFilter(id, updatedParams);
    } catch (error) {
      console.error("Не вдалося переключити enabled:", error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const filterToEdit = filters.find((f) => f.id === id);
      if (!filterToEdit) {
        console.error("Фильтр не найден");
        return;
      }

      // Передаем в функцию и id, и параметры фильтра
      await editNotificationFilter(id, filterToEdit.params);

      // По логике, тут можно обновить состояние, если нужно
    } catch (err) {
      console.error("Не вдалося редагувати фільтр", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotificationFilter(id);
      setFilters((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Не вдалося видалити фільтр", err);
    }
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="overflow-x-auto mt-10">
      <table className="container border text-xs bg-[#D9D9D9]">
        <thead className="bg-[#333] text-white">
          <tr>
            <th className="border p-2">Марки</th>
            <th className="border p-2">Модели</th>
            <th className="border p-2">Области</th>
            <th className="border p-2">Цена</th>
            <th className="border p-2">КПП</th>
            <th className="border p-2">Топливо</th>
            <th className="border p-2">Год</th>
            <th className="border p-2">Объем</th>
            <th className="border p-2">Пробег</th>
            <th className="border p-2">Состояние</th>
            <th className="border p-2">
              Вкл/Откл
              <br />
              оповещение
            </th>
            <th className="border p-2">
              Исключить
              <br />
              брокеров
            </th>
            <th className="border p-2">
              Отклонение
              <br />
              рын.цены
            </th>
            <th className="border p-2">
              Способ
              <br />
              оповещений
            </th>
            <th className="border p-2">Редактировать</th>
            <th className="border p-2">Удалить</th>
          </tr>
        </thead>
        <tbody className="text-black">
          {filters.map((filter) => (
            <tr key={filter.id} className="text-center">
              <td className="border p-1">
                {(filter.params.brands || [])
                  .map((id) => getBrandName(Number(id)))
                  .join(", ") || "–"}
              </td>
              <td className="border p-1">
                {(filter.params.models || [])
                  .map((id) => getModelName(Number(id)))
                  .join(", ") || "–"}
              </td>
              <td className="border p-1">
                {getRegionName(Number(filter.params.region)) || "–"}
              </td>

              <td className="border p-1">
                {filter.params.minPrice} – {filter.params.maxPrice}
              </td>
              <td className="border p-1">
                {filter.params.gearbox === 0
                  ? "Механика"
                  : filter.params.gearbox === 1
                  ? "Автомат"
                  : "Любой"}
              </td>
              <td className="border p-1">
                {typeof filter.params.fuel === "number"
                  ? ["Бензин", "Дизель", "Электро", "Гибрид", "Другой"][
                      filter.params.fuel
                    ]
                  : "Любое"}
              </td>

              <td className="border p-1">
                {filter.params.minYear} – {filter.params.maxYear}
              </td>
              <td className="border p-1">
                {filter.params.minEngineVolume} –{" "}
                {filter.params.maxEngineVolume}
              </td>
              <td className="border p-1">
                {filter.params.minMileage} – {filter.params.maxMileage}
              </td>
              <td className="border p-1">
                {filter.params.state === 1 ? "Целые" : "Любые"}
              </td>
              <td className="border p-1">
                <button
                  onClick={() => toggleEnabled(filter.id)}
                  className={`inline-block px-2 py-1 rounded-full text-white text-xs cursor-pointer ${
                    filter.params.enabled ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {filter.params.enabled ? "Вкл" : "Откл"}
                </button>
              </td>

              <td className="border p-1">
                {filter.params.includeDealers ? "Да" : "Нет"}
              </td>
              <td className="border p-1">
                {filter.params.marketPriceDeviation || 0} %
              </td>
              <td className="border p-1">
                <a
                  href="#"
                  title="Telegram"
                  className="text-blue-600 hover:opacity-80 inline-block"
                >
                  <PaperAirplaneIcon className="h-5 w-5 mx-auto" />
                </a>
              </td>
              <td className="border p-1">
                <button
                  onClick={() => handleEdit(filter.id)}
                  title="Редактировать"
                >
                  <PencilIcon className="h-5 w-5 text-yellow-600 hover:opacity-80 mx-auto cursor-pointer" />
                </button>
              </td>
              <td className="border p-1">
                <button onClick={() => handleDelete(filter.id)} title="Удалить">
                  <TrashIcon className="h-5 w-5 text-red-600 hover:opacity-80 mx-auto cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilterSubscriptionsTable;
