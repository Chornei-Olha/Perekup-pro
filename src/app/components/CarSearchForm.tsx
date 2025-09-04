"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CarSearchFilters } from "../../lib/types";

type Option<T = number> = { id: T; name: string; unit?: "hours" | "days" };

interface CarSearchFormProps {
  onSubmit: (filters: CarSearchFilters) => void;
}

export const CarSearchForm: React.FC<CarSearchFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const transferOptions: Option<boolean | "all">[] = [
    { id: "all", name: "Показать с пригнанными" },
    { id: true, name: "Только пригнанные" },
    { id: false, name: "Не показывать пригнанные" },
  ];

  const paintOptions: Option<boolean | "all">[] = [
    { id: "all", name: "Показать с крашенными" },
    { id: true, name: "Только крашенные" },
    { id: false, name: "Только некрашенные" },
  ];

  const stateOptions: Option<number | "all">[] = [
    { id: "all", name: "Показать все" },
    { id: 0, name: "Целые" },
    { id: 1, name: "Не требует ремонта" },
    { id: 2, name: "После ДТП" },
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

  const [selectedPaint, setSelectedPaint] = useState<"all" | boolean>("all");
  const [selectedTransfer, setSelectedTransfer] = useState<"all" | boolean>(
    "all"
  );
  const [selectedState, setSelectedState] = useState<"all" | number>("all");

  const [query, setQuery] = useState("");

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

  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minYear, setMinYear] = useState(2000);
  const [maxYear, setMaxYear] = useState(2025);

  const [minEngine, setMinEngine] = useState(0);
  const [maxEngine, setMaxEngine] = useState(6.5);
  const [minMileage, setMinMileage] = useState(100);
  const [maxMileage, setMaxMileage] = useState(1000000);
  const [urlModelId, setUrlModelId] = useState<number | null>(null);

  // Загружаем данные брендов и регионов
  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data));

    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands([{ id: 0, name: "Все марки" }, ...data]));
  }, []);

  // Когда регионы загружены, устанавливаем выбранный регион из URL
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    if (paramsObj.region) {
      const region = regions.find((r) => r.id === Number(paramsObj.region));
      if (region) setSelectedRegion(region);
    }
  }, [regions, searchParamsString]);

  // Загружаем модели при выборе бренда
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

  // Инициализация значений из URL
  useEffect(() => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    // Цены
    if (paramsObj.minPrice) setMinPrice(Number(paramsObj.minPrice));
    if (paramsObj.maxPrice) setMaxPrice(Number(paramsObj.maxPrice));

    // Годы
    if (paramsObj.minYear) setMinYear(Number(paramsObj.minYear));
    if (paramsObj.maxYear) setMaxYear(Number(paramsObj.maxYear));

    // Можно аналогично для объема и пробега
    if (paramsObj.minEngine) setMinEngine(Number(paramsObj.minEngine));
    if (paramsObj.maxEngine) setMaxEngine(Number(paramsObj.maxEngine));
    if (paramsObj.minMileage) setMinMileage(Number(paramsObj.minMileage));
    if (paramsObj.maxMileage) setMaxMileage(Number(paramsObj.maxMileage));

    if (!selectedBrand) {
      if (paramsObj.brands) {
        const brandIds = paramsObj.brands.split(",").map((b) => Number(b));
        const brand = brands.find((b) => brandIds.includes(b.id));
        if (brand) setSelectedBrand(brand);
      }
    }

    if (paramsObj.models) {
      const modelIds = paramsObj.models.split(",").map((m) => Number(m));
      if (modelIds.length > 0) {
        setUrlModelId(modelIds[0]); // запоминаем модель из URL
      }
    }

    if (paramsObj.region) {
      const region = regions.find((r) => r.id === Number(paramsObj.region));
      if (region) setSelectedRegion(region);
    }

    if (paramsObj.gearbox) {
      const gearbox = gearboxOptions.find(
        (g) => g.id === Number(paramsObj.gearbox)
      );
      if (gearbox) setSelectedGearbox(gearbox);
    }

    if (paramsObj.fuel) {
      const fuel = fuelOptions.find((f) => f.id === Number(paramsObj.fuel));
      if (fuel) setSelectedFuel(fuel);
    }

    if (paramsObj.period) {
      const period = periodOptions.find(
        (p) => p.id === Number(paramsObj.period)
      );
      if (period) setSelectedPeriod(period);
    }

    if (paramsObj.paint) {
      const paint = paramsObj.paint;
      if (paint === "true") setSelectedPaint(true);
      else if (paint === "false") setSelectedPaint(false);
      else setSelectedPaint("all");
    }

    if (paramsObj.transfer) {
      const transfer = paramsObj.transfer;
      if (transfer === "true") setSelectedTransfer(true);
      else if (transfer === "false") setSelectedTransfer(false);
      else setSelectedTransfer("all");
    }

    if (paramsObj.state) {
      const state = Number(paramsObj.state);
      if (!isNaN(state)) setSelectedState(state);
    }
  }, [searchParams.toString(), brands, models, regions]);

  useEffect(() => {
    if (urlModelId && models.length > 0) {
      const model = models.find((m) => m.id === urlModelId);
      if (model) {
        setSelectedModel(model);
      }
      setUrlModelId(null); // очистка, чтобы не зациклиться
    }
  }, [urlModelId, models]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data: CarSearchFilters = {
      brands: selectedBrand && selectedBrand.id !== 0 ? [selectedBrand.id] : [],
      models: selectedModel ? [selectedModel.id] : [],
      region:
        selectedRegion && selectedRegion.id !== 0
          ? selectedRegion.id
          : undefined,

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
      sold: formData.get("sold") === "on",
      includeDealers: formData.get("includeDealers") === "on",
      includeBanned: formData.get("includeBanned") === "on",
      marketPriceDeviation: Number(formData.get("deviation")) || 0,
      period:
        selectedPeriod.id !== 0
          ? selectedPeriod.unit === "days"
            ? selectedPeriod.id * 24
            : selectedPeriod.id
          : undefined,
    };

    if (selectedPaint !== "all") data.paint = selectedPaint;
    if (selectedTransfer !== "all") data.transfer = selectedTransfer;
    if (selectedState !== "all") data.state = [selectedState];

    onSubmit(data);

    const params = new URLSearchParams();

    if (data.brands?.length) params.set("brands", data.brands.join(","));
    if (data.models?.length) params.set("models", data.models.join(","));
    // if (data.region) params.set("region", String(data.region));
    if (data.region !== undefined) params.set("region", String(data.region));

    if (data.minPrice) params.set("minPrice", String(data.minPrice));
    if (data.maxPrice) params.set("maxPrice", String(data.maxPrice));
    if (data.minYear) params.set("minYear", String(data.minYear));
    if (data.maxYear) params.set("maxYear", String(data.maxYear));
    if (data.minEngineVolume)
      params.set("minEngine", String(data.minEngineVolume));
    if (data.maxEngineVolume)
      params.set("maxEngine", String(data.maxEngineVolume));
    if (data.minMileage) params.set("minMileage", String(data.minMileage));
    if (data.maxMileage) params.set("maxMileage", String(data.maxMileage));
    if (data.gearbox !== undefined) params.set("gearbox", String(data.gearbox));
    if (data.fuel !== undefined) params.set("fuel", String(data.fuel));
    if (data.paint !== undefined) params.set("paint", String(data.paint));
    if (data.transfer !== undefined)
      params.set("transfer", String(data.transfer));
    if (data.state) params.set("state", data.state.join(","));
    if (data.period) params.set("period", String(data.period));
    if (data.includeDealers) params.set("includeDealers", "true");
    if (data.includeBanned) params.set("includeBanned", "true");
    if (data.sold) params.set("sold", "true");
    if (data.marketPriceDeviation)
      params.set("deviation", String(data.marketPriceDeviation));

    router.push(`?${params.toString()}`);
  };

  const renderListbox = <T,>(
    label: string,
    options: Option<T>[],
    selected: Option<T> | null,
    setSelected: (val: Option<T>) => void
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
                key={String(option.id)}
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

  const filteredBrands =
    query === ""
      ? brands
      : brands.filter((brand) =>
          brand.name.toLowerCase().includes(query.toLowerCase())
        );

  const renderBrandCombobox = () => (
    <div>
      <label className="font-medium block mb-1">Марка</label>
      <Combobox
        value={selectedBrand}
        onChange={(brand) => {
          setSelectedBrand(brand);
          setSelectedModel(null); // сброс модели при смене бренда
          setQuery(""); // очищаем поле после выбора
        }}
      >
        <div className="relative">
          <ComboboxInput
            className="w-full border p-2 rounded bg-transparent text-left"
            displayValue={(brand: Option<number> | null) =>
              query || brand?.name || ""
            }
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedBrand(null); // временно сбрасываем выбранный бренд
            }}
            placeholder="Введите марку"
          />
          <ChevronUpDownIcon className="h-5 w-5 absolute right-2 top-2.5 text-gray-400" />
          {filteredBrands.length > 0 && (
            <ComboboxOptions className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto">
              {filteredBrands.map((brand) => (
                <ComboboxOption
                  key={brand.id}
                  value={brand}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 text-black ${
                      active ? "bg-gray-200" : "bg-white"
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block ${selected ? "font-bold" : ""}`}>
                      {brand.name}
                    </span>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>
    </div>
  );

  return (
    <form onSubmit={handleSearch} className="pt-10 sm:pt-15">
      <div className="flex flex-col sm:flex-row">
        <div className="space-y-4 sm:space-y-8 pt-8 pl-4 pr-4 sm:p-8 w-full sm:w-xl mx-auto">
          {renderBrandCombobox()}

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

          <div className="relative group">
            <label className="font-['Inter'] font-medium mb-1 flex items-center">
              % отклонения
              <span className="ml-2 text-gray-400 cursor-pointer">?</span>
            </label>
            <input
              name="deviation"
              type="number"
              className="border p-2 rounded w-full"
            />
            <div className="absolute left-full ml-2 top-0 hidden group-hover:block bg-gray-300 text-red-800 text-xs rounded px-2 py-1 max-w-sm z-20">
              Отклонение от рыночной цены можно задать в % или в $. Число 1–99 =
              %, 100 и больше = $. Например, 10% покажет и 15%, и 20% и т.д.
            </div>
          </div>

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
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              type="number"
              className="border p-2 rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <label className="font-['Inter'] font-medium block mb-1">Год</label>
            <input
              name="minYear"
              value={minYear}
              onChange={(e) => setMinYear(Number(e.target.value))}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxYear"
              value={maxYear}
              onChange={(e) => setMaxYear(Number(e.target.value))}
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
              value={minEngine}
              onChange={(e) => setMinEngine(Number(e.target.value))}
              type="number"
              step="0.1"
              className="border p-2 rounded"
            />
            <input
              name="maxEngine"
              value={maxEngine}
              onChange={(e) => setMaxEngine(Number(e.target.value))}
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
              value={minMileage}
              onChange={(e) => setMinMileage(Number(e.target.value))}
              type="number"
              className="border p-2 rounded"
            />
            <input
              name="maxMileage"
              value={maxMileage}
              onChange={(e) => setMaxMileage(Number(e.target.value))}
              type="number"
              className="border p-2 rounded"
            />
          </div>
          <div className="mb-3">
            {renderListbox(
              "Состояние",
              stateOptions,
              stateOptions.find((o) => o.id === selectedState) || null,
              (val) => setSelectedState(val.id)
            )}
          </div>
          <div className="mb-3">
            {renderListbox(
              "Окраска",
              paintOptions,
              paintOptions.find((o) => o.id === selectedPaint) || null,
              (val) => setSelectedPaint(val.id)
            )}
          </div>
          <div className="mb-3">
            {renderListbox(
              "Пригнанные",
              transferOptions,
              transferOptions.find((o) => o.id === selectedTransfer) || null,
              (val) => setSelectedTransfer(val.id)
            )}
          </div>
          <label className="relative group flex items-center">
            <input name="includeDealers" type="checkbox" className="mr-2" />{" "}
            Включить диллеров
            <span className="ml-2 text-gray-400 cursor-pointer">?</span>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-300 text-red-800 text-xs rounded px-4 py-1 max-w-xl z-20">
              Отображать объявления дилеров
            </div>
          </label>
          <br />
          <label className="relative group flex items-center">
            <input name="includeBanned" type="checkbox" className="mr-2" />{" "}
            Включить заблокированные
            <span className="ml-2 text-gray-400 cursor-pointer">?</span>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-300 text-red-800 text-xs rounded px-2 py-1 max-w-xl z-20">
              В список заблокированных входят: объявления от лизинга, рассрочки,
              нерастаможенных авто, нового закона и просто фейковых объявлений
            </div>
          </label>{" "}
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
