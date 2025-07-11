"use client";

import { useEffect, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CarSearchFilters } from "@/lib/types";

type Option = { id: number; name: string; unit?: "hours" | "days" };

interface Props {
  handleAddFilter: (filters: CarSearchFilters) => void;
  onAddFilter?: (filters: CarSearchFilters) => void;

  initialValues?: CarSearchFilters;
}

export const defaultFilterValues: CarSearchFilters = {
  brands: [],
  models: [],
  region: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minYear: 2000,
  maxYear: new Date().getFullYear(),
  minEngineVolume: undefined,
  maxEngineVolume: undefined,
  minMileage: undefined,
  maxMileage: undefined,
  gearbox: undefined,
  fuel: undefined,
  paint: false,
  transfer: false,
  sold: false,
  includeDealers: false,
  includeBanned: false,
  states: undefined,
  marketPriceDeviation: 0,
  period: undefined,
  sellerId: undefined,
  enabled: true,
};

const CarFilterForm = ({ handleAddFilter, initialValues }: Props) => {
  const periodOptions: Option[] = [
    { id: 0, name: "Весь период", unit: "days" },
    { id: 1, name: "1 час", unit: "hours" },
    { id: 3, name: "3 часа", unit: "hours" },
    { id: 1, name: "1 день", unit: "days" },
    { id: 3, name: "3 дня", unit: "days" },
    { id: 7, name: "7 дней", unit: "days" },
    { id: 30, name: "30 дней", unit: "days" },
  ];

  const gearboxOptions: Option[] = [
    { id: 0, name: "Механика" },
    { id: 1, name: "Автомат" },
  ];

  const fuelOptions: Option[] = [
    { id: 0, name: "Бензин" },
    { id: 1, name: "Дизель" },
    { id: 2, name: "Электро" },
    { id: 3, name: "Гибрид" },
    { id: 4, name: "Другой" },
  ];

  const [regions, setRegions] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [models, setModels] = useState<Option[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<Option | null>(() => {
    const brandId = initialValues?.brands?.[0];
    return brandId !== undefined
      ? brands.find((b) => b.id === brandId) || null
      : null;
  });
  const [selectedModel, setSelectedModel] = useState<Option | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Option | null>(null);
  const [selectedGearbox, setSelectedGearbox] = useState<Option | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<Option | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Option>(
    periodOptions[0]
  );

  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data));

    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands([{ id: 0, name: "Все марки" }, ...data]));
  }, []);

  useEffect(() => {
    if (selectedBrand && selectedBrand.id !== 0) {
      fetch("/api/models/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brands: [selectedBrand.id] }),
      })
        .then((res) => res.json())
        .then((data) => setModels(Array.isArray(data) ? data : []));
    } else {
      setModels([]);
      setSelectedModel(null);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (initialValues) {
      const brandId = initialValues.brands?.[0];
      const brand = brands.find((b) => b.id === brandId) || null;
      setSelectedBrand(brand);

      if (brand) {
        // Загрузить модели для бренда
        fetch("/api/models/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brands: [brand.id] }),
        })
          .then((res) => res.json())
          .then((data) => {
            setModels(data);
            const modelId = initialValues.models?.[0];
            const model = data.find((m: Option) => m.id === modelId) || null;
            setSelectedModel(model);
          });
      }

      const region = regions.find((r) => r.id === initialValues.region) || null;
      setSelectedRegion(region);

      const gearbox =
        gearboxOptions.find((g) => g.id === initialValues.gearbox) || null;
      setSelectedGearbox(gearbox);

      const fuel = fuelOptions.find((f) => f.id === initialValues.fuel) || null;
      setSelectedFuel(fuel);

      const periodId = initialValues.period
        ? initialValues.period % 24 === 0
          ? initialValues.period / 24
          : initialValues.period
        : 0;
      const unit =
        initialValues.period && initialValues.period % 24 === 0
          ? "days"
          : "hours";
      const period =
        periodOptions.find((p) => p.id === periodId && p.unit === unit) ||
        periodOptions[0];
      setSelectedPeriod(period);
    }
  }, [initialValues, brands, regions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const stateValues = fd.getAll("states").map((s) => Number(s));

    const filters: CarSearchFilters = {
      brands: selectedBrand && selectedBrand.id !== 0 ? [selectedBrand.id] : [],
      models: selectedModel ? [selectedModel.id] : [],
      region: selectedRegion?.id,
      minPrice: Number(fd.get("minPrice")) || undefined,
      maxPrice: Number(fd.get("maxPrice")) || undefined,
      minYear: Number(fd.get("minYear")),
      maxYear: Number(fd.get("maxYear")),
      minEngineVolume: Number(fd.get("minEngine")) || undefined,
      maxEngineVolume: Number(fd.get("maxEngine")) || undefined,
      minMileage: Number(fd.get("minMileage")) || undefined,
      maxMileage: Number(fd.get("maxMileage")) || undefined,
      gearbox: selectedGearbox?.id,
      fuel: selectedFuel?.id,
      paint: fd.get("paint") === "on",
      transfer: fd.get("transfer") === "on",
      sold: fd.get("sold") === "on",
      includeDealers: fd.get("includeDealers") === "on",
      includeBanned: fd.get("includeBanned") === "on",
      states: stateValues.length ? stateValues : undefined,

      // state: fd.get("state") ? Number(fd.get("state")) : undefined,
      marketPriceDeviation: Number(fd.get("deviation")) || 0,
      period:
        selectedPeriod.id !== 0
          ? selectedPeriod.unit === "days"
            ? selectedPeriod.id * 24
            : selectedPeriod.id
          : undefined,
    };

    handleAddFilter(filters);
  };

  const handleReset = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedRegion(null);
    setSelectedGearbox(null);
    setSelectedFuel(null);
    setSelectedPeriod(periodOptions[0]);
    (document.querySelector("form") as HTMLFormElement)?.reset();
  };

  const renderListbox = (
    label: string,
    options: Option[],
    selected: Option | null,
    setSelected: (val: Option) => void
  ) => (
    <div>
      <label className="font-medium block mb-1">{label}</label>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <ListboxButton className="w-full border p-2 rounded bg-transparent text-left">
            {selected?.name || `Выберите ${label.toLowerCase()}`}
            <ChevronUpDownIcon className="h-5 w-5 absolute right-2 top-2.5 text-gray-400" />
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <ListboxOption
                key={option.id}
                value={option}
                className={({ active }) =>
                  `cursor-pointer px-4 py-2 text-black ${
                    active ? "bg-gray-200" : "bg-white"
                  }`
                }
              >
                {({ selected }) => (
                  <span className={`block ${selected ? "font-bold" : ""}`}>
                    {option.name}
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          {renderListbox("Марка", brands, selectedBrand, setSelectedBrand)}
          {selectedBrand &&
            models.length > 0 &&
            renderListbox("Модель", models, selectedModel, setSelectedModel)}
          {renderListbox("Регион", regions, selectedRegion, setSelectedRegion)}
          <div className="grid grid-cols-2 gap-4">
            {renderListbox(
              "КПП",
              gearboxOptions,
              selectedGearbox,
              setSelectedGearbox
            )}
            {renderListbox(
              "Топливо",
              fuelOptions,
              selectedFuel,
              setSelectedFuel
            )}
          </div>

          <label className="block font-medium">Отклонение от рынка, %</label>
          <input
            name="deviation"
            type="number"
            className="border p-2 rounded w-full"
          />

          {renderListbox(
            "Период",
            periodOptions,
            selectedPeriod,
            setSelectedPeriod
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-3 font-medium">Цена, $</label>
            <input
              name="minPrice"
              // defaultValue={1000}
              defaultValue={initialValues?.minPrice ?? 1000}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxPrice"
              // defaultValue={100000}
              defaultValue={initialValues?.maxPrice ?? 100000}
              type="number"
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-3 font-medium">Год</label>
            <input
              name="minYear"
              // defaultValue={2000}
              defaultValue={initialValues?.minYear ?? 2000}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxYear"
              // defaultValue={2025}
              defaultValue={initialValues?.maxYear ?? 2025}
              type="number"
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-3 font-medium">Объём, см³</label>
            <input
              name="minEngine"
              // defaultValue={0}
              defaultValue={initialValues?.minEngineVolume ?? 0}
              type="number"
              step="0.1"
              className="border p-2 rounded"
            />
            <input
              name="maxEngine"
              // defaultValue={6.5}
              defaultValue={initialValues?.maxEngineVolume ?? 6.5}
              type="number"
              step="0.1"
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-3 font-medium">Пробег</label>
            <input
              name="minMileage"
              // defaultValue={100}
              defaultValue={initialValues?.minMileage ?? 100}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxMileage"
              // defaultValue={1000000}
              defaultValue={initialValues?.maxMileage ?? 100000}
              type="number"
              className="border p-2 rounded"
            />
          </div>

          {/* <div className="space-y-1">
            <label>
              <input
                name="paint"
                type="checkbox"
                defaultChecked={initialValues?.paint}
                className="mr-2"
              />{" "}
              Крашенные
            </label>
            <br />
            <label>
              <input
                name="transfer"
                type="checkbox"
                defaultChecked={initialValues?.transfer}
                className="mr-2"
              />{" "}
              Пригнанные
            </label>
            <br />
            <label>
              <input
                name="sold"
                type="checkbox"
                defaultChecked={initialValues?.sold}
                className="mr-2"
              />{" "}
              Проданные
            </label>
            <br />
            <label>
              <input
                name="includeDealers"
                type="checkbox"
                defaultChecked={initialValues?.includeDealers}
                className="mr-2"
              />{" "}
              Дилеры
            </label>
            <br />
            <label>
              <input
                name="includeBanned"
                type="checkbox"
                defaultChecked={initialValues?.includeBanned}
                className="mr-2"
              />{" "}
              Заблокированные
            </label>
          </div> */}
          <div className="space-y-1">
            <label>
              <input
                name="includeDealers"
                type="checkbox"
                defaultChecked={initialValues?.includeDealers}
                className="mr-2"
              />{" "}
              Дилеры
            </label>
            <label className="font-medium block"></label>
            {[
              { id: 1, label: "Крашенные" },
              { id: 2, label: "Пригнанные" },
              { id: 3, label: "Проданные" },
              { id: 4, label: "Заблокированные" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="states"
                  value={id}
                  defaultChecked={initialValues?.states?.includes(id)}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 pt-6">
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-10 py-2 rounded"
        >
          Добавить фильтр
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-400 hover:bg-gray-500 text-white px-10 py-2 rounded"
        >
          Сбросить
        </button>
      </div>
    </form>
  );
};

export default CarFilterForm;
