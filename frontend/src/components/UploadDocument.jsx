import { useState } from "react";

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [toast, setToast] = useState(null); // { message: string }

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setSummary("Одной из ключевых задач при использовании полиномиальной регрессии является определение оптимальной степени регрессии. В большинстве работ по оптимальному планированию экспериментов предполагается, что форма статистической модели заранее известна. Однако на практике точная степень полинома может быть неизвестна. Кроме того, реальный план эксперимента может отличаться от теоретически оптимального. В данной работе акцент сделан на том, что при D-оптимальном планировании отклонения от предполагаемой модели оказывают большее влияние, чем отклонения от экспериментального плана. Исходя из этого, предлагается метод выбора степени регрессии, основанный на критерии D-оптимальности. Также рассматриваются различные варианты нарушения модельных предпосылок и вводится новый класс D-оптимальных планов, обладающих большей устойчивостью и эффективностью по сравнению с равномерными экспериментальными планами.");
  };

  const handleAddToLocal = () => {
    const files = JSON.parse(localStorage.getItem("localFiles") || "[]");
    files.push({ name: file.name, summary, url: "#" });
    localStorage.setItem("localFiles", JSON.stringify(files));
    showToast("Добавлено в локальное хранилище");
  };

  const handleAddToKnowledge = () => {
    const files = JSON.parse(localStorage.getItem("knowledgeFiles") || "[]");
    files.push({ name: file.name, summary, url: "#" });
    localStorage.setItem("knowledgeFiles", JSON.stringify(files));
    showToast("Добавлено в базу знаний");
  };

  return (
    <div className="space-y-4 relative">
      <h2 className="text-xl font-bold">Загрузите документ</h2>
      <input type="file" accept="application/pdf" onChange={handleUpload} />
      {file && (
        <div className="mt-4 space-y-3">
          <p className="font-semibold">Файл: {file.name}</p>
          <p className="mt-2">Аннотация:</p>
          <div className="bg-gray-100 p-3 rounded text-sm">{summary}</div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToLocal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Добавить в локальное хранилище
            </button>
            <button
              onClick={handleAddToKnowledge}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Добавить в базу знаний
            </button>
          </div>
        </div>
      )}

      {/* Всплывающее уведомление */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {toast.message}
        </div>
      )}
    </div>
  );
}
