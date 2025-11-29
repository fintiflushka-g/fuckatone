import { useState } from "react";

const mockFiles = [
  { name:"D-оптимальное планирование для полиномиальной регрессии: выбор степени и робастность.pdf", 
    summary: "Одной из ключевых задач при использовании полиномиальной регрессии является определение оптимальной степени регрессии. В большинстве работ по оптимальному планированию экспериментов предполагается, что форма статистической модели заранее известна. Однако на практике точная степень полинома может быть неизвестна. Кроме того, реальный план эксперимента может отличаться от теоретически оптимального. В данной работе акцент сделан на том, что при D-оптимальном планировании отклонения от предполагаемой модели оказывают большее влияние, чем отклонения от экспериментального плана. Исходя из этого, предлагается метод выбора степени регрессии, основанный на критерии D-оптимальности. Также рассматриваются различные варианты нарушения модельных предпосылок и вводится новый класс D-оптимальных планов, обладающих большей устойчивостью и эффективностью по сравнению с равномерными экспериментальными планами.",
    url: "#",
    addedBy: "user" },
  { name: "Применение кварцевого концентрата в производстве листового стекла.pdf", summary: "Краткое содержание отчёта за 2024 год.", url: "#", addedBy: "Мария" },
  { name: "Уголовный кодекс Финляндии 1889 г. как законодательный источник европейской интеграции.pdf", summary: "Описание документа 3.", url: "#", addedBy: "user" },
  { name: "Стабильность битумополимеров при технологическом хранении.pdf", summary: "Описание документа 4.", url: "#", addedBy: "Иван" },
  { name: "Свойства торфорудных материалов на основе бакчарской руды и торфа Васюганского месторождения.pdf", summary: "Описание документа 5.", url: "#", addedBy: "Максим" },

  { name: "Документ 6.pdf", summary: "Описание документа 6.", url: "#", addedBy: "Мария" },
  { name: "Документ 7.pdf", summary: "Описание документа 7.", url: "#", addedBy: "Иван" },
  { name: "Документ 8.pdf", summary: "Описание документа 8.", url: "#", addedBy: "Мария" },
  { name: "Документ 9.pdf", summary: "Описание документа 9.", url: "#", addedBy: "Иван" },
  { name: "Документ 10.pdf", summary: "Описание документа 10.", url: "#", addedBy: "Мария" },
];

const currentUser = "еuser";
const ITEMS_PER_PAGE = 5;

export default function KnowledgeBase() {
  const [files, setFiles] = useState(mockFiles);
  const [visibleSummaries, setVisibleSummaries] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSummary = (index) => {
    setVisibleSummaries((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const handleDelete = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const filteredFiles = files.filter((file) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      file.name.toLowerCase().includes(lowerSearch) ||
      file.summary.toLowerCase().includes(lowerSearch) ||
      file.addedBy.toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFiles = filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4 text-[16px] max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold">База знаний</h2>

      <input
        type="text"
        placeholder="Поиск по названию, аннотации или автору..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full border px-3 py-2 rounded"
      />

      {/* Прокручиваемый список */}
      <div className="h-[500px] overflow-y-auto border rounded p-2 bg-gray-50">
        <ul className="space-y-4">
          {currentFiles.map((file, index) => (
            <li key={startIndex + index} className="border p-4 rounded bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-sm text-gray-500">Добавил: {file.addedBy}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleSummary(startIndex + index)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Аннотация
                  </button>
                  <button
                    onClick={() => window.open(file.url, "_blank")}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Открыть
                  </button>
                  <button
                    onClick={() => handleDownload(file)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Скачать
                  </button>
                  {file.addedBy === currentUser && (
                    <button
                      onClick={() => handleDelete(startIndex + index)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>
              {visibleSummaries[startIndex + index] && (
                <p className="text-base text-gray-700 mt-3">{file.summary}</p>
              )}
            </li>
          ))}
          {filteredFiles.length === 0 && (
            <p className="text-gray-500">Файлы не найдены.</p>
          )}
        </ul>
      </div>

      {/* Пагинация вне прокрутки */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 items-center py-2 sticky bottom-0 bg-white border-t">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Назад
          </button>
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}
