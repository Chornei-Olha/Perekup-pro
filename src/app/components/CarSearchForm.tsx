"use client";

import { useEffect, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CarSearchFilters } from "../../lib/types";

type Option = { id: number; name: string; unit?: "hours" | "days" };

interface CarSearchFormProps {
  onSubmit: (filters: CarSearchFilters) => void;
}

const CarSearchForm: React.FC<CarSearchFormProps> = ({ onSubmit }) => {
  const periodOptions: { id: number; name: string; unit: "hours" | "days" }[] =
    [
      { id: 0, name: "Весь период", unit: "days" },
      { id: 1, name: "1 час", unit: "hours" },
      { id: 3, name: "3 часа", unit: "hours" },
      { id: 1, name: "1 день", unit: "days" },
      { id: 3, name: "3 дня", unit: "days" },
      { id: 7, name: "7 дней", unit: "days" },
      { id: 30, name: "30 дней", unit: "days" },
    ];

  const [regions, setRegions] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [models, setModels] = useState<Option[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<Option | null>(null);
  const [selectedModel, setSelectedModel] = useState<Option | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Option | null>(null);

  const [selectedGearbox, setSelectedGearbox] = useState<Option | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<Option | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Option>(
    periodOptions[0]
  );

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
        .then((data) => {
          if (Array.isArray(data)) setModels(data);
          else if (Array.isArray(data.models)) setModels(data.models);
          else setModels([]);
        })
        .catch(() => setModels([]));
    } else {
      setModels([]);
      setSelectedModel(null);
    }
  }, [selectedBrand]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data: CarSearchFilters = {
      brands: selectedBrand && selectedBrand.id !== 0 ? [selectedBrand.id] : [],
      models: selectedModel ? [selectedModel.id] : [],
      region: selectedRegion ? selectedRegion.id : undefined,
      minPrice: Number(formData.get("minPrice")) || undefined,
      maxPrice: Number(formData.get("maxPrice")) || undefined,
      minYear: Number(formData.get("minYear")),
      maxYear: Number(formData.get("maxYear")),
      minEngineVolume: Number(formData.get("minEngine")) || undefined,
      maxEngineVolume: Number(formData.get("maxEngine")) || undefined,
      minMileage: Number(formData.get("minMileage")) || undefined,
      maxMileage: Number(formData.get("maxMileage")) || undefined,
      gearbox: selectedGearbox ? selectedGearbox.id : undefined,
      fuel: selectedFuel ? selectedFuel.id : undefined,
      paint: formData.get("paint") === "on",
      transfer: formData.get("transfer") === "on",
      sold: formData.get("sold") === "on",
      includeDealers: formData.get("includeDealers") === "on",
      includeBanned: formData.get("includeBanned") === "on",
      state:
        formData.get("state") !== ""
          ? Number(formData.get("state"))
          : undefined,
      marketPriceDeviation: Number(formData.get("deviation")) || 0,
      period:
        selectedPeriod.id !== 0
          ? selectedPeriod.unit === "days"
            ? selectedPeriod.id * 24
            : selectedPeriod.id
          : undefined,
    };

    onSubmit(data);
  };

  const renderListbox = (
    label: string,
    options: Option[],
    selected: Option | null,
    setSelected: (val: Option) => void
  ) => (
    <div>
      <label className="font-['Inter'] font-medium block mb-1">{label}</label>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <ListboxButton className="w-full border p-2 rounded text-left bg-transparent">
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
    <form onSubmit={handleSearch} className="pt-10 sm:pt-15">
      <div className="flex flex-col sm:flex-row">
        <div className="space-y-4 sm:space-y-8 pt-8 pl-4 pr-4 sm:p-8 w-full sm:w-xl mx-auto">
          {renderListbox("Марка", brands, selectedBrand, setSelectedBrand)}
          {selectedBrand && selectedBrand.id !== 0 && models.length > 0 ? (
            renderListbox("Модель", models, selectedModel, setSelectedModel)
          ) : (
            <p className="text-sm text-gray-500">
              Выберите марку для отображения моделей
            </p>
          )}
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

          <label className="font-['Inter'] font-medium block mb-1">
            % отклонения
          </label>
          <input
            name="deviation"
            type="number"
            className="border p-2 rounded w-full"
          />

          <div className="mt-4">
            {renderListbox(
              "Период, дни",
              periodOptions,
              selectedPeriod,
              setSelectedPeriod
            )}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-7 pt-4 pl-4 pr-4 sm:p-8 sm:pt-14 w-full sm:w-xl mx-auto">
          <div className="grid grid-cols-3 gap-2">
            <label className="font-['Inter'] font-medium block mb-1">
              Цена, $
            </label>
            <input
              name="minPrice"
              defaultValue={1000}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxPrice"
              defaultValue={100000}
              type="number"
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="font-['Inter'] font-medium block mb-1">Год</label>
            <input
              name="minYear"
              defaultValue={2000}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxYear"
              defaultValue={2025}
              type="number"
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="font-['Inter'] font-medium block mb-1">
              Объем, см3
            </label>
            <input
              name="minEngine"
              defaultValue={0}
              type="number"
              step="0.1"
              className="border p-2 rounded"
            />
            <input
              name="maxEngine"
              defaultValue={6.5}
              type="number"
              step="0.1"
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="font-['Inter'] font-medium block mb-1">
              Пробег
            </label>
            <input
              name="minMileage"
              defaultValue={100}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxMileage"
              defaultValue={1000000}
              type="number"
              className="border p-2 rounded"
            />
          </div>

          <label>
            <input name="paint" type="checkbox" className="mr-2" /> Крашенные
          </label>
          <br />
          <label>
            <input name="transfer" type="checkbox" className="mr-2" />{" "}
            Пригнанные
          </label>
          <br />
          <label>
            <input name="sold" type="checkbox" className="mr-2" /> Проданные
          </label>
          <br />
          <label>
            <input name="includeDealers" type="checkbox" className="mr-2" />{" "}
            Включить диллеров
          </label>
          <br />
          <label>
            <input name="includeBanned" type="checkbox" className="mr-2" />{" "}
            Включить заблокированные
          </label>
        </div>
      </div>

      <div className="space-y-4 p-7 text-center mx-auto">
        <button
          type="submit"
          className="font-['Inter'] font-extralight text-[15px] sm:text-[20px] bg-[#9D0D14] hover:bg-red-700 transition px-20 py-2 rounded-[20px] text-white"
        >
          Подобрать авто
        </button>
      </div>
    </form>
  );
};

export default CarSearchForm;
