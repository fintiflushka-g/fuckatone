import { useState, useEffect } from "react";
import { fetchApprovements } from "./api/ApprovementApi"; // ваш API-запрос
import { mockApprovements } from "./mockApprovement";

const ITEMS_PER_PAGE = 5;

export default function Alerts() {
  const [files, setFiles] = useState(mockApprovements); // сначала моки
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visibleInputs, setVisibleInputs] = useState({});
  const [visibleOutputs, setVisibleOutputs] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApprovements();
        setFiles((prev) => [...prev, ...(data ?? [])]); // добавляем данные с бэка
      } catch (err) {
        console.warn("Ошибка при загрузке:", err);
        setError(null); // не падаем
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleInputs = (index) =>
    setVisibleInputs((prev) => ({ ...prev, [index]: !prev[index] }));

  const toggleOutput = (index) =>
    setVisibleOutputs((prev) => ({ ...prev, [index]: !prev[index] }));

  const filteredFiles = files.filter((file) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      file.shortName.toLowerCase().includes(lowerSearch) ||
      file.inputText.toLowerCase().includes(lowerSearch) ||
      file.from?.toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFiles = filteredFiles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) return <p className="text-center text-lg">Загрузка...</p>;

  return (
    <div className="space-y-4 text-[16px] max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold">Уведомления</h2>

      <input
        type="text"
        placeholder="Поиск"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full border px-3 py-2 rounded"
      />

      <div className="h-[500px] overflow-y-auto border rounded p-2 bg-gray-50">
        <ul className="space-y-4">
          {currentFiles.map((file, index) => (
            <li
              key={startIndex + index}
              className="border p-4 rounded bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{file.shortName}</p>
                  <p className="text-sm text-gray-500">{file.mainWords}</p>
                  <p className="text-sm text-gray-500">От: {file.from}</p>
                  <p className="text-sm text-gray-500">Кому: {file.to}</p>
                  <p className="text-sm text-gray-500">Получено: {file.received}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleInputs(startIndex + index)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Текст
                  </button>
                  <button
                    onClick={() => toggleOutput(startIndex + index)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Ответ
                  </button>
                </div>
              </div>

              {visibleInputs[startIndex + index] && (
                <p className="text-base text-gray-700 mt-3">
                  Сообщение: {file.inputText}
                </p>
              )}
              {visibleOutputs[startIndex + index] && (
                <p className="text-base text-gray-700 mt-3">
                  Ответ: {file.outputText}
                </p>
              )}
            </li>
          ))}

          {filteredFiles.length === 0 && (
            <p className="text-gray-500">Сообщения не найдены.</p>
          )}
        </ul>
      </div>

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
