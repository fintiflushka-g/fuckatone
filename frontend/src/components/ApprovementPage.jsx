import { useState, useEffect } from "react";
import { fetchApprovements, updateApprovement } from "./api/ApprovementApi";
import { mockApprovements } from "./mockApprovement";

const ITEMS_PER_PAGE = 5;

export default function ApprovementPage() {
  const [files, setFiles] = useState(mockApprovements);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visibleInputs, setVisibleInputs] = useState({});
  const [visibleOutputs, setVisibleOutputs] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [editedText, setEditedText] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApprovements();
        setFiles((prev) => [...prev, ...(data ?? [])]);
      } catch (err) {
        console.warn("Ошибка загрузки:", err);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleInputs = (index) =>
    setVisibleInputs((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleOutput = (index) =>
    setVisibleOutputs((prev) => ({ ...prev, [index]: !prev[index] }));

  const filteredFiles = files.filter((file) => {
    const lower = searchTerm.toLowerCase();
    return (
      file.shortName.toLowerCase().includes(lower) ||
      file.inputText.toLowerCase().includes(lower) ||
      file.from?.toLowerCase().includes(lower)
    );
  });

  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFiles = filteredFiles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleApprove = async (idx) => {
    const file = currentFiles[idx];
    showToast("Согласовано успешно");

    try {
      await updateApprovement(file.id, file.outputText);
    } catch (err) {
      console.warn("Ошибка при согласовании:", err);
    }

    // Убираем согласованный элемент из списка
    setFiles((prev) => prev.filter((f) => f !== file));
  };

  if (loading) return <p className="text-center text-lg">Загрузка...</p>;

  return (
    <div className="space-y-4 text-[16px] max-w-7xl mx-auto relative">
      <h2 className="text-2xl font-bold">Согласование</h2>

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
          {currentFiles.map((file, index) => {
            const idx = startIndex + index;

            return (
              <li
                key={file.id ?? idx}
                className="border p-4 rounded bg-white shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{file.shortName}</p>
                    <p className="text-sm text-black-500">
                      Необходимо согласование: {file.approvers}
                    </p>
                    <p className="text-sm text-gray-500">{file.mainWords}</p>
                    <p className="text-sm text-gray-500">От: {file.from}</p>
                    <p className="text-sm text-gray-500">Кому: {file.to}</p>
                    <p className="text-sm text-gray-500">
                      Получено: {file.received}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleInputs(idx)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Текст
                    </button>

                    <button
                      onClick={() => toggleOutput(idx)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ответ
                    </button>

                    <button
                      onClick={() => handleApprove(index)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Согласовать
                    </button>
                  </div>
                </div>

                {visibleInputs[idx] && (
                  <p className="text-base text-gray-700 mt-3">
                    Сообщение: {file.inputText}
                  </p>
                )}

                {visibleOutputs[idx] && (
                  <div className="mt-3">
                    {editMode[idx] ? (
                      <>
                        <textarea
                          className="w-full border rounded p-2 text-gray-700"
                          value={editedText[idx] ?? file.outputText}
                          onChange={(e) =>
                            setEditedText((p) => ({
                              ...p,
                              [idx]: e.target.value,
                            }))
                          }
                        />

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={async () => {
                              try {
                                await updateApprovement(
                                  file.id,
                                  editedText[idx]
                                );
                              } catch {
                                // мок
                              }

                              const updated = [...files];
                              updated[idx].outputText = editedText[idx];
                              setFiles(updated);

                              setEditMode((p) => ({ ...p, [idx]: false }));
                              showToast("Ответ сохранён");
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Сохранить
                          </button>

                          <button
                            onClick={() =>
                              setEditMode((p) => ({ ...p, [idx]: false }))
                            }
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                          >
                            Отмена
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-base text-gray-700">
                          Ответ: {file.outputText}
                        </p>

                        <button
                          onClick={() => {
                            setEditedText((p) => ({
                              ...p,
                              [idx]: file.outputText,
                            }));
                            setEditMode((p) => ({ ...p, [idx]: true }));
                          }}
                          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Редактировать ответ
                        </button>
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}

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

      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
