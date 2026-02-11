"use client";

import { useState } from "react";

interface BlockSize {
  length: number;
  width: number;
  height: number;
}

interface Opening {
  width: number;
  height: number;
  count: number;
}

interface Gable {
  width: number;
  height: number;
}

const PRESET_BLOCKS = [
  { label: "390×190×188 Керам", length: 390, width: 190, height: 188 },
  { label: "625×300×200", length: 625, width: 300, height: 200 },
  { label: "625×300×249", length: 625, width: 300, height: 249 },
  { label: "625×400×249", length: 625, width: 400, height: 249 },
];

export function BlockCalculator() {
  const [blockPreset, setBlockPreset] = useState<string>("custom");
  const [blockSize, setBlockSize] = useState<BlockSize>({ length: 390, width: 190, height: 188 });
  const [perimeter, setPerimeter] = useState<number>(30);
  const [wallHeight, setWallHeight] = useState<number>(300);
  const [wallThickness, setWallThickness] = useState<string>("half");
  const [mortarThickness, setMortarThickness] = useState<number>(10);
  const [meshFrequency, setMeshFrequency] = useState<string>("every");
  const [meshRows, setMeshRows] = useState<number>(1);
  const [pricePerBlock, setPricePerBlock] = useState<number>(0);
  const [blockWeight, setBlockWeight] = useState<number>(0);
  const [showGables, setShowGables] = useState<boolean>(false);
  const [gables, setGables] = useState<Gable[]>([]);
  const [showOpenings, setShowOpenings] = useState<boolean>(false);
  const [openings, setOpenings] = useState<Opening[]>([]);

  const handlePresetChange = (preset: string) => {
    setBlockPreset(preset);
    if (preset !== "custom") {
      const presetBlock = PRESET_BLOCKS.find((b) => b.label === preset);
      if (presetBlock) {
        setBlockSize({
          length: presetBlock.length,
          width: presetBlock.width,
          height: presetBlock.height,
        });
      }
    }
  };

  const addGable = () => {
    setGables([...gables, { width: 0, height: 0 }]);
  };

  const updateGable = (index: number, field: keyof Gable, value: number) => {
    const updated = [...gables];
    updated[index] = { ...updated[index], [field]: value };
    setGables(updated);
  };

  const removeGable = (index: number) => {
    setGables(gables.filter((_, i) => i !== index));
  };

  const addOpening = () => {
    setOpenings([...openings, { width: 0, height: 0, count: 1 }]);
  };

  const updateOpening = (index: number, field: keyof Opening, value: number) => {
    const updated = [...openings];
    updated[index] = { ...updated[index], [field]: value };
    setOpenings(updated);
  };

  const removeOpening = (index: number) => {
    setOpenings(openings.filter((_, i) => i !== index));
  };

  const calculate = () => {
    // Переводим все в миллиметры для расчетов
    const blockLength = blockSize.length; // мм
    const blockWidth = blockSize.width; // мм
    const blockHeight = blockSize.height; // мм
    const perimeterM = perimeter; // метры
    const wallHeightCm = wallHeight; // см
    const wallHeightM = wallHeightCm / 100; // метры
    const mortarThicknessMm = mortarThickness; // мм

    // Определяем толщину стены в миллиметрах
    let wallThicknessMm = 0;
    switch (wallThickness) {
      case "half":
        wallThicknessMm = blockWidth;
        break;
      case "full":
        wallThicknessMm = blockLength;
        break;
      case "oneHalf":
        wallThicknessMm = blockLength + blockWidth / 2;
        break;
      case "two":
        wallThicknessMm = blockLength * 2;
        break;
    }

    // Площадь стен в м²
    let wallArea = perimeterM * wallHeightM;

    // Вычитаем площадь проемов (окна и двери) с учетом количества
    const openingsArea = openings.reduce((sum, opening) => {
      // Переводим см в метры
      const widthM = opening.width / 100;
      const heightM = opening.height / 100;
      const count = opening.count > 0 ? opening.count : 1;
      return sum + (widthM * heightM * count);
    }, 0);
    wallArea -= openingsArea;

    // Добавляем площадь фронтонов
    const gablesArea = gables.reduce((sum, gable) => {
      const widthM = gable.width / 100;
      const heightM = gable.height / 100;
      return sum + (widthM * heightM) / 2; // Треугольник
    }, 0);
    wallArea += gablesArea;

    // Объем кладки в м³
    const masonryVolume = wallArea * (wallThicknessMm / 1000);

    // Объем одного блока с учетом раствора
    const blockVolumeWithMortar =
      (blockLength + mortarThicknessMm) *
      (blockWidth + mortarThicknessMm) *
      (blockHeight + mortarThicknessMm) /
      1_000_000_000; // м³

    // Количество блоков
    const blockCount = Math.ceil(masonryVolume / blockVolumeWithMortar);

    // Общий вес
    const totalWeight = blockWeight > 0 ? blockCount * blockWeight : 0;

    // Общая стоимость
    const totalCost = pricePerBlock > 0 ? blockCount * pricePerBlock : 0;

    return {
      blockCount,
      masonryVolume,
      totalWeight,
      totalCost,
      wallArea,
    };
  };

  const result = calculate();

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--nevblock-blue)] mb-2">
          Онлайн калькулятор расчета строительных блоков
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Рассчитайте необходимое количество блоков для строительства
        </p>
      </div>

      <div className="space-y-6">
        {/* Размер блока */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Размер (Д×Ш×В) или вид блока
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              value={blockPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="custom">Свои размеры</option>
              {PRESET_BLOCKS.map((block) => (
                <option key={block.label} value={block.label}>
                  {block.label}
                </option>
              ))}
            </select>
            {blockPreset === "custom" && (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Д"
                  value={blockSize.length || ""}
                  onChange={(e) =>
                    setBlockSize({ ...blockSize, length: Number(e.target.value) })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Ш"
                  value={blockSize.width || ""}
                  onChange={(e) =>
                    setBlockSize({ ...blockSize, width: Number(e.target.value) })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="В"
                  value={blockSize.height || ""}
                  onChange={(e) =>
                    setBlockSize({ ...blockSize, height: Number(e.target.value) })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Размеры в мм</p>
        </div>

        {/* Периметр */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Общая длина всех стен (периметр)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={perimeter || ""}
              onChange={(e) => setPerimeter(Number(e.target.value))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            />
            <span className="flex items-center text-gray-600">метров</span>
          </div>
        </div>

        {/* Высота стен */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Высота стен по углам
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={wallHeight || ""}
              onChange={(e) => setWallHeight(Number(e.target.value))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            />
            <span className="flex items-center text-gray-600">см</span>
          </div>
        </div>

        {/* Толщина стен */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Толщина стен
          </label>
          <select
            value={wallThickness}
            onChange={(e) => setWallThickness(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="half">Половина блока</option>
            <option value="full">Целый блок</option>
            <option value="oneHalf">Полтора блока</option>
            <option value="two">Два блока</option>
          </select>
        </div>

        {/* Толщина раствора */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Толщина раствора в кладке
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              value={mortarThickness}
              onChange={(e) => setMortarThickness(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value={5}>Раствор 5</option>
              <option value={10}>Раствор 10</option>
              <option value={15}>Раствор 15</option>
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                value={mortarThickness || ""}
                onChange={(e) => setMortarThickness(Number(e.target.value))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <span className="flex items-center text-gray-600">мм</span>
            </div>
          </div>
        </div>

        {/* Кладочная сетка */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Кладочная сетка
          </label>
          <div className="space-y-2">
            <select
              value={meshFrequency}
              onChange={(e) => setMeshFrequency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="every">Каждый ряд</option>
              <option value="custom">Через N рядов</option>
              <option value="none">Без сетки</option>
            </select>
            {meshFrequency === "custom" && (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={meshRows || ""}
                  onChange={(e) => setMeshRows(Number(e.target.value))}
                  placeholder="Через сколько рядов"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Цена и вес */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цена за 1 шт.
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={pricePerBlock || ""}
                onChange={(e) => setPricePerBlock(Number(e.target.value))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <span className="flex items-center text-gray-600">руб</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вес 1 блока
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={blockWeight || ""}
                onChange={(e) => setBlockWeight(Number(e.target.value))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <span className="flex items-center text-gray-600">кг</span>
            </div>
          </div>
        </div>

        {/* Фронтоны */}
        <div>
          <button
            type="button"
            onClick={() => setShowGables(!showGables)}
            className="flex items-center gap-2 text-sm font-medium text-[var(--nevblock-blue)] hover:underline"
          >
            <span>{showGables ? "−" : "+"}</span>
            <span>Фронтоны</span>
          </button>
          {showGables && (
            <div className="mt-3 space-y-3 pl-6 border-l-2 border-gray-200">
              {gables.map((gable, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Ширина (см)"
                    value={gable.width || ""}
                    onChange={(e) =>
                      updateGable(index, "width", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Высота (см)"
                    value={gable.height || ""}
                    onChange={(e) =>
                      updateGable(index, "height", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeGable(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Удалить
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addGable}
                className="text-sm text-[var(--nevblock-blue)] hover:underline"
              >
                + Добавить фронтон
              </button>
            </div>
          )}
        </div>

        {/* Окна и двери */}
        <div>
          <button
            type="button"
            onClick={() => setShowOpenings(!showOpenings)}
            className="flex items-center gap-2 text-sm font-medium text-[var(--nevblock-blue)] hover:underline"
          >
            <span>{showOpenings ? "−" : "+"}</span>
            <span>Учесть окна и двери</span>
          </button>
          {showOpenings && (
            <div className="mt-3 space-y-3 pl-6 border-l-2 border-gray-200">
              {openings.map((opening, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Ширина (см)"
                    value={opening.width || ""}
                    onChange={(e) =>
                      updateOpening(index, "width", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Высота (см)"
                    value={opening.height || ""}
                    onChange={(e) =>
                      updateOpening(index, "height", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Количество"
                    min="1"
                    value={opening.count || ""}
                    onChange={(e) =>
                      updateOpening(index, "count", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeOpening(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Удалить
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOpening}
                className="text-sm text-[var(--nevblock-blue)] hover:underline"
              >
                + Добавить проем
              </button>
            </div>
          )}
        </div>

        {/* Результаты */}
        <div className="pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-[var(--nevblock-light)] to-white rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[var(--nevblock-blue)] mb-4">
              Результаты расчета
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Количество блоков</p>
                <p className="text-2xl font-bold text-[var(--nevblock-brown)]">
                  {result.blockCount.toLocaleString("ru-RU")} шт
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Объем кладки</p>
                <p className="text-2xl font-bold text-[var(--nevblock-brown)]">
                  {result.masonryVolume.toFixed(2)} м³
                </p>
              </div>
              {result.totalWeight > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Общий вес</p>
                  <p className="text-2xl font-bold text-[var(--nevblock-brown)]">
                    {result.totalWeight.toFixed(0)} кг
                  </p>
                </div>
              )}
              {result.totalCost > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Общая стоимость</p>
                  <p className="text-2xl font-bold text-[var(--nevblock-brown)]">
                    {result.totalCost.toLocaleString("ru-RU")} руб
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
